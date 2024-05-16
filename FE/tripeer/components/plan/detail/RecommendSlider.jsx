"use client";

import { useEffect, useState } from "react";
import styles from "./recommendSlider.module.css";
import FullHeart from "@/components/plan/asset/fullheart.svg";
import Heart from "@/components/plan/asset/heart.svg";
import Image from "next/image";
import api from "@/utils/api";

const RecommendSlider = (props) => {
  const {
    recommends,
    recommend,
    rId,
    setRecommends,
    plan,
    provider,
    myInfo,
    setAlert,
    setInit,
    setTimer,
  } = props;

  const [transMax, setTransMax] = useState(0);
  const [goStep, setGoStep] = useState(0);

  const chooseEulReul = (word) => {
    const lastChar = word[word.length - 1];
    const lastCharCode = lastChar.charCodeAt(0);
    if (lastCharCode < 0xac00 || lastCharCode > 0xd7a3) {
      return word + "를"; //한글 아닐때 를!
    }

    // 받침 확인
    const baseCode = lastCharCode - 0xac00;
    const jongseong = baseCode % 28;

    return jongseong === 0 ? word + "를" : word + "을";
  };

  const changeWishList = async (idx, isLike, spotId) => {
    const cloneRecoms = structuredClone(recommends);
    cloneRecoms[rId]["spotItemList"][idx].isWishlist = !isLike;
    setRecommends(cloneRecoms);
    await api.post(`/plan/wishlist/${spotId}`);
  };

  const addSaveSpot = async (idx, spot) => {
    const saveSpot = provider.doc.getArray("saveSpot");
    try {
      const tempSave = { ...spot, ...myInfo };
      await api.post(
        `/plan/bucket?planId=${plan.planId}&spotInfoId=${spot.spotInfoId}`,
      );
      saveSpot.insert(0, [tempSave]);
    } finally {
      const cloneRecoms = structuredClone(recommends);
      cloneRecoms[rId]["spotItemList"][idx].spot = true;
      setRecommends(cloneRecoms);
    }
  };

  const removeSaveSpot = async (idx, spot) => {
    const totalYList = provider.doc.getArray("totalYList").toJSON();
    let isVisit = false;
    for (let item of totalYList) {
      if (item.length > 0) {
        isVisit = true;
        break;
      }
    }
    if (totalYList.length > 0 && isVisit) {
      const findTotal = totalYList[0].filter((item) => {
        return item.spotInfoId === spot.spotInfoId;
      });
      if (findTotal.length === 0) {
        setAlert(true);
        setInit(true);
        let time = setTimeout(() => {
          setAlert(false);
          setTimer(time);
        }, 2000);
        return;
      }
    }
    try {
      await api.delete(
        `/plan/bucket?planId=${plan.planId}&spotInfoId=${spot.spotInfoId}`,
      );
      const ySpot = provider.doc.getArray("saveSpot");
      const arr = ySpot.toArray();
      let index = arr.findIndex((item) => item.spotInfoId === spot.spotInfoId);
      ySpot.delete(index);
    } finally {
      const cloneRecoms = structuredClone(recommends);
      cloneRecoms[rId]["spotItemList"][idx].spot = false;
      setRecommends(cloneRecoms);
    }
  };

  const chooseWaGwa = (word) => {
    const lastChar = word[word.length - 1];
    const lastCharCode = lastChar.charCodeAt(0);
    if (lastCharCode < 0xac00 || lastCharCode > 0xd7a3) {
      return word + "과"; //한글 아닐때 과!
    }

    // 받침 확인
    const baseCode = lastCharCode - 0xac00;
    const jongseong = baseCode % 28;

    return jongseong === 0 ? word + "와" : word + "과";
  };

  const makeSentence = (item) => {
    switch (item.sub) {
      case "wishlist1":
        return chooseEulReul(item.main) + " 즐겨찾는 당신을 위해";
      case "wishlist2":
        return "요즘 " + item.main + "에 관심 있나요?";
      case "bucket1":
        return "이번 계획 키워드는 " + item.main;
      case "bucket2":
        return "여행은 " + chooseWaGwa(item.main) + " 함께";
      case "style1":
        return "나는야 " + item.main + " 취향";
      case "style2":
        return item.main + " 너무 좋아";
      case "hotbucket":
        return "인기 키워드 " + item.main + "!!";
      case "hotwish":
        return "유저들이 좋아하는 " + item.main + " 어떠세요?";
    }
  };

  const goNext = (idx) => {
    if (idx > 0) {
      const goTo = goStep - 300;
      if (goTo < transMax) {
        setGoStep(transMax);
      } else {
        setGoStep(goTo);
      }
    } else {
      const goTo = goStep + 300;
      if (goTo > 0) {
        setGoStep(0);
      } else {
        setGoStep(goTo);
      }
    }
  };

  useEffect(() => {
    if (recommend) {
      const MAX_LENGTH = recommend.spotItemList.length * 160;
      setTransMax(-MAX_LENGTH + 330);
    }
  }, [recommend]);

  return (
    <>
      {recommend ? (
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.realExplain}>{makeSentence(recommend)}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                className={styles.arrow}
                onClick={() => {
                  goNext(-1);
                }}></div>
              <div
                className={styles.arrow}
                style={{ transform: "rotate(180deg)" }}
                onClick={() => {
                  goNext(1);
                }}></div>
            </div>
          </header>
          <div className={styles.slider}>
            <div
              className={styles.realTrack}
              style={{
                transform: `translateX(${goStep}px)`,
              }}>
              {recommend.spotItemList.map((spot, idx) => {
                return (
                  <div className={styles.realCard} key={idx}>
                    <Image
                      loader={() => {
                        if (spot.img) {
                          return spot.img;
                        }
                        return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png";
                      }}
                      src={
                        "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png"
                      }
                      width={150}
                      height={150}
                      style={{ borderRadius: "10px" }}
                      alt="trip-image"
                      quality={30}
                    />
                    <p className={styles.realTitle}>{spot.title}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        marginLeft: "4px",
                        marginTop: "8px",
                      }}>
                      <div className={styles.positionIcon} />
                      <p className={styles.realPosition}>{spot.addr}</p>
                    </div>
                    <div className={styles.controller}>
                      <div
                        className={styles.realLikeBtn}
                        onClick={() => {
                          changeWishList(idx, spot.isWishlist, spot.spotInfoId);
                        }}>
                        <Image
                          width={18}
                          height={18}
                          src={spot.isWishlist ? FullHeart : Heart}
                          alt="HeartIcon"
                        />
                      </div>
                      {spot.spot ? (
                        <div
                          className={styles.realCancelBtn}
                          onClick={() => {
                            removeSaveSpot(idx, spot);
                          }}>
                          취소
                        </div>
                      ) : (
                        <div
                          className={styles.realPlusBtn}
                          onClick={() => {
                            addSaveSpot(idx, spot);
                          }}>
                          여행지 추가
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.explain}></p>
          </header>
          <div className={styles.slider}>
            <div className={styles.track}>
              {[1, 2, 3].map((_, idx) => {
                return (
                  <div className={styles.card} key={idx}>
                    <div className={styles.img}></div>
                    <p className={styles.title}></p>
                    <p className={styles.positioin}></p>
                    <div className={styles.controller}>
                      <div className={styles.likeBtn}></div>
                      <div className={styles.plusBtn}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendSlider;
