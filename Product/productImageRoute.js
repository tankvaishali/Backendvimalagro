import express from 'express';
import upload from '../Cloudinary/Multer.js';
import cloudinary from 'cloudinary';

const productImageRoute = express.Router();

productImageRoute.post('/product-image', upload.single('image'), (req, res) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'Image upload failed' });
    }
    console.log("➡️ Uploaded file info:", req.file);
    // Multer-storage-cloudinary usually attaches public_id + path
    res.status(200).json({
        url: req.file.path,         // Cloudinary URL
        public_id: req.file.filename // public_id stored in Cloudinary
    });
});

export default productImageRoute;