import UserModel from "../models/UserSchema.js";

const saveRecord = async (req, res) => {
  const { username, roomId, data } = req.body;

  try {

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.records.push({ roomId, data });

    await user.save();

    return res.status(200).json({ message: "Record saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error saving record" });
  }
};

const fetchRecord = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ records: user.records });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching records" });
  }
};

export { saveRecord, fetchRecord };
