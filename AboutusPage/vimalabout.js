// import express from "express";
// import mongoose from "mongoose";
// import { vimalaboutusmulter } from "../Cloudinary/Multer.js";
// import cloudinary from "../Cloudinary/cloudinary.js";

// // ✅ Schema
// const vimalaboutSchema = new mongoose.Schema(
//   {
//     vimalaboutimage: { type: String, required: true }, // Cloudinary URL
//     public_id: { type: String, required: true }, // For deletion
//   },
//   { timestamps: true }
// );

// // ✅ Model
// const VimalAbout = mongoose.model("VimalAbout", vimalaboutSchema);

// // ✅ Router
// const vimalaboutusimage = express.Router();

// // ➡️ POST API (Upload new image)
// vimalaboutusimage.post("/", vimalaboutusmulter.single("vimalaboutimage"), async (req, res) => {
//   try {
//     if (!req.file || !req.file.path || !req.file.filename) {
//       return res.status(400).json({ error: "Image is required" });
//     }

//     const newAbout = new VimalAbout({
//       vimalaboutimage: req.file.path,   // Cloudinary URL
//       public_id: req.file.filename,     // Cloudinary public_id
//     });

//     await newAbout.save();
//     res.status(201).json(newAbout);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to upload image", details: err.message });
//   }
// });

// // ➡️ GET API (Fetch all images)
// vimalaboutusimage.get("/", async (req, res) => {
//   try {
//     const data = await VimalAbout.find().sort({ createdAt: 1 });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch images", details: err.message });
//   }
// });

// // ➡️ DELETE API (Delete by ID)
// vimalaboutusimage.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const about = await VimalAbout.findById(id);

//     if (!about) {
//       return res.status(404).json({ error: "Image not found" });
//     }

//     // ✅ Delete image from Cloudinary using stored public_id
//     await cloudinary.uploader.destroy(about.public_id);

//     // ✅ Delete from DB
//     await about.deleteOne();

//     res.status(200).json({ message: "Image deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete image", details: err.message });
//   }
// });

// export default vimalaboutusimage;



// after put api adding

import express from "express";
import mongoose from "mongoose";
import { vimalaboutusmulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js";

// ✅ Schema
const vimalaboutSchema = new mongoose.Schema(
  {
    vimalaboutimage: { type: String, required: true }, // Cloudinary URL
    public_id: { type: String, required: true }, // For deletion
  },
  { timestamps: true }
);

// ✅ Model
const VimalAbout = mongoose.model("VimalAbout", vimalaboutSchema);

// ✅ Router
const vimalaboutusimage = express.Router();

// ➡️ POST API (Upload new image)
vimalaboutusimage.post("/", vimalaboutusmulter.single("vimalaboutimage"), async (req, res) => {
  try {
    if (!req.file || !req.file.path || !req.file.filename) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newAbout = new VimalAbout({
      vimalaboutimage: req.file.path,   // Cloudinary URL
      public_id: req.file.filename,     // Cloudinary public_id
    });

    await newAbout.save();
    res.status(201).json(newAbout);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload image", details: err.message });
  }
});

// ➡️ GET API (Fetch all images)
vimalaboutusimage.get("/", async (req, res) => {
  try {
    const data = await VimalAbout.find().sort({ createdAt: 1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images", details: err.message });
  }
});

// ➡️ PUT API (Update image by ID)
vimalaboutusimage.put("/:id", vimalaboutusmulter.single("vimalaboutimage"), async (req, res) => {
  try {
    const { id } = req.params;
    const about = await VimalAbout.findById(id);

    if (!about) {
      return res.status(404).json({ error: "Image not found" });
    }

    if (!req.file || !req.file.path || !req.file.filename) {
      return res.status(400).json({ error: "Image is required" });
    }

    // ✅ Delete old image from Cloudinary
    await cloudinary.uploader.destroy(about.public_id);

    // ✅ Update with new image
    about.vimalaboutimage = req.file.path;   // New Cloudinary URL
    about.public_id = req.file.filename;     // New public_id

    await about.save();
    res.status(200).json({ message: "Image updated successfully", about });
  } catch (err) {
    res.status(500).json({ error: "Failed to update image", details: err.message });
  }
});

// ➡️ DELETE API (Delete by ID)
vimalaboutusimage.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const about = await VimalAbout.findById(id);

    if (!about) {
      return res.status(404).json({ error: "Image not found" });
    }

    // ✅ Delete image from Cloudinary using stored public_id
    await cloudinary.uploader.destroy(about.public_id);

    // ✅ Delete from DB
    await about.deleteOne();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image", details: err.message });
  }
});

export default vimalaboutusimage;
