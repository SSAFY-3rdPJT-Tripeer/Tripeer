"use client";

import Image from "next/image";

import styles from "./page.module.css";
import logo from "/public/login/logo.png"; // 로고 사진
import google from "/public/login/google.png"; // 구글 버튼
import kakao from "/public/login/kakao.png"; // 카카오 버튼
import naver from "/public/login/naver.png";
import Link from "next/link"; // 네이버 버튼
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className={`${styles.main} ${styles.center}`}>
      {/* 로고 사진 */}
      <Image
        src={logo}
        alt="logo"
        className={styles.image}
        onClick={() => {
          router.push("/");
        }}
      />
      {/* 로그인 & 회원가입 */}
      <div className={`${styles.center} ${styles.textBox}`}>
        <div className={`${styles.line}`} />
        <p className={`fontRegular.className ${styles.text}`}>
          로그인&회원가입
        </p>
        <div className={`${styles.line}`} />
      </div>
      {/* 소셜 로그인 버튼 */}
      <Link
        href={"https://k10d207.p.ssafy.io/api/oauth2/authorization/google"}
        className={styles.loginBtn}>
        <Image
          src={google}
          alt="logo"
          className={styles.loginImage}
          placeholder="blur"
          priority
        />
      </Link>
      <Link
        href={"https://k10d207.p.ssafy.io/api/oauth2/authorization/kakao"}
        className={styles.loginBtn}>
        <Image
          src={kakao}
          alt="logo"
          className={styles.loginImage}
          placeholder="blur"
          priority
        />
      </Link>
      <Link
        href={"https://k10d207.p.ssafy.io/api/oauth2/authorization/naver"}
        className={styles.loginBtn}>
        <Image
          src={naver}
          alt="logo"
          className={styles.loginImage}
          placeholder="blur"
          priority
        />
      </Link>
    </main>
  );
}
