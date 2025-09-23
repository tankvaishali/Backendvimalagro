import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 800, crop: "limit" }],
  },
});

const upload = multer({ storage: productStorage });

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 800, crop: "limit" }],
  },
});

const uploadblog = multer({ storage: productStorage });


export default uploadblog;

// ✅ Aboutus storage
const aboutusStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aboutus", // 📁 Cloudinary folder for aboutus
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 800, crop: "limit" }]
  }
});
export const uploadAboutus = multer({ storage: aboutusStorage }); 

// ✅ Aboutus storage
const TestimonialStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "testimonial",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 800, crop: "limit" }]
  }
});
export const Testimonialmulter = multer({ storage: TestimonialStorage }); 


// ✅ certificate storage
const certificatestorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "certificate",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 800, crop: "limit" }]
  }
});
export const certificatemulter = multer({ storage: certificatestorage }); 


const vimalaboutus = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vimalaboutus",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 800, crop: "limit" }]
  }
});
export const vimalaboutusmulter = multer({ storage: vimalaboutus }); 

const Leaderlogostorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "leaderlogo",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 800, crop: "limit" }]
  }
});
export const Leaderlogomulter = multer({ storage:Leaderlogostorage  }); 

const Bannerstorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [{ width: 1920, crop: "limit" }]
  }
});
export const Bannermulter = multer({ storage:Bannerstorage  }); 
