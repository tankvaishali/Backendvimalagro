// // import express from "express";
// // import mongoose from "mongoose";
// // import { uploadAboutus } from "../Cloudinary/Multer.js";

// // // ✅ Schema
// // const aboutusSchema = new mongoose.Schema({
// //   image1: { type: String, required: true },
// //   image2: { type: String, required: true },
// //   image3: { type: String, required: true },
// //   image4: { type: String, required: true },
// // }, { timestamps: true });

// // const Aboutus = mongoose.model("Aboutus", aboutusSchema);

// // const Aboutusimage = express.Router();

// // // ✅ POST API → Upload 4 images & save to DB
// // Aboutusimage.post(
// //   "/",
// //   uploadAboutus.fields([
// //     { name: "image1", maxCount: 1 },
// //     { name: "image2", maxCount: 1 },
// //     { name: "image3", maxCount: 1 },
// //     { name: "image4", maxCount: 1 },
// //   ]),
// //   async (req, res) => {
// //     try {
// //       if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3 || !req.files.image4) {
// //         return res.status(400).json({ message: "Please upload all 4 images" });
// //       }

// //       const newAboutus = new Aboutus({
// //         image1: req.files.image1[0].path,
// //         image2: req.files.image2[0].path,
// //         image3: req.files.image3[0].path,
// //         image4: req.files.image4[0].path,
// //       });

// //       await newAboutus.save();
// //       res.status(201).json({ message: "Aboutus images uploaded successfully", data: newAboutus });
// //     } catch (error) {
// //       res.status(500).json({ message: "Error uploading images", error: error.message });
// //     }
// //   }
// // );

// // // ✅ GET API → Fetch all Aboutus entries
// // Aboutusimage.get("/", async (req, res) => {
// //   try {
// //     const aboutusData = await Aboutus.find();
// //     res.json(aboutusData);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching data", error: error.message });
// //   }
// // });

// // export default Aboutusimage;
// import express from "express";
// import mongoose from "mongoose";
// import { uploadAboutus } from "../Cloudinary/Multer.js";
// import cloudinary from "../Cloudinary/cloudinary.js"; // ✅ Import Cloudinary

// // ✅ Schema with URLs + public_id
// const aboutusSchema = new mongoose.Schema(
//   {
//     image1: { type: String, required: true },
//     image1_public_id: { type: String},

//     image2: { type: String, required: true },
//     image2_public_id: { type: String },

//     image3: { type: String, required: true },
//     image3_public_id: { type: String },

//     image4: { type: String, required: true },
//     image4_public_id: { type: String },
//   },
//   { timestamps: true }
// );

// const Aboutus = mongoose.model("Aboutus", aboutusSchema);

// const Aboutusimage = express.Router();

// // ✅ POST API → Upload 4 images & save to DB
// Aboutusimage.post(
//   "/",
//   uploadAboutus.fields([
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//     { name: "image3", maxCount: 1 },
//     { name: "image4", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       if (
//         !req.files ||
//         !req.files.image1 ||
//         !req.files.image2 ||
//         !req.files.image3 ||
//         !req.files.image4
//       ) {
//         return res.status(400).json({ message: "Please upload all 4 images" });
//       }

//       const newAboutus = new Aboutus({
//         image1: req.files.image1[0].path,
//         image1_public_id: req.files.image1[0].filename,

//         image2: req.files.image2[0].path,
//         image2_public_id: req.files.image2[0].filename,

//         image3: req.files.image3[0].path,
//         image3_public_id: req.files.image3[0].filename,

//         image4: req.files.image4[0].path,
//         image4_public_id: req.files.image4[0].filename,
//       });

//       await newAboutus.save();
//       res.status(201).json({
//         message: "About Us images uploaded successfully",
//         data: newAboutus,
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: "Error uploading images",
//         error: error.message,
//       });
//     }
//   }
// );

// // ✅ GET API → Fetch all Aboutus entries
// Aboutusimage.get("/", async (req, res) => {
//   try {
//     const aboutusData = await Aboutus.find();
//     res.json(aboutusData);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching data", error: error.message });
//   }
// });

// // ✅ DELETE API → Delete entry + Cloudinary images
// Aboutusimage.delete("/:id", async (req, res) => {
//   try {
//     const aboutus = await Aboutus.findById(req.params.id);
//     if (!aboutus) {
//       return res.status(404).json({ message: "Aboutus entry not found" });
//     }

