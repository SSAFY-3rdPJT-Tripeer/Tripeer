"use client";

import { useEffect, useState } from "react";
import LoadComponent from "@/components/loading/LoadComponent.jsx";

const Test = () => {
  const [step, setStep] = useState(2);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStep(1);
      clearTimeout(timeout);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div>
      <LoadComponent step={step} />
    </div>
  );
};

export default Test;
