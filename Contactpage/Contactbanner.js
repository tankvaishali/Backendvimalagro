import express from "express";
import mongoose from "mongoose";
import { Bannermulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ Contact Page Banner Schema
const contactpagebannerSchema = new mongoose.Schema(
  {
    desktopcontactbanner: { type: String, required: true }, // Cloudinary URL
    desktoppublic_id: { type: String, required: true },     // Cloudinary public_id
    mobilecontactbanner: { type: String, required: true },  // Cloudinary URL
    mobilepublic_id: { type: String, required: true },      // Cloudinary public_id
  },
  { timestamps: true }
);

const ContactBanner = mongoose.model("ContactBanner", contactpagebannerSchema);
const contactbannerRouter = express.Router();


// ➡️ POST API (Upload Contact Page Banner)
contactbannerRouter.post(
  "/",
  Bannermulter.fields([
    { name: "desktopcontactbanner", maxCount: 1 },
    { name: "mobilecontactbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (
        !req.files ||
        !req.files.desktopcontactbanner ||
        !req.files.mobilecontactbanner
      ) {
        return res.status(400).json({ error: "Both desktop and mobile contact banners are required" });
      }

      const newBanner = new ContactBanner({
        desktopcontactbanner: req.files.desktopcontactbanner[0].path,
        desktoppublic_id: req.files.desktopcontactbanner[0].filename,
        mobilecontactbanner: req.files.mobilecontactbanner[0].path,
        mobilepublic_id: req.files.mobilecontactbanner[0].filename,
      });

      await newBanner.save();

      res.status(201).json({
        message: "Contact page banner uploaded successfully",
        banner: newBanner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ GET API (Fetch All Contact Banners)
contactbannerRouter.get("/", async (req, res) => {
  try {
    const banners = await ContactBanner.find().sort({ createdAt: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ➡️ PUT API (Update Contact Banner + Cloudinary)
contactbannerRouter.put(
  "/:id",
  Bannermulter.fields([
    { name: "desktopcontactbanner", maxCount: 1 },
    { name: "mobilecontactbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const banner = await ContactBanner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ error: "Contact banner not found" });
      }

      // ✅ Update desktop contact banner if provided
      if (req.files.desktopcontactbanner) {
        await cloudinary.uploader.destroy(banner.desktoppublic_id);
        banner.desktopcontactbanner = req.files.desktopcontactbanner[0].path;
        banner.desktoppublic_id = req.files.desktopcontactbanner[0].filename;
      }

      // ✅ Update mobile contact banner if provided
      if (req.files.mobilecontactbanner) {
        await cloudinary.uploader.destroy(banner.mobilepublic_id);
        banner.mobilecontactbanner = req.files.mobilecontactbanner[0].path;
        banner.mobilepublic_id = req.files.mobilecontactbanner[0].filename;
      }

      await banner.save();

      res.status(200).json({
        message: "Contact banner updated successfully",
        banner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ DELETE API (Delete Contact Banner + Cloudinary images)
contactbannerRouter.delete("/:id", async (req, res) => {
  try {
    const banner = await ContactBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Contact banner not found" });
    }

    await cloudinary.uploader.destroy(banner.desktoppublic_id);
    await cloudinary.uploader.destroy(banner.mobilepublic_id);

    await banner.deleteOne();

    res.status(200).json({ message: "Contact banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default contactbannerRouter;
