import { useEffect, useState } from "react";
import styles from "./dateModal.module.css";
import Image from "next/image";

import arrow from "./asset/arrowBtn.svg";

const DateModal = (props) => {
  const { setStep, setNewPlan, newPlan } = props;
  const [canNext, setCanNext] = useState(false);
  const [startYear, setStartYear] = useState("0000");
  const [startMonth, setStartMonth] = useState("0");
  const [startDay, setStartDay] = useState("0");
  const [endYear, setEndYear] = useState("0000");
  const [endMonth, setEndMonth] = useState("0");
  const [endDay, setEndDay] = useState("0");
  const [weekArr, setWeekArr] = useState([]);

  const MONTHS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const WEEKS = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const movePrev = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
      return;
    }
    setMonth(month - 1);
  };

  const moveNext = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth(month + 1);
  };

  const nextPage = () => {
    if (canNext) {
      const formStartMonth = String(startMonth).padStart(2, "0");
      const formStartDay = String(startDay).padStart(2, "0");
      const formEndMonth = String(endMonth).padStart(2, "0");
      const formEndDay = String(endDay).padStart(2, "0");
      let plan = Object.assign(newPlan);
      plan.startDay = `${startYear}-${formStartMonth}-${formStartDay}`;
      plan.endDay = `${endYear}-${formEndMonth}-${formEndDay}`;
      setNewPlan(plan);
      setStep(2);
    }
  };

  const setDay = (day) => {
    const dayDate = day["날짜"];
    const selectedDate = new Date(year, month, dayDate);
    const currentDate = new Date(startYear, startMonth - 1, startDay);

    // MONTHS 배열 결과를 변수에 저장하여 중복 계산 방지
    const selectedMonth = MONTHS[month];

    // 시작 날짜 설정 또는 변경
    if (startDay === "0" || currentDate.getTime() > selectedDate.getTime()) {
      setStartYear(year);
      setStartMonth(selectedMonth);
      setStartDay(dayDate);
    }
    // 종료 날짜 설정
    else if (endDay === "0") {
      setEndYear(year);
      setEndMonth(selectedMonth);
      setEndDay(dayDate);
    }
    // 나머지 경우들: 시작 날짜를 새로운 날짜로 업데이트하고 종료 날짜를 초기화
    else {
      setStartYear(year);
      setStartMonth(selectedMonth);
      setStartDay(dayDate);
      setEndYear("0000");
      setEndMonth("0");
      setEndDay("0");
    }
  };

  useEffect(() => {
    if (startDay !== "0" && endDay !== "0") {
      setCanNext(true);
    } else {
      setCanNext(false);
    }
  }, [startDay, endDay]);

  useEffect(() => {
    const createPrevMonthDays = (days, firstWeekDay) => {
      for (let noDay = 0; noDay < firstWeekDay; noDay++) {
        let day = new Date(year, month, noDay - firstWeekDay + 1).getDate();
        let weekDay = new Date(year, month, noDay - firstWeekDay + 1).getDay();
        days.push({
          날짜: day,
          요일: weekDay,
          style: "prevDay",
        });
      }
    };

    const createCurrentMonthDays = (days, lastDay) => {
      for (let day = 1; day <= lastDay; day++) {
        let weekDay = new Date(year, month, day).getDay();
        if (new Date(year, month, day).getTime() < new Date().getTime()) {
          days.push({
            날짜: day,
            요일: weekDay,
            style: "prevDay",
          });
        } else {
          days.push({
            날짜: day,
            요일: weekDay,
            style: "currentDay",
          });
        }
      }
    };

    const getDayArr = () => {
      let days = [];
      const firstWeekDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();
      // 이전 달 정보
      createPrevMonthDays(days, firstWeekDay);
      // 이번 달 정보
      createCurrentMonthDays(days, lastDay);
      return days;
    };

    const getWeekArr = (dayArr) => {
      const weeks = [];
      for (let i = 0; i < dayArr.length; i += 7) {
        weeks.push(dayArr.slice(i, i + 7));
      }
      return weeks;
    };
    let dayArr = getDayArr();
    const weeks = getWeekArr(dayArr);
    setWeekArr(weeks);
  }, [year, month]);

  return (
    <>
      <header className={styles.header}>
        <p className={styles.title}>여행날짜를 선택해주세요.</p>
        <p
          className={`${styles.btn} ${canNext ? styles.able : styles.disable}`}
          onClick={() => {
            nextPage();
          }}>
          다음
        </p>
      </header>
      <section className={styles.dateContainer}>
        <div className={styles.textDate}>
          <div className={styles.startDay}>
            <p className={styles.dayTitle}>출발 일자</p>
            <p className={styles.dayContent}>
              {startYear}년 {startMonth}월 {startDay}일
            </p>
          </div>
          <div className={styles.endDay}>
            <p className={styles.dayTitle}>도착 일자</p>
            <p className={styles.dayContent}>
              {endYear}년 {endMonth}월 {endDay}일
            </p>
          </div>
        </div>
        <div className={styles.calendar}>
          <article>
            <header className={styles.dateController}>
              <p className={styles.dateNow}>
                {year}년 {MONTHS[month]}월
              </p>
              <div className={styles.dateBtn}>
                <Image
                  src={arrow}
                  width={20}
                  height={20}
                  alt="prev-btn"
                  className={styles.leftBtn}
                  onClick={() => {
                    movePrev();
                  }}
                />
                <Image
                  src={arrow}
                  width={20}
                  height={20}
                  alt="next-btn"
                  className={styles.rightBtn}
                  onClick={() => {
                    moveNext();
                  }}
                />
              </div>
            </header>
            <main>
              <table className={styles.calendarTable}>
                <thead>
                  <tr>
                    {WEEKS.map((day, idx) => {
                      return (
                        <th key={idx} className={styles.calendarDay}>
                          {day}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {weekArr.map((week, idx) => {
                    return (
                      <tr key={idx}>
                        {week.map((day, id) => {
                          return (
                            <td
                              key={id}
                              className={`${styles.dayTable} ${styles[day.style]} ${new Date(startYear, startMonth - 1, startDay).getTime() <= new Date(year, month, day["날짜"]).getTime() && new Date(endYear, endMonth - 1, endDay).getTime() >= new Date(year, month, day["날짜"]).getTime() && day.style !== "prevDay" ? styles.clicked : ""} 
                              ${((startYear === year && startDay === day["날짜"] && startMonth === MONTHS[month]) || (endYear === year && endDay === day["날짜"] && endMonth === MONTHS[month])) && day.style !== "prevDay" ? styles.realClick : ""}`}
                              onClick={() => {
                                setDay(day);
                              }}>
                              <span>{day["날짜"]}</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </main>
          </article>
        </div>
      </section>
    </>
  );
};

export default DateModal;
