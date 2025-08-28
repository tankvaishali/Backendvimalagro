import mongoose from "mongoose";

const Connection = async () => {
   await mongoose.connect("mongodb+srv://swadvimalgj:tbeLp4SVNcIvotnz@cluster0.kniraly.mongodb.net/vimalagro",{ tls: true}).then(() => {
        console.log("mongoDB connected");
    })
}

export default Connection