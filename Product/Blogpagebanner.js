import express from "express";
import mongoose from "mongoose";
import { Bannermulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ Product Page Banner Schema
const productbannerSchema = new mongoose.Schema(
  {
    desktopproductbanner: { type: String, required: true }, // Cloudinary URL
    desktoppublic_id: { type: String, required: true },    // Cloudinary public_id
    mobileproductbanner: { type: String, required: true }, // Cloudinary URL
    mobilepublic_id: { type: String, required: true },     // Cloudinary public_id
  },
  { timestamps: true }
);

const ProductBanner = mongoose.model("ProductBanner", productbannerSchema);
const productbannerRouter = express.Router();


// ➡️ POST API (Upload Product Page Banner)
productbannerRouter.post(
  "/",
  Bannermulter.fields([
    { name: "desktopproductbanner", maxCount: 1 },
    { name: "mobileproductbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (
        !req.files ||
        !req.files.desktopproductbanner ||
        !req.files.mobileproductbanner
      ) {
        return res.status(400).json({ error: "Both desktop and mobile banners are required" });
      }

      const newBanner = new ProductBanner({
        desktopproductbanner: req.files.desktopproductbanner[0].path,
        desktoppublic_id: req.files.desktopproductbanner[0].filename,
        mobileproductbanner: req.files.mobileproductbanner[0].path,
        mobilepublic_id: req.files.mobileproductbanner[0].filename,
      });

      await newBanner.save();

      res.status(201).json({
        message: "Product page banner uploaded successfully",
        banner: newBanner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ GET API (Fetch All Product Banners)
productbannerRouter.get("/", async (req, res) => {
  try {
    const banners = await ProductBanner.find().sort({ createdAt: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ➡️ PUT API (Update Product Banner + Cloudinary)
productbannerRouter.put(
  "/:id",
  Bannermulter.fields([
    { name: "desktopproductbanner", maxCount: 1 },
    { name: "mobileproductbanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const banner = await ProductBanner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }

      // ✅ Update desktop banner if provided
      if (req.files.desktopproductbanner) {
        await cloudinary.uploader.destroy(banner.desktoppublic_id);
        banner.desktopproductbanner = req.files.desktopproductbanner[0].path;
        banner.desktoppublic_id = req.files.desktopproductbanner[0].filename;
      }

      // ✅ Update mobile banner if provided
      if (req.files.mobileproductbanner) {
        await cloudinary.uploader.destroy(banner.mobilepublic_id);
        banner.mobileproductbanner = req.files.mobileproductbanner[0].path;
        banner.mobilepublic_id = req.files.mobileproductbanner[0].filename;
      }

      await banner.save();

      res.status(200).json({
        message: "Product banner updated successfully",
        banner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ➡️ DELETE API (Delete Product Banner + Cloudinary images)
productbannerRouter.delete("/:id", async (req, res) => {
  try {
    const banner = await ProductBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    await cloudinary.uploader.destroy(banner.desktoppublic_id);
    await cloudinary.uploader.destroy(banner.mobilepublic_id);

    await banner.deleteOne();

    res.status(200).json({ message: "Product banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default productbannerRouter;
