"use client";

import { useEffect, useState } from "react";
import RegisterLoading from "@/components/register/registerLogin";
import NicknamePage from "@/components/register/nickNamePage";
import BirthdayPage from "@/components/register/birthDayPage";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageNum, setPageNum] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [pageNum]);

  return (
    <>
      {isLoading ? (
        <RegisterLoading />
      ) : pageNum === 0 ? (
        <NicknamePage pageNum={pageNum} setPageNum={setPageNum} />
      ) : pageNum === 1 ? (
        <BirthdayPage />
      ) : null}
    </>
  );
}
