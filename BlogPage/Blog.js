import express from "express";
import BlogSchema from "./BlogSchema.js";
import cloudinary from "../Cloudinary/cloudinary.js";
import uploadblog from "../Cloudinary/Multer.js";

const blogRoutes = express.Router();

// Helper for safe JSON parsing
const safeParse = (data) => {
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

// Define recipe image fields (max 10 recipes)
const recipeFields = Array.from({ length: 10 }).map((_, i) => ({
    name: `recipeImage_${i}`,
    maxCount: 1,
}));

// ➡️ Create Blog
blogRoutes.post(
    "/add",
    uploadblog.fields([
        { name: "blogImage", maxCount: 1 },
        { name: "blogBanner", maxCount: 1 },
        { name: "blogBannerMobile", maxCount: 1 },
        ...recipeFields,
    ]),
    async (req, res) => {
        try {
            const body = req.body;

            // Parse embedded recipes
            const recipes = safeParse(body.recipes).map((rec, i) => {
                const file = req.files[`recipeImage_${i}`]?.[0];
                return {
                    ...rec,
                    image: file ? file.path : null,
                    image_public_id: file ? file.filename : null,
                };
            });

            const newBlog = new BlogSchema({
                blogImage: req.files?.blogImage ? req.files.blogImage[0].path : null,
                blogImage_public_id: req.files?.blogImage
                    ? req.files.blogImage[0].filename
                    : null,

                blogBanner: req.files?.blogBanner ? req.files.blogBanner[0].path : null,
                blogBanner_public_id: req.files?.blogBanner
                    ? req.files.blogBanner[0].filename
                    : null,

                blogBannerMobile: req.files?.blogBannerMobile ? req.files.blogBannerMobile[0].path : null,
                blogBannerMobile_public_id: req.files?.blogBannerMobile
                    ? req.files.blogBannerMobile[0].filename
                    : null,

                title: body.title,
                description: body.description,
                category: body.category,
                recipes,
            });

            const saved = await newBlog.save();
            res.status(201).json(saved);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ Get all blogs
blogRoutes.get("/", async (req, res) => {
    try {
        const blogs = await BlogSchema.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ Get single blog
blogRoutes.get("/:id", async (req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ Update blog
blogRoutes.put(
    "/:id",
    uploadblog.fields([
        { name: "blogImage", maxCount: 1 },
        { name: "blogBanner", maxCount: 1 },
        { name: "blogBannerMobile", maxCount: 1 },
        ...recipeFields,
    ]),
    async (req, res) => {
        try {
            const body = req.body;
            const blog = await BlogSchema.findById(req.params.id);
            if (!blog) return res.status(404).json({ error: "Not found" });

            // ✅ Update text fields
            blog.title = body.title || blog.title;
            blog.description = body.description || blog.description;
            blog.category = body.category || blog.category;

            // ✅ Replace blogImage
            if (req.files?.blogImage) {
                if (blog.blogImage_public_id) {
                    await cloudinary.uploader.destroy(blog.blogImage_public_id);
                }
                blog.blogImage = req.files.blogImage[0].path;
                blog.blogImage_public_id = req.files.blogImage[0].filename;
            }

            // ✅ Replace blogBanner
            if (req.files?.blogBanner) {
                if (blog.blogBanner_public_id) {
                    await cloudinary.uploader.destroy(blog.blogBanner_public_id);
                }
                blog.blogBanner = req.files.blogBanner[0].path;
                blog.blogBanner_public_id = req.files.blogBanner[0].filename;
            }
            if (req.files?.blogBannerMobile) {
                if (blog.blogBannerMobile_public_id) {
                    await cloudinary.uploader.destroy(blog.blogBannerMobile_public_id);
                }
                blog.blogBannerMobile = req.files.blogBannerMobile[0].path;
                blog.blogBannerMobile_public_id = req.files.blogBannerMobile[0].filename;
            }

            // ✅ Update recipes
            let parsedRecipes = safeParse(body.recipes) || [];
            const updatedRecipes = parsedRecipes.map((rec, i) => {
                const file = req.files[`recipeImage_${i}`]?.[0];
                return {
                    ...rec,
                    image: file ? file.path : blog.recipes[i]?.image,
                    image_public_id: file
                        ? file.filename
                        : blog.recipes[i]?.image_public_id,
                };
            });
            blog.recipes = updatedRecipes;

            const updated = await blog.save();
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ Delete blog
blogRoutes.delete("/:id", async (req, res) => {
    try {
        const deleted = await BlogSchema.findById(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });

        if (deleted.blogImage_public_id) {
            await cloudinary.uploader.destroy(deleted.blogImage_public_id);
        }
        if (deleted.blogBanner_public_id) {
            await cloudinary.uploader.destroy(deleted.blogBanner_public_id);
        }
        if (deleted.blogBannerMobile_public_id) {
            await cloudinary.uploader.destroy(deleted.blogBannerMobile_public_id);
        }

        for (let rec of deleted.recipes || []) {
            if (rec.image_public_id) {
                await cloudinary.uploader.destroy(rec.image_public_id);
            }
        }

        await deleted.deleteOne();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default blogRoutes;
