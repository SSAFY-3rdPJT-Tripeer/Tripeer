"use client";

import { useRouter } from "next/navigation";

import logo from "/public/login/logo.png";
import styles from "./page.module.css";
import Image from "next/image";

export default function RegisterPage() {
    const router = useRouter();

    const nextPage = () => {
        router.push("/register/nickname");
    };

    return (
        <div onClick={nextPage} className={`${styles.box} ${styles.center}`}>
            <Image src={logo} alt={"logo"} className={styles.logo} />
        </div>
    );
}
