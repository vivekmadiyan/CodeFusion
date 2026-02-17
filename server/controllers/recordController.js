import Record from "../models/Record.js";

export const saveRecord = async (req, res) => {
  try {
    const { roomId, code } = req.body;

    if (!roomId || !code) {
      return res.status(400).json({ msg: "Missing roomId or code" });
    }

    // Check if record already exists for this room
    let record = await Record.findOne({ roomId });

    if (record) {
      // Update existing record
      record.code = code;
      record.updatedAt = Date.now();
      await record.save();
    } else {
      // Create new record
      record = new Record({ roomId, code });
      await record.save();
    }

    res.status(200).json({ msg: "Code saved successfully" });

  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({ msg: "Server error while saving code" });
  }
};

export const fetchRecord = async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ msg: "Missing roomId" });
    }

    const record = await Record.findOne({ roomId });

    if (!record) {
      return res.status(404).json({ msg: "No saved code found" });
    }

    res.status(200).json({ code: record.code });

  } catch (error) {
    console.error("Error fetching code:", error);
    res.status(500).json({ msg: "Server error while fetching code" });
  }
};
