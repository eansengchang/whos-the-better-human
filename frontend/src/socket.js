import { io } from "socket.io-client";

const BACKEND_IP = process.env.BACKEND_IP

export const socket = io(BACKEND_IP, {
  autoConnect: true,
});
