import express from "express";
import Product from "./ProductList.js";
import cloudinary from "../Cloudinary/cloudinary.js";
import upload from "../Cloudinary/Multer.js";

const productRoutes = express.Router();

// helper for safe parsing JSON
const safeParse = (data) => {
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

const subproductFields = Array.from({ length: 100 }).map((_, i) => ({
    name: `subproductImg_${i}`, maxCount: 1
}));

const recipeFieldspost = Array.from({ length: 100 }).flatMap((_, i) => [
    { name: `recipeMainImg_${i}`, maxCount: 1 },
    { name: `recipeSubImg_${i}`, maxCount: 1 },
]);

// ➡️ Create product
productRoutes.post(
    "/add",
    upload.fields([
        { name: "productBanner", maxCount: 1 },
        { name: "productBannerMobile", maxCount: 1 },  // ✅ new
        { name: "banner2", maxCount: 1 },
        { name: "banner2Mobile", maxCount: 1 },        // ✅ new
        { name: "howToMakeBanner", maxCount: 1 },
        { name: "howToMakeBannerMobile", maxCount: 1 },// ✅ new
        { name: "productImages", maxCount: 10 },
        ...subproductFields,
        ...recipeFieldspost,
    ]),
    async (req, res) => {
        try {
            const body = req.body;

            const subproducts = safeParse(body.subproducts).map((sub, i) => {
                const file = req.files[`subproductImg_${i}`]?.[0];
                return {
                    ...sub,
                    subproductImg: file ? file.path : null,
                    subproductImg_public_id: file ? file.filename : null,
                };
            });

            const recipes = safeParse(body.recipes).map((rec, i) => {
                const mainFile = req.files[`recipeMainImg_${i}`]?.[0];
                const subFile = req.files[`recipeSubImg_${i}`]?.[0];
                return {
                    ...rec,
                    recipeMainImg: mainFile ? mainFile.path : null,
                    recipeMainImg_public_id: mainFile ? mainFile.filename : null,
                    recipeSubImg: subFile ? subFile.path : null,
                    recipeSubImg_public_id: subFile ? subFile.filename : null,
                };
            });

            const newProduct = new Product({
                productName: body.productName,
                productSizes: safeParse(body.productSizes),

                productBanner: req.files?.productBanner
                    ? req.files.productBanner[0].path
                    : null,
                productBanner_public_id: req.files?.productBanner
                    ? req.files.productBanner[0].filename
                    : null,

                banner2: req.files?.banner2 ? req.files.banner2[0].path : null,
                banner2_public_id: req.files?.banner2
                    ? req.files.banner2[0].filename
                    : null,

                howToMakeBanner: req.files?.howToMakeBanner
                    ? req.files.howToMakeBanner[0].path
                    : null,
                howToMakeBanner_public_id: req.files?.howToMakeBanner
                    ? req.files.howToMakeBanner[0].filename
                    : null,


                /* Mobile */
                productBannerMobile: req.files?.productBannerMobile
                    ? req.files.productBannerMobile[0].path
                    : null,
                productBannerMobile_public_id: req.files?.productBannerMobile
                    ? req.files.productBannerMobile[0].filename
                    : null,

                banner2Mobile: req.files?.banner2Mobile
                    ? req.files.banner2Mobile[0].path
                    : null,
                banner2Mobile_public_id: req.files?.banner2Mobile
                    ? req.files.banner2Mobile[0].filename
                    : null,

                howToMakeBannerMobile: req.files?.howToMakeBannerMobile
                    ? req.files.howToMakeBannerMobile[0].path
                    : null,
                howToMakeBannerMobile_public_id: req.files?.howToMakeBannerMobile
                    ? req.files.howToMakeBannerMobile[0].filename
                    : null,

                /* End */

                productImages: req.files?.productImages
                    ? req.files.productImages.map((img) => img.path)
                    : [],
                productImages_public_id: req.files?.productImages
                    ? req.files.productImages.map((img) => img.filename)
                    : [],

                subproducts,
                recipes,
            });

            const saved = await newProduct.save();
            res.status(201).json(saved);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);


// ➡️ Get all products
productRoutes.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➡️ Get single product
productRoutes.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ➡️ Update product (supports file upload)
productRoutes.put(
    "/:id",
    upload.fields([
        { name: "productBanner", maxCount: 1 },
        { name: "productBannerMobile", maxCount: 1 },
        { name: "banner2", maxCount: 1 },
        { name: "banner2Mobile", maxCount: 1 },
        { name: "howToMakeBanner", maxCount: 1 },
        { name: "howToMakeBannerMobile", maxCount: 1 },
        { name: "productImages", maxCount: 10 },
        ...subproductFields,
        ...recipeFieldspost,
    ]),
    async (req, res) => {
        try {
            const body = req.body;
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ error: "Not found" });

            // ✅ Update simple fields
            product.productName = body.productName || product.productName;
            product.productSizes = body.productSizes
                ? safeParse(body.productSizes)
                : product.productSizes;

            // ✅ Banner images (delete old, replace new only if file provided)
            const singleImageFields = [
                "productBanner",
                "banner2",
                "howToMakeBanner",
                "productBannerMobile",
                "banner2Mobile",
                "howToMakeBannerMobile",
            ];

            for (let field of singleImageFields) {
                if (req.files?.[field]) {
                    const publicIdKey = `${field}_public_id`;
                    if (product[publicIdKey]) {
                        await cloudinary.uploader.destroy(product[publicIdKey]);
                    }
                    product[field] = req.files[field][0].path;
                    product[publicIdKey] = req.files[field][0].filename;
                }
            }

            // ✅ Product Images (append instead of replace)
            if (req.files?.productImages) {
                // delete old images from Cloudinary
                if (product.productImages_public_id && product.productImages_public_id.length > 0) {
                    for (let oldId of product.productImages_public_id) {
                        await cloudinary.uploader.destroy(oldId);
                    }
                }

                const newImgs = req.files.productImages.map((img) => ({
                    url: img.path,
                    public_id: img.filename,
                }));

                // replace with new only
                product.productImages = newImgs.map((i) => i.url);
                product.productImages_public_id = newImgs.map((i) => i.public_id);
            }


            // ✅ Subproducts (update or keep old)
            if (body.subproducts) {
                const parsedSubs = safeParse(body.subproducts);

                const updatedSubs = await Promise.all(
                    parsedSubs.map(async (sub, i) => {
                        const file = req.files[`subproductImg_${i}`]?.[0];
                        if (file && product.subproducts[i]?.subproductImg_public_id) {
                            await cloudinary.uploader.destroy(
                                product.subproducts[i].subproductImg_public_id
                            );
                        }
                        return {
                            ...product.subproducts[i],
                            ...sub,
                            subproductImg: file
                                ? file.path
                                : product.subproducts[i]?.subproductImg,
                            subproductImg_public_id: file
                                ? file.filename
                                : product.subproducts[i]?.subproductImg_public_id,
                        };
                    })
                );

                product.subproducts = updatedSubs;
            }

            // ✅ Recipes (update or keep old)
            if (body.recipes) {
                const parsedRecipes = safeParse(body.recipes);

                const updatedRecipes = await Promise.all(
                    parsedRecipes.map(async (rec, i) => {
                        const mainFile = req.files[`recipeMainImg_${i}`]?.[0];
                        const subFile = req.files[`recipeSubImg_${i}`]?.[0];

                        if (mainFile && product.recipes[i]?.recipeMainImg_public_id) {
                            await cloudinary.uploader.destroy(
                                product.recipes[i].recipeMainImg_public_id
                            );
                        }
                        if (subFile && product.recipes[i]?.recipeSubImg_public_id) {
                            await cloudinary.uploader.destroy(
                                product.recipes[i].recipeSubImg_public_id
                            );
                        }

                        return {
                            ...product.recipes[i],
                            ...rec,
                            recipeMainImg: mainFile
                                ? mainFile.path
                                : product.recipes[i]?.recipeMainImg,
                            recipeMainImg_public_id: mainFile
                                ? mainFile.filename
                                : product.recipes[i]?.recipeMainImg_public_id,
                            recipeSubImg: subFile
                                ? subFile.path
                                : product.recipes[i]?.recipeSubImg,
                            recipeSubImg_public_id: subFile
                                ? subFile.filename
                                : product.recipes[i]?.recipeSubImg_public_id,
                        };
                    })
                );

                product.recipes = updatedRecipes;
            }

            const updated = await product.save();
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// ➡️ Delete product
productRoutes.delete("/:id", async (req, res) => {
    try {
        const deleted = await Product.findById(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });

        if (deleted.productBanner_public_id) {
            await cloudinary.uploader.destroy(deleted.productBanner_public_id);
        }
        if (deleted.banner2_public_id) {
            await cloudinary.uploader.destroy(deleted.banner2_public_id);
        }
        if (deleted.howToMakeBanner_public_id) {
            await cloudinary.uploader.destroy(deleted.howToMakeBanner_public_id);
        }
        if (deleted.productBannerMobile_public_id) {
            await cloudinary.uploader.destroy(deleted.productBannerMobile_public_id);
        }
        if (deleted.banner2Mobile_public_id) {
            await cloudinary.uploader.destroy(deleted.banner2Mobile_public_id);
        }
        if (deleted.howToMakeBannerMobile_public_id) {
            await cloudinary.uploader.destroy(deleted.howToMakeBannerMobile_public_id);
        }
        if (Array.isArray(deleted.productImages_public_id)) {
            for (let id of deleted.productImages_public_id) {
                if (id) await cloudinary.uploader.destroy(id);
            }
        }

        for (let sub of deleted.subproducts || []) {
            if (sub.subproductImg_public_id) {
                await cloudinary.uploader.destroy(sub.subproductImg_public_id);
            }
        }

        for (let rec of deleted.recipes || []) {
            if (rec.recipeMainImg_public_id) {
                await cloudinary.uploader.destroy(rec.recipeMainImg_public_id);
            }
            if (rec.recipeSubImg_public_id) {
                await cloudinary.uploader.destroy(rec.recipeSubImg_public_id);
            }
        }

        await deleted.deleteOne();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default productRoutes;
