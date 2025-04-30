import mongoose from "mongoose";
import logger from "../utils/logger";

const connectToDb = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error("❌ MongoDB connection failed:", error);
        process.exit(1); // Exit the app if DB connection fails
    }
};

export default connectToDb;
