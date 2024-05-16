"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./weather.module.css";

// 날씨 아이콘
import daySunny from "./asset/daySunny.png";
import dayCloudLot from "./asset/dayCloudLot.png";
import dayCloudy from "./asset/dayCloudy.png";
import nightCloudLot from "./asset/nightCloudLot.png";
import nightCloudy from "./asset/nightCloudy.png";
import nightSunny from "./asset/nightSunny.png";
import rainSnow from "./asset/rainSnow.png";
import rainy from "./asset/rainy.png";
import shortRain from "./asset/shortRain.png";
import smallDayCloudLot from "./asset/smallDayCloudLot.png";
import smallDayCloudy from "./asset/smallDayCloudy.png";
import smallDaySunny from "./asset/smallDaySunny.png";
import smallNightCloudLot from "./asset/smallNightCloudLot.png";
import smallNightCloudy from "./asset/smallNightCloudy.png";
import smallNightSunny from "./asset/smallNightSunny.png";
import smallRainSnow from "./asset/smallRainSnow.png";
import smallRainy from "./asset/smallRainy.png";
import smallShortRain from "./asset/smallShortRain.png";
import smallSnow from "./asset/smallSnow.png";
import snow from "./asset/snow.png";
import axios from "axios";
import Image from "next/image";

const Weather = (props) => {
  const { planId, setOnWeather, citys } = props;
  const [step, setStep] = useState(0);
  const [weathers, setWeathers] = useState(null);
  const [maxTemp, setMaxTemp] = useState(0);
  const [minTemp, setMinTemp] = useState(0);
  const [nowHour, setNowHour] = useState(0);
  const [hourNext, setHourNext] = useState(0);

  const transStep = [5, -60, -125, -190, -255, -290];

  const WEATHER_CODE = useMemo(() => {
    return {
      맑음: {
        dayIcon: daySunny,
        nightIcon: nightSunny,
        daySmallIcon: smallDaySunny,
        nightSmallIcon: smallNightSunny,
      },
      구름많음: {
        dayIcon: dayCloudy,
        nightIcon: nightCloudy,
        daySmallIcon: smallDayCloudy,
        nightSmallIcon: smallNightCloudy,
      },
      흐림: {
        dayIcon: dayCloudLot,
        nightIcon: nightCloudLot,
        daySmallIcon: smallDayCloudLot,
        nightSmallIcon: smallNightCloudLot,
      },
      비: {
        dayIcon: rainy,
        nightIcon: rainy,
        daySmallIcon: smallRainy,
        nightSmallIcon: smallRainy,
      },
      "비/눈": {
        dayIcon: rainSnow,
        nightIcon: rainSnow,
        daySmallIcon: smallRainSnow,
        nightSmallIcon: smallRainSnow,
      },
      눈: {
        dayIcon: snow,
        nightIcon: snow,
        daySmallIcon: smallSnow,
        nightSmallIcon: smallSnow,
      },
      소나기: {
        dayIcon: shortRain,
        nightIcon: shortRain,
        daySmallIcon: smallShortRain,
        nightSmallIcon: smallShortRain,
      },
    };
  }, []);

  const testHour = (hour) => {
    return hour > 5 && hour < 13 ? true : false;
  };

  const nextStep = (value) => {
    const next = step + value;
    if (next === citys.length) setStep(0);
    else if (next < 0) setStep(citys.length - 1);
    else setStep(next);
  };

  const goTo = (value) => {
    const MAX_VALUE = transStep.length - 1;
    const MIN_VALUE = 0;
    const nextStep = hourNext + value;
    if (hourNext > MAX_VALUE) setHourNext(MIN_VALUE);
    else if (hourNext < MIN_VALUE) setHourNext(MAX_VALUE);
    else setHourNext(nextStep);
  };

  useEffect(() => {
    if (citys) {
      const cityId = citys[step].cityId;
      const townId = citys[step].townId;
      const getInfo = async () => {
        const res = await axios.get(
          `https://k10d207.p.ssafy.io/api/weather?cityId=${cityId}&townId=${townId}`,
        );
        const hourList = res.data.data.map((data) => data["hourly_temp"]);
        const maxy = Math.max(...hourList);
        const miny = Math.min(...hourList);
        const date = new Date();
        setWeathers(res.data.data);
        setNowHour(date.getHours());
        setMaxTemp(maxy);
        setMinTemp(miny);
        console.log(res.data.data);
      };
      getInfo();
    }
  }, [citys, step]);

  return (
    <div className={styles.container}>
      {weathers ? (
        <div className={styles.modal}>
          <header className={styles.header}>
            <div
              className={styles.directionIcon}
              onClick={() => {
                setOnWeather(false);
              }}
            />
            <p className={styles.title}>현재 여행지 날씨</p>
          </header>
          <div className={styles.weatherBox}>
            {citys.length > 1 ? (
              <div className={styles.dayController}>
                <div
                  className={styles.leftArrow}
                  onClick={() => {
                    nextStep(-1);
                  }}></div>
                <div
                  className={styles.rightArrow}
                  onClick={() => {
                    nextStep(1);
                  }}></div>
              </div>
            ) : null}
            <p className={styles.cityName}>{weathers[0].cityName}</p>
            <Image
              src={
                testHour(nowHour)
                  ? WEATHER_CODE[weathers[nowHour]["sky_cond"]].dayIcon
                  : WEATHER_CODE[weathers[nowHour]["sky_cond"]].nightIcon
              }
              width={170}
              height={170}
              alt="weatherIcon"
              sizes="contain"
            />
          </div>
          <div className={styles.weatherInfoBox}>
            <div className={styles.todayTemp}>
              <div className={styles.nowTemp}>
                {weathers[nowHour]["hourly_temp"]}{" "}
                <p className={styles.tempIcon}>°</p>
              </div>
              <p className={styles.tempInfo}>{weathers[nowHour]["sky_cond"]}</p>
            </div>
            <div className={styles.tempMaxLow}>
              <div className={styles.tempText}>
                <p>최고</p>
                <div className={styles.maxTemp}>
                  {maxTemp} <p className={styles.maxTempIcon}>°</p>
                </div>
              </div>
              <div className={styles.tempText}>
                <p>최저</p>
                <div className={styles.maxTemp}>
                  {minTemp} <p className={styles.maxTempIcon}>°</p>
                </div>
              </div>
            </div>

            <div className={styles.todaySlide}>
              <div className={styles.todayTrack}>
                {weathers.map((hour, idx) => {
                  return (
                    <div key={idx} className={styles.timeInfo}>
                      <div className={styles.time}>
                        {parseInt(hour.time) + "시"}
                      </div>
                      <Image
                        src={
                          testHour(hour["time"])
                            ? WEATHER_CODE[hour["sky_cond"]].daySmallIcon
                            : WEATHER_CODE[hour["sky_cond"]].nightSmallIcon
                        }
                        style={{ backgroundPosition: "50% 50%" }}
                        width={28}
                        height={28}
                        alt={"아이콘"}
                      />
                      <p className={styles.temp}>{hour["hourly_temp"] + "°"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
