import express from "express";
import cors from "cors"
import Connection from "./Mongodbdata/connection.js";
import counterApi from "./HomePage/Counter.js";
import faq from "./AboutusPage/faq.js";
import ViewMorebtn from "./Product/Button.js";

const app = express()
app.use(express.json())
app.use(cors())
Connection()

app.use("/view", ViewMorebtn);  // Button hide and show 
app.use("/counter",counterApi);
app.use("/faq", faq);

app.listen(8000, () => {
    console.log("server is running on localhost:8000");
})