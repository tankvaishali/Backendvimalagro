import mongoose from "mongoose";
import express from "express";
import cloudinary from "../Cloudinary/cloudinary.js";
import { Category } from "../Cloudinary/Multer.js";

const Schema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // link to Product schema
        required: true,
    },
    category: [
        {
            categoryName: String,
            categoryBanner: String, //image
            categoryBanner_public_id: String,
            description: String,
            productName: String,
        },
    ],
})
export const OurCategory = mongoose.model("OurCategory", Schema);

const categoryRoutes = express.Router();

// helper for safe parsing JSON
const safeParse = (data) => {
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

// define up to 10 category banner fields
const categoryFields = Array.from({ length: 10 }).map((_, i) => ({
    name: `categoryBanner_${i}`, maxCount: 1
}));

// ➡️ CREATE Category
categoryRoutes.post(
    "/add",
    Category.fields(categoryFields),
    async (req, res) => {
        try {
            const body = req.body;

            const categories = safeParse(body.category).map((cat, i) => {
                const file = req.files[`categoryBanner_${i}`]?.[0];
                return {
                    ...cat,
                    categoryBanner: file ? file.path : null,
                    categoryBanner_public_id: file ? file.filename : null,
                };
            });

            const newCategory = new OurCategory({
                productId: body.productId,
                category: categories,
            });

            const saved = await newCategory.save();
            res.status(201).json(saved);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ GET all categories (with product info)
categoryRoutes.get("/", async (req, res) => {
    try {
        const categories = await OurCategory.find()
            .populate("productId", "productName");
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ GET single category
categoryRoutes.get("/:id", async (req, res) => {
    try {
        const category = await OurCategory.findById(req.params.id)
            .populate("productId", "productName");
        if (!category) return res.status(404).json({ error: "Not found" });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ UPDATE category
categoryRoutes.put(
    "/:id",
    Category.fields(categoryFields),
    async (req, res) => {
        try {
            const body = req.body;
            const categoryDoc = await OurCategory.findById(req.params.id);
            if (!categoryDoc) return res.status(404).json({ error: "Not found" });

            let parsedCategories = [];
            if (body.category) {
                parsedCategories = safeParse(body.category);
            }

            const updatedCategories = parsedCategories.map((cat, i) => {
                const file = req.files[`categoryBanner_${i}`]?.[0];
                return {
                    ...cat,
                    categoryBanner: file
                        ? file.path
                        : categoryDoc.category[i]?.categoryBanner,
                    categoryBanner_public_id: file
                        ? file.filename
                        : categoryDoc.category[i]?.categoryBanner_public_id,
                };
            });

            categoryDoc.productId = body.productId || categoryDoc.productId;
            categoryDoc.category = updatedCategories;

            const updated = await categoryDoc.save();
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ DELETE category
categoryRoutes.delete("/:id", async (req, res) => {
    try {
        const categoryDoc = await OurCategory.findById(req.params.id);
        if (!categoryDoc) return res.status(404).json({ error: "Not found" });

        for (let cat of categoryDoc.category || []) {
            if (cat.categoryBanner_public_id) {
                await cloudinary.uploader.destroy(cat.categoryBanner_public_id);
            }
        }

        await categoryDoc.deleteOne();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); export default categoryRoutes;