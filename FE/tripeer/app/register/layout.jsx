import Image from "next/image";

import styles from "./layout.module.css";
import bg from "/public/register/registerBg.png";


export default function RegisterLayout({children}) {
    return (
        <main className={styles.main}>
            <Image src={bg} alt={"bg"} className={styles.bg}/>
            <div className={`${styles.center} ${styles.box}`}>{children}</div>
        </main>
    );
}
