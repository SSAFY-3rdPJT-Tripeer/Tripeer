"use client";

// 외부 모듈
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

// 내부 모듈
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import styles from "./diaryDetailCard.module.css";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import api from "@/utils/api";
// import { set } from "lodash";

const DiaryDetailCard = (props) => {
  const router = useRouter();
  const { diaryDayList, getDayOfWeek, setIsCostModal } = props;
  const [diaryDay, setDiaryDay] = useState(null);
  const [galleryPriviews, setGalleryPreviews] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const formatCost = (cost) => {
    return parseInt(cost, 10).toLocaleString();
  };
  const [costs, setCosts] = useState(
    diaryDayList.planDetailList.map((detail) => ({
      id: detail.planDetailId,
      cost: parseInt(detail.cost, 10),
      formattedCost: formatCost(detail.cost),
    })),
  );
  const defaultGalleryURL =
    "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/galleryDefault.png";

  const goAlbum = (diaryDay) => {
    window.sessionStorage.setItem("prevScroll", window.scrollY.toString());
    router.push(`/diary/detail/${diaryDayList.planDayId}/${diaryDay}`);
  };

  const CARD_CATEGORY = useMemo(() => {
    return {
      관광지: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      문화시설: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      "축제 공연 행사": {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      "여행 코스": {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      레포츠: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      숙박: {
        name: "숙박",
        color: "#D26D6D",
        img: SleepIcon,
      },
      쇼핑: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      음식점: {
        name: "맛집",
        color: "#D37608",
        img: EatIcon,
      },
    };
  }, []);

  const getContentType = (type) => {
    if (!diaryDayList) return 0;
    switch (type) {
      case "음식점":
        return 1;
      case "숙박":
        return 2;
      default:
        return 0;
    }
  };

  const showGallery = () => {
    if (diaryDayList) {
      const photos = diaryDayList.galleryImgs;
      const filledPrevies = [...photos];

      while (filledPrevies.length < 4) {
        filledPrevies.push(defaultGalleryURL);
      }
      setGalleryPreviews(filledPrevies);
    }
  };

  // 비용을 업데이트하는 함수
  const handleCostChange = (planDetailId, newCost) => {
    const numericCost = newCost.replace(/,/g, "");
    setCosts((currentCosts) =>
      currentCosts.map((cost) =>
        cost.id === planDetailId
          ? {
              ...cost,
              cost: numericCost,
              formattedCost: formatCost(numericCost),
            }
          : cost,
      ),
    );
  };

  const editCost = async (planDetailId, cost) => {
    await api.post("/history/cost", {
      planDetailId: planDetailId,
      cost: cost,
    });
  };

  const calculateTotalCost = () => {
    const total = costs.reduce((acc, curr) => acc + parseInt(curr.cost, 10), 0);
    setTotalCost(total);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [costs]);

  useEffect(() => {
    const scrollValue = window.sessionStorage.getItem("prevScroll");
    if (scrollValue) {
      window.scrollTo(0, parseInt(scrollValue));
      window.sessionStorage.removeItem("prevScroll");
    }
  }, []);

  useEffect(() => {
    if (diaryDayList) {
      setDiaryDay(diaryDayList.day);
      showGallery();
    }
  }, [diaryDayList]);

  return (
    <main className={styles.container}>
      <div className={styles.dateBox}>
        <div className={styles.dateLeft}>{diaryDay}일차</div>
        <div className={styles.dateRight}>
          {getDayOfWeek(diaryDayList.date)}
        </div>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.contentLeft}>
          {galleryPriviews.map((item, idx) => {
            return (
              <div key={idx} className={styles.photoBox}>
                <div
                  style={{
                    backgroundImage: `url(${item ? item : defaultGalleryURL})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}>
                  {idx === 3 ? (
                    <div
                      className={styles.moreBox}
                      onClick={() => {
                        goAlbum(diaryDay);
                      }}>
                      <div className={styles.moreText}>사진 더보기</div>
                      <div className={styles.moreIcon}></div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.contentRight}>
          {diaryDayList.planDetailList.map((item, id) => {
            return (
              <div key={id} className={styles.planBox}>
                <div className={styles.orderBox}>
                  <div
                    className={styles.orderNumBox}
                    style={{
                      backgroundColor: `${CARD_CATEGORY[item.contentType].color}`,
                    }}>
                    <div className={styles.orderNum}>{item.step}</div>
                  </div>
                  <div className={styles.orderBar}>
                    {id === diaryDayList.planDetailList.length - 1 ? (
                      <div className={styles.orderBarLast}></div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className={styles.planContentBox}>
                  <div className={styles.planSpot}>{item.title}</div>
                  <div className={styles.planTime}>{item.address}</div>

                  <div className={styles.planSpotBox}>
                    <div
                      className={`${styles.planType} ${styles["type" + getContentType(item.contentType)]}`}></div>

                    <div className={styles.planCostBox}>
                      <input
                        className={styles.planCostText}
                        value={
                          costs.find((cost) => cost.id === item.planDetailId)
                            ?.formattedCost || "0"
                        }
                        onChange={(e) =>
                          handleCostChange(item.planDetailId, e.target.value)
                        }></input>
                      <span className={styles.planCostSpan}>원</span>
                      <div
                        className={styles.planCostEdit}
                        onClick={() => {
                          setIsCostModal(true);
                          editCost(
                            item.planDetailId,
                            costs.find((cost) => cost.id === item.planDetailId)
                              ?.cost,
                          );
                        }}>
                        수정
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.planImgBox}>
                  <Image
                    className={styles.planImg}
                    src={
                      "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png"
                    }
                    alt="이미지"
                    width={100}
                    height={100}
                    unoptimized={false}
                    sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                    loader={() => {
                      if (item.image) {
                        return item.image;
                      }
                      return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.totalCostBox}>
        <div className={styles.totalCostText}>{diaryDay}일차 합계</div>
        <div className={styles.totalCostOutput}>
          {totalCost.toLocaleString()} 원
        </div>
      </div>
    </main>
  );
};
export default DiaryDetailCard;
