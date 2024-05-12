"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const Schedule = (props) => {
  const { planId } = props.params;
  const router = useRouter();
  const [dayStep, setDayStep] = useState(1);
  useEffect(() => {
    if (planId) {
      console.log(planId);
    }
  }, [planId]);
  return (
    <div>
      <header className={styles.header}>
        <div
          className={styles.directionIcon}
          onClick={() => {
            router.back();
          }}
        />
      </header>
      <div className={styles.container}>
        <div className={styles.dayInfo}>
          <p>{dayStep}일차</p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
