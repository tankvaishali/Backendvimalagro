// import mongoose, { Schema } from "mongoose";

// // Subproduct Schema
// const SubproductSchema = new Schema({
//     subproductName: { type: String, required: true },
//     subproductImg: { type: String }, // URL or Cloudinary link
//     description: { type: String },
//     weight: { type: String },
// });

// // Recipe Schema
// const RecipeSchema = new Schema({
//     recipeName: { type: String, required: true },
//     steps: [{ type: String }], // Array of steps
//     recipeMainImg: { type: String }, // main image
//     recipeSubImg: { type: String },  // sub image
// });

// // Main Product Schema
// const ProSchema = new Schema(
//     {
//         productBanner: { type: String }, // main product banner image
//         productName: { type: String, required: true },
//         productImages: [{ type: String }], // multiple product images
//         productSizes: [{ type: String }],  // array of sizes

//         subproducts: [SubproductSchema], // embedded subproducts

//         banner2: { type: String },          // another banner image
//         howToMakeBanner: { type: String },  // how-to-make banner image

//         recipes: [RecipeSchema], // array of recipes
//     },
//     { timestamps: true }
// );

// const ProductSchema = mongoose.model("Product", ProSchema);
// // // Export properly
// // const Subproduct = mongoose.model("Subproduct", SubproductSchema);
// // const Recipe = mongoose.model("Recipe", RecipeSchema);


// export default ProductSchema;


import mongoose, { Schema } from "mongoose";

// const subproductSchema = new mongoose.Schema({
//     id: { type: String },
//     ProductName: { type: String },
//     subName: { type: String },
//     proimg: { type: String },
//     description: { type: String }
// });

// const recipeSchema = new mongoose.Schema({
//     recipeName: { type: String, required: true },
//     steps: [{ type: String }],
//     recipeMainImg: { type: String },
//     recipeSubImg: { type: String }
// });

// const productSchema = new mongoose.Schema({
//     id: { type: String, required: true, unique: true },
//     h1: { type: String, required: true },
//     mainLine: { type: String, required: true },
//     img: { type: String, required: true },
//     subproducts: [subproductSchema],
//     recipes: [recipeSchema],
// });

const SubproductSchema = new Schema({
    subproductName: { type: String, required: true },
    subproductImg: { type: String }, // URL or Cloudinary link
    description: { type: String },
    weight: { type: String },
});

// Recipe Schema
const RecipeSchema = new Schema({
    recipeName: { type: String, required: true },
    steps: [{ type: String }], // Array of steps
    recipeMainImg: { type: String }, // main image
    recipeSubImg: { type: String },  // sub image
});

// Main Product Schema
const ProSchema = new Schema(
    {
        productBanner: { type: String }, // main product banner image
        productName: { type: String, required: true },
        productImages: [{ type: String }], // multiple product images
        productSizes: [{ type: String }],  // array of sizes

        subproducts: [SubproductSchema], // embedded subproducts

        banner2: { type: String },          // another banner image
        howToMakeBanner: { type: String },  // how-to-make banner image

        recipes: [RecipeSchema], // array of recipes
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", ProSchema);

export default Product;