import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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

const PlanMap = (props) => {
  const { plan } = props;
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

  const CATEGORY = ["전체", "숙박", "맛집", "명소", "즐겨찾기"];
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

  const updateList = async () => {
    setIsTarget(false);
    try {
      const res = await api.get(
        `/plan/spot?planId=${plan.planId}&keyword=${searchKeyword}&page=${page}&sortType=${sortType}`,
      );
      if (res.status === 200) {
        setSpotList((prev) => [...prev, ...res.data.data]);
        setPage(page + 1);
        setIsTarget(true);
      }
    } catch (err) {
      setIsTarget(false);
    }
  };

  const searchSpot = async (e) => {
    if (e.key === "Enter" && onCategory !== 4) {
      searchApi(searchKeyword);
    }
  };

  const categoryController = (idx) => {
    const getWishList = async () => {
      const res = await api.get(`/plan/wishlist/${plan.planId}`);
      setSpotWishList(res.data.data);
    };
    setOnCategory(idx);
    switch (idx) {
      case 0:
        setSortType(0);
        break;
      case 1:
        setSortType(3);
        break;
      case 2:
        setSortType(4);
        break;
      case 3:
        setSortType(2);
        break;
      case 4:
        getWishList();
        setIsTarget(false);
        break;
    }
  };

  const searchApi = useCallback(
    async (keyword) => {
      const res = await api.get(
        `/plan/spot?planId=${plan.planId}&keyword=${keyword}&page=0&sortType=${sortType}`,
      );
      if (res.status === 204) {
        setSpotList([]);
        setIsTarget(false);
        return;
      }
      if (res.status === 200) {
        setPage(1);
        setSpotList(res.data.data);
        setIsTarget(true);
      }
    },
    [sortType],
  );

  const changeKeyword = (e) => {
    setSearchKeyword(e.currentTarget.value);
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

  useEffect(() => {
    if (isTarget) {
      io.observe(targetRef.current);
    }
  }, [isTarget, spotList]);

  useEffect(() => {
    if (plan) {
      setTowns(plan.townList);
      searchApi(searchKeyword);
    }
  }, [plan, sortType, searchApi]);

  return (
    <div className={styles.container}>
      <aside className={styles.searchBox}>
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
        <section>
          {CATEGORY.map((category, idx) => (
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
          ))}
        </section>
        <section className={styles.searchResult}>
          {onCategory !== 4
            ? spotList.map((spot, idx) => (
                <div
                  key={idx}
                  className={styles.searchCard}
                  ref={idx === spotList.length - 1 ? targetRef : null}>
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
                        />
                      </div>
                      {spot.spot ? (
                        <div className={styles.minusBtn}>선택취소</div>
                      ) : (
                        <div className={styles.addBtn}>여행지 추가</div>
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
                        <p className={styles.positionContent}>{spot.addr}</p>
                      </div>
                      <hr className={styles.cardLine} />
                      <div className={styles.cardBtns}>
                        <div
                          className={styles.heartBtn}
                          onClick={() => {
                            changeWishList(spot.spotInfoId, idx, false);
                          }}>
                          <Image
                            src={spot.wishlist ? HeartIcon[0] : HeartIcon[1]}
                            width={18}
                            height={18}
                            alt="heart"
                          />
                        </div>
                        {spot.spot ? (
                          <div className={styles.minusBtn}>선택취소</div>
                        ) : (
                          <div className={styles.addBtn}>여행지 추가</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          {onCategory !== 4 && spotList.length === 0 ? (
            <div className={styles.emptySearch}>검색 결과가 없습니다.</div>
          ) : null}
          {onCategory === 4 && spotWishList.length === 0 ? (
            <div className={styles.emptySearch}>찜 목록이 비었습니다.</div>
          ) : null}
        </section>
      </aside>
      <Map />
      {onModal ? <AddSpot towns={towns} setOnModal={setOnModal} /> : null}
    </div>
  );
};

export default PlanMap;
