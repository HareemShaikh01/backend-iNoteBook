import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectDB = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)    
       console.log("MONGODB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED ",error);   
        process.exit(1);
    }
}

export default connectDB;