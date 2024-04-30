"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./placeDetailItem.module.css";
import src from "@/public/place/vectorGrey.png";
import api from "@/utils/api";

export default function PlaceDetailItem({
  data,
  list,
  likeSpotId,
  setLikeSpotId,
}) {
  const [loaded, setLoaded] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const likeOnClick = () => {
    setIsLike(!isLike);
    postWish();
    setLikeSpotId((prev) => [...prev, data.spotId]);
  };

  const postWish = async () => {
    try {
      const res = await api.post(`/place/wishList/${data.spotId}`);
      console.log(res.data);
    } catch (e) {
      console.log("찜 에러 : ", e);
    }
  };

  useEffect(() => {
    if (data.wishlist || likeSpotId.includes(data.spotId)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [list]);

  return (
    <main className={`${styles.main}`}>
      <div className={`${loaded ? styles.complete : styles.loading}`}>
        <div className={`${!loaded ? styles.waitBox : styles.noWaitBox}`}>
          <p>이미지 로드중...</p>
        </div>
        <img
          className={styles.image}
          style={{ visibility: loaded ? "visible" : "hidden" }}
          key={data.spotImg}
          src={data.spotImg}
          alt=""
          onLoad={() => setLoaded(true)}
        />
      </div>
      <Image
        className={styles.like}
        src={isLike ? "/place/like.png" : "/place/unlike.png"}
        alt=""
        width={50}
        height={50}
        onClick={likeOnClick}
      />
      <section className={styles.section}>
        <p className={styles.p}>{data.spotName}</p>
        <article className={styles.article}>
          <Image className={styles.vector} src={src} alt="" />
          <p>{data.address}</p>
        </article>
      </section>
    </main>
  );
}
