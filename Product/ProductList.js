import mongoose, { Schema } from "mongoose";

const SubproductSchema = new Schema({
    subproductName: { type: String, required: true },
    subproductImg: {
        type: String,
        public_id: String,
    },
    description: { type: String },
    weight: { type: Number },
});

const RecipeSchema = new Schema({
    recipeName: { type: String, required: true },
    steps: [{ type: String }],
    recipeMainImg: {
        type: String,
        public_id: String,
    },
    recipeSubImg: [
        {
            type: String,
            public_id: String,
        },
    ],
});

const ProSchema = new Schema(
    {
        productBanner: {
            type: String,
            public_id: String,
        },
        productName: { type: String, required: true },
        productImages: [
            {
                type: String,
                public_id: String,
            },
        ],
        productSizes: [{ type: String }],

        subproducts: [SubproductSchema],

        banner2: {
            type: String,
            public_id: String,
        },
        howToMakeBanner: {
            type: String,
            public_id: String,
        },

        recipes: [RecipeSchema],
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", ProSchema);

export default Product;