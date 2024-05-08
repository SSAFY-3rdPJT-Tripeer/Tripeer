import styles from "./scheduleCategoryChip.module.css";
import Image from "next/image";

import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";

export default function ScheduleCategoryChip({ category }) {
  const categoryList = {
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
      color: "#D25B06",
      img: EatIcon,
    },
  };

  return (
    <div className={styles.container}>
      <Image src={categoryList[category].img} alt={""} />
      <p
        className={styles.p}
        style={{ color: `${categoryList[category].color}` }}>
        {categoryList[category].name}
      </p>
    </div>
  );
}
