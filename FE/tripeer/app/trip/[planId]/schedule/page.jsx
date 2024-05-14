"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import logo from "@/public/FullLogo.svg";
import Image from "next/image";
import axios from "axios";
import busIcon from "@/public/trip/busIcon.svg";
import carIcon from "@/public/trip/carIcon.svg";
import whitePerson from "@/public/trip/whitePerson.svg";
import whiteCar from "@/public/trip/whiteCar.svg";
import whiteBus from "@/public/trip/whiteBus.svg";
import whiteSubway from "@/public/trip/whiteSubway.svg";
import whiteTrain from "@/public/trip/whiteTrain.svg";
import whiteAirplane from "@/public/trip/whiteAirplane.svg";
import whiteFerry from "@/public/trip/whiteFerry.svg";
import smallPerson from "@/public/trip/smallPerson.svg";
import smallBus from "@/public/trip/smallBus.svg";
import smallExpressBus from "@/public/trip/smallExpressBus.svg";
import smallFerry from "@/public/trip/smallFerry.svg";
import smallAirplane from "@/public/trip/smallAirplane.svg";
import smallSubway from "@/public/trip/smallSubway.svg";
import smallTrain from "@/public/trip/smallTrain.svg";
import smallCar from "@/public/trip/smallCar.svg";

