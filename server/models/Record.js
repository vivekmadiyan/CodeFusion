import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true, // one record per room
  },
  code: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Record", recordSchema);
