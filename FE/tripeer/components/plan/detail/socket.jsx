"use client";

import { io } from "socket.io-client";

const socket = io("https://k10d207.p.ssafy.io", {
  path: "/rtc",
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export { socket };
