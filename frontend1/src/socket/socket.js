import { io } from "socket.io-client";

// Use environment variable for backend URL, fallback to localhost for development
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export const socket = io(SOCKET_URL);
