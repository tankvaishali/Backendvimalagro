import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productSizes: [{ type: String, required: true }],
    productBanner: String,
    productBanner_public_id: String,
    banner2: String,
    banner2_public_id: String,
    howToMakeBanner: String,
    howToMakeBanner_public_id: String,
    productImages: [String],
    productImages_public_id: [String],
    subproducts: [
        {
            subproductName: String,
            subproductImg: String,
            subproductImg_public_id: String,
            description: String,
            weight: String,
        },
    ],
    recipes: [
        {
            recipeName: String,
            steps: [String],
            recipeMainImg: String,
            recipeMainImg_public_id: String,
            recipeSubImg: String,            // ✅ fix
            recipeSubImg_public_id: String,  // ✅ fix
        },
    ],
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
