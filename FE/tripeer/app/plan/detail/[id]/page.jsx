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
  const router = useRouter();

  useEffect(() => {
    const setUserState = async () => {
      const res = await api.get("/user/myinfo");
      provider.awareness.setLocalStateField("user", {
        id: res.data.data.userId,
        nickname: res.data.data.nickname,
        img: res.data.data.profileImage,
      });
    };
    if (provider) {
      setUserState();

      provider.awareness.on("change", () => {
        const unique = new Set();
        const result = [];
        provider.awareness.getStates().forEach((user) => {
          const key = JSON.stringify(user);
          if (!unique.has(key)) {
            unique.add(key);
            result.push(user);
          }
        });
        console.log(result);
        setOnline(result);
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
            "ws://k10d207.p.ssafy.io:3001",
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
    return () => {
      if (provider) {
        provider.destroy();
      }
    };
  }, [props]);

  const RENDER = useMemo(() => {
    return [
      <PlanHome key={"PlanHome"} {...props} plan={plan} setPlan={setPlan} />,
      <PlanMap key={"PlanMap"} {...props} plan={plan} setPlan={setPlan} />,
      <PlanSchedule key={"PlanSchedule"} />,
    ];
  }, [props, plan]);
  return (
    <div className={styles.container}>
      <PlanNav current={current} setCurrent={setCurrent}></PlanNav>
      {RENDER[current]}
    </div>
  );
};

export default PageDetail;
