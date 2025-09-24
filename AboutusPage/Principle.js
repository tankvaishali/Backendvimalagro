import express from "express";
import mongoose from "mongoose";
import { PrincipleMulter } from "../Cloudinary/Multer.js"; // ✅ Multer config for principle
import cloudinary from "../Cloudinary/cloudinary.js";      // ✅ Cloudinary instance

// ✅ Schema
const principleSchema = new mongoose.Schema(
  {
    principleimage: { type: String, required: true }, // Cloudinary URL (secure_url)
    public_id: { type: String },                      // Cloudinary public_id
    principletitle: { type: String, required: true },
    principledescription: { type: String, required: true },
    principlenumber: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Model
const Principle = mongoose.model("Principle", principleSchema);

// ✅ Router
const aboutprinciple = express.Router();

/**
 * ➡️ POST API (Create Principle)
 */
aboutprinciple.post(
  "/",
  PrincipleMulter.single("principleimage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      const newPrinciple = new Principle({
        principleimage: req.file.path,  // secure_url
        public_id: req.file.filename,   // public_id
        principletitle: req.body.principletitle,
        principledescription: req.body.principledescription,
        principlenumber: req.body.principlenumber,
      });

      await newPrinciple.save();
      res
        .status(201)
        .json({ message: "Principle added successfully", data: newPrinciple });
    } catch (error) {
      res.status(500).json({ message: "Error adding principle", error: error.message });
    }
  }
);

/**
 * ➡️ GET API (Fetch All Principles)
 */
aboutprinciple.get("/", async (req, res) => {
  try {
    const principles = await Principle.find().sort({ createdAt: 1 });
    res.json(principles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching principles", error: error.message });
  }
});

/**
 * ➡️ PUT API (Update Principle)
 */
aboutprinciple.put(
  "/:id",
  PrincipleMulter.single("principleimage"),
  async (req, res) => {
    try {
      const principle = await Principle.findById(req.params.id);
      if (!principle) {
        return res.status(404).json({ message: "Principle not found" });
      }

      // ✅ Prepare update data
      const updateData = {
        principletitle: req.body.principletitle,
        principledescription: req.body.principledescription,
        principlenumber: req.body.principlenumber,
      };

      if (req.file) {
        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(principle.public_id);

        // Save new image
        updateData.principleimage = req.file.path;
        updateData.public_id = req.file.filename;
      }

      const updatedPrinciple = await Principle.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        message: "Principle updated successfully",
        data: updatedPrinciple,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating principle", error: error.message });
    }
  }
);

/**
 * ➡️ DELETE API (Delete Principle + Cloudinary image)
 */
aboutprinciple.delete("/:id", async (req, res) => {
  try {
    const principle = await Principle.findById(req.params.id);
    if (!principle) {
      return res.status(404).json({ message: "Principle not found" });
    }

    // ✅ Delete image from Cloudinary
    await cloudinary.uploader.destroy(principle.public_id);

    // ✅ Delete document from MongoDB
    await principle.deleteOne();

    res.json({ message: "Principle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting principle", error: error.message });
  }
});

export default aboutprinciple;
