import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./PlanSchedule.module.css";
import flagSrc from "@/public/plan/flag.png";
import scheduleIcon from "@/public/plan/scheduleIcon.png";
// 더미 데이터
import dummyUserList from "@/utils/dummyUserList";
import dummyPlaceList from "@/utils/dummyItem";
import ScheduleItem from "@/components/plan/detail/schedule/scheduleItem";

const PlanSchedule = () => {
  const [userList, setUserList] = useState([]);
  const [placeList, setPlaceList] = useState([]);

  useEffect(() => {
    setUserList(dummyUserList);
    setPlaceList(dummyPlaceList);
  }, []);

  return (
    // 화면 전체
    <div className={styles.container}>
      {/*  왼쪽 우리의 여행지 목록 전체 박스  */}
      <main className={styles.main}>
        {/*  우리의 여행지 목록 타이틀 박스  */}
        <section className={styles.titleBox}>
          <Image src={flagSrc} alt={""} width={23} height={26} />
          <p>우리의 여행지 목록</p>
        </section>
        <div className={styles.line} />
        {/*  유저 프사 박스  */}
        <section className={styles.userBox}>
          {userList.map((el, idx) => {
            return <img key={idx} src={el.img} alt={""} />;
          })}
        </section>
        <div className={styles.line} />
        {/*  왼쪽 바디 */}
        {/*  목록 리스트  */}
        <section className={`${styles.list} ${styles.scroll}`}>
          {placeList.map((el, idx) => {
            return <ScheduleItem key={idx} data={el} />;
          })}
        </section>
      </main>
      {/*  오른쪽 플랜 일정 짜는 바디  */}
      {/*  오른쪽 일정 박스  */}
      <main className={styles.mainRight}>
        {/*  오른쪽 헤더  */}
        <header className={styles.rightHeader}>
          {/*  헤더의 왼쪽 부분  */}
          <section className={styles.leftSection}>
            <Image src={scheduleIcon} alt={""} width={30} height={30} />
            <p>여행일정</p>
            <p>24.05.05(월) - 24.05.08(목)</p>
          </section>
          {/*  헤더의 오른쪽 부분  */}
        </header>
        <div className={styles.line} />
      </main>
    </div>
  );
};

export default PlanSchedule;
