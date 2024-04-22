import styles from "./landing2.module.css";

const Landing1 = () => {
  return (
    <main className={styles.container}>
      <article className={styles.leftSection}>
        <section className={styles.bannerBack1}>
          <div className={styles.bannerBack2}></div>
          <div className={styles.secondBanner}></div>
        </section>
      </article>

      <article className={styles.rightSection}>
        <section className={styles.titleBox}>
          <p className={styles.title}>
            Tripeer는 여러분이 사랑하는 사람들과 함께
          </p>
          <p className={styles.title}>
            여행 일정을 쉽게 계획하고 조정할 수 있게 도와줍니다.
          </p>
        </section>
        <section className={styles.subTitleBox}>
          <p className={styles.subTitle}>
            일정 공유, 음성 채팅, 실시간 업데이트 기능을 통해
          </p>
          <p className={styles.subTitle}>
            모두가 만족하는 여행 계획을 완성하세요.
          </p>
        </section>
      </article>
    </main>
  );
};
export default Landing1;
