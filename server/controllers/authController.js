import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserSchema.js";

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExist = await UserModel.findOne({ username });
    if (userExist) {
      return res.status(409).json({ msg: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    console.log("✅ User registered:", username);

    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error while registering:", error);
    return res.status(500).json({ msg: "Server error while registering" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🔹 Login attempt for:", username);

    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ msg: "Username or password incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(401).json({ msg: "Username or password incorrect" });
    }

    console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Generated Token:", token);

    res.status(200).json({
      msg: "Login Successful",
      token,
    });

  } catch (error) {
    console.error("❌ Error while logging in:", error);
    return res.status(500).json({ msg: "Server error while logging in" });
  }
};

export { login, register };
