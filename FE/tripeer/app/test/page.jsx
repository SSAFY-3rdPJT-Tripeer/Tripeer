"use client";

import Loading from "@/components/loading/Loading";
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

  return (
    <div>
      <Loading step={step}></Loading>
    </div>
  );
};

export default Test;