const Schedule = (props) => {
  const { planId } = props.params;
  const router = useRouter();
  const [dayStep, setDayStep] = useState(0);
  const [plan, setPlan] = useState(null);
  const [diary, setDiary] = useState(null);
  const MAX_STEP = useRef(null);
  const [timeList, setTimeList] = useState(null);
  const [routeList, setRouteList] = useState(null);
  const [planDetail, setPlanDetail] = useState([]);
  const [rootToggles, setRootToggles] = useState([]);

  const getMinute = (str) => {
    let arr = str.split(":");
    let minutes = 0;
    minutes = minutes + parseInt(arr[0]) * 60;
    minutes = minutes + parseInt(arr[1]);
    return minutes;
  };

  const setToggle = (idx) => {
    let arr = [...rootToggles];
    arr[idx] = !arr[idx];
    setRootToggles([...arr]);
  };

  useEffect(() => {
    console.log(rootToggles);
  }, [rootToggles]);

  const getWidth = (mother, son) => {
    return (100 * son) / mother;
  };

  const ROUTE_STYLE = useMemo(() => {
    return {
      BUS: {
        Icon: whiteBus,
        routeColor: "#F96976",
        circleColor: "#E33E4D",
        fontColor: "#fff",
        smallIcon: smallBus,
        info: "버스",
      },
      WALK: {
        Icon: whitePerson,
        routeColor: "#E2E7EE",
        circleColor: "#CBCBCB",
        fontColor: "#858585",
        smallIcon: smallPerson,
        info: "도보",
      },
      CAR: {
        Icon: whiteCar,
        routeColor: "#4FBDB7",
        circleColor: "#2D8F8A",
        fontColor: "#fff",
        smallIcon: smallCar,
        info: "차",
      },
      SUBWAY: {
        Icon: whiteSubway,
        routeColor: "#FF8E00",
        circleColor: "#D25B06",
        fontColor: "#fff",
        smallIcon: smallSubway,
        info: "지하철",
      },
      EXPRESSBUS: {
        Icon: whiteBus,
        routeColor: "#9F63FF",
        circleColor: "#6C06D2",
        fontColor: "#fff",
        smallIcon: smallExpressBus,
        info: "시외버스",
      },
      TRAIN: {
        Icon: whiteTrain,
        routeColor: "#3E9F48",
        circleColor: "#246C45",
        fontColor: "#fff",
        smallIcon: smallTrain,
        info: "기차",
      },
      AIRPLANE: {
        Icon: whiteAirplane,
        routeColor: "#FFD552",
        circleColor: "#FFC100",
        fontColor: "#3D3C3C",
        smallIcon: smallAirplane,
        info: "비행기",
      },
      FERRY: {
        Icon: whiteFerry,
        routeColor: "#4E8DCC",
        circleColor: "#2D8F8A",
        fontColor: "#fff",
        smallIcon: smallFerry,
        info: "배",
      },
    };
  }, []);

  const CARD_CATEGORY = useMemo(() => {
    return {
      관광지: {
        name: "명소",
        color: "#4FBDB7",
        img: GoodPlaceIcon,
      },
      문화시설: {
        name: "명소",
        color: "#4FBDB7",
        img: GoodPlaceIcon,
      },
      "축제 공연 행사": {
        name: "명소",
        color: "#4FBDB7",
        img: GoodPlaceIcon,
      },
      "여행 코스": {
        name: "명소",
        color: "#4FBDB7",
        img: GoodPlaceIcon,
      },
      레포츠: {
        name: "명소",
        color: "#4FBDB7",
        img: GoodPlaceIcon,
      },
      숙박: {
        name: "숙박",
        color: "#D26D6D",
        img: SleepIcon,
      },
      쇼핑: {
        name: "명소",
        color: "#4FBDB7",
        img: GoodPlaceIcon,
      },
      음식점: {
        name: "맛집",
        color: "#D25B06",
        img: EatIcon,
      },
    };
  }, []);

  const move = (range) => {
    if (range > 0) {
      MAX_STEP.current === dayStep ? setDayStep(0) : setDayStep(dayStep + 1);
    } else {
      dayStep === 0 ? setDayStep(MAX_STEP.current) : setDayStep(dayStep - 1);
    }
  };

  useEffect(() => {
    if (planId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/history/${planId}`)
        .then((res) => {
          setPlan(res.data.data);
          setDiary(res.data.data.diaryDayList);
          console.log(res.data.data.diaryDayList);
          MAX_STEP.current = res.data.data.diaryDayList.length - 1;
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [planId, router]);

  useEffect(() => {
    if ((dayStep, diary)) {
      setTimeList(diary[dayStep]["timeList"]);
      const arr = new Array(diary[dayStep]["routeList"].length).fill(false);
      console.log(arr);
      setRootToggles(arr);
      setRouteList(diary[dayStep]["routeList"]);
      setPlanDetail(diary[dayStep]);
    }
  }, [dayStep, diary]);
  return (
    <div style={{ overflow: "hidden", width: "100vw", height: "100vh" }}>
      <header className={styles.header}>
        <div
          className={styles.directionIcon}
          onClick={() => {
            router.push(`/trip/${planId}`);
          }}
        />
        <Image
          src={logo}
          width={100}
          height={25}
          alt="Tripeer Full Logo"
          style={{ objectFit: "cover", cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        />
      </header>
      {diary && timeList && routeList ? (
        <div className={styles.container}>
          <div className={styles.dayInfo}>
            <p>{dayStep + 1}일차</p>
            <div className={styles.dayController}>
              <div
                className={styles.dayControllLeft}
                onClick={() => {
                  move(-1);
                }}
              />
              <p className={styles.dateInfo}>{diary[dayStep]["date"]}</p>
              <div
                className={styles.dayControllRight}
                onClick={() => {
                  move(1);
                }}
              />
            </div>
          </div>
          {diary[dayStep]["planDetailList"].length > 0 ? (
            diary[dayStep]["planDetailList"].map((spot, idx) => {
              return (
                <div key={idx}>
                  <div className={styles.card}>
                    <div className={styles.cardInfoFlex}>
                      <div
                        className={styles.categoryCircle}
                        style={{
                          backgroundColor: `${CARD_CATEGORY[spot.contentType].color}`,
                        }}>
                        {idx + 1}
                      </div>
                      <div className={styles.cardFlex}>
                        <div className={styles.cardTitle}>{spot.title}</div>
                        <div className={styles.cardAddress}>{spot.address}</div>
                        <div className={styles.cardCategory}>
                          <Image
                            src={CARD_CATEGORY[spot.contentType].img}
                            width={16}
                            height={16}
                            alt="아이콘"
                          />
                          <p
                            style={{
                              color: `${CARD_CATEGORY[spot.contentType].color}`,
                              fontSize: "0.7rem",
                              fontWeight: "500",
                            }}>
                            {CARD_CATEGORY[spot.contentType].name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Image
                      loader={() => {
                        return spot.image;
                      }}
                      src={spot.image}
                      width={70}
                      height={70}
                      alt="관광사진"
                      style={{ borderRadius: "5px", alignSelf: "center" }}
                    />
                  </div>
                  {idx ===
                  diary[dayStep]["planDetailList"].length - 1 ? null : (
                    <div className={styles.routeBox}>
                      {timeList[idx] && timeList[idx][1] === "0" ? (
                        <>
                          <div className={styles.routeShortInfo}>
                            <Image
                              width={36}
                              height={22}
                              src={carIcon}
                              alt="탈것"
                            />
                            <div>{getMinute(timeList[idx][0]) + "분"}</div>
                          </div>
                          <div className={styles.routeInfo}>
                            {getMinute(timeList[idx][0]) == 0 ? null : (
                              <div
                                className={styles.route}
                                style={{
                                  width: "100%",
                                  backgroundColor: "#4FBDB7",
                                }}>
                                <div
                                  className={styles.howTo}
                                  style={{ backgroundColor: "#2D8F8A" }}>
                                  <Image
                                    src={whiteCar}
                                    width={10}
                                    height={10}
                                    alt="작은 아이콘"
                                  />
                                </div>
                                <div className={styles.longFlex}>
                                  <p className={styles.howLong}>
                                    {getMinute(timeList[idx][0]) + "분"}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : timeList[idx] ? (
                        <>
                          <div className={styles.routeShortInfo}>
                            <Image
                              width={36}
                              height={22}
                              src={busIcon}
                              alt="탈것"
                            />
                            <div>
                              {routeList[idx]["totalFare"].toLocaleString() +
                                "원"}
                            </div>
                            <div>{getMinute(timeList[idx][0]) + "분"}</div>
                          </div>
                          <div className={styles.routeInfo}>
                            {routeList[idx]["publicRootDetailList"].map(
                              (root, id) => {
                                return (
                                  <div
                                    key={id}
                                    className={styles.route}
                                    style={{
                                      width: `calc(${getWidth(getMinute(timeList[idx][0]), getMinute(root["sectionTime"]))}%)`,
                                      backgroundColor: `${ROUTE_STYLE[root["mode"]].routeColor}`,
                                    }}>
                                    {root.mode === "WALK" && id !== 0 ? null : (
                                      <div
                                        className={styles.howTo}
                                        style={{
                                          backgroundColor: `${ROUTE_STYLE[root["mode"]].circleColor}`,
                                        }}>
                                        <Image
                                          src={ROUTE_STYLE[root["mode"]].Icon}
                                          width={10}
                                          height={10}
                                          alt="작은 아이콘"
                                        />
                                      </div>
                                    )}
                                    <div className={styles.longFlex}>
                                      <p
                                        className={styles.howLong}
                                        style={{
                                          color: `${ROUTE_STYLE[root["mode"]].fontColor}`,
                                        }}>
                                        {getMinute(root["sectionTime"]) + "분"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                          {rootToggles[idx] ? (
                            <div className={styles.rootDetailBox}>
                              {routeList[idx]["publicRootDetailList"].map(
                                (detail, idx) => {
                                  return (
                                    <div key={idx}>
                                      <div className={styles.tracks}>
                                        <div className={styles.track}></div>
                                        <div className={styles.track}></div>
                                        <div className={styles.track}></div>
                                      </div>
                                      <div className={styles.detailInfo}>
                                        <Image
                                          src={
                                            ROUTE_STYLE[detail["mode"]]
                                              .smallIcon
                                          }
                                          width={14}
                                          height={14}
                                          alt="아이콘"
                                        />
                                        <div className={styles.detailText}>
                                          {ROUTE_STYLE[detail["mode"]].info +
                                            "로 " +
                                            detail.distance.toLocaleString() +
                                            "m 이동"}
                                          <p
                                            className={
                                              styles.detailTextDestination
                                            }>
                                            {` (${detail.startName} -> ${detail.endName})`}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                              <div className={styles.tracks}>
                                <div className={styles.track}></div>
                                <div className={styles.track}></div>
                                <div className={styles.track}></div>
                              </div>
                            </div>
                          ) : null}
                          <div className={styles.rootIconBox}>
                            <div
                              className={
                                rootToggles[idx]
                                  ? styles.rootShowIcon
                                  : styles.rootNotShowIcon
                              }
                              style={{ transition: "0.3s ease-in-out" }}
                              onClick={() => {
                                setToggle(idx);
                              }}
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className={styles.blackContainer}>
              해당 일자에 계획하신 일정이 없습니다.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Schedule;
