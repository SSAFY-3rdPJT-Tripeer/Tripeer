"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import cookies from "js-cookie";
import logo from "@/public/login/logo.png";
import Image from "next/image";
import styles from "./page.module.css";

export default function RedirectPage() {
  const router = useRouter();

  const logoAnimation = {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 1, delay: 0 },
  };

  useEffect(() => {
    // const accessToken = cookies.get("Authorization");
    // localStorage.setItem("accessToken", accessToken);

    const timer = setTimeout(() => {
      router.push("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.main}>
      <motion.div {...logoAnimation}>
        <Image className={styles.image} src={logo} alt={"logo"} priority />
      </motion.div>
    </div>
  );
}
