"use client";

import SuperUserBtn from "@/components/nav/superUserBtn";
import apiLocal from "@/utils/apiLocal";
import apiServer from "@/utils/apiServer";

const Admin = () => {
  const local = async () => {
    const res = await apiLocal.post("/node/opt", {
      planId: 33,
      planday: 1,
      data: [
        {
          spotInfoId: 129921,
          title: "다도화랑",
          contentType: "문화시설",
          addr: "서울특별시 강남구 논현로159길 24",
          latitude: 37.52298794,
          longitude: 127.0260901,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/129921.png",
          spot: false,
          wishlist: false,
          order: 1,
          planId: 20,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
        {
          spotInfoId: 127269,
          title: "청담공원",
          contentType: "관광지",
          addr: "서울특별시 강남구 영동대로131길 26",
          latitude: 37.52115807,
          longitude: 127.0526683,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/127269.png",
          spot: false,
          wishlist: false,
          order: 1,
          planId: 20,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
        {
          spotInfoId: 126823,
          title: "압구정 로데오거리",
          contentType: "관광지",
          addr: "서울특별시 강남구 압구정동",
          latitude: 37.52687661,
          longitude: 127.0388972,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/126823.png",
          spot: false,
          wishlist: false,
          order: 1,
          planId: 20,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
      ],
    });
    console.log(res);
  };

  const server = async () => {
    const res = await apiServer.post("/node/opt", {
      planId: 33,
      planday: 1,
      data: [
        {
          spotInfoId: 129921,
          title: "다도화랑",
          contentType: "문화시설",
          addr: "서울특별시 강남구 논현로159길 24",
          latitude: 37.52298794,
          longitude: 127.0260901,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/129921.png",
          spot: false,
          wishlist: false,
          order: 1,
          planId: 20,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
        {
          spotInfoId: 127269,
          title: "청담공원",
          contentType: "관광지",
          addr: "서울특별시 강남구 영동대로131길 26",
          latitude: 37.52115807,
          longitude: 127.0526683,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/127269.png",
          spot: false,
          wishlist: false,
          order: 1,
          planId: 20,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
        {
          spotInfoId: 126823,
          title: "압구정 로데오거리",
          contentType: "관광지",
          addr: "서울특별시 강남구 압구정동",
          latitude: 37.52687661,
          longitude: 127.0388972,
          img: "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/126823.png",
          spot: false,
          wishlist: false,
          order: 1,
          planId: 20,
          userId: 1,
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png",
          nickname: "admin",
        },
      ],
    });
    console.log(res);
  };

  const onClick1 = () => {
    local();
  };

  const onClick2 = () => {
    server();
  };

  return (
    <div>
      <SuperUserBtn id={15} />
      <SuperUserBtn id={16} />
      <div onClick={onClick1}>로컬딸깍</div>
      <div onClick={onClick2}>서버딸깍</div>
    </div>
  );
};

export default Admin;
