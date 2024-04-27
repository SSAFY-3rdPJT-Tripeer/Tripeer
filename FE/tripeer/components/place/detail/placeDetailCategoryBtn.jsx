"use client";

import Image from "next/image";

import styles from "./placeDetailCategoryBtn.module.css";
import usePlaceStore from "@/stores/place";
import { useEffect, useState } from "react";

export default function PlaceDetailCategoryBtn({ title, src, checkSrc, idx }) {
  const store = usePlaceStore();
  const [isCheck, setIsCheck] = useState(false);

  const onClick = async () => {
    await store.setCategory(idx);
    setIsCheck(true);
  };

  const onMouseEnter = () => {
    setIsCheck(true);
  };

  const onMouseLeave = () => {
    setIsCheck(store.category === idx);
  };

  useEffect(() => {
    if (store.category === idx) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  }, [idx, store.category]);

  return (
    <main
      className={styles.main}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <Image
        className={styles.image}
        src={isCheck ? checkSrc : src}
        alt={""}
        priority
      />
      <p className={isCheck ? styles.pCheck : styles.p}>{title}</p>
    </main>
  );
}
