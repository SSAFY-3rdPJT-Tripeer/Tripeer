"use client";

/* eslint-disable */

// 외부 모듈
import { useEffect, useState } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./cards.module.css";
import daegu from "./asset/daegu.jpg";

const Cards = () => {
  const [plans, setPlans] = useState([{}, {}, {}, {}, {}]);
  const [showPlans, setShowPlans] = useState([]);
  const [flag, setFlag] = useState(0);
  const [noPlans, setNoPlans] = useState(2); // 레이아웃 비율 유지를 위한 빈 플랜
  const MAX_PLANS_CNT = 6; // 만들 수 있는 최대 계획
  const Per_PAGE_CNT = 3; // 한 페이지에 랜더할 계획의 갯수

  const changeFlag = () => {
    flag === 0 ? setFlag(1) : setFlag(0);
  };

  useEffect(() => {
    let arr = [];
    if (flag === 0) {
      for (let i = 0; i < MAX_PLANS_CNT / 2; i++) {
        if (i === plans.length) break;
        arr.push(plans[i]);
      }
    } else {
      for (let i = 3; i < MAX_PLANS_CNT; i++) {
        if (i === plans.length) break;
        arr.push(plans[i]);
      }
    }
    setShowPlans(arr);
  }, [plans, flag]);

  useEffect(() => {
    switch (showPlans.length) {
      case 0:
        setNoPlans(2);
        break;
      case 1:
        setNoPlans(1);
        break;
      case 4:
        setNoPlans(1);
        break;
      default:
        setNoPlans(0);
        break;
    }
  }, [showPlans]);

  return (
    <main className={styles.container}>
      <aside className={styles.direction}>
        {plans.length >= Per_PAGE_CNT ? (
          <div
            className={styles.left}
            onClick={() => {
              changeFlag();
            }}
          />
        ) : null}
      </aside>
      <article className={`${styles.cardBox}  ${styles.cardAni}`}>
        {showPlans.map((plan, idx) => (
          <div className={styles.card} key={idx}>
            <section
              className={styles.cardBody}
              style={{ position: "relative" }}>
              <Image
                src={daegu}
                placeholder="blur"
                blurDataURL="/altImg.png"
                alt="picture"
                fill
                style={{ borderRadius: "15px" }}
              />
              <div className={styles.cardContent}>
                <div className={styles.title}>
                  <span>싸피탐험대</span>
                  <div className={styles.person}>
                    <div className={styles.personIcon} />
                    <span className={styles.personFont}>5명</span>
                    <div className={styles.personToggle} />
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.destination}>
                    <div className={styles.destinationIcon} />
                    <span className={styles.destinationTitle}>대구 광역시</span>
                  </div>
                  <div className={styles.calendar}>
                    <div className={styles.calendarIcon} />
                    <span className={styles.calendarTitle}>
                      4월 18일(목) ~ 4월 21일(일)
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.newIcon}>
                <span>New</span>
              </div>
            </section>
          </div>
        ))}

        {showPlans.length < Per_PAGE_CNT ? (
          <div className={styles.card}>
            <section className={styles.cardBody}>
              <div className={styles.addCard}>
                <div className={styles.addBtn}>
                  <div className={styles.btn}>
                    <div className={styles.plus} />
                  </div>
                  <p className={styles.addContent}>계획 추가하기</p>
                </div>
              </div>
            </section>
          </div>
        ) : null}
        {[...new Array(noPlans)].map((_, idx) => (
          <div className={styles.card} key={idx} />
        ))}
      </article>
      <aside className={styles.direction}>
        {plans.length >= Per_PAGE_CNT ? (
          <div
            className={styles.right}
            onClick={() => {
              changeFlag();
            }}
          />
        ) : null}
      </aside>
    </main>
  );
};

export default Cards;
