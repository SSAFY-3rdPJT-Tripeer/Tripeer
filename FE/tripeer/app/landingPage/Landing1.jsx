import styles from "./landing1.module.css";

const Landing1 = () => {
  return (
    <main className={styles.container}>
      <article className={styles.leftSection}>
        <p className={styles.title}>함께 여행을, 함께 계획하다.</p>
        <p className={styles.title}>여행 협업 플래너</p>
        <p className={styles.subTitle}>
          여행 계획의 모든 것, 한곳에서 협업하세요.
        </p>
        <div className={styles.startBtn}>시작하기</div>
      </article>
      <article className={styles.rightSection}>
        <section className={styles.firstBanner}></section>
      </article>
    </main>
  );
};
export default Landing1;
