import express from 'express';
import upload from '../Cloudinary/Multer.js';

const productImageRoute = express.Router();

// POST /api/upload/product-image
productImageRoute.post('/product-image', upload.single('image'), (req, res) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'Image upload failed' });
    }

    res.status(200).json({ url: req.file.path });
});

export default productImageRoute;