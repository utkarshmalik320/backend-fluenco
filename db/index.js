import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config("./env");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MONGODB connection established!! DB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Connection Error Conection cannot Establish", error); // Corrected console.log spelling
        process.exit(1);
    }
};

export default connectDB;
