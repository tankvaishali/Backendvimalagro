// import express from "express";
// import mongoose from "mongoose";
// import { Testimonialmulter } from "../Cloudinary/Multer.js";

// // ✅ Schema
// const testimonialSchema = new mongoose.Schema(
//   {
//     testimonialname: { type: String, required: true },
//     testimonialpera: { type: String, required: true },
//     testimonialimage: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// const TestimonialRouter = express.Router();


// TestimonialRouter.post(
//   "/",
//   Testimonialmulter.single("testimonialimage"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: "Please upload an image" });
//       }

//       const newTestimonial = new Testimonial({
//         testimonialname: req.body.testimonialname,
//         testimonialpera: req.body.testimonialpera,
//         testimonialimage: req.file.path, // Cloudinary URL
//       });

//       await newTestimonial.save();
//       res
//         .status(201)
//         .json({ message: "Testimonial added successfully", data: newTestimonial });
//     } catch (error) {
//       res.status(500).json({ message: "Error adding testimonial", error: error.message });
//     }
//   }
// );


// TestimonialRouter.get("/", async (req, res) => {
//   try {
//     const testimonials = await Testimonial.find();
//     res.json(testimonials);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching testimonials", error: error.message });
//   }
// });

// TestimonialRouter.put(
//   "/:id",
//   Testimonialmulter.single("testimonialimage"),
//   async (req, res) => {
//     try {
//       const updateData = {
//         testimonialname: req.body.testimonialname,
//         testimonialpera: req.body.testimonialpera,
//       };

//       if (req.file) {
//         updateData.testimonialimage = req.file.path; // update image only if uploaded
//       }

//       const updatedTestimonial = await Testimonial.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         { new: true }
//       );

//       if (!updatedTestimonial) {
//         return res.status(404).json({ message: "Testimonial not found" });
//       }

//       res.json({
//         message: "Testimonial updated successfully",
//         data: updatedTestimonial,
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Error updating testimonial", error: error.message });
//     }
//   }
// );


// TestimonialRouter.delete("/:id", async (req, res) => {
//   try {
//     const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);

//     if (!deletedTestimonial) {
//       return res.status(404).json({ message: "Testimonial not found" });
//     }

//     res.json({ message: "Testimonial deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting testimonial", error: error.message });
//   }
// });

// export default TestimonialRouter;



import express from "express";
import mongoose from "mongoose";
import { Testimonialmulter } from "../Cloudinary/Multer.js";
import cloudinary from "../Cloudinary/cloudinary.js"; // ✅ import cloudinary

// ✅ Schema
const testimonialSchema = new mongoose.Schema(
  {
    testimonialname: { type: String, required: true },
    testimonialpera: { type: String, required: true },
    testimonialimage: { type: String, required: true }, // Cloudinary URL
    public_id: { type: String },        // Cloudinary public_id
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

const TestimonialRouter = express.Router();

// ➡️ POST API (Upload Testimonial)
TestimonialRouter.post(
  "/",
  Testimonialmulter.single("testimonialimage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      const newTestimonial = new Testimonial({
        testimonialname: req.body.testimonialname,
        testimonialpera: req.body.testimonialpera,
        testimonialimage: req.file.path,   // secure_url
        public_id: req.file.filename,      // public_id
      });

      await newTestimonial.save();
      res
        .status(201)
        .json({ message: "Testimonial added successfully", data: newTestimonial });
    } catch (error) {
      res.status(500).json({ message: "Error adding testimonial", error: error.message });
    }
  }
);

// ➡️ GET API (Fetch All Testimonials)
TestimonialRouter.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: 1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials", error: error.message });
  }
});

// ➡️ PUT API (Update Testimonial)
TestimonialRouter.put(
  "/:id",
  Testimonialmulter.single("testimonialimage"),
  async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }

      // ✅ Prepare update data
      const updateData = {
        testimonialname: req.body.testimonialname,
        testimonialpera: req.body.testimonialpera,
      };

      if (req.file) {
        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(testimonial.public_id);

        // Save new image
        updateData.testimonialimage = req.file.path;
        updateData.public_id = req.file.filename;
      }

      const updatedTestimonial = await Testimonial.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        message: "Testimonial updated successfully",
        data: updatedTestimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating testimonial", error: error.message });
    }
  }
);

// ➡️ DELETE API (Delete Testimonial + Cloudinary image)
TestimonialRouter.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // ✅ Delete image from Cloudinary
    await cloudinary.uploader.destroy(testimonial.public_id);

    // ✅ Delete document from MongoDB
    await testimonial.deleteOne();

    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting testimonial", error: error.message });
  }
});

export default TestimonialRouter;

