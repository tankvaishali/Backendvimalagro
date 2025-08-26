import express from "express";
import cors from "cors"
import Connection from "./Mongodbdata/connection.js";
import counterApi from "./HomePage/Counter.js";

const app = express()
app.use(express.json())
app.use(cors())
Connection()


app.use("/counter",counterApi)



app.listen(8000, () => {
    console.log("server is running on localhost:8000");

})