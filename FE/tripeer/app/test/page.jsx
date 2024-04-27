"use client";

import Loading from "@/components/loading/loading";
import { useEffect, useState } from "react";

const Test = () => {
  const [step, setStep] = useState(2);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStep(1);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {}, [step]);

  return (
    <div>
      <Loading step={step}></Loading>
    </div>
  );
};

export default Test;
