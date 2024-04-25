import sample1 from "./assets/sampleImg1.png";
import sample2 from "./assets/sampleImg2.png";
import sample3 from "./assets/sampleImg3.png";

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

export { card };
