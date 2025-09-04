import express from "express";
import mongoose from "mongoose";
import cloudinary from "../Cloudinary/cloudinary.js";
import { Leaderlogomulter } from "../Cloudinary/Multer.js";

// ✅ Leaderlogo Schema
const Leaderlogoschema = new mongoose.Schema(
  {
    Leaderlogoimage: { type: String, required: true }, // Cloudinary URL
    public_id: { type: String },                       // Cloudinary public_id
  },
  { timestamps: true }
);

const Leaderlogodata = mongoose.model("Leaderlogo", Leaderlogoschema);

const Leaderlogo = express.Router();

// ➡️ POST API (Upload Leaderlogo)
Leaderlogo.post(
  "/",
  Leaderlogomulter.single("Leaderlogoimage"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.path || !req.file.filename) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const newLeaderlogo = new Leaderlogodata({
        Leaderlogoimage: req.file.path,   // Cloudinary secure_url
        public_id: req.file.filename,     // Cloudinary public_id
      });

      await newLeaderlogo.save();

      res.status(201).json({
        message: "Leader logo uploaded successfully",
        leaderlogo: newLeaderlogo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ➡️ GET API (Fetch All Leaderlogos)
Leaderlogo.get("/", async (req, res) => {
  try {
    const leaderlogos = await Leaderlogodata.find().sort({ createdAt: -1 });
    res.status(200).json(leaderlogos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ DELETE API (Delete Leaderlogo + Cloudinary image)
Leaderlogo.delete("/:id", async (req, res) => {
  try {
    const leaderlogo = await Leaderlogodata.findById(req.params.id);

    if (!leaderlogo) {
      return res.status(404).json({ error: "Leader logo not found" });
    }

    // ✅ Delete from Cloudinary
    await cloudinary.uploader.destroy(leaderlogo.public_id);

    // ✅ Delete from MongoDB
    await leaderlogo.deleteOne();

    res.status(200).json({ message: "Leader logo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default Leaderlogo;
