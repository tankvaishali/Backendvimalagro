import express from "express";
import mongoose from "mongoose";
import { uploadAboutus } from "../Cloudinary/Multer.js";

// ✅ Schema
const aboutusSchema = new mongoose.Schema({
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  image4: { type: String, required: true },
}, { timestamps: true });

const Aboutus = mongoose.model("Aboutus", aboutusSchema);

const Aboutusimage = express.Router();

// ✅ POST API → Upload 4 images & save to DB
Aboutusimage.post(
  "/",
  uploadAboutus.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3 || !req.files.image4) {
        return res.status(400).json({ message: "Please upload all 4 images" });
      }

      const newAboutus = new Aboutus({
        image1: req.files.image1[0].path,
        image2: req.files.image2[0].path,
        image3: req.files.image3[0].path,
        image4: req.files.image4[0].path,
      });

      await newAboutus.save();
      res.status(201).json({ message: "Aboutus images uploaded successfully", data: newAboutus });
    } catch (error) {
      res.status(500).json({ message: "Error uploading images", error: error.message });
    }
  }
);


// ✅ GET API → Fetch all Aboutus entries
Aboutusimage.get("/", async (req, res) => {
  try {
    const aboutusData = await Aboutus.find();
    res.json(aboutusData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

export default Aboutusimage;
