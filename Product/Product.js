import express from "express";
import Product from './ProductList.js'

const productRoutes = express.Router();


// ➡️ Add a new main product
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

// ➡️ Add a subproduct to an existing product
productRoutes.post("/:id/add-subproduct", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.subproducts.push(req.body);
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Add a recipe to an existing product
productRoutes.post("/:id/add-recipe", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.recipes.push(req.body);
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ (Optional) Delete a subproduct
productRoutes.delete("/:id/subproduct/:subId", async (req, res) => {
    try {
        const { id, subId } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.subproducts = product.subproducts.filter(
            (s) => s._id.toString() !== subId
        );
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ (Optional) Delete a recipe
productRoutes.delete("/:id/recipe/:recipeId", async (req, res) => {
    try {
        const { id, recipeId } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.recipes = product.recipes.filter(
            (r) => r._id.toString() !== recipeId
        );
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default productRoutes;








// import express from "express";
// import Product from "./ProductList.js";

// const AddProduct = express.Router();

// // ➡️ Add a new main product
// AddProduct.post("/add", async (req, res) => {
//     try {
//         const newProduct = new Product(req.body);
//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// // ➡️ Get all products
// AddProduct.get("/", async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ➡️ Add a subproduct to an existing product
// AddProduct.post("/:id/add-subproduct", async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).json({ error: "Product not found" });

//         product.subproducts.push(req.body);
//         await product.save();

//         res.json(product);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// // ➡️ Add a recipe to an existing product
// AddProduct.post("/:id/add-recipe", async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).json({ error: "Product not found" });

//         product.recipes.push(req.body);
//         await product.save();

//         res.json(product);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// // ➡️ Delete a subproduct
// AddProduct.delete("/:id/subproduct/:subId", async (req, res) => {
//     try {
//         const { id, subId } = req.params;
//         const product = await Product.findById(id);
//         if (!product) return res.status(404).json({ error: "Product not found" });

//         product.subproducts = product.subproducts.filter(
//             (s) => s._id.toString() !== subId
//         );
//         await product.save();

//         res.json(product);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// // ➡️ Delete a recipe
// AddProduct.delete("/:id/recipe/:recipeId", async (req, res) => {
//     try {
//         const { id, recipeId } = req.params;
//         const product = await Product.findById(id);
//         if (!product) return res.status(404).json({ error: "Product not found" });

//         product.recipes = product.recipes.filter(
//             (r) => r._id.toString() !== recipeId
//         );
//         await product.save();

//         res.json(product);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// export default AddProduct;
