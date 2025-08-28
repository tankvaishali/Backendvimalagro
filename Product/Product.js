// import express from "express";
// import ProductSchema from "./ProductList.js";
// import cloudinary from "../Cloudinary/cloudinary.js";
// import upload from "../Cloudinary/Multer.js";

// const AddProduct = express.Router()

// const uploadToCloudinary = async (file, folder = "product-image") => {
//     const b64 = Buffer.from(file.buffer).toString("base64");
//     const dataURI = "data:" + file.mimetype + ";base64," + b64;
//     const result = await cloudinary.uploader.upload(dataURI, { folder });
//     return result.secure_url;
// };

// AddProduct.post(
//     "/",
//     upload.fields([
//         { name: "productBanner", maxCount: 1 },
//         { name: "productImages" }, // multiple
//         { name: "banner2", maxCount: 1 },
//         { name: "howToMakeBanner", maxCount: 1 },
//         { name: "subproductImg" }, // multiple
//         { name: "recipeMainImg" },
//         { name: "recipeSubImg" },
//     ]),
//     async (req, res) => {
//         try {
//             const body = req.body;

//             // Parse subproducts and recipes JSON
//             const subproducts = body.subproducts ? JSON.parse(body.subproducts) : [];
//             const recipes = body.recipes ? JSON.parse(body.recipes) : [];

//             // Map files to subproducts & recipes
//             if (req.files["subproductImg"]) {
//                 req.files["subproductImg"].forEach((file, i) => {
//                     if (subproducts[i]) subproducts[i].subproductImg = file.path;
//                 });
//             }

//             if (req.files["recipeMainImg"]) {
//                 req.files["recipeMainImg"].forEach((file, i) => {
//                     if (recipes[i]) recipes[i].recipeMainImg = file.path;
//                 });
//             }

//             if (req.files["recipeSubImg"]) {
//                 req.files["recipeSubImg"].forEach((file, i) => {
//                     if (recipes[i]) recipes[i].recipeSubImg = file.path;
//                 });
//             }

//             const product = new VimalProduct({
//                 productBanner: req.files["productBanner"]?.[0]?.path,
//                 productName: body.productName,
//                 productImages: req.files["productImages"]?.map((f) => f.path) || [],
//                 productSizes: Array.isArray(body.productSizes)
//                     ? body.productSizes
//                     : [body.productSizes].filter(Boolean),
//                 banner2: req.files["banner2"]?.[0]?.path,
//                 howToMakeBanner: req.files["howToMakeBanner"]?.[0]?.path,
//                 subproducts,
//                 recipes,
//             });

//             await product.save();
//             res.status(201).json({ message: "Product created successfully", product });
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ message: "Error creating product", error: err.message });
//         }
//     }
// );

// // 👉 READ ALL (GET)
// AddProduct.get("/", async (req, res) => {
//     try {
//         const products = await ProductSchema.find();
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching products", error });
//     }
// });

// // 👉 READ ONE (GET by ID)
// AddProduct.get("/:id", async (req, res) => {
//     try {
//         const product = await ProductSchema.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching product", error });
//     }
// });

// // 👉 UPDATE (PUT)
// AddProduct.put("/:id", async (req, res) => {
//     try {
//         const updatedProduct = await ProductSchema.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         if (!updatedProduct) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         res
//             .status(200)
//             .json({ message: "Product updated successfully", updatedProduct });
//     } catch (error) {
//         res.status(400).json({ message: "Error updating product", error });
//     }
// });

// // 👉 DELETE (DELETE)
// AddProduct.delete("/:id", async (req, res) => {
//     try {
//         const deletedProduct = await ProductSchema.findByIdAndDelete(req.params.id);
//         if (!deletedProduct) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         res.status(200).json({ message: "Product deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting product", error });
//     }
// });

// export default AddProduct;



// /* Clouinary crediential */
// // nary.config({
// // cloud_name: 'ddwmypv1a',
// // api_key: 548743141131585,
// // api_secret: 'AWRMoaTVicNgKODFvwr-7lI6Hsw',
// // });




import express from "express";
import ProductSchema from "./ProductList.js";
const AddProduct = express.Router();


// ➡️ Add a new main product
AddProduct.post("/add", async (req, res) => {
    try {
        const newProduct = new ProductSchema(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Get all products
AddProduct.get("/", async (req, res) => {
    try {
        const products = await ProductSchema.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ Add a subproduct to an existing product
AddProduct.post("/:id/add-subproduct", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductSchema.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.subproducts.push(req.body);
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ Add a recipe to an existing product
AddProduct.post("/:id/add-recipe", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductSchema.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.recipes.push(req.body);
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➡️ (Optional) Delete a subproduct
AddProduct.delete("/:id/subproduct/:subId", async (req, res) => {
    try {
        const { id, subId } = req.params;
        const product = await ProductSchema.findById(id);
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
AddProduct.delete("/:id/recipe/:recipeId", async (req, res) => {
    try {
        const { id, recipeId } = req.params;
        const product = await ProductSchema.findById(id);
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

export default AddProduct;
