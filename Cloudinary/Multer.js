import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// ✅ Product storage
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product", // 📁 Cloudinary folder for products
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }]
  }
});
const upload = multer({ storage: productStorage });
export default upload;   // 👈 keep your existing default export

// ✅ Aboutus storage
const aboutusStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aboutus", // 📁 Cloudinary folder for aboutus
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }]
  }
});
export const uploadAboutus = multer({ storage: aboutusStorage }); 

// ✅ Aboutus storage
const TestimonialStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aboutus",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }]
  }
});
export const Testimonialmulter = multer({ storage: TestimonialStorage }); 
