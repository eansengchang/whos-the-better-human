import { io } from "socket.io-client";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export const socket = io(REACT_APP_BACKEND_URL, {
  autoConnect: true,
});

console.log(socket)