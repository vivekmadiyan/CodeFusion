import { io } from "socket.io-client";

export const initSocket = async () => {
  const token = localStorage.getItem("token"); // 🔥 get JWT

  const options = {
    "force new connection": true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
    auth: {
      token: token, // 🔐 send token to backend
    },
  };

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  return io(API_BASE_URL, options);
};
