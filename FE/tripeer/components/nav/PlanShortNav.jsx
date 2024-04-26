import Image from "next/image";
import styles from "./planShortNav.module.css";
import logo from "@/public/shortLogo.svg";
import { useRouter } from "next/navigation";

const PlanShortNav = (props) => {
  const { current, setCurrent } = props;
  const router = useRouter();
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
        <Image src={logo} width={30} height={30} alt="Tripper-logo" />
      </header>
      <article className={styles.contentBox}>
        <section className={styles.controller}>
          <div
            className={styles.item}
            onClick={() => {
              goTo(0);
            }}>
            <div className={`${styles.home} ${styles.icon}`} />
          </div>
          <div
            className={styles.item}
            onClick={() => {
              goTo(1);
            }}>
            <div
              className={`${current === 1 ? styles.onMap : styles.offMap} ${styles.icon}`}
            />
          </div>
          <div
            className={styles.item}
            onClick={() => {
              goTo(2);
            }}>
            <div
              className={`${current === 2 ? styles.onSchedule : styles.offSchedule} ${styles.icon}`}
            />
          </div>
        </section>
        <footer
          className={`${styles.outPage} ${styles.item}`}
          onClick={() => {
            goTo(3);
          }}>
          <div className={`${styles.exit} ${styles.icon}`} />
        </footer>
      </article>
    </div>
  );
};

export default PlanShortNav;
