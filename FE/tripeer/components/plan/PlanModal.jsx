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
      <section className={styles.container}></section>
    </article>
  );
};

export default PlanModal;
