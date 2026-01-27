import UserModel from "../models/UserSchema.js";

const saveRecord = async (req, res) => {
  const { username, roomId, data } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 CHECK IF ROOM ALREADY EXISTS
    const existingRecord = user.records.find(
      (record) => record.roomId === roomId
    );

    if (existingRecord) {
      // ✅ UPDATE EXISTING ROOM
      existingRecord.data = data;
      existingRecord.updatedAt = new Date();
    } else {
      // ✅ CREATE NEW ROOM RECORD
      user.records.push({
        roomId,
        data,
        updatedAt: new Date(),
      });
    }

    await user.save();

    return res.status(200).json({ message: "Record saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error saving record" });
  }
};
