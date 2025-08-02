// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // 👈 Your backend server URL

export default socket;
