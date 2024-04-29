"use client";

// 외부 모듈
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import cookies from "js-cookie";

// 내부 모듈
import style from "@/components/nav/navbar.module.css";
import Logo from "@/public/logo.png";
import toggleIcon from "@/components/nav/assets/toggle.svg";
import api from "@/utils/api";

const NavBar = () => {
  const [toggle, setToggle] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const LOGO_WIDTH = 130;
  const LOGO_HEIGHT = 50;
  const TOGGLE_WIDTH = 15;
  const TOGGLE_HEIGHT = 8;

  const logoutOnClick = () => {
    cookies.remove("Authorization");
    router.push("/");
  };

  const getUserData = async () => {
    try {
      const res = await api.get("user/social/info");
      console.log(res.data);
    } catch (e) {
      console.log("유저 정보 GET 에러 : ", e);
    }
  };

  useEffect(() => {
    const token = cookies.get("Authorization");

    if (token) {
      setIsLogin(true);
      // getUserData();
    }
  }, []);

  return (
    <>
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
          <Link href="/diary" className={style.link}>
            지난 여행
          </Link>
          <Link href="/place/all/all" className={style.link}>
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
                className={`${style.toggleIcon} ${toggle ? style.onToggle : style.offToggle}`}
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
                    <li className={style.option} onClick={logoutOnClick}>
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
    </>
  );
};
export default NavBar;
