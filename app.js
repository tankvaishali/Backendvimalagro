import express from "express";
import cors from "cors"
import Connection from "./Mongodbdata/connection.js";
import AddProduct from "./Product/Product.js";
import ViewMorebtn from "./Product/Button.js";
import productImageRoute from "./Product/productImageRoute.js";

const app = express()

app.use(cors())
Connection()
app.use(express.json());

app.use("/view", ViewMorebtn); //for button hide and show 
app.use("/api/products", AddProduct);
app.use('/api/upload', productImageRoute); // Get Add Update and Delete Product

app.listen(8000, () => {
    console.log("server is running on localhost:8000");
})