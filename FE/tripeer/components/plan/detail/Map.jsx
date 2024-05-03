"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const Map = (props) => {
  const {
    mapLatitude,
    mapLongitude,
    isMarker,
    setIsMarker,
    myInfo,
    showSpots,
  } = props;
  const [map, setMap] = useState(null); // 이후 마커 추가시 사용할 객체
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevMarker, setPrevMarker] = useState(null);
  const [prevShowSpots, setPrevShowSpots] = useState([]);

  useEffect(() => {
    if (map && mapLatitude && mapLongitude) {
      const { naver } = window;
      const spot = new naver.maps.LatLng(mapLatitude, mapLongitude);
      map.panTo(spot);
    }
  }, [map, mapLatitude, mapLongitude]);

  useEffect(() => {
    if (isMarker) {
      if (prevMarker) {
        prevMarker.setMap(null);
      }
      const { naver } = window;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(mapLatitude, mapLongitude),
        map,
        icon: {
          url: `https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/marker${myInfo.order}.svg`,
          size: new naver.maps.Size(33, 45),
          scaledSize: new naver.maps.Size(33, 45),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(19, 58),
        },
      });
      setPrevMarker(marker);
      setIsMarker(false);
    }
  }, [isMarker]);

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
        zoom: 12,
        minZoom: 10,
      };
      const mapObj = new naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapObj);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const { naver } = window;
      if (prevShowSpots.length > 0) {
        prevShowSpots.map((marker) => marker.setMap(null));
      }
      const markers = showSpots.map((spot) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(spot.latitude, spot.longitude),
          map,
          icon: {
            url: `https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/marker${spot.order}.svg`,
            size: new naver.maps.Size(33, 45),
            scaledSize: new naver.maps.Size(33, 45),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(19, 58),
          },
        });
        return marker;
      });
      setPrevShowSpots(markers);
    }
  }, [isLoaded, showSpots]);

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
