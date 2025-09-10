import express from "express";
import { SubProduct } from "./ProductList.js";
import cloudinary from "../Cloudinary/cloudinary.js";
import upload from "../Cloudinary/Multer.js";

const extraSubProductRoutes = express.Router();

// helper for safe parsing JSON
const safeParse = (data) => {
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

// define up to 10 image fields
const subproductFields = Array.from({ length: 10 }).map((_, i) => ({
    name: `subproductImg_${i}`, maxCount: 1
}));

// ➡️ CREATE Extra SubProduct
extraSubProductRoutes.post(
    "/add",
    upload.fields(subproductFields),
    async (req, res) => {
        try {
            const body = req.body;

            console.log("Incoming body:", body); // ✅ Debug

            const extrasubproducts = safeParse(body.extrasubproducts).map((sub, i) => {
                const file = req.files[`subproductImg_${i}`]?.[0];
                return {
                    ...sub,
                    subproductImg: file ? file.path : null,
                    subproductImg_public_id: file ? file.filename : null,
                };
            });

            // ✅ Make sure productId is saved
            const newExtra = new SubProduct({
                productId: body.productId,
                extrasubproducts,
            });

            const saved = await newExtra.save();
            res.status(201).json(saved);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ GET all (with product info)
extraSubProductRoutes.get("/", async (req, res) => {
    try {
        const extras = await SubProduct.find()
            .populate("productId", "productName"); // ✅ show product name
        res.json(extras);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ GET single
extraSubProductRoutes.get("/:id", async (req, res) => {
    try {
        const extra = await SubProduct.findById(req.params.id).populate("productId", "productName");
        if (!extra) return res.status(404).json({ error: "Not found" });
        res.json(extra);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ UPDATE
extraSubProductRoutes.put(
    "/:id",
    upload.fields(subproductFields),
    async (req, res) => {
        try {
            const body = req.body;
            const extra = await SubProduct.findById(req.params.id);
            if (!extra) return res.status(404).json({ error: "Not found" });

            let parsedSubs = [];
            if (body.extrasubproducts) {
                parsedSubs = safeParse(body.extrasubproducts);
            }

            const updatedSubs = parsedSubs.map((sub, i) => {
                const file = req.files[`subproductImg_${i}`]?.[0];
                return {
                    ...sub,
                    subproductImg: file
                        ? file.path
                        : extra.extrasubproducts[i]?.subproductImg,
                    subproductImg_public_id: file
                        ? file.filename
                        : extra.extrasubproducts[i]?.subproductImg_public_id,
                };
            });

            extra.productId = body.productId || extra.productId; // ✅ keep or update productId
            extra.extrasubproducts = updatedSubs;

            const updated = await extra.save();
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ DELETE
extraSubProductRoutes.delete("/:id", async (req, res) => {
    try {
        const deleted = await SubProduct.findById(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });

        for (let sub of deleted.extrasubproducts || []) {
            if (sub.subproductImg_public_id) {
                await cloudinary.uploader.destroy(sub.subproductImg_public_id);
            }
        }

        await deleted.deleteOne();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default extraSubProductRoutes;
