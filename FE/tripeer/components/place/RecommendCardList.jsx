"use client";

import { useEffect, useState } from "react";
// 외부 모듈

// 내부 모듈
import styles from "./recommendCardList.module.css";
import useRegisterStore from "@/stores/register";
import axios from "axios";
import api from "@/utils/api";

const RecommendCardList = ({ city }) => {
  const store = useRegisterStore();
  const [myInfo, setMyInfo] = useState(null);
  const [isLike, setIsLike] = useState([]);
  const [recommendData, setRecommendData] = useState([]);

  const onClick = (item) => {
    window.open(
      `https://map.naver.com/p/search/${`${item.addr} ${item.title}`}`,
    );
  };

  const getData = async () => {
    // if (myInfo) {
    const res = await axios.post("https://k10d207.p.ssafy.io/recommend/items", {
      user_id: `${myInfo.userId}`,
      city_id: city === "all" ? -1 : city,
    });

    setRecommendData(res.data);
    const updateData = res.data.map((item) => {
      return item.isWishlist;
    });
    setIsLike(updateData);

    // }
  };

  const postWish = async (spotInfoId) => {
    await api.post(`/place/wishList/${spotInfoId}`);
  };

  const likeOnClick = (spotInfoId, index) => {
    setIsLike(() => {
      const newLike = [...isLike];
      newLike[index] = !newLike[index];
      return newLike;
    });
    postWish(spotInfoId);
  };

  useEffect(() => {
    if (myInfo) {
      getData(); // myInfo 가 설정된 후에 getData 호출
    }
  }, [myInfo]);

  useEffect(() => {
    setMyInfo(store.myInfo);
  }, [store]);

  return (
    <>
      {myInfo && recommendData && recommendData.length > 0 && (
        <div className={styles.container}>
          <header className={styles.headerBox}>
            <div className={styles.headerIcon}></div>
            <div className={styles.header}>
              {myInfo.nickname}님의{" "}
              <span>{`여행스타일(${recommendData[0].contentType})`}</span>에
              어울리는 여행지를 추천해드려요.
            </div>
          </header>
          <article className={styles.article}>
            {recommendData &&
              recommendData.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className={styles.cardBox}
                    onClick={() => {
                      onClick(item);
                    }}>
                    <div
                      className={styles.card}
                      style={{
                        backgroundImage: `url(${item.img})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        height: "400px",
                        width: "400px",
                        position: "relative",
                      }}>
                      <div className={styles.titleBox}>
                        <div className={styles.title}>{item.title}</div>
                        <div className={styles.addrBox}>
                          <div className={styles.addrIcon}></div>
                          <div className={styles.addrText}>{item.addr}</div>
                        </div>
                      </div>
                      <div
                        className={
                          isLike[idx]
                            ? `${styles.iconFull}`
                            : `${styles.iconEmpty}`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          likeOnClick(item.spotInfoId, idx);
                        }}></div>
                      <div className={styles.recoIcon}>추천</div>
                    </div>
                  </div>
                );
              })}
          </article>
        </div>
      )}
    </>
  );
};

export default RecommendCardList;
