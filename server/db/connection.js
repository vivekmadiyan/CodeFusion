import mongoose from 'mongoose';

// 1. Read the connection string from environment variables
const dbURI = process.env.MONGODB_URI;

const Connect = async () => {
  // 2. Add a check to ensure the variable exists
  if (!dbURI) {
    console.error('FATAL ERROR: MONGODB_URI is not set in the environment.');
    process.exit(1); // Exit the application with an error code
  }

  try {
    // 3. Use the dbURI variable to connect
    await mongoose.connect(dbURI);
    console.log("Successfully connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if the connection fails
  }
};

export default Connect;
