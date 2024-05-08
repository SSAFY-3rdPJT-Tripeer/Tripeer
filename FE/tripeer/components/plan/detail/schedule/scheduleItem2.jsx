import styles from "./scheduleItem2.module.css";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import kebobBtnSrc from "@/public/plan/kebobBtn.png";
import Image from "next/image";

export default function ScheduleItem2({ data, idx }) {
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
    <div className={`${styles.container}`}>
      <section className={styles.left}>
        <div
          className={styles.numberBox}
          style={{ backgroundColor: categoryList[data.contentType].color }}>
          {idx + 1}
        </div>
        <p className={styles.name}>{data.title}</p>
      </section>
      <section className={styles.right}>
        <p
          className={styles.category}
          style={{ color: categoryList[data.contentType].color }}>
          {categoryList[data.contentType].name}
        </p>
        <Image
          src={kebobBtnSrc}
          alt={""}
          width={24}
          height={24}
          onClick={() => {
            console.log("click");
          }}
        />
      </section>
    </div>
  );
}
