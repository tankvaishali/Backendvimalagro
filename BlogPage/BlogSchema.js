import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    recipeName: { type: String, required: true },
    serving: { type: Number, required: true },
    prep_time: { type: Number, required: true },
    cook_time: { type: Number, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    image: { type: String },
    image_public_id: { type: String },
    cooking_instructions: [{ type: String, required: true }],
});

const Schema = new mongoose.Schema(
    {
        blogImage: { type: String, required: true },
        blogImage_public_id: { type: String },
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        blogBanner: { type: String, required: true },
        blogBanner_public_id: { type: String },
        recipes: [recipeSchema],
    },
    { timestamps: true }
);
    
const BlogSchema = mongoose.model("Blog", Schema);
export default BlogSchema;
