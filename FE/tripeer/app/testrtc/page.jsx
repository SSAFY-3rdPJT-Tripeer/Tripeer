"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const RtcTest = () => {
  const peer = useRef(null);
  const socket = useRef(null);
  const peers = useRef({});
  const myVideo = useRef(null);
  const videoGrid = useRef(null);
  useEffect(() => {});
  useEffect(() => {
    function addVideoStream(video, stream) {
      console.log("hi");
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid.current.append(video);
    }

    function connectToNewUser(userId, stream) {
      const call = peer.current.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });

      peers.current[userId] = call;
    }
    if (myVideo.current && typeof window !== "undefined") {
      socket.current = io("https://k10d207.p.ssafy.io", {
        path: "/rtc",
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      peer.current = new Peer(undefined);
      myVideo.current.muted = true;

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          addVideoStream(myVideo.current, stream);
          peer.current.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
              addVideoStream(video, userVideoStream);
            });
          });
          socket.current.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      socket.current.on("user-disconnected", (userId) => {
        if (peers.current[userId]) {
          peers.current[userId].close();
        }
      });
      peer.current.on("open", (id) => {
        socket.current.emit("join-room", 123, id);
      });
    }
    return () => {
      socket.current.disconnect();
    };
  }, [myVideo]);
  return (
    <div>
      <div>
        <video
          ref={myVideo}
          onLoadedMetadata={(e) => {
            e.currentTarget.play();
          }}></video>
      </div>
      <div ref={videoGrid}></div>
    </div>
  );
};

export default RtcTest;
