"use client";

import { useEffect, useMemo, useState } from "react";
import PlanNav from "@/components/nav/PlanNav";
import styles from "./page.module.css";
import PlanHome from "@/components/plan/detail/PlanHome";
import PlanMap from "@/components/plan/detail/PlanMap";
import PlanSchedule from "@/components/plan/detail/PlanSchedule";

const PageDetail = (props) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    // 여기서 구독 처리( 해당 props에 planId 존재함)
    console.log(props);
  }, [props]);
  const RENDER = useMemo(() => {
    return [
      <PlanHome key={"PlanHome"} />,
      <PlanMap key={"PlanMap"} />,
      <PlanSchedule key={"PlanSchedule"} />,
    ];
  }, []);
  return (
    <main className={styles.container}>
      <PlanNav current={current} setCurrent={setCurrent}></PlanNav>
      {RENDER[current]}
    </main>
  );
};

export default PageDetail;
