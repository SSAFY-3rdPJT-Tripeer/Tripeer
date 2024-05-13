"use client";

import { useEffect } from "react";
import styles from "./weather.module.css";

const Weather = (props) => {
  const { planId, setOnWeather } = props;
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
        <div className={styles.test}></div>
      </div>
    </div>
  );
};

export default Weather;
