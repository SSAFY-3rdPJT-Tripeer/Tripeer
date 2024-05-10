import sample1 from "./assets/sampleImg1.png";
import sample2 from "./assets/sampleImg2.png";
import sample3 from "./assets/sampleImg3.png";
import user1 from "./assets/sampleUser1.png";
import user2 from "./assets/sampleUser2.png";
import user3 from "./assets/sampleUser3.png";
import user4 from "./assets/sampleUser4.png";
import user5 from "./assets/sampleUser5.png";
import user6 from "./assets/sampleUser6.png";

const card = [
  {
    planId: 1,
    Img: sample1,
    title: "벚꽃 경주 나들이",
    startDay: "2024.04.03",
    endDay: "2024.04.04",
    member: [{ userId: 1, nickname: "string", profileImage: "string" }],
    townList: ["경주시", "포항시"],
  },
  {
    planId: 2,
    Img: sample2,
    title: "서울 여행",
    startDay: "2024.04.03",
    endDay: "2024.04.04",
    member: [
      { userId: 1, nickname: "string", profileImage: "string" },
      { userId: 1, nickname: "string", profileImage: "string" },
    ],
    townList: ["서울특별시"],
  },
  {
    planId: 3,
    Img: sample3,
    title: "구미 2반 부산 바캉스",
    startDay: "2024.04.03",
    endDay: "2024.04.04",
    member: [{ userId: 1, nickname: "string", profileImage: "string" }],
    townList: ["부산시"],
  },
  {
    planId: 4,
    Img: sample3,
    title: "구미 2반 부산 바캉스",
    startDay: "2024.04.03",
    endDay: "2024.04.04",
    member: [{ userId: 1, nickname: "string", profileImage: "string" }],
    townList: ["경주시", "포항시"],
  },
];

const cardDetail = [
  {
    diaryDetail: {
      planId: 33,
      title: "달구벌 대구로",
      img: "https://lh5.googleusercontent.com/p/AF1QipOwoD8xgxPFObnzOUg9t6Lm55tRnECcAEnSxYeg=w675-h390-n-k-no",
      townList: ["대구"],
      startDay: "2024-04-29",
      endDay: "2024-04-30",
      member: [
        {
          userId: 6,
          nickname: "진짜양건우",
          profileImage:
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/6/f89fd3cb-4fd7-41c7-9094-450ecdd7af26.png",
        },
      ],
      newPlan: false,
    },
    diaryDayList: [
      {
        planDayId: 48,
        date: "2024-04-29",
        day: 1,
        galleryImgs: [],
        planDetailList: [
          {
            title: "비슬산자연휴양림",
            contentType: "관광지",
            address: "대구광역시 달성군 유가읍 일연선사길 61",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/62/219162_image2_1.jpg",
            day: 1,
            step: 1,
            cost: 0,
          },
          {
            title: "동화사(대구)",
            contentType: "관광지",
            address: "대구광역시 동구 동화사1길 1",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/07/2400807_image2_1.jpg",
            day: 1,
            step: 2,
            cost: 0,
          },
          {
            title: "경상감영공원",
            contentType: "관광지",
            address: "대구광역시 중구 경상감영길 99",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/11/1575311_image2_1.jpg",
            day: 1,
            step: 3,
            cost: 0,
          },
          {
            title: "동촌유원지",
            contentType: "관광지",
            address: "대구광역시 동구 효동로2길 72",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/56/2493956_image2_1.jpg",
            day: 1,
            step: 4,
            cost: 0,
          },
          {
            title: "파계사",
            contentType: "관광지",
            address: "대구광역시 동구 파계로 741",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/16/1574316_image2_1.jpg",
            day: 1,
            step: 5,
            cost: 0,
          },
        ],
        timeList: [
          ["01:12", "0"],
          ["00:50", "0"],
          ["00:24", "0"],
          ["00:33", "0"],
          ["00:00", "0"],
        ],
      },
      {
        planDayId: 49,
        date: "2024-04-30",
        day: 2,
        galleryImgs: [],
        planDetailList: [
          {
            title: "대구앞산공원",
            contentType: "관광지",
            address: "대구광역시 남구 앞산순환로 574-87",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/09/2363709_image2_1.jpg",
            day: 2,
            step: 1,
            cost: 0,
          },
          {
            title: "대구두류공원",
            contentType: "관광지",
            address: "대구광역시 달서구 공원순환로 36",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/29/2370129_image2_1.jpg",
            day: 2,
            step: 2,
            cost: 0,
          },
          {
            title: "화원동산",
            contentType: "관광지",
            address: "대구광역시 달성군 화원읍 사문진로1길 40-12",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/51/1929251_image2_1.jpg",
            day: 2,
            step: 3,
            cost: 0,
          },
          {
            title: "대구 달성공원",
            contentType: "관광지",
            address: "대구광역시 중구 달성공원로 35",
            image:
              "http://tong.visitkorea.or.kr/cms/resource/94/1026094_image2_1.jpg",
            day: 2,
            step: 4,
            cost: 0,
          },
        ],
        timeList: [
          ["00:16", "0"],
          ["00:36", "0"],
          ["00:46", "0"],
          ["00:00", "0"],
        ],
      },
    ],
  },
];

export { card, cardDetail };
