"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import logo from "@/public/FullLogo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import altImg from "@/public/altImg.png";
import axios from "axios";
import Link from "next/link";

const TripPage = (props) => {
  const { planId } = props.params;
  const router = useRouter();
  const [plan, setPlan] = useState(null);
  const [planDetail, setPlanDetail] = useState(null);
  const [planDate, setPlanDate] = useState("");

  // 플랜 아이디 받기
  useEffect(() => {
    if (planId) {
      // 해당 planId를 통한 조회 로직 추가하면 됨
      console.log(planId);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/history/${planId}`)
        .then((res) => {
          setPlan(res.data.data);
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [planId, router]);

  useEffect(() => {
    const date = ["월", "화", "수", "목", "금", "토", "일"];

    if (plan) {
      setPlanDetail(plan.diaryDetail);
      const startDate = new Date(plan.diaryDetail.startDay);
      const endDate = new Date(plan.diaryDetail.endDay);
      const startYear = startDate.getFullYear().toString().substring(2, 4);
      const endYear = endDate.getFullYear().toString().substring(2, 4);
      const startMonth = (startDate.getMonth() + 1).toString().padStart(2, "0");
      const endMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");
      const startDay = startDate.getDate().toString().padStart(2, "0");
      const endDay = endDate.getDate().toString().padStart(2, "0");
      let startString =
        startYear +
        "." +
        startMonth +
        "." +
        startDay +
        `(${date[startDate.getDay() - 1]})`;
      let endString =
        endYear +
        "." +
        endMonth +
        "." +
        endDay +
        `(${date[endDate.getDay() - 1]})`;
      setPlanDate(startString + " - " + endString);
    }
  }, [plan]);

  return (
    <div>
      <header className={styles.logoHeader}>
        <Image
          src={logo}
          width={100}
          height={25}
          alt="Tripeer Full Logo"
          style={{ objectFit: "cover", cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        />
      </header>
      <div className={styles.planContainer}>
        <div className={styles.planCard}>
          <div className={styles.img} style={{ position: "relative" }}>
            <Image
              src={altImg}
              loader={() => {
                return planDetail ? planDetail.img : altImg;
              }}
              fill
              alt="디폴트"
              className={styles.realImg}
            />
          </div>
          <div className={styles.detailBox}>
            <div className={styles.planTitle}>
              {planDetail ? planDetail.title : null}
            </div>
            <div className={styles.type}>
              <div className={styles.placePointer} />
              <p>여행지</p>
            </div>
            <p className={styles.font}>
              {planDetail
                ? planDetail.townList.map((town, idx) => {
                    return idx !== planDetail.townList.length - 1 ? (
                      <span key={idx}>{town} ,</span>
                    ) : (
                      <span key={idx}>{town}</span>
                    );
                  })
                : null}
            </p>
            <div className={styles.type}>
              <div className={styles.dayIcon} />
              <p>여행 날짜</p>
            </div>
            <p className={styles.font}>{planDate}</p>
            <div className={styles.type}>
              <div className={styles.personIcon} />
              <p>여행 인원</p>
            </div>
            <div className={styles.personBox}>
              {planDetail
                ? planDetail.member.map((item, idx) => {
                    return (
                      <div className={styles.circle} key={idx}>
                        <div
                          className={styles.profile}
                          style={{
                            backgroundImage: `url(${item.profileImage})`,
                          }}
                        />
                        <p className={styles.profileName}>{item.nickname}</p>
                      </div>
                    );
                  })
                : null}
            </div>
            <div className={styles.btnBox}>
              <div className={styles.weatherBtn}>
                <div className={styles.weatherIcon} />
              </div>
              <Link
                style={{ textDecoration: "none" }}
                href={{
                  pathname: `/trip/${planId}/schedule`,
                }}>
                <div className={styles.planBtn}>
                  <p>여행 일정 보러 가기</p>
                  <div className={styles.directIcon} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPage;
