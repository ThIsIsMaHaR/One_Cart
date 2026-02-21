import mongoose from "mongoose";

const connectDb = async () => {
    // 1. Setup the listener first
    mongoose.connection.on('connected', () => {
        console.log("✅ Database Connected Successfully");
    });

    mongoose.connection.on('error', (err) => {
        console.log("❌ Mongoose Connection Error:", err);
    });

    // 2. Check for the URI
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ ERROR: MONGODB_URI is missing in Render Environment Variables");
        return;
    }

    try {
        // 3. Connect (Remove the manual "/e-commerce" for now to test the base connection)
        await mongoose.connect(uri);
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
    }
};

export default connectDb;