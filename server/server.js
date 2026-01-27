import dotenv from "dotenv";
dotenv.config();

console.log("🔥 ENV CHECK:", process.env.MONGODB_URI);


import express from "express";
import cors from "cors";
import Connect from "./db/connection.js";
import { app, server } from "./socket/socket.js";

import authRouter from "./routes/authRouter.js";
import recordRouter from "./routes/recordRouter.js";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.json("Server is online 🚀");
});
app.use("/user", authRouter);
app.use("/record", recordRouter);

// Dynamic PORT for Render
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await Connect();
  console.log(`✅ Server is running on port ${PORT}`);
});
