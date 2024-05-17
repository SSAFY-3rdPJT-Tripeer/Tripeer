"use client";

import { useEffect, useState } from "react";
import RegisterLoading from "@/components/register/registerLogin";
import NicknamePage from "@/components/register/nickNamePage";
import BirthdayPage from "@/components/register/birthDayPage";
import StylePage from "@/components/register/stylePage";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageNum, setPageNum] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <RegisterLoading />
      ) : pageNum === 0 ? (
        <NicknamePage pageNum={pageNum} setPageNum={setPageNum} />
      ) : pageNum === 1 ? (
        <BirthdayPage pageNum={pageNum} setPageNum={setPageNum} />
      ) : pageNum === 2 ? (
        <StylePage pageNum={pageNum} setPageNum={setPageNum} />
      ) : (
        router.push("/redirect")
      )}
    </>
  );
}
