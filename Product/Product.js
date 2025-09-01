import express from "express";
import Product from "./ProductList.js";

const productRoutes = express.Router();


// ➡️ Create a new main product
productRoutes.post("/add", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const data = await newProduct.save();
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
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


// ➡️ Get single product by ID
productRoutes.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ➡️ Update a whole product (fields + subproducts + recipes)
productRoutes.put("/:id", async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Product not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ➡️ Delete a product
productRoutes.delete("/:id", async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ---------------------------
// 📌 SUBPRODUCTS
// ---------------------------

// ➡️ Add subproduct
productRoutes.post("/:id/subproducts", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.subproducts.push(req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Update subproduct
productRoutes.put("/:id/subproducts/:subId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const sub = product.subproducts.id(req.params.subId);
        if (!sub) return res.status(404).json({ error: "Subproduct not found" });

        sub.set(req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Delete subproduct
productRoutes.delete("/:id/subproducts/:subId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.subproducts.pull({ _id: req.params.subId });
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ---------------------------
// 📌 RECIPES
// ---------------------------

// ➡️ Add recipe
productRoutes.post("/:id/recipes", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.recipes.push(req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Update recipe
productRoutes.put("/:id/recipes/:recipeId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const recipe = product.recipes.id(req.params.recipeId);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });

        recipe.set(req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Delete recipe
productRoutes.delete("/:id/recipes/:recipeId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.recipes.pull({ _id: req.params.recipeId });
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


export default productRoutes;
