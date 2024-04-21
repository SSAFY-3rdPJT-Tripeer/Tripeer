import styles from "./cancelBtn.module.css";
import { useRouter } from "next/navigation";

export default function CancelBtn() {
  const router = useRouter();
  const cancelOnClick = () => {
    router.back();
  };

  return (
    <div
      className={`${styles.center} ${styles.cancel}`}
      onClick={cancelOnClick}>
      취소
    </div>
  );
}
