// 외부 모듈
import Image from "next/image";

// 내부 모듈
import styles from "./slider.module.css";
import airplane1 from "./asset/Airplane1.png";
import airplane2 from "./asset/Airplane2.png";
import airplane3 from "./asset/Airplane3.png";
import airplane4 from "./asset/Airplane4.png";
import airplane5 from "./asset/Airplane5.png";
import airplane6 from "./asset/Airplane6.png";

const Slider = () => {
  return (
    <section className={styles.slider}>
      <div className={styles.slideTrack}>
        {[
          airplane1,
          airplane2,
          airplane3,
          airplane4,
          airplane5,
          airplane6,
          airplane1,
          airplane2,
          airplane3,
          airplane4,
          airplane5,
          airplane6,
        ].map((img, idx) => {
          return (
            <div className={styles.slide} key={idx}>
              <Image src={img} height="300" width="200" alt={`airpic${idx}`} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Slider;
