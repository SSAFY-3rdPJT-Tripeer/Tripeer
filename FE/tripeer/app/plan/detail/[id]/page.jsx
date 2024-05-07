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
  const myPeerConnection = useRef({});
  const [roomName, setRoomName] = useState(null);
  const [myAudio, setMyaudio] = useState(null);
  const [media, setMedia] = useState(null);
  const myface = useRef(null);
  const peerface = useRef(null);
  const peer = useRef(null);
  const socket = useRef(null);
  const [muted, setMuted] = useState(false);
  const selectedCandidate = useRef({});
  const localStream = useRef(null);
  const box = useRef(null);

  // const handleMuteBtn = function () {
  //   localStream.current.getAudioTracks().forEach((track) => {
  //     track.enabled = !track.enabled;
  //   });
  //   if (!muted) {
  //     setMuted(true);
  //   } else {
  //     setMuted(false);
  //   }
  // };
  const handleMuteBtn = function () {
    localStream.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;

      if (!track.enabled) {
        myface.current.srcObject
          .getAudioTracks()
          .forEach((t) => (t.enabled = false));
      } else {
        myface.current.srcObject
          .getAudioTracks()
          .forEach((t) => (t.enabled = true));
      }
    });

    setMuted(!muted);
  };

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

  useEffect(() => {
    if (roomName) {
      const makeConnect = async (userId) => {
        myPeerConnection.current[userId] = new Object();
        myPeerConnection.current[userId].connection = new RTCPeerConnection({
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
        myPeerConnection.current[userId].connection.addEventListener(
          "icecandidate",
          icecandidate,
        );
        myPeerConnection.current[userId].connection.addEventListener(
          // "addstream",
          // addstream,
          "track",
          handleTrackEvent,
        );

        localStream.current.getTracks().forEach(async (track) => {
          await myPeerConnection.current[userId].connection.addTrack(
            track,
            localStream.current,
          );
        });
      };

      const socket = io("https://k10d207.p.ssafy.io", {
        path: "/rtc",
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      socket.emit("join_room", roomName);
      socket.on("welcome", async ({ userId }) => {
        await makeConnect(userId);
        const offer =
          await myPeerConnection.current[userId].connection.createOffer();
        await myPeerConnection.current[userId].connection.setLocalDescription(
          offer,
        );
        socket.emit("offer", offer, roomName);
      });
      socket.on("offer", async ({ userId, offer }) => {
        await makeConnect(userId);
        if (!myPeerConnection.current[userId].connection.remoteDescription) {
          await myPeerConnection.current[
            userId
          ].connection.setRemoteDescription(offer);
          const answer =
            await myPeerConnection.current[userId].connection.createAnswer(
              offer,
            );
          await myPeerConnection.current[userId].connection.setLocalDescription(
            answer,
          );
          socket.emit("answer", {
            answer,
            // offer,
            toUserId: userId,
            roomName: roomName,
          });
        }
        // console.log("offer : ", offer);
        // console.log("myPeerConnection : ", myPeerConnection);
      });
      socket.on("answer", async ({ userId, answer, toUserId }) => {
        if (myPeerConnection.current[userId] === undefined) {
          await myPeerConnection.current[
            userId
          ].connection.setRemoteDescription(answer);
        }
      });
      socket.on("ice", async ({ userId, candidate }) => {
        if (selectedCandidate.current[candidate.candidate] === undefined) {
          selectedCandidate.current[candidate.candidate] = true;
          await myPeerConnection.current[userId].connection.addIceCandidate(
            candidate,
          );
        }
      });

      socket.on("userDisconnect", ({ userId }) => {
        delete myPeerConnection.current[userId];
      });

      const useMedia = async () => {
        await getMedia();
      };

      const getAudios = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter((device) => {
          return device.kind === "audiooutput";
          // return device.kind === "audioinput";
        });
        const currentAudio = localStream.current.getAudioTracks()[0];
      };
      // const getMedia = async () => {
      //   try {
      //     const stream = await navigator.mediaDevices.getUserMedia({
      //       audio: true,
      //       video: false,
      //     });
      //     localStream.current = stream;
      //     // myface.current.srcObject = stream;
      //     // 로컬에서 오디오 트랙 재생을 방지

      //     getAudios();
      //   } catch (err) {
      //     console.log(err);
      //   }
      // };

      const getMedia = async () => {
        try {
          // 오디오와 비디오 트랙을 사용자로부터 요청
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          localStream.current = stream;

          // 오디오 트랙을 숨겨 로컬에서는 재생되지 않도록 처리
          const audioTracks = stream.getAudioTracks();
          audioTracks.forEach((track) => {
            track.enabled = true; // 상대방에게는 오디오가 전송되지만, 로컬에서는 재생되지 않음
          });

          // 로컬 플레이어(myface)에 오디오 스트림을 설정하지 않음
          if (myface.current) {
            myface.current.srcObject = new MediaStream(); // 오디오를 제외한 빈 스트림을 설정
          }

          // 오디오 트랙이 로컬에서 재생되지 않도록 설정
          const localAudioPlayer = document.createElement("audio");
          localAudioPlayer.srcObject = new MediaStream(audioTracks); // 오디오 트랙을 포함하지만 재생되지 않음
          localAudioPlayer.muted = true; // 이 audio 태그는 음소거되어 있으므로 아무 소리도 들리지 않음
          document.body.appendChild(localAudioPlayer); // 문서에 추가하여 오디오를 활성화하지만 뮤트된 상태로 관리
        } catch (err) {
          console.log("미디어 접근 에러:", err);
        }
      };

      const icecandidate = (ice) => {
        if (ice.candidate) {
          socket.emit("ice", ice.candidate, roomName);
        }
      };

      // const addstream = (data) => {
      //   let videoArea = document.createElement("video");
      //   videoArea.autoplay = true;
      //   videoArea.srcObject = data.stream;
      //   box.current.appendChild(videoArea);
      //   console.log("video: ", videoArea.srcObject);
      // };
      const handleTrackEvent = (event) => {
        console.log("트랙 받음:", event.track); // 트랙 정보 로깅
        console.log("스트림 받음:", event.streams[0]); // 스트림 정보 로깅

        if (event.track.kind === "video") {
          let videoArea = document.createElement("video");
          videoArea.autoplay = true;
          videoArea.srcObject = event.streams[0];
          box.current.appendChild(videoArea);
        } else if (event.track.kind === "audio") {
          // 오디오 트랙을 처리하는 로직, 필요한 경우
        }
      };

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useMedia();

      return () => {
        socket.close();
        localStream.current.getAudioTracks().forEach((t) => t.stop());
      };
    }
  }, [myPeerConnection, roomName]);

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
        handleMuteBtn={handleMuteBtn}
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
        plan={plan}
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
      <div className={styles.socketBox} ref={box}>
        <video
          ref={myface}
          autoPlay
          playsInline
          width={50}
          height={50}
          style={{ border: "1px red solid", display: "none" }}>
          myVoice
        </video>

        <video
          ref={peerface}
          autoPlay
          playsInline
          width={50}
          height={50}
          style={{ border: "1px red solid", display: "none" }}>
          myVoice
        </video>
      </div>
    </div>
  );
};

export default PageDetail;
