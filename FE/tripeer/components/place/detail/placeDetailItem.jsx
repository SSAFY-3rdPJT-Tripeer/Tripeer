"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./placeDetailItem.module.css";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function PlaceDetailItem({
  data,
  list,
  likeSpotId,
  setLikeSpotId,
}) {
  const [loaded, setLoaded] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const router = useRouter();

  const likeOnClick = () => {
    setIsLike(!isLike);
    postWish();
    setLikeSpotId((prev) => [...prev, data.spotId]);
  };

  const onClick = () => {
    router.push(
      `https://map.naver.com/p/search/${`${data.address} ${data.spotName}`}`,
    );
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

  useEffect(() => {
    if (data) {
      setLoaded(true);
    }
  }, []);

  return (
    <main className={`${styles.main}`}>
      <div className={`${loaded ? styles.complete : styles.loading}`}>
        <div className={`${!loaded ? styles.waitBox : styles.noWaitBox}`}>
          <p>이미지 로드중...</p>
        </div>
      </div>
      <div
        className={styles.image}
        style={{
          visibility: loaded ? "visible" : "hidden",
          backgroundImage: `url(${data.spotImg})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "380px",
          width: "390px",
          position: "relative",
        }}>
        <Image
          className={styles.like}
          src={isLike ? "/place/like.png" : "/place/unlike.png"}
          alt=""
          width={50}
          height={50}
          onClick={likeOnClick}
        />
        <section className={styles.section} onClick={onClick}>
          <p className={styles.p}>{data.spotName}</p>
          <article className={styles.article}>
            <div className={styles.vector}></div>
            <p className={styles.addrText}>{data.address}</p>
          </article>
        </section>
      </div>
    </main>
  );
}
