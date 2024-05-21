import logo from "/public/login/logo.png";
import styles from "./registerLogin.module.css";
import Image from "next/image";

export default function RegisterLoading() {
  return (
    <div className={`${styles.box} ${styles.center}`}>
      <Image src={logo} alt={"logo"} priority className={styles.logo} />
    </div>
  );
}
