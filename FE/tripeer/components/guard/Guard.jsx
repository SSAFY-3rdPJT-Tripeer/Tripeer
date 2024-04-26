"use client";

/* eslint-disable */

import { useRouter } from "next/navigation";

const Guard = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== undefined) {
      const router = useRouter();
      console.log(localStorage.getItem("accessToken"));
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.replace("/login");
        return null;
      }
      return <WrappedComponent {...props} />;
    }
    return null;
  };
};

export default Guard;
