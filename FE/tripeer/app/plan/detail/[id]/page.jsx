"use client";

// 외부 모듈
import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useRouter } from "next/navigation";

// 내부 모듈
import PlanNav from "@/components/nav/PlanNav";
import styles from "./page.module.css";
import PlanHome from "@/components/plan/detail/PlanHome";
import PlanMap from "@/components/plan/detail/PlanMap";
import PlanSchedule from "@/components/plan/detail/PlanSchedule";
import api from "@/utils/api";
import MikeFunction from "@/components/plan/detail/MikeFunction";
import QRCode from "qrcode.react";

const PageDetail = (props) => {
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
  const [roomName, setRoomName] = useState(null);
  const [exit, setExit] = useState(false);

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
      const isExit = provider.doc.getText("exit");
      isExit.observe(() => {
        if (isExit.toString() === "exit") {
          setExit(true);
          console.log("프로젝트 종료");
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
        plan={plan}
        online={online}
        myInfo={myInfo}
        provider={provider}
        mouseInfo={mouseInfo}
      />,
    ];
  }, [props, plan, online, myInfo, provider, mouseInfo]);

  return (
    <>
      <MikeFunction roomName={roomName} myInfo={myInfo} />
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
      </div>
      {exit ? (
        <div className={styles.back}>
          <div className={styles.modalBox}>
            <div
              className={styles.backIcon}
              onClick={() => {
                router.back();
              }}
            />
            <QRCode
              value={`https://k10d207.p.ssafy.io/trip/${props.params.id}`}
            />
            <div
              className={styles.exitBtn}
              onClick={() => {
                window.location.replace(
                  `https://k10d207.p.ssafy.io/trip/${props.params.id}`,
                );
              }}>
              여행 바로 가기
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PageDetail;
