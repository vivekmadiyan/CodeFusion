import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempts: Infinity, // fix spelling
    timeout: 10000,
    transports: ["websocket"],
  };

  // Use Vite env variable
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  return io(API_BASE_URL, options);
};
