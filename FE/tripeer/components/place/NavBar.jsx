"use client";

// 외부 모듈
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import cookies from "js-cookie";

// 내부 모듈
import style from "@/components/nav/navbar.module.css";
import Logo from "@/public/logo.png";
import toggleIcon from "@/components/nav/assets/toggle.svg";
// import api from "@/utils/api";
import useRegisterStore from "@/stores/register";

const NavBar = () => {
  const path = usePathname();
  const [toggle, setToggle] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [myname, setMyname] = useState("");
  const [myImg, setMyImg] = useState("");
  const router = useRouter();
  const store = useRegisterStore();
  const LOGO_WIDTH = 130;
  const LOGO_HEIGHT = 50;
  const TOGGLE_WIDTH = 15;
  const TOGGLE_HEIGHT = 8;

  const logoutOnClick = () => {
    cookies.remove("Authorization");
    router.push("/");
    window.location.reload();
  };

  useEffect(() => {
    const getName = async () => {
      const data = await store.myInfo;
      setMyname(data?.nickname);
      setMyImg(data?.profileImage);
    };
    const token = cookies.get("Authorization");
    if (token) {
      setIsLogin(true);
      getName();
      // const data = store.myInfo;
    }
  }, [path, store]);

  return (
    <header className={style.container}>
      <Link href="/">
        <Image
          src={Logo}
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          alt="logo"
          priority
        />
      </Link>
      <nav className={style.linkBox}>
        <Link
          href="/plan"
          className={
            path === "/plan"
              ? `${style.link} ${style.linkClicked}`
              : `${style.link}`
          }>
          일정 계획
        </Link>
        <Link
          href="/diary"
          className={
            path === "/diary"
              ? `${style.link} ${style.linkClicked}`
              : `${style.link}`
          }>
          지난 여행
        </Link>
        <Link
          href="/place/all/all"
          className={
            path === "/place/all/all"
              ? `${style.link} ${style.linkClicked}`
              : `${style.link}`
          }>
          여행지
        </Link>
        {isLogin ? (
          <div className={style.profileBox}>
            {myImg ? (
              <div
                className={style.userImgBox}
                style={{
                  width: "40px",
                  height: "40px",
                  position: "relative",
                }}>
                <Image
                  className={style.userImg}
                  loader={() =>
                    myImg
                      ? `${myImg}`
                      : `https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png`
                  }
                  src={
                    "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png"
                  }
                  fill
                  alt="사진"
                  priority="false"
                  sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
                  quality={100}
                />
              </div>
            ) : (
              <></>
            )}
            <p className={style.userName}>{myname ? myname : ""}</p>
            <Image
              src={toggleIcon}
              width={TOGGLE_WIDTH}
              height={TOGGLE_HEIGHT}
              alt="toggle"
              className={`${style.toggleIcon} ${toggle ? style.onToggle : style.offToggle}`}
              onClick={() => {
                setToggle(!toggle);
              }}
            />
            {toggle ? (
              <>
                <ul className={style.options}>
                  <li
                    className={style.option}
                    onClick={() => {
                      router.push("/mypage");
                    }}>
                    <div className={`${style.mypage} ${style.icon}`} />
                    <span>마이 페이지</span>
                  </li>
                  <li
                    className={style.option}
                    onClick={() => {
                      logoutOnClick();
                    }}>
                    <div className={`${style.logout} ${style.icon}`} />
                    <span>로그아웃</span>
                  </li>
                </ul>
                <div
                  className={style.back}
                  onClick={() => {
                    setToggle(false);
                  }}
                />
              </>
            ) : null}
          </div>
        ) : (
          <Link href="/login" style={{ textDecoration: "none" }}>
            <div className={style.loginBox}>로그인</div>
          </Link>
        )}
      </nav>
    </header>
  );
};
export default NavBar;
