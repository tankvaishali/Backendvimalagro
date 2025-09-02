import express from "express";
import mongoose from "mongoose";
import { certificatemulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ Certificate Schema
const certificateSchema = new mongoose.Schema(
  {
    certificateimage: { type: String, required: true }, // Cloudinary URL
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

const certificatelist = express.Router();

// ➡️ POST API (Upload Certificate)
certificatelist.post("/", certificatemulter.single("certificateimage"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newCertificate = new Certificate({
      certificateimage: req.file.path, // Cloudinary gives back the image URL
    });

    await newCertificate.save();

    res.status(201).json({
      message: "Certificate uploaded successfully",
      certificate: newCertificate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ GET API (Fetch All Certificates)
certificatelist.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


certificatelist.delete("/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // ✅ Extract public_id from Cloudinary URL
    const imageUrl = certificate.certificateimage;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // get last part before extension

    // ✅ Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // ✅ Delete from MongoDB
    await certificate.deleteOne();

    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default certificatelist;
