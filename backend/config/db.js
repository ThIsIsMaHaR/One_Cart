import mongoose from "mongoose";

const connectDb = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("✅ Database Connected Successfully");
        });

        if (!process.env.MONGODB_URI) {
            console.error("❌ ERROR: MONGODB_URI is missing in Render Environment Variables");
            return;
        }

        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        // Don't process.exit(1) here to allow the server to at least start 
        // and show you the error in the logs.
    }
};

export default connectDb;