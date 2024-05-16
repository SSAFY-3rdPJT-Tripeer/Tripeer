import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import defaultImg from "../asset/image (42).png";
import styles from "./planMap.module.css";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import FullHeart from "@/components/plan/asset/fullheart.svg";
import Heart from "@/components/plan/asset/heart.svg";
import AddSpot from "./AddSpot";
import Image from "next/image";
import api from "@/utils/api";
import Map from "./Map";
import SpotList from "./SpotList";
import OnlineBox from "./OnlineBox";
import RecommendSlider from "./RecommendSlider";
import axios from "axios";

const PlanMap = (props) => {
  const { plan, online, myInfo, provider } = props;
  const [towns, setTowns] = useState([]);
  const targetRef = useRef(null);
  const [isTarget, setIsTarget] = useState(false);
  const [page, setPage] = useState(0);
  const [targetStep, setTargetStep] = useState(0);
  const [onToggle, setOnToggle] = useState(false);
  const [onCategory, setOnCategory] = useState(0);
  const [sortType, setSortType] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [spotList, setSpotList] = useState([]);
  const [spotWishList, setSpotWishList] = useState([]);
  const [onModal, setOnModal] = useState(false);
  const [mapLatitude, setMapLatitude] = useState(null);
  const [mapLongitude, setMapLongitude] = useState(null);
  const [isMarker, setIsMarker] = useState(null);
  const [onSaveSpot, setOnSaveSpot] = useState(false);
  const [members, setMembers] = useState([]);
  const [ySpot, setYSpot] = useState(null); // y.js에 y-Array(savespot)이 담길 객체
  const [saveSpots, setSaveSpots] = useState([]); // y.js의 savespot 객체의 배열을 화면에 보여줄 State
  const [io, setIo] = useState(null);
  const [showSpots, setShowSpots] = useState([]);
  const [timer, setTimer] = useState(null);
  const [alert, setAlert] = useState(false);
  const [init, setInit] = useState(false);
  const [recommends, setRecommends] = useState(null);
  const [tempKeyword, setTempKeyword] = useState("");
  const spotRef = useRef(null);

  const CATEGORY = ["전체", "숙박", "맛집", "명소", "즐겨찾기", "추천"];
  const COLOR = [
    "#A60000",
    "#DE5000",
    "#D78E00",
    "#48B416",
    "#0065AE",
    "#20178B",
    "#65379F",
    "#F96976",
  ];
  const HeartIcon = [FullHeart, Heart];
  const CARD_CATEGORY = useMemo(() => {
    return {
      관광지: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      문화시설: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      "축제 공연 행사": {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      "여행 코스": {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      레포츠: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      숙박: {
        name: "숙박",
        color: "#D26D6D",
        img: SleepIcon,
      },
      쇼핑: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      음식점: {
        name: "맛집",
        color: "#D25B06",
        img: EatIcon,
      },
    };
  }, []);

  useEffect(() => {
    const tempIo = new IntersectionObserver(
      (entris) => {
        entris.forEach((entry) => {
          if (entry.isIntersecting && isTarget) {
            tempIo.unobserve(entry.target);
            setPage((prev) => prev + 1);
          }
        });
      },
      { threshold: 0.9 },
    );
    setIo(tempIo);
  }, [isTarget]);

  const getPages = useCallback(async () => {
    setIsTarget(false);
    try {
      const res = await api.get(
        `/plan/spot?planId=${plan.planId}&keyword=${searchKeyword}&sortType=${sortType}&page=${page}`,
      );
      if (res.status === 204) {
        setSpotList([]);
        setIsTarget(false);
        return;
      }
      if (res.status === 200) {
        setSpotList((prev) => [...prev, ...res.data.data]);
        setIsTarget(true);
      }
    } catch {
      setIsTarget(false);
    }
  }, [plan, sortType, page]);

  useEffect(() => {
    if (page > 0) {
      getPages();
    }
  }, [page, getPages]);

  const getData = useCallback(async () => {
    setIsTarget(false);
    try {
      const res = await api.get(
        `/plan/spot?planId=${plan.planId}&keyword=${searchKeyword}&sortType=${sortType}&page=0`,
      );
      if (res.status === 204) {
        setSpotList([]);
        setIsTarget(false);
        return;
      }
      if (res.status === 200) {
        setSpotList(res.data.data);
        setIsTarget(true);
      }
    } catch {
      setIsTarget(false);
    }
  }, [sortType, searchKeyword, plan]);

  useEffect(() => {
    if (
      plan &&
      (sortType === 0 || sortType === 3 || sortType === 4 || sortType === 2)
    ) {
      getData();
    }
  }, [sortType, plan, getData]);

  // useEffect(() => {
  //   const tempIo = new IntersectionObserver(
  //     (entris) => {
  //       entris.forEach((entry) => {
  //         if (entry.isIntersecting && isTarget) {
  //           tempIo.unobserve(entry.target);
  //           updateList();
  //         }
  //       });
  //     },
  //     { threshold: 0.9 },
  //   );
  //   setIo(tempIo);
  // }, [isTarget]);

  // const updateList = async () => {
  //   setIsTarget(false);
  //   try {
  //     const res = await api.get(
  //       `/plan/spot?planId=${plan.planId}&keyword=${searchKeyword}&page=${page}&sortType=${sortType}`,
  //     );
  //     if (res.status === 200) {
  //       setSpotList((prev) => [...prev, ...res.data.data]);
  //       setPage(page + 1);
  //       setIsTarget(true);
  //     }
  //   } catch (err) {
  //     setIsTarget(false);
  //   }
  // };

  const searchSpot = async (e) => {
    if (e.key === "Enter" && onCategory !== 4 && onCategory !== 5) {
      setPage(0);
      spotRef.current.scrollTop = 0;
      setSearchKeyword(tempKeyword);
      // getData();
    }
  };

  const searchClick = async () => {
    if (onCategory !== 4 && onCategory !== 5) {
      setPage(0);
      spotRef.current.scrollTop = 0;

      setSearchKeyword(tempKeyword);

      // getData();
    }
  };

  const categoryController = (idx) => {
    const getWishList = async () => {
      const res = await api.get(`/plan/wishlist/${plan.planId}`);
      setSpotWishList(res.data.data);
    };
    const getRecommendList = async () => {
      const req = {
        plan_id: myInfo.planId,
        user_id: myInfo.userId,
      };
      const res = await axios.post(
        "https://k10d207.p.ssafy.io/recommend/items2",
        req,
      );
      console.log(res.data);
      setRecommends(res.data);
    };
    setOnCategory(idx);
    setPage(0);
    spotRef.current.scrollTop = 0;
    switch (idx) {
      case 0:
        setSortType(0);
        setRecommends(null);

        break;
      case 1:
        setSortType(3);
        setRecommends(null);

        break;
      case 2:
        setSortType(4);
        setRecommends(null);

        break;
      case 3:
        setSortType(2);
        setRecommends(null);
        break;
      case 4:
        getWishList();
        setIsTarget(false);
        setRecommends(null);

        break;
      case 5:
        setIsTarget(false);
        getRecommendList();
        break;
    }
  };

  // const searchApi = useCallback(
  //   async (keyword) => {
  //     const res = await api.get(
  //       `/plan/spot?planId=${plan.planId}&keyword=${keyword}&page=0&sortType=${sortType}`,
  //     );
  //     if (res.status === 204) {
  //       setSpotList([]);
  //       setIsTarget(false);
  //       return;
  //     }
  //     if (res.status === 200) {
  //       setPage(1);
  //       setSpotList(res.data.data);
  //       setIsTarget(true);
  //     }
  //   },
  //   [sortType, plan],
  // );

  const changeKeyword = (e) => {
    setTempKeyword(e.currentTarget.value);
  };

  const changeWishList = async (spotId, idx, isSpot) => {
    if (isSpot) {
      const tempList = [...spotList];
      tempList[idx]["wishlist"] = !tempList[idx]["wishlist"];
      setSpotList(tempList);
    } else {
      const tempList = spotWishList.filter((_, id) => {
        return idx !== id;
      });
      setSpotWishList(tempList);
    }
    await api.post(`/plan/wishlist/${spotId}`);
  };

  const moveMap = (spot) => {
    setIsMarker(spot);
  };

  const justMoveMap = (spot) => {
    setMapLongitude(spot.longitude);
    setMapLatitude(spot.latitude);
  };

  const addSaveSpot = async (spot) => {
    try {
      const tempSave = { ...spot, ...myInfo };
      await api.post(
        `/plan/bucket?planId=${plan.planId}&spotInfoId=${spot.spotInfoId}`,
      );
      const totalY = provider.doc.getArray("totalYList");
      const totalFirst = totalY.get(0);
      totalFirst.insert(0, [tempSave]);
      ySpot.insert(0, [tempSave]);
    } finally {
      const tempSpot = spotList.map((item) => {
        if (spot.spotInfoId !== item.spotInfoId) {
          return item;
        }
        item.spot = true;
        return item;
      });
      setSpotList(tempSpot);
    }
  };

  const removeSaveSpot = async (spot) => {
    const totalYList = provider.doc.getArray("totalYList").toJSON();
    const totalY = provider.doc.getArray("totalYList");
    let isVisit = false;
    for (let item of totalYList) {
      if (item.length > 0) {
        isVisit = true;
        break;
      }
    }
    if (totalYList.length > 0 && isVisit) {
      const findTotal = totalYList[0].filter((item) => {
        return item.spotInfoId === spot.spotInfoId;
      });

      if (findTotal.length === 0) {
        setAlert(true);
        setInit(true);
        let time = setTimeout(() => {
          setAlert(false);
          setTimer(time);
        }, 2000);
        return;
      }
    }
    try {
      await api.delete(
        `/plan/bucket?planId=${plan.planId}&spotInfoId=${spot.spotInfoId}`,
      );
      const totalFirst = totalY.get(0);
      const totalArr = totalFirst.toArray();
      let totalIndex = totalArr.findIndex(
        (item) => item.spotInfoId === spot.spotInfoId,
      );
      const arr = ySpot.toArray();
      let index = arr.findIndex((item) => item.spotInfoId === spot.spotInfoId);
      totalFirst.delete(totalIndex);
      ySpot.delete(index);
    } finally {
      const tempSpot = spotList.map((item) => {
        if (item.spotInfoId !== spot.spotInfoId) {
          return item;
        }
        item.spot = false;
        return item;
      });
      setSpotList(tempSpot);
    }
  };

  useEffect(() => {
    if (towns.length > 0) {
      setMapLatitude(towns[targetStep]["latitude"]);
      setMapLongitude(towns[targetStep]["longitude"]);
    }
  }, [targetStep, towns]);

  useEffect(() => {
    if (isTarget && io && targetRef.current) {
      io.observe(targetRef.current);
    }
  }, [isTarget, spotList, io]);

  // useEffect(() => {
  //   if (plan) {
  //     searchApi(searchKeyword);
  //   }
  // }, [plan, sortType, searchApi]);

  useEffect(() => {
    const getMember = async () => {
      const res = await api.get(`/plan/member/${plan.planId}`);
      setMembers(res.data.data);
    };
    if (plan) {
      setTowns(plan.townList);
      getMember();
    }
  }, [plan]);

  useEffect(() => {
    if (myInfo && provider && spotList.length > 0) {
      const saveSpot = provider.doc.getArray("saveSpot");
      setYSpot(saveSpot);
      setSaveSpots(saveSpot.toArray());
      saveSpot.observe(() => {
        setIsTarget(false);
        const spots = saveSpot.toArray();
        const tempSpotList = spotList.map((spot) => {
          if (
            spots.findIndex((item) => item.spotInfoId === spot.spotInfoId) !==
            -1
          ) {
            spot.spot = true;
          } else {
            spot.spot = false;
          }
          return spot;
        });
        setSpotList(tempSpotList);
        if (onCategory === 4) {
          const tempWishSpotList = spotWishList.map((spot) => {
            if (
              spots.findIndex((item) => item.spotInfoId === spot.spotInfoId) !==
              -1
            ) {
              spot.spot = true;
            } else {
              spot.spot = false;
            }
            return spot;
          });
          setSpotWishList(tempWishSpotList);
        }
        setSaveSpots(spots);
        setIsTarget(true);
      });
    }
  }, [myInfo, provider, spotList, spotWishList, onCategory]);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }, [timer]);

  return (
    <div className={styles.container}>
      <aside className={styles.searchBox}>
        <SpotList
          onSaveSpot={onSaveSpot}
          saveSpots={saveSpots}
          members={members}
          removeSaveSpot={removeSaveSpot}
          showSpots={showSpots}
          setShowSpots={setShowSpots}
          justMoveMap={justMoveMap}
        />
        <div
          className={styles.saveSpotToggle}
          onClick={() => {
            setOnSaveSpot(!onSaveSpot);
          }}>
          <div
            className={onSaveSpot ? styles.saveSpotIcon : styles.saveNoSpotIcon}
          />
        </div>
        <header className={styles.searchHeader}>
          <div className={styles.townList}>
            <span className={styles.townTitle}>
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
          <div
            className={styles.newPlaceBtn}
            onClick={() => {
              setOnModal(true);
            }}>
            신규 장소 등록
          </div>
        </header>
        <hr className={styles.sectionLine} />
        <div className={styles.inputBox}>
          <input
            type="text"
            className={styles.searchInput}
            maxLength={30}
            onChange={(e) => {
              changeKeyword(e);
            }}
            onKeyDown={(e) => {
              searchSpot(e);
            }}
            placeholder="여행지를 기입하고 엔터를 입력하세요."
          />
          <div
            className={styles.enter}
            onClick={() => {
              searchClick();
            }}></div>
        </div>
        <section>
          {CATEGORY.map((category, idx) =>
            idx === 5 ? (
              <span
                key={idx}
                className={
                  onCategory !== idx ? styles.flagCategory : styles.onCategory
                }
                onClick={() => {
                  categoryController(idx);
                }}>
                <span className={styles.recomandFlag}>🚩</span>
                {category}
              </span>
            ) : (
              <span
                key={idx}
                className={
                  onCategory !== idx ? styles.category : styles.onCategory
                }
                onClick={() => {
                  categoryController(idx);
                }}>
                {category}
              </span>
            ),
          )}
        </section>
        <section className={styles.searchResult} ref={spotRef}>
          {onCategory === 5 ? (
            <>
              {recommends
                ? recommends.map((recommend, idx) => {
                    return (
                      <RecommendSlider
                        key={idx}
                        recommend={recommend}
                        recommends={recommends}
                        setRecommends={setRecommends}
                        rId={idx}
                        plan={plan}
                        provider={provider}
                        myInfo={myInfo}
                        setAlert={setAlert}
                        setInit={setInit}
                        setTimer={setTimer}
                      />
                    );
                  })
                : [1, 2].map((_, idx) => {
                    return <RecommendSlider key={idx} />;
                  })}
            </>
          ) : (
            <div>
              {onCategory !== 4
                ? spotList.map((spot, idx) => (
                    <div
                      key={idx}
                      className={styles.searchCard}
                      ref={idx === spotList.length - 1 ? targetRef : null}>
                      <div
                        className={styles.cardImg}
                        onClick={() => {
                          moveMap(spot);
                        }}
                        style={{ position: "relative" }}>
                        <Image
                          loader={() => spot.img}
                          src={spot.img}
                          fill
                          alt="사진"
                          placeholder="blur"
                          blurDataURL={`${defaultImg}`}
                          priority="true"
                          sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
                          quality={50}
                        />
                      </div>
                      <div className={styles.cardContent}>
                        <div
                          className={styles.cardHeader}
                          onClick={() => {
                            moveMap(spot);
                          }}>
                          <p className={styles.cardTitle}>{spot.title}</p>
                          <div className={styles.cardCategoryBox}>
                            <div
                              className={styles.cardCategoryIcon}
                              style={{ position: "relative" }}>
                              <Image
                                src={CARD_CATEGORY[spot.contentType].img}
                                fill
                                alt="icon"
                              />
                            </div>
                            <p
                              className={styles.cardCategory}
                              style={{
                                color: `${CARD_CATEGORY[spot.contentType].color}`,
                              }}>
                              {CARD_CATEGORY[spot.contentType].name}
                            </p>
                          </div>
                        </div>
                        <div
                          className={styles.cardPosition}
                          onClick={() => {
                            moveMap(spot);
                          }}>
                          <div className={styles.positionIcon} />
                          <p className={styles.positionContent}>{spot.addr}</p>
                        </div>
                        <hr className={styles.cardLine} />
                        <div className={styles.cardBtns}>
                          <div
                            className={styles.heartBtn}
                            onClick={() => {
                              changeWishList(spot.spotInfoId, idx, true);
                            }}>
                            <Image
                              src={spot.wishlist ? HeartIcon[0] : HeartIcon[1]}
                              width={18}
                              height={18}
                              alt="heart"
                              quality={50}
                              loading="eager"
                            />
                          </div>
                          {spot.spot ? (
                            <div
                              className={styles.minusBtn}
                              onClick={() => {
                                removeSaveSpot(spot);
                              }}>
                              선택취소
                            </div>
                          ) : (
                            <div
                              className={styles.addBtn}
                              onClick={() => {
                                addSaveSpot(spot);
                              }}>
                              여행지 추가
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                : spotWishList.map((spot, idx) => {
                    return (
                      <div key={idx} className={styles.searchCard}>
                        <div
                          className={styles.cardImg}
                          style={{ backgroundImage: `url(${spot.img})` }}
                        />
                        <div className={styles.cardContent}>
                          <div className={styles.cardHeader}>
                            <p className={styles.cardTitle}>{spot.title}</p>
                            <div className={styles.cardCategoryBox}>
                              <div
                                className={styles.cardCategoryIcon}
                                style={{ position: "relative" }}>
                                <Image
                                  src={CARD_CATEGORY[spot.contentType].img}
                                  fill
                                  alt="icon"
                                />
                              </div>
                              <p
                                className={styles.cardCategory}
                                style={{
                                  color: `${CARD_CATEGORY[spot.contentType].color}`,
                                }}>
                                {CARD_CATEGORY[spot.contentType].name}
                              </p>
                            </div>
                          </div>
                          <div className={styles.cardPosition}>
                            <div className={styles.positionIcon} />
                            <p className={styles.positionContent}>
                              {spot.addr}
                            </p>
                          </div>
                          <hr className={styles.cardLine} />
                          <div className={styles.cardBtns}>
                            <div
                              className={styles.heartBtn}
                              onClick={() => {
                                changeWishList(spot.spotInfoId, idx, false);
                              }}>
                              <Image
                                src={
                                  spot.wishlist ? HeartIcon[0] : HeartIcon[1]
                                }
                                width={18}
                                height={18}
                                alt="heart"
                              />
                            </div>
                            {spot.spot ? (
                              <div
                                className={styles.minusBtn}
                                onClick={() => {
                                  removeSaveSpot(spot);
                                }}>
                                선택취소
                              </div>
                            ) : (
                              <div
                                className={styles.addBtn}
                                onClick={() => {
                                  addSaveSpot(spot);
                                }}>
                                여행지 추가
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}
          {onCategory !== 4 && spotList.length === 0 ? (
            <div className={styles.emptySearch}>검색 결과가 없습니다.</div>
          ) : null}
          {onCategory === 4 && spotWishList.length === 0 ? (
            <div className={styles.emptySearch}>찜 목록이 비었습니다.</div>
          ) : null}
        </section>
      </aside>
      <Map
        mapLatitude={mapLatitude}
        mapLongitude={mapLongitude}
        setMapLatitude={setMapLatitude}
        setMapLongitude={setMapLongitude}
        isMarker={isMarker}
        setIsMarker={setIsMarker}
        myInfo={myInfo}
        showSpots={showSpots}
        setShowSpots={setShowSpots}
      />
      {onModal ? (
        <AddSpot
          towns={towns}
          setOnModal={setOnModal}
          planId={plan.planId}
          myInfo={myInfo}
          provider={provider}
        />
      ) : null}
      <OnlineBox members={members} online={online} myInfo={myInfo} />
      {init ? (
        <div
          className={`${styles.warnBox} ${alert ? styles.warnShow : styles.warnNo}`}>
          <div className={styles.warnIcon}></div>
          <p>이미 일정에 추가된 여행지입니다.</p>
        </div>
      ) : null}
    </div>
  );
};

export default PlanMap;
