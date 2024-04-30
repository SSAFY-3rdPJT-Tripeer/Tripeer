import styles from "./scheduleCategoryChip.module.css";
import Image from "next/image";

import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";

export default function ScheduleCategoryChip({ category }) {
  const categoryList = {
    명소: {
      src: GoodPlaceIcon,
      color: "#2D8F8A",
    },
    숙박: {
      src: SleepIcon,
      color: "#D26D6D",
    },
    맛집: {
      src: EatIcon,
      color: "#D25B06",
    },
  };

  return (
    <div className={styles.container}>
      <Image src={categoryList[category].src} alt={""} />
      <p
        className={styles.p}
        style={{ color: `${categoryList[category].color}` }}>
        {category}
      </p>
    </div>
  );
}
