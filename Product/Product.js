import express from "express";
import Product from "./ProductList.js";

const productRoutes = express.Router();

// ➡️ Create product with subproducts & recipes
productRoutes.post("/add", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Get all products
productRoutes.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ Get single product
productRoutes.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ Update product (whole)
productRoutes.put("/:id", async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Delete product
// productRoutes.delete("/:id", async (req, res) => {
//     try {
//         const deleted = await Product.findByIdAndDelete(req.params.id);
//         if (!deleted) return res.status(404).json({ error: "Not found" });
//         res.json({ message: "Deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

productRoutes.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Not found" });

        // ✅ Collect all image public_ids
        let imagePublicIds = [];

        if (product.productBanner?.public_id) {
            imagePublicIds.push(product.productBanner.public_id);
        }
        if (product.banner2?.public_id) {
            imagePublicIds.push(product.banner2.public_id);
        }
        if (product.howToMakeBanner?.public_id) {
            imagePublicIds.push(product.howToMakeBanner.public_id);
        }

        if (Array.isArray(product.productImages)) {
            product.productImages.forEach(img => {
                if (img?.public_id) imagePublicIds.push(img.public_id);
            });
        }

        if (Array.isArray(product.subproducts)) {
            product.subproducts.forEach(sp => {
                if (sp.subproductImg?.public_id) imagePublicIds.push(sp.subproductImg.public_id);
            });
        }

        if (Array.isArray(product.recipes)) {
            product.recipes.forEach(r => {
                if (r.recipeMainImg?.public_id) imagePublicIds.push(r.recipeMainImg.public_id);
                if (Array.isArray(r.recipeSubImg)) {
                    r.recipeSubImg.forEach(img => {
                        if (img?.public_id) imagePublicIds.push(img.public_id);
                    });
                }
            });
        }

        // ✅ Delete all images from Cloudinary
        for (const publicId of imagePublicIds) {
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.warn("Cloudinary delete failed:", publicId, err.message);
            }
        }

        // ✅ Delete from MongoDB
        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Deleted product + images from Cloudinary" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default productRoutes;
