import styles from "./cancelBtn.module.css";

export default function CancelBtn({ pageNum, setPageNum }) {
  const cancelOnClick = () => {
    setPageNum(pageNum - 1);
  };

  return (
    <div
      className={`${styles.center} ${styles.cancel}`}
      onClick={cancelOnClick}>
      취소
    </div>
  );
}
