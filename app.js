import express from "express";
import cors from "cors"
import Connection from "./Mongodbdata/connection.js";

const app = express()

app.use(cors())
Connection()

app.listen(8000, () => {
    console.log("server is running on localhost:8000");

})