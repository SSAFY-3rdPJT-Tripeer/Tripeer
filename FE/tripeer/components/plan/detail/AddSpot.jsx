"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./addSpot.module.css";
import AddConfirm from "./AddConfirm";
import axios from "axios";

const AddSpot = (props) => {
  const { towns, setOnModal, planId, myInfo, provider } = props;
  const [targetStep, setTargetStep] = useState(0);
  const [onToggle, setOnToggle] = useState(false);
  const [map, setMap] = useState(null);
  const [keyword, setKeyWord] = useState("");
  const mapRef = useRef(null);
  const targetRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTarget, setIsTarget] = useState(false);
  const [page, setPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [prevMarker, setPrevMarker] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const resultBox = useRef(null);

  const moveTo = (e, x, y) => {
    e.preventDefault();
    const { naver } = window;
    if (prevMarker) {
      prevMarker.setMap(null);
    }
    const spot = new naver.maps.LatLng(y, x);
    const marker = new naver.maps.Marker({
      position: spot,
      map: map,
    });
    setPrevMarker(marker);
    map.panTo(spot);
  };

  useEffect(() => {
    if (map && towns.length > 0) {
      const { naver } = window;
      const spot = new naver.maps.LatLng(
        towns[targetStep]["latitude"],
        towns[targetStep]["longitude"],
      );
      map.panTo(spot);
    }
  }, [targetStep, map, towns]);

  const searchKeyWord = useCallback(
    async (e) => {
      if (e.key === "Enter" && keyword.length > 0) {
        setPage(1);
        const res = await axios.get(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${towns[targetStep].title + `${keyword}`}&page=${1}`,
          {
            headers: {
              Authorization: `KakaoAK 539e943cc2b1239fa94da86fb8f82c76`,
            },
          },
        );
        resultBox.current.scrollTo({ top: 0, behavior: "smooth" });
        res.data.meta.is_end ? setIsTarget(false) : setIsTarget(true);
        setSearchResult(res.data.documents);
      }
    },
    [towns, targetStep, keyword],
  );

  const changeKeyword = (e) => {
    setKeyWord(e.currentTarget.value);
  };

  const goToConfirm = (spot) => {
    setIsLoaded(false);
    setConfirm(spot);
  };

  const offModal = (e) => {
    if (e.target === e.currentTarget) setOnModal(false);
  };

  const updateList = useCallback(async () => {
    const nextPage = page + 1;
    const res = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${towns[targetStep].title + `${keyword}`}&page=${nextPage}`,
      {
        headers: {
          Authorization: `KakaoAK 539e943cc2b1239fa94da86fb8f82c76`,
        },
      },
    );
    console.log(res);
    setSearchResult([...searchResult, ...res.data.documents]);
    res.data.meta.is_end ? setIsTarget(false) : setIsTarget(true);
    setPage(nextPage);
  }, [page, targetStep, towns, searchResult, keyword]);

  const io = new IntersectionObserver(
    (entris) => {
      entris.forEach((entry) => {
        if (entry.isIntersecting && isTarget) {
          io.unobserve(entry.target);
          updateList();
        }
      });
    },
    { threshold: 0.9 },
  );

  useEffect(() => {
    if (!confirm) {
      const INTERVAL = setInterval(() => {
        if (window.naver && window.naver.maps) {
          setIsLoaded(true);
          clearInterval(INTERVAL);
        }
      }, 100);
      return () => {
        clearInterval(INTERVAL);
      };
    }
  }, [confirm]);

  useEffect(() => {
    if (isTarget) {
      io.observe(targetRef.current);
    }
  }, [isTarget, searchResult]);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const { naver } = window;
      var mapOptions = {
        center: new naver.maps.LatLng(36.5595704, 128.105399),
        zoom: 16,
        minZoom: 16,
      };
      const mapObj = new naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapObj);
    }
  }, [isLoaded]);

  return (
    <section
      className={styles.back}
      onMouseDown={(e) => {
        offModal(e);
      }}>
      {confirm ? (
        <AddConfirm
          confirm={confirm}
          setConfirm={setConfirm}
          setOnModal={setOnModal}
          planId={planId}
          myInfo={myInfo}
          provider={provider}
        />
      ) : (
        <div className={styles.backContainer}>
          <header className={styles.header}>신규 장소 등록</header>

          <input
            type="text"
            className={styles.searchInput}
            maxLength={30}
            onKeyDown={(e) => {
              searchKeyWord(e);
            }}
            onChange={(e) => {
              changeKeyword(e);
            }}
            placeholder="여행지를 기입하고 엔터를 입력하세요."
          />
          <div
            ref={mapRef}
            id="map"
            style={{
              width: "452px",
              height: "220px",
              boxSizing: "border-box",
              margin: "0px",
            }}>
            <header className={styles.searchHeader}>
              <div className={styles.townList}>
                <span
                  className={styles.townTitle}
                  onClick={() => {
                    setOnToggle(!onToggle);
                  }}>
                  {towns.length > 0 ? towns[targetStep].title : ""}
                </span>
                <div
                  className={styles.toggle}
                  onClick={() => {
                    setOnToggle(!onToggle);
                  }}
                />
                {onToggle ? (
                  <div className={styles.townCateogry}>
                    {towns.map((town, idx) => {
                      return (
                        <p
                          key={idx}
                          className={styles.townExample}
                          onClick={() => {
                            setTargetStep(idx);
                            setOnToggle(false);
                          }}>
                          {town.title}
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </header>
          </div>
          <div className={styles.resultBox} ref={resultBox}>
            {searchResult.length === 0 ? (
              <div className={styles.emptySearch}>검색 결과가 없습니다.</div>
            ) : (
              searchResult.map((result, idx) => {
                return (
                  <div key={idx}>
                    <div
                      className={styles.card}
                      ref={idx === searchResult.length - 1 ? targetRef : null}>
                      <div className={styles.cardInfo}>
                        <div
                          className={styles.pointIcon}
                          onClick={(e) => {
                            moveTo(e, result.x, result.y);
                          }}
                        />
                        <div
                          className={styles.cardContent}
                          onClick={(e) => {
                            moveTo(e, result.x, result.y);
                          }}>
                          <div className={styles.cardTitle}>
                            {result["place_name"]}
                          </div>
                          <div className={styles.cardPlace}>
                            {result["address_name"]}
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.plusBtn}
                        onClick={() => {
                          goToConfirm(result);
                        }}
                      />
                    </div>
                    <hr className={styles.sectionLine} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AddSpot;
