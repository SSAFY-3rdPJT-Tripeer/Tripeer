"use client";

import { io } from "socket.io-client";

const socket = io("https://k10d207.p.ssafy.io/rtc");
// const socket = io("https://k10d207.p.ssafy.io/rtc", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "foobar",
//   },
// });

export { socket };
