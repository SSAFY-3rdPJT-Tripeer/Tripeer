import styles from "./cancelBtn.module.css";
import { useRouter } from "next/navigation";

export default function CancelBtn({ pageNum, setPageNum }) {
  const router = useRouter();
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