//     // ✅ Delete each image from Cloudinary
//     await cloudinary.uploader.destroy(aboutus.image1_public_id);
//     await cloudinary.uploader.destroy(aboutus.image2_public_id);
//     await cloudinary.uploader.destroy(aboutus.image3_public_id);
//     await cloudinary.uploader.destroy(aboutus.image4_public_id);

//     // ✅ Delete MongoDB record
//     await aboutus.deleteOne();

//     res.json({ message: "Aboutus entry and images deleted successfully" });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error deleting Aboutus entry",  
//       error: error.message,
//     });
//   }
// });

// export default Aboutusimage;
import express from "express";
import mongoose from "mongoose";
import { uploadAboutus } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js"; // ✅ Import Cloudinary

// ✅ Schema with URLs + public_id
const aboutusSchema = new mongoose.Schema(
  {
    image1: { type: String, required: true },
    image1_public_id: { type: String },

    image2: { type: String, required: true },
    image2_public_id: { type: String },

    image3: { type: String, required: true },
    image3_public_id: { type: String },

    image4: { type: String, required: true },
    image4_public_id: { type: String },
  },
  { timestamps: true }
);

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
      if (
        !req.files?.image1 ||
        !req.files?.image2 ||
        !req.files?.image3 ||
        !req.files?.image4
      ) {
        return res.status(400).json({ message: "Please upload all 4 images" });
      }

      const newAboutus = new Aboutus({
        image1: req.files.image1[0].path,
        image1_public_id: req.files.image1[0].filename,

        image2: req.files.image2[0].path,
        image2_public_id: req.files.image2[0].filename,

        image3: req.files.image3[0].path,
        image3_public_id: req.files.image3[0].filename,

        image4: req.files.image4[0].path,
        image4_public_id: req.files.image4[0].filename,
      });

      await newAboutus.save();
      res.status(201).json({
        message: "About Us images uploaded successfully",
        data: newAboutus,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error uploading images",
        error: error.message,
      });
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


// ✅ PUT API → Update Aboutus entry (replace images if provided)
Aboutusimage.put(
  "/:id",
  uploadAboutus.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const aboutus = await Aboutus.findById(req.params.id);
      if (!aboutus) {
        return res.status(404).json({ message: "Aboutus entry not found" });
      }

      // ✅ If a new image is uploaded → delete old one from Cloudinary
      if (req.files.image1) {
        await cloudinary.uploader.destroy(aboutus.image1_public_id);
        aboutus.image1 = req.files.image1[0].path;
        aboutus.image1_public_id = req.files.image1[0].filename;
      }

      if (req.files.image2) {
        await cloudinary.uploader.destroy(aboutus.image2_public_id);
        aboutus.image2 = req.files.image2[0].path;
        aboutus.image2_public_id = req.files.image2[0].filename;
      }

      if (req.files.image3) {
        await cloudinary.uploader.destroy(aboutus.image3_public_id);
        aboutus.image3 = req.files.image3[0].path;
        aboutus.image3_public_id = req.files.image3[0].filename;
      }

      if (req.files.image4) {
        await cloudinary.uploader.destroy(aboutus.image4_public_id);
        aboutus.image4 = req.files.image4[0].path;
        aboutus.image4_public_id = req.files.image4[0].filename;
      }

      await aboutus.save();

      res.json({
        message: "Aboutus entry updated successfully",
        data: aboutus,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating Aboutus entry",
        error: error.message,
      });
    }
  }
);


// ✅ DELETE API → Delete entry + Cloudinary images
Aboutusimage.delete("/:id", async (req, res) => {
  try {
    const aboutus = await Aboutus.findById(req.params.id);
    if (!aboutus) {
      return res.status(404).json({ message: "Aboutus entry not found" });
    }

    // ✅ Delete each image from Cloudinary
    await cloudinary.uploader.destroy(aboutus.image1_public_id);
    await cloudinary.uploader.destroy(aboutus.image2_public_id);
    await cloudinary.uploader.destroy(aboutus.image3_public_id);
    await cloudinary.uploader.destroy(aboutus.image4_public_id);

    // ✅ Delete MongoDB record
    await aboutus.deleteOne();

    res.json({ message: "Aboutus entry and images deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Aboutus entry",
      error: error.message,
    });
  }
});

export default Aboutusimage;
