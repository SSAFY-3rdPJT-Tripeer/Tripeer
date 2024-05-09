"use client";

import { useEffect, useState } from "react";

const TripPage = (props) => {
  const { planId } = props.params;

  // 플랜 아이디 받기
  useEffect(() => {
    if (planId) {
      // 해당 planId를 통한 조회 로직 추가하면 됨
      console.log(planId);
    }
  }, [planId]);

  return (
    <div>
      <div></div>
    </div>
  );
};

export default TripPage;
