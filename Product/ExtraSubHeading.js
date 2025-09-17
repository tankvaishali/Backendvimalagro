import express from "express";
import { Heading } from "./ProductList.js";
const ExtraSubHeading = express.Router();

// helper for safe parsing JSON
const safeParse = (data) => {
    try {
        return data ? JSON.parse(data) : {};
    } catch (e) {
        return {};
    }
};

// ➡️ CREATE Extra Heading
ExtraSubHeading.post("/", async (req, res) => {
    try {
        const { productId, subproductTitle } = req.body;

        const updated = await Heading.findOneAndUpdate(
            { productId }, // search by productId
            { productId, subproductTitle }, // update this
            { new: true, upsert: true } // create if not exist
        );

        res.status(201).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ GET all (with product info)
ExtraSubHeading.get("/", async (req, res) => {
    try {
        const headings = await Heading.find().populate("productId", "productName");
        res.json(headings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ GET single
ExtraSubHeading.get("/:id", async (req, res) => {
    try {
        const heading = await Heading.findById(req.params.id).populate("productId", "productName");
        if (!heading) return res.status(404).json({ error: "Not found" });
        res.json(heading);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ UPDATE
ExtraSubHeading.put("/:id", async (req, res) => {
    try {
        const body = safeParse(JSON.stringify(req.body));

        const heading = await Heading.findById(req.params.id);
        if (!heading) return res.status(404).json({ error: "Not found" });

        heading.productId = body.productId || heading.productId;
        heading.subproductTitle = body.subproductTitle || heading.subproductTitle;

        const updated = await heading.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ DELETE
ExtraSubHeading.delete("/:id", async (req, res) => {
    try {
        const deleted = await Heading.findById(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });

        await deleted.deleteOne();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default ExtraSubHeading;
