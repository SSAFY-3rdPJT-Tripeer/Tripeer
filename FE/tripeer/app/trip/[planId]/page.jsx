"use client";

import { useEffect, useMemo, useState } from "react";
import MapRoute from "@/components/plan/MapRoute";

const TripPage = (props) => {
  const { planId } = props.params;

  const totalYList = useMemo(() => {
    return [
      [],
      [
        {
          spotInfoId: 130384,
          title: "대구 남구문화원",
          contentType: "문화시설",
          addr: "대구광역시 남구 앞산순환로 478",
          latitude: 35.83130736,
          longitude: 128.5768876,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/130384.png",
          wishlist: false,
          spot: false,
          order: 0,
          planId: 77,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
        {
          spotInfoId: 129837,
          title: "대구교육대학교 교육박물관",
          contentType: "문화시설",
          addr: "대구광역시 남구 중앙대로 219",
          latitude: 35.853069,
          longitude: 128.5889415,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/129837.png",
          wishlist: false,
          spot: false,
          order: 0,
          planId: 77,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
        {
          spotInfoId: 126132,
          title: "대구앞산공원",
          contentType: "관광지",
          addr: "대구광역시 남구 앞산순환로 574-87",
          latitude: 35.82901895,
          longitude: 128.589056,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/126132.png",
          wishlist: false,
          spot: false,
          order: 0,
          planId: 77,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
      ],
      [],
      [],
      [],
      [],
    ];
  }, []);

  // 플랜 아이디 받기
  useEffect(() => {
    if (planId) {
      // 해당 planId를 통한 조회 로직 추가하면 됨
      console.log(planId);
    }
  }, [planId]);

  return (
    <div>
      <div>
        <MapRoute daySpots={totalYList} />
      </div>
    </div>
  );
};

export default TripPage;
