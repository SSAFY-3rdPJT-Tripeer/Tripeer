"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const MikeFunction = (props) => {
  const { roomName, myInfo } = props;
  const peer = useRef(null);
  const socket = useRef(null);
  const peers = useRef({});
  const myVideo = useRef(null);
  const videoGrid = useRef(null);
  const myStream = useRef(null);
  useEffect(() => {
    function addVideoStream(video, stream, userId) {
      video.style.display = "none";
      video.classList.add(userId);
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
        addVideoStream(video, userVideoStream, userId);
      });
      call.on("close", () => {
        video.remove();
      });

      peers.current[userId] = call;
    }
    if (
      myVideo.current &&
      typeof window !== "undefined" &&
      roomName &&
      myInfo
    ) {
      socket.current = io("https://k10d207.p.ssafy.io", {
        path: "/rtc",
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      peer.current = new Peer("Tripeer" + myInfo.userId);
      myVideo.current.muted = true;

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          myStream.current = stream;
          addVideoStream(myVideo.current, stream, "Tripeer" + myInfo.userId);
          peer.current.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
              addVideoStream(video, userVideoStream, call.peer);
            });
          });
          socket.current.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
          });
        });

      socket.current.on("user-disconnected", (userId) => {
        if (peers.current[userId]) {
          peers.current[userId].close();
        }
      });
      peer.current.on("open", (id) => {
        socket.current.emit("join-room", roomName, id);
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      if (myStream.current) {
        myStream.current.getTracks()[0].stop();
      }
    };
  }, [myVideo, roomName, myInfo]);
  return (
    <div
      style={{
        zIndex: "-1",
        pointerEvents: "none",
        width: "0px",
        height: "0px",
      }}>
      <video
        ref={myVideo}
        onLoadedMetadata={(e) => {
          e.currentTarget.play();
        }}
      />
      <div
        ref={videoGrid}
        style={{
          zIndex: "-1",
          pointerEvents: "none",
          width: "0px",
          height: "0px",
        }}></div>
    </div>
  );
};

export default MikeFunction;
