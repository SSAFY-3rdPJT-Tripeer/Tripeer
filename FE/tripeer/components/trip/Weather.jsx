"use client";

import { useEffect, useState } from "react";
import styles from "./weather.module.css";

// 날씨 아이콘
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

const Weather = (props) => {
  const { planId, setOnWeather, citys } = props;
  const [step, setStep] = useState(0);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (citys) {
      const cityId = citys[step].cityId;
      const townId = citys[step].townId;
      axios
        .get(
          `https://k10d207.p.ssafy.io/api/weather?cityId=${cityId}&townId=${townId}`,
        )
        .then((res) => {
          console.log(res.data);
        });
    }
  }, [citys, step]);

  return (
    <div className={styles.container}>
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
        <div className={styles.weatherBox}></div>
        <div className={styles.weatherInfoBox}>
          <div className={styles.todayTemp}>
            <div className={styles.nowTemp}>
              26 <p className={styles.tempIcon}>°</p>
            </div>
            <p className={styles.tempInfo}>대체로 맑음</p>
          </div>
          <div className={styles.tempMaxLow}>
            <div className={styles.tempText}>
              <p>최고</p>
              <div className={styles.maxTemp}>
                26 <p className={styles.maxTempIcon}>°</p>
              </div>
            </div>
            <div className={styles.tempText}>
              <p>최저</p>
              <div className={styles.maxTemp}>
                26 <p className={styles.maxTempIcon}>°</p>
              </div>
            </div>
          </div>
          <div className={styles.todaySlide}>
            <div
              className={styles.todayTrack}
              style={{ transform: `translateX(10%)` }}>
              {[...new Array(23)].map((_, idx) => {
                return (
                  <div key={idx} className={styles.timeInfo}>
                    <div className={styles.time}>14시</div>
                    <div className={styles.weatherIcon}></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
