"use client";

import { useEffect, useMemo, useState } from "react";
import PlanNav from "@/components/nav/PlanNav";
import styles from "./page.module.css";
import PlanHome from "@/components/plan/detail/PlanHome";
import PlanMap from "@/components/plan/detail/PlanMap";
import PlanSchedule from "@/components/plan/detail/PlanSchedule";
import api from "@/utils/api";

const PageDetail = (props) => {
  const [current, setCurrent] = useState(0);
  const [plan, setPlan] = useState(null);
  useEffect(() => {
    const getPlan = async () => {
      if (props.params?.id) {
        const res = await api.get(`/plan/main/${props.params.id}`);
        setPlan(res.data.data);
        console.log(res);
      }
    };
    getPlan();
  }, [props]);
  const RENDER = useMemo(() => {
    return [
      <PlanHome key={"PlanHome"} {...props} plan={plan} setPlan={setPlan} />,
      <PlanMap key={"PlanMap"} />,
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
