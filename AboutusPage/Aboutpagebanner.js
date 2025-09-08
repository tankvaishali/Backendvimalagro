import express from "express";
import mongoose from "mongoose";
import { Bannermulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ About Page Banner Schema
const aboutpagebannerSchema = new mongoose.Schema(
  {
    desktopaboutbanner: { type: String, required: true }, // Cloudinary URL
    desktoppublic_id: { type: String, required: true },   // Cloudinary public_id
    mobileaboutbanner: { type: String, required: true },  // Cloudinary URL
    mobilepublic_id: { type: String, required: true },    // Cloudinary public_id
  },
  { timestamps: true }
);

const AboutBanner = mongoose.model("AboutBanner", aboutpagebannerSchema);
const aboutbannerRouter = express.Router();


// ➡️ POST API (Upload About Page Banner)
aboutbannerRouter.post(
  "/",
  Bannermulter.fields([
    { name: "desktopaboutbanner", maxCount: 1 },
    { name: "mobileaboutbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (
        !req.files ||
        !req.files.desktopaboutbanner ||
        !req.files.mobileaboutbanner
      ) {
        return res.status(400).json({ error: "Both desktop and mobile banners are required" });
      }

      const newBanner = new AboutBanner({
        desktopaboutbanner: req.files.desktopaboutbanner[0].path,
        desktoppublic_id: req.files.desktopaboutbanner[0].filename,
        mobileaboutbanner: req.files.mobileaboutbanner[0].path,
        mobilepublic_id: req.files.mobileaboutbanner[0].filename,
      });

      await newBanner.save();

      res.status(201).json({
        message: "About page banner uploaded successfully",
        banner: newBanner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ GET API (Fetch All About Banners)
aboutbannerRouter.get("/", async (req, res) => {
  try {
    const banners = await AboutBanner.find().sort({ createdAt: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ➡️ PUT API (Update About Page Banner + Cloudinary)
aboutbannerRouter.put(
  "/:id",
  Bannermulter.fields([
    { name: "desktopaboutbanner", maxCount: 1 },
    { name: "mobileaboutbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const banner = await AboutBanner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }

      // ✅ Update desktop banner if provided
      if (req.files.desktopaboutbanner) {
        await cloudinary.uploader.destroy(banner.desktoppublic_id);
        banner.desktopaboutbanner = req.files.desktopaboutbanner[0].path;
        banner.desktoppublic_id = req.files.desktopaboutbanner[0].filename;
      }

      // ✅ Update mobile banner if provided
      if (req.files.mobileaboutbanner) {
        await cloudinary.uploader.destroy(banner.mobilepublic_id);
        banner.mobileaboutbanner = req.files.mobileaboutbanner[0].path;
        banner.mobilepublic_id = req.files.mobileaboutbanner[0].filename;
      }

      await banner.save();

      res.status(200).json({
        message: "About page banner updated successfully",
        banner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ DELETE API (Delete About Banner + Cloudinary)
aboutbannerRouter.delete("/:id", async (req, res) => {
  try {
    const banner = await AboutBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    await cloudinary.uploader.destroy(banner.desktoppublic_id);
    await cloudinary.uploader.destroy(banner.mobilepublic_id);

    await banner.deleteOne();

    res.status(200).json({ message: "About banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default aboutbannerRouter;
