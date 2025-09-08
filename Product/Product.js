import express from "express";
import Product from "./ProductList.js";
import cloudinary from "../Cloudinary/cloudinary.js";
import upload from "../Cloudinary/Multer.js";

const productRoutes = express.Router();

// helper for safe parsing JSON
const safeParse = (data) => {
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

// ➡️ Create product
productRoutes.post(
    "/add",
    upload.fields([
        { name: "productBanner", maxCount: 1 },
        { name: "banner2", maxCount: 1 },
        { name: "howToMakeBanner", maxCount: 1 },
        { name: "productImages", maxCount: 10 },
        { name: "subproductImg", maxCount: 10 },
        { name: "recipeMainImg", maxCount: 10 },
        { name: "recipeSubImg", maxCount: 10 },
    ]),
    async (req, res) => {
        try {
            const body = req.body;

            const newProduct = new Product({
                productName: body.productName,
                productSizes: safeParse(body.productSizes),

                productBanner: req.files?.productBanner
                    ? req.files.productBanner[0].path
                    : null,
                productBanner_public_id: req.files?.productBanner
                    ? req.files.productBanner[0].filename
                    : null,

                banner2: req.files?.banner2 ? req.files.banner2[0].path : null,
                banner2_public_id: req.files?.banner2
                    ? req.files.banner2[0].filename
                    : null,

                howToMakeBanner: req.files?.howToMakeBanner
                    ? req.files.howToMakeBanner[0].path
                    : null,
                howToMakeBanner_public_id: req.files?.howToMakeBanner
                    ? req.files.howToMakeBanner[0].filename
                    : null,

                productImages: req.files?.productImages
                    ? req.files.productImages.map((img) => img.path)
                    : [],
                productImages_public_id: req.files?.productImages
                    ? req.files.productImages.map((img) => img.filename)
                    : [],

                subproducts: safeParse(body.subproducts).map((sub, i) => ({
                    ...sub,
                    subproductImg:
                        req.files?.subproductImg && req.files.subproductImg[i]
                            ? req.files.subproductImg[i].path
                            : null,
                    subproductImg_public_id:
                        req.files?.subproductImg && req.files.subproductImg[i]
                            ? req.files.subproductImg[i].filename
                            : null,
                })),

                recipes: safeParse(body.recipes).map((rec, i) => ({
                    ...rec,
                    recipeMainImg:
                        req.files?.recipeMainImg && req.files.recipeMainImg[i]
                            ? req.files.recipeMainImg[i].path
                            : null,
                    recipeMainImg_public_id:
                        req.files?.recipeMainImg && req.files.recipeMainImg[i]
                            ? req.files.recipeMainImg[i].filename
                            : null,
                    // ✅ Only take one subimage per recipe
                    recipeSubImg:
                        req.files?.recipeSubImg && req.files.recipeSubImg[i]
                            ? req.files.recipeSubImg[i].path
                            : null,
                    recipeSubImg_public_id:
                        req.files?.recipeSubImg && req.files.recipeSubImg[i]
                            ? req.files.recipeSubImg[i].filename
                            : null,
                })),
            });

            const saved = await newProduct.save();
            res.status(201).json(saved);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

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

// ➡️ Update product (supports file upload)
productRoutes.put(
    "/:id",
    upload.fields([
        { name: "productBanner", maxCount: 1 },
        { name: "banner2", maxCount: 1 },
        { name: "howToMakeBanner", maxCount: 1 },
        { name: "productImages", maxCount: 10 },
        { name: "subproductImg", maxCount: 10 },
        { name: "recipeMainImg", maxCount: 10 },
        { name: "recipeSubImg", maxCount: 10 },
    ]),
    async (req, res) => {
        try {
            const body = req.body;
            const safeParse = (data) => {
                try {
                    return data ? JSON.parse(data) : [];
                } catch {
                    return [];
                }
            };

            // ✅ Load existing product
            const existing = await Product.findById(req.params.id);
            if (!existing) return res.status(404).json({ error: "Not found" });

            // ✅ Start with old data
            const update = { ...existing._doc };

            // ✅ Basic fields
            if (body.productName) update.productName = body.productName;
            if (body.productSizes) update.productSizes = safeParse(body.productSizes);

            // ✅ Banners
            if (req.files?.productBanner) {
                if (existing.productBanner_public_id) {
                    await cloudinary.uploader.destroy(existing.productBanner_public_id);
                }
                update.productBanner = req.files.productBanner[0].path;
                update.productBanner_public_id = req.files.productBanner[0].filename;
            }
            if (req.files?.banner2) {
                update.banner2 = req.files.banner2[0].path;
                update.banner2_public_id = req.files.banner2[0].filename;
            }
            if (req.files?.howToMakeBanner) {
                update.howToMakeBanner = req.files.howToMakeBanner[0].path;
                update.howToMakeBanner_public_id =
                    req.files.howToMakeBanner[0].filename;
            }

            // ✅ Product Images
            if (req.files?.productImages) {
                update.productImages = req.files.productImages.map((img) => img.path);
                update.productImages_public_id = req.files.productImages.map(
                    (img) => img.filename
                );
            }

            // ✅ Subproducts
            if (body.subproducts) {
                const parsed = safeParse(body.subproducts);
                update.subproducts = parsed.map((sub, i) => ({
                    ...existing.subproducts[i]?._doc, // keep old values
                    ...sub, // overwrite text fields
                    subproductImg:
                        req.files?.subproductImg && req.files.subproductImg[i]
                            ? req.files.subproductImg[i].path
                            : existing.subproducts[i]?.subproductImg || null,
                    subproductImg_public_id:
                        req.files?.subproductImg && req.files.subproductImg[i]
                            ? req.files.subproductImg[i].filename
                            : existing.subproducts[i]?.subproductImg_public_id || null,
                }));
            }

            // ✅ Recipes
            if (body.recipes) {
                const parsed = safeParse(body.recipes);
                update.recipes = parsed.map((rec, i) => ({
                    ...existing.recipes[i]?._doc, // keep old values
                    ...rec,
                    recipeMainImg:
                        req.files?.recipeMainImg && req.files.recipeMainImg[i]
                            ? req.files.recipeMainImg[i].path
                            : existing.recipes[i]?.recipeMainImg || null,
                    recipeMainImg_public_id:
                        req.files?.recipeMainImg && req.files.recipeMainImg[i]
                            ? req.files.recipeMainImg[i].filename
                            : existing.recipes[i]?.recipeMainImg_public_id || null,
                    recipeSubImg:
                        req.files?.recipeSubImg && req.files.recipeSubImg[i]
                            ? req.files.recipeSubImg[i].path
                            : existing.recipes[i]?.recipeSubImg || null,
                    recipeSubImg_public_id:
                        req.files?.recipeSubImg && req.files.recipeSubImg[i]
                            ? req.files.recipeSubImg[i].filename
                            : existing.recipes[i]?.recipeSubImg_public_id || null,
                }));
            }

            // ✅ Save merged update
            const updated = await Product.findByIdAndUpdate(req.params.id, update, {
                new: true,
            });

            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ Delete product
productRoutes.delete("/:id", async (req, res) => {
    try {
        const deleted = await Product.findById(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });

        if (deleted.productBanner_public_id) {
            await cloudinary.uploader.destroy(deleted.productBanner_public_id);
        }
        if (deleted.banner2_public_id) {
            await cloudinary.uploader.destroy(deleted.banner2_public_id);
        }
        if (deleted.howToMakeBanner_public_id) {
            await cloudinary.uploader.destroy(deleted.howToMakeBanner_public_id);
        }

        if (Array.isArray(deleted.productImages_public_id)) {
            for (let id of deleted.productImages_public_id) {
                if (id) await cloudinary.uploader.destroy(id);
            }
        }

        for (let sub of deleted.subproducts || []) {
            if (sub.subproductImg_public_id) {
                await cloudinary.uploader.destroy(sub.subproductImg_public_id);
            }
        }

        for (let rec of deleted.recipes || []) {
            if (rec.recipeMainImg_public_id) {
                await cloudinary.uploader.destroy(rec.recipeMainImg_public_id);
            }
            if (rec.recipeSubImg_public_id) {
                await cloudinary.uploader.destroy(rec.recipeSubImg_public_id);
            }
        }

        await deleted.deleteOne();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default productRoutes;
