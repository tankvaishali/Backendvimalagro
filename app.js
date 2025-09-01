import express from "express";
import cors from "cors";
import Connection from "./Mongodbdata/connection.js";
import counterApi from "./HomePage/Counter.js";
import faq from "./AboutusPage/faq.js";
import ViewMorebtn from "./Product/Button.js";
import AddProduct from "./Product/Product.js";
import productImageRoute from "./Product/productImageRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

// connect MongoDB
Connection();

// Routes
app.use("/view", ViewMorebtn);
app.use("/counter", counterApi);
app.use("/faq", faq);
app.use("/api/products", AddProduct);
app.use("/api/upload", productImageRoute);

app.listen(8000, () => {
    console.log("🚀 Server is running on http://localhost:8000");
});
