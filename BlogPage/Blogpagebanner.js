import express from "express";
import mongoose from "mongoose";
import { Bannermulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ Blog Page Banner Schema
const blogbannerSchema = new mongoose.Schema(
  {
    desktopblogbanner: { type: String, required: true }, // Cloudinary URL
    desktoppublic_id: { type: String, required: true },  // Cloudinary public_id
    mobileblogbanner: { type: String, required: true },  // Cloudinary URL
    mobilepublic_id: { type: String, required: true },   // Cloudinary public_id
  },
  { timestamps: true }
);

const BlogBanner = mongoose.model("BlogBanner", blogbannerSchema);
const blogbannerRouter = express.Router();


// ➡️ POST API (Upload Blog Banner)
blogbannerRouter.post(
  "/",
  Bannermulter.fields([
    { name: "desktopblogbanner", maxCount: 1 },
    { name: "mobileblogbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (
        !req.files ||
        !req.files.desktopblogbanner ||
        !req.files.mobileblogbanner
      ) {
        return res.status(400).json({ error: "Both desktop and mobile blog banners are required" });
      }

      const newBanner = new BlogBanner({
        desktopblogbanner: req.files.desktopblogbanner[0].path,
        desktoppublic_id: req.files.desktopblogbanner[0].filename,
        mobileblogbanner: req.files.mobileblogbanner[0].path,
        mobilepublic_id: req.files.mobileblogbanner[0].filename,
      });

      await newBanner.save();

      res.status(201).json({
        message: "Blog banner uploaded successfully",
        banner: newBanner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ GET API (Fetch All Blog Banners)
blogbannerRouter.get("/", async (req, res) => {
  try {
    const banners = await BlogBanner.find().sort({ createdAt: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ➡️ PUT API (Update Blog Banner + Cloudinary)
blogbannerRouter.put(
  "/:id",
  Bannermulter.fields([
    { name: "desktopblogbanner", maxCount: 1 },
    { name: "mobileblogbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const banner = await BlogBanner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ error: "Blog banner not found" });
      }

      // ✅ Update desktop blog banner if provided
      if (req.files.desktopblogbanner) {
        await cloudinary.uploader.destroy(banner.desktoppublic_id);
        banner.desktopblogbanner = req.files.desktopblogbanner[0].path;
        banner.desktoppublic_id = req.files.desktopblogbanner[0].filename;
      }

      // ✅ Update mobile blog banner if provided
      if (req.files.mobileblogbanner) {
        await cloudinary.uploader.destroy(banner.mobilepublic_id);
        banner.mobileblogbanner = req.files.mobileblogbanner[0].path;
        banner.mobilepublic_id = req.files.mobileblogbanner[0].filename;
      }

      await banner.save();

      res.status(200).json({
        message: "Blog banner updated successfully",
        banner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ DELETE API (Delete Blog Banner + Cloudinary images)
blogbannerRouter.delete("/:id", async (req, res) => {
  try {
    const banner = await BlogBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Blog banner not found" });
    }

    await cloudinary.uploader.destroy(banner.desktoppublic_id);
    await cloudinary.uploader.destroy(banner.mobilepublic_id);

    await banner.deleteOne();

    res.status(200).json({ message: "Blog banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default blogbannerRouter;
