"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import useRegisterStore from "@/stores/register";

export default function MyPage() {
  const router = useRouter();
  const store = useRegisterStore();
  const [myInfo, setMyInfo] = useState(null);
  const [warn, setWarn] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [nickname, setNickname] = useState("");
  const [duplicate, setDuplicate] = useState(false);
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

  const inputNick = useRef(null);
  const timer = useRef(null);

  const editImage = async (file) => {
    const form = new FormData();
    form.append("image", file);

    const res = await api.patch("/user/myinfo/profileimage", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const image = res.data.data.imageUrl;
    store.setMyInfo({ ...store.myInfo, profileImage: image });
    window.location.reload();
  };

  useEffect(() => {
    if (myInfo) {
      console.log(myInfo);
    }
  }, [myInfo]);

  const confirm = async () => {
    if (nickname.length < 2) {
      setDuplicate(true);

      return false;
    }
    const data = await isDuplicate();
    if (data) {
      setDuplicate(true);
      return;
    } else {
      let styles = [null, null, null];
      let id = 0;
      btns.forEach((item, idx) => {
        if (item.click === true) {
          styles[id] = idx + 1;
          id += 1;
        }
      });
      const request = {
        nickname,
        style1Num: styles[0],
        style2Num: styles[1],
        style3Num: styles[2],
        userId: null,
        birth: null,
        profileImage: null,
        style1: null,
        style2: null,
        style3: null,
      };
      const res = await api.patch(`/user/myinfo`, request);
      console.log(res);
      store.setMyInfo({ ...store.myInfo, nickname: nickname });
      router.push("/");
    }
  };

  const isDuplicate = async () => {
    if (nickname === myInfo.nickname) return false;
    const res = await api.get(`/user/name/duplicatecheck/${nickname}`);
    return res.data.data;
  };

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

  useEffect(() => {
    const getInfo = async () => {
      const res = await api.get("/user/myinfo");
      setMyInfo(res.data.data);
      const date = new Date(res.data.data.birth);
      setYear(date.getFullYear());
      setMonth(date.getMonth() + 1);
      setDay(date.getDate());
      setNickname(res.data.data.nickname);
      inputNick.current.value = res.data.data.nickname;

      const arrs = [
        res.data.data.style1,
        res.data.data.style2,
        res.data.data.style3,
      ];
      const myBtns = btns.map((btn) => {
        if (arrs.find((item) => item === btn.title)) {
          btn.click = true;
        }
        return btn;
      });
      setBtns(myBtns);
      console.log(res.data.data);
    };
    getInfo();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

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
                  return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png";
                }}
                src={
                  "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png"
                }
                alt="user image"
                fill
              />
              <label className={styles.settingBox} htmlFor="file">
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files.length === 0) return;
                    else editImage(e.target.files[0]);
                  }}
                />
                <div className={styles.settingIcon} />
              </label>
            </div>
            <div className={styles.inputBox}>
              <p className={styles.nickTitle}>닉네임</p>
              <input
                type="text"
                maxLength={10}
                style={{ borderRadius: "5px" }}
                ref={inputNick}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
              />
              <p className={styles.nickWarn}>2~10자 이내</p>
            </div>

            <div className={styles.inputBox}>
              <p className={styles.nickTitle}>생년월일</p>
              <input
                type="text"
                maxLength={4}
                style={{ width: "50px", borderRadius: "5px" }}
                value={year}
                disabled
              />
              <p className={styles.birthInfo}>년</p>
              <input
                type="text"
                maxLength={2}
                style={{ width: "50px", borderRadius: "5px" }}
                value={month}
                disabled
              />
              <p className={styles.birthInfo}>월</p>
              <input
                type="text"
                maxLength={2}
                style={{ width: "50px", borderRadius: "5px" }}
                value={day}
                disabled
              />
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
              <div
                className={styles.cancelBtn}
                onClick={() => {
                  router.back();
                }}>
                이전
              </div>
              <div
                className={styles.confirmBtn}
                onClick={() => {
                  confirm();
                }}>
                확인
              </div>
            </div>
            {duplicate ? (
              <p style={{ color: "red", marginTop: "12px" }}>
                중복된 닉네임이거나 닉네임의 글자 수를 확인해주세요.
              </p>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}
