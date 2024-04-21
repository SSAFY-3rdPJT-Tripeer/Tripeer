import Image from "next/image";

import styles from './page.module.css'
import logo from '/public/login/logo.png' // 로고 사진
import google from '/public/login/google.png' // 구글 버튼
import kakao from '/public/login/kakao.png' // 카카오 버튼
import naver from '/public/login/naver.png' // 네이버 버튼

export default function LoginPage() {
    return <main className={`${styles.main} ${styles.center}`}>
        {/* 로고 사진 */}
        <Image src={logo} alt='logo' className={styles.image}/>
        {/* 로그인 & 회원가입 */}
        <div className={`${styles.center} ${styles.textBox}`}>
            <div className={`${styles.line}`}/>
            <p className={`fontRegular.className ${styles.text}`}>로그인&회원가입</p>
            <div className={`${styles.line}`}/>
        </div>
        {/* 소셜 로그인 버튼 */}
        <Image src={google} alt='logo' placeholder='blur' className={styles.loginBtn}/>
        <Image src={kakao} alt='logo' placeholder='blur' className={styles.loginBtn}/>
        <Image src={naver} alt='logo' placeholder='blur' className={styles.loginBtn}/>
    </main>
}