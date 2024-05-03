"use client";

// 외부 모듈
import { useEffect, useMemo, useState } from "react";
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

const PageDetail = (props) => {
  const [provider, setProvider] = useState(null);
  const [current, setCurrent] = useState(0);
  const [plan, setPlan] = useState(null);
  const [online, setOnline] = useState([]);
  const [myInfo, setMyInfo] = useState({});
  const [mouseInfo, setMouseInfo] = useState([]);
  const router = useRouter();

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

  useEffect(() => {
    const setUserState = async () => {
      const res = await api.get(`/plan/myinfo/${props.params.id}`);
      setMyInfo(res.data.data);
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
    <div className={styles.container}>
      <PlanNav current={current} setCurrent={setCurrent}></PlanNav>
      {RENDER[current]}
    </div>
  );
};

export default PageDetail;
