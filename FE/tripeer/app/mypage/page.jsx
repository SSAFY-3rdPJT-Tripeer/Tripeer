"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/utils/api";
import defaultImg from "@/public/altImg.png";

export default function MyPage() {
  const [myInfo, setMyInfo] = useState(null);
  const [warn, setWarn] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const getInfo = async () => {
      const res = await api.get("/user/myinfo");
      setMyInfo(res.data.data);
      console.log(res.data.data);
    };
    getInfo();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const changeBtns = (idx) => {
    if (btns[idx].click === false) {
      const checkBtns = btns.filter((btn) => {
        return btn.click === true;
      });
      if (checkBtns.length >= 3) {
        setWarn(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          setWarn(false);
        }, [1000]);
        return;
      }
    }
    const newBtns = btns.map((btn, id) => {
      if (id === idx) {
        btn.click = !btn.click;
      }
      return btn;
    });
    setWarn(false);
    setBtns(newBtns);
  };

  const [btns, setBtns] = useState([
    {
      title: "관광지",
      click: false,
    },
    {
      title: "문화시설",
      click: false,
    },
    {
      title: "축제",
      click: false,
    },
    {
      title: "패키지",
      click: false,
    },
    {
      title: "레포츠",
      click: false,
    },
    {
      title: "쇼핑",
      click: false,
    },
    {
      title: "음식점",
      click: false,
    },
  ]);

  return (
    <div className={styles.container}>
      <div style={{ position: "relative" }}>
        <Image
          src={
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/lowRegisterBg.png"
          }
          alt={"background"}
          fill
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
          priority
          quality={100}
          loading="eager"
        />
      </div>
      <main className={styles.contentBox}>
        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.banner}>Tripeer</p>
            <p className={styles.siteInfo}>
              고민만 하던 여행 계획 함께 계획하세요.
            </p>
          </header>
          <section>
            <div
              className={styles.profileImage}
              style={{ position: "relative" }}>
              <Image
                className={styles.profileImage}
                loader={() => {
                  if (myInfo) {
                    return myInfo.profileImage;
                  }
                  return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/lowRegisterBg.png";
                }}
                src={
                  "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/lowRegisterBg.png"
                }
                alt="user image"
                fill
              />
              <div className={styles.settingBox}>
                <div className={styles.settingIcon} />
              </div>
            </div>
            <div className={styles.inputBox}>
              <p className={styles.nickTitle}>닉네임</p>
              <input type="text" maxLength={10} placeholder={myInfo.nickname} />
              <p className={styles.nickWarn}>1~10자 이내</p>
            </div>
            <div className={styles.inputBox}>
              <p className={styles.nickTitle}>생년월일</p>
              <input type="text" maxLength={4} style={{ width: "50px" }} />
              <p className={styles.birthInfo}>년</p>
              <input type="text" maxLength={4} style={{ width: "50px" }} />
              <p className={styles.birthInfo}>월</p>
              <input type="text" maxLength={4} style={{ width: "50px" }} />
              <p className={styles.birthInfo}>일</p>
            </div>
            <div className={styles.styleBox}>
              <p className={styles.styleTitle}>여행 스타일</p>
              <p
                className={warn ? styles.styleTrueWarn : styles.styleFalseWarn}>
                (최대 3개)
              </p>
            </div>
            <div className={styles.styleContent}>
              {btns.map((btn, idx) => {
                return (
                  <div
                    className={btn.click ? styles.clickBtn : styles.btn}
                    key={idx}
                    onClick={() => {
                      changeBtns(idx);
                    }}>
                    <Image
                      className={styles.image}
                      src={`/register/style${idx + 1}.png`}
                      alt={"styleBtn"}
                      width={20}
                      height={20}
                    />
                    <p>{btn.title}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.confirmBox}>
              <div className={styles.cancelBtn}>이전</div>
              <div className={styles.confirmBtn}>확인</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
