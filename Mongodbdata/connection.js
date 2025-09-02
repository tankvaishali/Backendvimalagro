import mongoose from "mongoose";

const Connection = async () => {
    try {
        await mongoose.connect("mongodb+srv://swadvimalgj:tbeLp4SVNcIvotnz@cluster0.kniraly.mongodb.net/vimalagro");
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

export default Connection