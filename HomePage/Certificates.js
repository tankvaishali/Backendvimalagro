
import express from "express";
import mongoose from "mongoose";
import { certificatemulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ Certificate Schema
const certificateSchema = new mongoose.Schema(
  {
    certificateimage: { type: String, required: true }, // Cloudinary URL
    public_id: { type: String },       // Cloudinary public_id
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

const certificatelist = express.Router();

// ➡️ POST API (Upload Certificate)
certificatelist.post(
  "/",
  certificatemulter.single("certificateimage"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.path || !req.file.filename) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const newCertificate = new Certificate({
        certificateimage: req.file.path,   // secure_url
        public_id: req.file.filename,      // Cloudinary public_id
      });

      await newCertificate.save();

      res.status(201).json({
        message: "Certificate uploaded successfully",
        certificate: newCertificate,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ➡️ GET API (Fetch All Certificates)
certificatelist.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: 1 });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ DELETE API (Delete Certificate + Cloudinary image)
certificatelist.delete("/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // ✅ Delete from Cloudinary using public_id
    await cloudinary.uploader.destroy(certificate.public_id);

    // ✅ Delete from MongoDB
    await certificate.deleteOne();

    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default certificatelist;
