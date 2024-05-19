import Image from "next/image";
import { useState } from "react";

import styles from "./placeSearchBar.module.css";
import searchImg from "@/public/place/searchBtn.png";
import usePlaceStore from "@/stores/place";

export default function PlaceSearchBar({ setList, setIsSearch }) {
  const store = usePlaceStore();
  // 입력한 내용
  const [words, setWords] = useState("");
  const onChange = (e) => {
    const value = e.target.value;
    const data = store.allData;

    if (value.length) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }

    setWords(value);

    const result = data.filter(
      (item) => item.townName && item.townName.includes(value),
    );
    setList(result);
  };

  return (
    <main className={styles.main}>
      <input className={styles.input} onChange={onChange} value={words} />
      <Image
        src={searchImg}
        className={styles.image}
        alt={"searchImg"}
        priority
      />
    </main>
  );
}
