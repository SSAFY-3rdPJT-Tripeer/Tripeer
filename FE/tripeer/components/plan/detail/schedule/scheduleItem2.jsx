import styles from "./scheduleItem2.module.css";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import kebobBtnSrc from "@/public/plan/kebobBtn.png";
import Image from "next/image";

export default function ScheduleItem2({ data, idx }) {
  const categoryList = {
    관광지: {
      src: GoodPlaceIcon,
      color: "#2D8F8A",
      title: "명소",
    },
    숙박: {
      src: SleepIcon,
      color: "#D26D6D",
      title: "숙박",
    },
    음식점: {
      src: EatIcon,
      color: "#D25B06",
      title: "맛집",
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
          {categoryList[data.contentType].title}
        </p>
        <Image src={kebobBtnSrc} alt={""} width={24} height={24} />
      </section>
    </div>
  );
}
