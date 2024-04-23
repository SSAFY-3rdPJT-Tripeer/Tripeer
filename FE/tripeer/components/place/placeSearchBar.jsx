import Image from "next/image";

import styles from "./placeSearchBar.module.css";
import searchImg from "@/public/place/searchBtn.png";

export default function PlaceSearchBar() {
  return (
    <main className={styles.main}>
      <input className={styles.input} />
      <Image
        src={searchImg}
        className={styles.image}
        alt={"searchImg"}
        priority
      />
    </main>
  );
}
