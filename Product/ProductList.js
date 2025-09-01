import mongoose, { Schema } from "mongoose";

const SubproductSchema = new Schema({
    subproductName: { type: String, required: true },
    subproductImg: { type: String },
    description: { type: String },
    weight: { type: String },
});

const RecipeSchema = new Schema({
    recipeName: { type: String, required: true },
    steps: [{ type: String }],
    recipeMainImg: { type: String },
    recipeSubImg: { type: String },
});

const ProSchema = new Schema(
    {
        productBanner: { type: String },
        productName: { type: String, required: true },
        productImages: [{ type: String }],
        productSizes: [{ type: String }],

        subproducts: [SubproductSchema],

        banner2: { type: String },
        howToMakeBanner: { type: String },

        recipes: [RecipeSchema],
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", ProSchema);

export default Product;