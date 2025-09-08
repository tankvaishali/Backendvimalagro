import express from "express";
import mongoose from "mongoose";
import { Bannermulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ Homepage Banner Schema
const homepagebannerSchema = new mongoose.Schema(
  {
    desktophomebanner: { type: String, required: true }, // Cloudinary URL
    desktoppublic_id: { type: String, required: true }, // Cloudinary public_id
    mobilehomebanner: { type: String, required: true }, // Cloudinary URL
    mobilepublic_id: { type: String, required: true }, // Cloudinary public_id
  },
  { timestamps: true }
);

const HomeBanner = mongoose.model("HomeBanner", homepagebannerSchema);
const homebannerRouter = express.Router();


// ➡️ POST API (Upload Homepage Banner)
homebannerRouter.post(
  "/",
  Bannermulter.fields([
    { name: "desktophomebanner", maxCount: 1 },
    { name: "mobilehomebanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (
        !req.files ||
        !req.files.desktophomebanner ||
        !req.files.mobilehomebanner
      ) {
        return res.status(400).json({ error: "Both desktop and mobile banners are required" });
      }

      const newBanner = new HomeBanner({
        desktophomebanner: req.files.desktophomebanner[0].path, // Cloudinary URL
        desktoppublic_id: req.files.desktophomebanner[0].filename, // public_id
        mobilehomebanner: req.files.mobilehomebanner[0].path, // Cloudinary URL
        mobilepublic_id: req.files.mobilehomebanner[0].filename, // public_id
      });

      await newBanner.save();

      res.status(201).json({
        message: "Homepage banner uploaded successfully",
        banner: newBanner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ GET API (Fetch All Banners)
homebannerRouter.get("/", async (req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ➡️ DELETE API (Delete Banner + Cloudinary images)
homebannerRouter.delete("/:id", async (req, res) => {
  try {
    const banner = await HomeBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // ✅ Delete from Cloudinary
    await cloudinary.uploader.destroy(banner.desktoppublic_id);
    await cloudinary.uploader.destroy(banner.mobilepublic_id);

    // ✅ Delete from MongoDB
    await banner.deleteOne();

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default homebannerRouter;
