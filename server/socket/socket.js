import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import ACTIONS from "../actions/Actions.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


// 🔐 ADD SOCKET AUTH MIDDLEWARE HERE
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log("❌ Socket rejected: No token");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    console.log("✅ Socket authenticated:", decoded.username);
    next();
  } catch (error) {
    console.log("❌ Socket rejected: Invalid token");
    return next(new Error("Authentication error"));
  }
});


const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("🔌 socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId }) => {
    // 🔥 USE AUTHENTICATED USERNAME FROM TOKEN
    const username = socket.user.username;

    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

export { app, server, io };
