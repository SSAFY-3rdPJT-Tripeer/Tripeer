import styles from "./cancelBtn.module.css";
import { useRouter } from "next/navigation";

<<<<<<< HEAD
export default function CancelBtn({ pageNum, setPageNum }) {
  const router = useRouter();
  const cancelOnClick = () => {
    setPageNum(pageNum - 1);
=======
export default function CancelBtn() {
  const router = useRouter();
  const cancelOnClick = () => {
    router.back();
>>>>>>> origin/fe/feat/login
  };

  return (
    <div
      className={`${styles.center} ${styles.cancel}`}
      onClick={cancelOnClick}>
      취소
    </div>
  );
}
