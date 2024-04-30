"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const Map = () => {
  const [map, setMap] = useState(null); // 이후 마커 추가시 사용할 객체
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const INTERVAL = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setIsLoaded(true);
        clearInterval(INTERVAL);
      }
    }, 100);
    return () => {
      clearInterval(INTERVAL);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const { naver } = window;
      var mapOptions = {
        center: new naver.maps.LatLng(36.5595704, 128.105399),
        zoom: 9,
        minZoom: 9,
      };
      const mapObj = new naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapObj);
    }
  }, [isLoaded]);

  return (
    <>
      <Script
        type="text/javascript"
        src={
          "https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=us08e13nh8"
        }
      />
      <div
        ref={mapRef}
        id="map"
        style={{
          width: "calc(100vw - 542px)",
          height: "100vh",
          boxSizing: "border-box",
          margin: "0px",
        }}
      />
    </>
  );
};

export default Map;
