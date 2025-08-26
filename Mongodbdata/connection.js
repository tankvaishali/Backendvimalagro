import mongoose from "mongoose";

const Connection = async () => {
   await mongoose.connect("mongodb+srv://vaishalitank28603:vaishalitank312@cluster0.qzxy1.mongodb.net/vimalagro",{ tls: true}).then(() => {
        console.log("mongoDB connected");
    })
}

export default Connection