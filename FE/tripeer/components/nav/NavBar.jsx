"use client";

// 외부 모듈
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// 내부 모듈
import style from "./navbar.module.css";
import Logo from "@/public/logo.png";
import toggleIcon from "./assets/toggle.svg";

const NavBar = () => {
  const path = usePathname();
  const [toggle, setToggle] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navRenderPath = {
    "/": true,
    "/plan": true,
    "/test": true,
  };
  const LOGO_WIDTH = 130;
  const LOGO_HEIGHT = 50;
  const TOGGLE_WIDTH = 15;
  const TOGGLE_HEIGHT = 8;

  return (
    <>
      {navRenderPath[path] ? (
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
            <Link href="/plan" className={style.link}>
              일정 계획
            </Link>
            <Link href="/test" className={style.link}>
              지난 여행
            </Link>
            <Link href="/test" className={style.link}>
              여행지
            </Link>
            {isLogin ? (
              <div className={style.profileBox}>
                <div className={style.userImg} />
                <p className={style.userName}>부수환</p>
                <Image
                  src={toggleIcon}
                  width={TOGGLE_WIDTH}
                  height={TOGGLE_HEIGHT}
                  alt="toggle"
                  className={style.toggleIcon}
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                />
                {toggle ? (
                  <>
                    <ul className={style.options}>
                      <li className={style.option}>
                        <div className={`${style.mypage} ${style.icon}`} />
                        <span>마이 페이지</span>
                      </li>
                      <li className={style.option}>
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
              <div
                className={style.loginBox}
                onClick={() => {
                  setIsLogin(true);
                }}>
                로그인
              </div>
            )}
          </nav>
        </header>
      ) : null}
    </>
  );
};
export default NavBar;
