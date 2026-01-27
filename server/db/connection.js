import mongoose from "mongoose";

const Connect = async () => {
  // ✅ Read env INSIDE the function (runtime, not import time)
  const dbURI = process.env.MONGODB_URI;

  if (!dbURI) {
    console.error("FATAL ERROR: MONGODB_URI is not set in the environment.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbURI);
    console.log("✅ Successfully connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default Connect;
