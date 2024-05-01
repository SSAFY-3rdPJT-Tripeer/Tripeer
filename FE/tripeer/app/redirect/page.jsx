"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import logo from "@/public/login/logo.png";
import Image from "next/image";
import styles from "./page.module.css";
import api from "@/utils/api";
import useRegisterStore from "@/stores/register";

export default function RedirectPage() {
  const router = useRouter();
  const store = useRegisterStore();

  const logoAnimation = {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 1, delay: 0 },
  };

  useEffect(async () => {
    // const accessToken = cookies.get("Authorization");
    // localStorage.setItem("accessToken", accessToken);

    const res = await api.get("/user/myinfo");
    store.setMyInfo(res.data.data);

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
