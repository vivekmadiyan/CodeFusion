import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  data: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roomId: { type: String, unique: true, sparse: true },  // ✅ FIXED
  records: [recordSchema],
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
