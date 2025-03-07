import styles from "./planFullNav.module.css";
import Image from "next/image";
import banner from "@/public/logo.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlanDetailGuide from "./PlanDetailGuide";

const PlanFullNav = (props) => {
  const { current, setCurrent } = props;
  const router = useRouter();
  const [isGuide, setIsGuide] = useState(false);

  const goTo = (idx) => {
    if (idx === 3) {
      router.push("/plan");
    }
    if (idx !== current) {
      setCurrent(idx);
    }
  };
  return (
    <div className={styles.container}>
      <header className={styles.bannerBox}>
        <Image
          onClick={() => {
            router.push("/");
          }}
          priority
          src={banner}
          width={130}
          height={50}
          alt="Tripper_Logo"
          quality={100}
        />
      </header>
      <article className={styles.contentBox}>
        <section className={styles.controller}>
          <div
            className={styles.item}
            onClick={() => {
              goTo(0);
            }}>
            <div className={`${styles.home} ${styles.icon}`} />
            <span className={styles.text}>홈</span>
          </div>
          <div
            className={styles.item}
            onClick={() => {
              goTo(1);
            }}>
            <div className={`${styles.map} ${styles.icon}`} />
            <span className={styles.offText}>지도</span>
          </div>
          <div
            className={styles.item}
            onClick={() => {
              goTo(2);
            }}>
            <div className={`${styles.schedule} ${styles.icon}`} />
            <span className={styles.offText}>일정</span>
          </div>
          <div
            className={styles.item}
            onClick={() => {
              setIsGuide(!isGuide);
            }}>
            <div
              className={`${isGuide ? styles.onGuide : styles.offGuide} ${styles.icon}`}
            />
            <span className={isGuide ? styles.text : styles.offText}>
              도움말
            </span>
          </div>
        </section>
        <footer
          className={`${styles.outPage} ${styles.item}`}
          onClick={() => {
            goTo(3);
          }}>
          <div className={`${styles.exit} ${styles.icon}`} />
          <span className={styles.offExit}>방 나가기</span>
        </footer>
      </article>
      {isGuide ? (
        <div
          className={styles.back}
          onClick={(e) => {
            if (e.currentTarget === e.target) setIsGuide(false);
          }}>
          <div className={styles.modal}>
            <PlanDetailGuide />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PlanFullNav;
