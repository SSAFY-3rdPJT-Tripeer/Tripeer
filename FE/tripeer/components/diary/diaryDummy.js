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
    planId: 3,
    Img: sample3,
    title: "구미 2반 부산 바캉스",
    startDay: "2024.04.03",
    endDay: "2024.04.04",
    member: [
      { userId: 1, nickname: "박싸피", profileImage: user1 },
      { userId: 2, nickname: "오싸피", profileImage: user2 },
      { userId: 3, nickname: "김싸피파피파피파피파", profileImage: user3 },
      { userId: 4, nickname: "최싸피", profileImage: user4 },
      { userId: 5, nickname: "이싸피", profileImage: user5 },
      { userId: 6, nickname: "임싸피", profileImage: user6 },
    ],
    townList: ["부산시"],
  },
];

export { card, cardDetail };
