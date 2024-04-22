import styles from "./landing5.module.css";

const Landing5 = () => {
  return (
    <main className={styles.container}>
      <p className={styles.subTitle}>
        친구, 가족과 함께하는 여행 일정 계획을 이제 쉽고 편하게{" "}
      </p>
      <p className={styles.title}>
        모든 일정, 한 눈에 - 당신과 동료의 완벽한 여행 파트너{" "}
      </p>
      <div className={styles.bannerBox}>
        <div className={styles.banner}></div>
      </div>
    </main>
  );
};

export default Landing5;
