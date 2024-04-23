import styles from "./planModal.module.css";

const PlanModal = (props) => {
  const { setOnModal } = props;
  const offModal = (e) => {
    if (e.currentTarget === e.target) {
      setOnModal(false);
    }
  };
  return (
    <article
      className={styles.back}
      onClick={(e) => {
        offModal(e);
      }}>
      <section className={styles.container}>
        <header className={styles.header}>
          <p>여행지를 선택해주세요.</p>
          <p>다음</p>
        </header>
      </section>
    </article>
  );
};

export default PlanModal;
