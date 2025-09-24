// import express from "express";
// import cors from "cors";
// import Connection from "./Mongodbdata/connection.js";
// import counterApi from "./HomePage/Counter.js";
// import faq from "./AboutusPage/faq.js";
// import ViewMorebtn from "./Product/Button.js";
// import AddProduct from "./Product/Product.js";
// import productImageRoute from "./Product/productImageRoute.js";

// const app = express();
// app.use(express.json());
// app.use(cors());

// // connect MongoDB
// Connection();

// // Routes
// app.use("/view", ViewMorebtn);
// app.use("/counter", counterApi);
// app.use("/faq", faq);
// app.use("/api/products", AddProduct);
// app.use("/api/upload", productImageRoute);

// app.listen(8000, () => {
//     console.log("🚀 Server is running on http://localhost:8000");
// });


import express from "express";
import cors from "cors";
import Connection from "./Mongodbdata/connection.js";
import counterApi from "./HomePage/Counter.js";
import faq from "./AboutusPage/faq.js";
import ViewMorebtn from "./Product/Button.js";
import AddProduct from "./Product/Product.js";
import productImageRoute from "./Product/productImageRoute.js";
import Aboutusimage from "./HomePage/Aboutus.js";
import TestimonialRouter from "./HomePage/Testimonial.js";
import certificatelist from "./HomePage/Certificates.js";
import Ourstory from "./AboutusPage/Ourstory.js";
import vimalaboutusimage from "./AboutusPage/vimalabout.js";
import Leaderlogo from "./AboutusPage/Leaderlogo.js";
import homebannerRouter from "./HomePage/Homepagebanner.js";
import aboutbannerRouter from "./AboutusPage/Aboutpagebanner.js";
import productbannerRouter from "./Product/Blogpagebanner.js";
import blogbannerRouter from "./BlogPage/Blogpagebanner.js";
import contactbannerRouter from "./Contactpage/Contactbanner.js";
import extraSubProductRoutes from "./Product/ExtraSubProduct.js";
import blogRoutes from "./BlogPage/Blog.js";
import ExtraSubHeading from "./Product/ExtraSubHeading.js";
import aboutprinciple from "./AboutusPage/Principle.js";

const app = express();
app.use(cors())
app.use(express.json());
app.use("/homebanner", homebannerRouter);
app.use("/aboutbanner", aboutbannerRouter);
app.use("/productbanner", productbannerRouter);
app.use("/blogbanner", blogbannerRouter);
app.use("/api/blogs", blogRoutes);
app.use("/contactbanner", contactbannerRouter);
app.use("/view", ViewMorebtn);
app.use("/counter", counterApi);
app.use("/faq", faq);
app.use("/certificate", certificatelist);
app.use("/aboutus", Aboutusimage)
app.use("/aboutus", Aboutusimage)
app.use("/ourstory", Ourstory)
app.use("/principle", aboutprinciple)
app.use("/api/products", AddProduct);
app.use("/api/upload", productImageRoute);
app.use("/api/extrasubproducts", extraSubProductRoutes);
app.use("/api/heading", ExtraSubHeading);
app.use("/testimonial", TestimonialRouter);
app.use("/vimalabout", vimalaboutusimage);
app.use("/leaderlogo", Leaderlogo);
app.use(cors());
// ✅ Use Render's port, not hardcoded 8000
const PORT = 8000;

Connection().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
