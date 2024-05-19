import styles from "./nextBtn.module.css";

export default function NextBtn({ onClickNext, title }) {
  return (
    <div className={`${styles.center} ${styles.next}`} onClick={onClickNext}>
      {title}
    </div>
  );
}
