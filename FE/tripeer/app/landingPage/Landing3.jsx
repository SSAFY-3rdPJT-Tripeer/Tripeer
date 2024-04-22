import styles from "./landing3.module.css";

const Landing3 = () => {
  return (
    <main className={styles.container}>
      <article className={styles.leftSection}>
        <section className={styles.contentBox}>
          <div className={styles.titleIcon1}></div>
          <div className={styles.titleBox}>
            <div className={styles.title}>플랜 생성</div>
            <div className={styles.subTitle}>
              <p>여행하고 싶은 목적지를 설정하고,</p>
              <p>일정을 선택하세요.</p>
            </div>
          </div>
        </section>
        <section className={styles.contentBox}>
          <div className={styles.titleIcon2}></div>
          <div className={styles.titleBox}>
            <div className={styles.title}>스팟 선택</div>
            <div className={styles.subTitle}>
              <p>가고 싶은 장소를 선택하고, </p>
              <p>지도를 통해 친구들과 공유해 보세요.</p>
            </div>
          </div>
        </section>
        <section className={styles.contentBox}>
          <div className={styles.titleIcon3}></div>
          <div className={styles.titleBox}>
            <div className={styles.title}>플랜 조정</div>
            <div className={styles.subTitle}>
              <p>최단 거리로 추천 받고, </p>
              <p>최적의 여행계획을 세워보세요.</p>
            </div>
          </div>
        </section>
      </article>
      <article className={styles.rightSection}>
        <section className={styles.sampleCard}>
          <div className={styles.sampleSubCard}></div>
        </section>
      </article>
    </main>
  );
};

export default Landing3;
