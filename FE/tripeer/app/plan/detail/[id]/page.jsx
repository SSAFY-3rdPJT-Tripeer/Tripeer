"use client";

// 외부 모듈
import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

// 내부 모듈
import PlanNav from "@/components/nav/PlanNav";
import styles from "./page.module.css";
import PlanHome from "@/components/plan/detail/PlanHome";
import PlanMap from "@/components/plan/detail/PlanMap";
import PlanSchedule from "@/components/plan/detail/PlanSchedule";
import api from "@/utils/api";
import { socket } from "@/components/plan/detail/socket";

const PageDetail = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [current, setCurrent] = useState(0);
  const [plan, setPlan] = useState(null);
  const [online, setOnline] = useState([]);
  const [myInfo, setMyInfo] = useState({});
  const [mouseInfo, setMouseInfo] = useState([]);
  const [mode, setMode] = useState(false); // 0이면 채팅off , 1이면 채팅 On
  const [myMouse, setMyMouse] = useState([-100, -100]);
  const inputBox = useRef(null);
  const [showInfo, setShowInfo] = useState("...");
  const [timer, setTimer] = useState(null);
  const router = useRouter();
  const [myStream, setMystream] = useState(null);
  /** @type {RTCPeerConnection} */
  const [myPeerConnection, setMyPeerConnection] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [myAudio, setMyaudio] = useState(null);
  const [media, setMedia] = useState(null);
  const myface = useRef(null);
  const peerface = useRef(null);
  const peer = useRef(null);
  const socket = useRef(null);

  const COLOR = [
    "#A60000",
    "#DE5000",
    "#D78E00",
    "#48B416",
    "#0065AE",
    "#20178B",
    "#65379F",
    "#F96976",
  ];

  const updateMouse = (x, y) => {
    if (provider) {
      provider.awareness.setLocalStateField("mouse", {
        id: myInfo.userId,
        nickname: showInfo,
        color: myInfo.order,
        page: current,
        x: x,
        y: y,
      });
    }
  };

  const chat = (e) => {
    setShowInfo(e.target.value);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    let tempTimer = setTimeout(() => {
      setShowInfo(myInfo.nickname);
      setMode(false);
    }, 3000);
    setTimer(tempTimer);
  };

  useEffect(() => {
    const setUserState = async () => {
      const res = await api.get(`/plan/myinfo/${props.params.id}`);
      setRoomName(props.params.id); // socket 연결을 위한 roomName 생성
      setMyInfo(res.data.data);
      setShowInfo(res.data.data.nickname);
      provider.awareness.setLocalStateField("user", {
        id: res.data.data.userId,
        nickname: res.data.data.nickname,
        img: res.data.data.profileImage,
        color: COLOR[res.data.data.order],
      });
    };
    if (provider) {
      setUserState();
      provider.awareness.on("change", () => {
        const unique = new Set();
        const unique2 = new Set();
        const result = [];
        const result2 = [];
        provider.awareness.getStates().forEach((user) => {
          const clone = structuredClone(user);
          const key = JSON.stringify(user);
          if (clone.mouse) {
            const key2 = user.mouse.id;
            if (!unique2.has(key2)) {
              unique2.add(key2);
              result2.push(clone.mouse);
            }
          }
          if (!unique.has(key)) {
            unique.add(key);
            result.push(user.user);
          }
        });
        if (JSON.stringify(result) !== JSON.stringify(online)) {
          setOnline(result);
        }
        if (JSON.stringify(result2) !== JSON.stringify(mouseInfo)) {
          setMouseInfo(result2);
        }
      });
    }
  }, [provider]);

  useEffect(() => {
    const changeMode = (e) => {
      if (e.key === "`") {
        if (mode) {
          setMode(false);
        } else {
          setMode(true);
        }
      }
    };
    window.addEventListener("keydown", changeMode);
    return () => {
      window.removeEventListener("keydown", changeMode);
    };
  }, [mode]);

  useEffect(() => {
    const getPlan = async () => {
      if (props.params?.id) {
        const doc = new Y.Doc();
        try {
          const res = await api.get(`/plan/main/${props.params.id}`);
          setPlan(res.data.data);
          const ws = new WebsocketProvider(
            "wss://k10d207.p.ssafy.io/node",
            `room-${props.params.id}`,
            doc,
          );
          setProvider(ws);
        } catch (err) {
          router.push("/");
        }
      }
    };
    getPlan();
  }, [props, router]);

  useEffect(() => {
    return () => {
      if (provider) {
        provider.destroy();
      }
    };
  }, [provider]);

  useEffect(() => {
    updateMouse(myMouse[0], myMouse[1]);
  }, [showInfo, updateMouse]);

  useEffect(() => {
    if (mode === true) {
      console.log(inputBox);
      inputBox.current.focus();
    }
  }, [mode]);

  // const makeConnection = () => {
  //   const peerInfo = new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: [
  //           "stun:stun.l.google.com:19302",
  //           "stun:stun1.l.google.com:19302",
  //           "stun:stun2.l.google.com:19302",
  //           "stun:stun3.l.google.com:19302",
  //           "stun:stun4.l.google.com:19302",
  //         ],
  //       },
  //     ],
  //   });
  //   console.log(peerInfo);
  //   peerInfo.addEventListener("icecandidate", handleIce);
  //   setMyPeerConnection(peerInfo);
  // };
  // const handleIce = function (data) {
  //   console.log("sent candidate");
  //   socket.emit("ice", data.candidate, roomName);
  // };

  useEffect(() => {
    if (roomName && myStream) {
      const sock = io("https://k10d207.p.ssafy.io", {
        path: "/rtc",
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      const peerInfo = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      });
      peer.current = peerInfo;
      peerInfo.addEventListener("icecandidate", (data) => {
        console.log("sent candidate");
        sock.emit("ice", data.candidate, roomName);
      });
      peerInfo.addEventListener("addstream", (data) => {
        peerface.current.srcObject = data.stream;
      });
      myStream
        .getTracks()
        .forEach((track) => peerInfo.addTrack(track, myStream));
      setMyPeerConnection(peerInfo);

      socket.current = sock;
      sock.emit("join_room", roomName);
      sock.on("welcome", async () => {
        const offer = await peerInfo.createOffer();
        peerInfo.setLocalDescription(offer);
        console.log("sent the offer");
        sock.emit("offer", offer, roomName);
      });
      sock.on("offer", async (offer) => {
        console.log("received the offer");
        console.log(offer);
        peerInfo.setRemoteDescription(offer);
        const answer = await peerInfo.createAnswer();
        console.log(answer);
        peerInfo.setLocalDescription(answer);
        sock.emit("answer", answer, roomName);
        console.log("sent the answer");
      });
      sock.on("answer", (answer) => {
        peerInfo.setRemoteDescription(answer);
        console.log("received the answer");
      });
      sock.on("ice", (ice) => {
        console.log("recieve candidate");
        peerInfo.addIceCandidate(ice);
      });
    }
  }, [roomName, myStream]);

  useEffect(() => {
    let stream;
    const getAudios = async function () {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter((device) => {
          return device.kind === "audioinput";
        });
        const currentAudio = stream.getAudioTracks()[0];
        console.log("커렌트", currentAudio);
      } catch (err) {
        console.log(err);
      }
    };
    const getMedia = async function () {
      const initialConstrains = {
        audio: false,
        video: false,
      };
      try {
        stream = await navigator.mediaDevices.getUserMedia(initialConstrains);
        console.log(myface.current);
        myface.current.srcObject = stream;
        await getAudios();
        setMystream(stream);
      } catch (err) {
        console.log(err);
      }
    };
    getMedia();
    return () => {
      peer.current.close();
      socket.current.close();
      stream.getAudioTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  const RENDER = useMemo(() => {
    return [
      <PlanHome
        key={"PlanHome"}
        {...props}
        plan={plan}
        setPlan={setPlan}
        online={online}
        myInfo={myInfo}
        provider={provider}
        mouseInfo={mouseInfo}
      />,
      <PlanMap
        key={"PlanMap"}
        {...props}
        plan={plan}
        setPlan={setPlan}
        online={online}
        myInfo={myInfo}
        provider={provider}
        mouseInfo={mouseInfo}
      />,
      <PlanSchedule
        key={"PlanSchedule"}
        online={online}
        myInfo={myInfo}
        provider={provider}
        mouseInfo={mouseInfo}
      />,
    ];
  }, [props, plan, online, myInfo, provider, mouseInfo]);

  return (
    <div
      className={styles.container}
      onMouseMove={(e) => {
        updateMouse(e.clientX, e.clientY);
        setMyMouse([e.clientX, e.clientY]);
      }}>
      {!mode ? (
        <span
          style={{
            transform: `translate(${myMouse[0] + 10}px, ${myMouse[1] + 10}px)`,
            backgroundColor: `${COLOR[myInfo.order]}`,
          }}
          className={styles.userNickname}>
          Me
        </span>
      ) : (
        <textarea
          style={{
            transform: `translate(${myMouse[0] + 10}px, ${myMouse[1] + 10}px)`,
            backgroundColor: `${COLOR[myInfo.order]}`,
          }}
          className={`${styles.userNickname} ${styles.userInput}`}
          placeholder="글을 입력하세요."
          ref={inputBox}
          rows={3}
          maxLength={35}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            chat(e);
          }}
        />
      )}
      {mouseInfo.map((user, idx) => {
        return user.id === myInfo.userId || user.page !== current ? null : (
          <div key={idx}>
            <div
              key={`mouse${idx}`}
              className={styles.mouse}
              style={{
                backgroundImage: `url(https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/mouse${user.color}.svg)`,
                transform: `translate(${user.x}px, ${user.y}px)`,
              }}></div>
            <span
              key={`name${idx}`}
              style={{
                transform: `translate(${user.x + 20}px, ${user.y + 10}px)`,
                backgroundColor: `${COLOR[user.color]}`,
              }}
              className={styles.userNickname}>
              {user.nickname}
            </span>
          </div>
        );
      })}
      <PlanNav current={current} setCurrent={setCurrent}></PlanNav>
      {RENDER[current]}
      <video
        ref={myface}
        autoPlay
        playsInline
        width={100}
        height={100}
        style={{ border: "1px red solid" }}>
        myVoice
      </video>
      <button>음소거</button>
      <video
        ref={peerface}
        autoPlay
        playsInline
        width={100}
        height={100}
        style={{ border: "1px red solid" }}>
        myVoice
      </video>
    </div>
  );
};

export default PageDetail;
