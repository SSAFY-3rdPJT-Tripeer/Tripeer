"use client";

/* eslint-disable */

import { useRouter } from "next/navigation";

const Guard = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== undefined) {
      const router = useRouter();
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
