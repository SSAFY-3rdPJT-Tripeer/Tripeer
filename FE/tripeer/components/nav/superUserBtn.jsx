"use client";

import axios from "axios";
import cookies from "js-cookie";

import styles from "./superUserBtn.module.css";
import { useRouter } from "next/navigation";

export default function SuperUserBtn({ id }) {
  const router = useRouter();
  const onClick = async () => {
    await axios
      .get(`https://k10d207.p.ssafy.io/api/user/test/getsuper/${id}`)
      .then((res) => {
        const accessToken = res.data.data.replace("Bearer ", "");
        // localStorage.setItem("accessToken", accessToken);
        cookies.set("Authorization", accessToken);
        router.push("/redirect");
      });
  };

  return (
    <button className={styles.main} onClick={onClick}>
      딸깍
    </button>
  );
}
