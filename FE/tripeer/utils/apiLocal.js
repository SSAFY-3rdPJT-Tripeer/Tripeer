"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import cookies from "js-cookie";

const apiLocal = axios.create({
  // 기본 주소
  baseURL: `https://k10d207.p.ssafy.io`,
  withCredentials: true,
  timeout: 123000,
});
apiLocal.interceptors.request.use(async (config) => {
  // 액세스 토큰 로컬에서 가져오기
  // const token = localStorage.getItem("accessToken");
  // 쿠키에서 액세스 토큰 가져오기
  const token = cookies.get("Authorization");
  // 만료 됐는지 확인
  const decodedToken = jwtDecode(token);
  const isTokenExpired = decodedToken.exp * 1000 < Date.now();

  // const re = cookies.get("Authorization-re");
  // // 만료 됐는지 확인
  // const decodedTokenRe = jwtDecode(re);
  // const isTokenExpiredRe = decodedTokenRe.exp * 1000 < Date.now();
  //
  // // 리프레시가 만료된 경우
  // if (isTokenExpiredRe) {
  //   await router.push("/login");
  //   return;
  // }

  // 만료된 경우
  if (isTokenExpired) {
    try {
      // 재발급 요청
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/reissue`,
        {},
        { withCredentials: true },
      );
      // 재발급 받은 액세스 토큰을 쿠키에 저장
      const { accessToken } = res.data;
      // localStorage.setItem("accessToken", accessToken);
      cookies.set("Authorization", accessToken);
      // 기본 헤더 고정값
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } catch (err) {
      console.log("토큰 재발급 에러: ", err);
    }
  }
  // 만료가 안 된 경우
  else {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default apiLocal;
