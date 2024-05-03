import styles from "./spotList.module.css";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const SpotList = (props) => {
  const {
    onSaveSpot,
    saveSpots,
    members,
    removeSaveSpot,
    setShowSpots,
    showSpots,
    justMoveMap,
  } = props;
  const [memberChecks, setMemberChecks] = useState(null);

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

  const filterSpot = (idx) => {
    const temp = memberChecks.map((item, id) => {
      if (idx !== id) return item;
      return !item;
    });
    setMemberChecks(temp);
  };

  useEffect(() => {
    if (memberChecks && members.length > 0) {
      const onMembers = members.filter((mem, idx) => {
        if (memberChecks[idx]) return mem;
      });
      const show = saveSpots.filter((spot) => {
        if (onMembers.find((mem) => mem.userId === spot.userId)) return spot;
      });
      setShowSpots(show);
    }
  }, [memberChecks, members, saveSpots]);

  useEffect(() => {
    if (members.length > 0) {
      setMemberChecks(
        members.map(() => {
          return true;
        }),
      );
    }
  }, [members]);

  return (
    <div className={onSaveSpot ? styles.container : styles.none}>
      <div className={styles.showBox}>
        <div className={styles.header}>
          <div className={styles.flagIcon} />
          <span>우리의 여행지 목록</span>
        </div>
        <hr className={styles.spotLine} />
        <div className={styles.memberBox}>
          {members.map((member, idx) => {
            return (
              <div
                className={styles.memberImg}
                key={idx}
                style={
                  memberChecks && memberChecks[idx]
                    ? {
                        backgroundImage: `url(${member.profileImage})`,
                        border: `3px solid ${COLOR[member.order]}`,
                      }
                    : { backgroundImage: `url(${member.profileImage})` }
                }
                onClick={() => {
                  filterSpot(idx);
                }}
              />
            );
          })}
        </div>
        <hr className={styles.spotLine} />
        <div className={styles.spotSection}>
          {showSpots.length > 0 ? (
            showSpots.map((spot, idx) => {
              return (
                <div key={idx} className={styles.spotCard}>
                  <div className={styles.cardFlex}>
                    <div
                      className={styles.spotImg}
                      style={{ backgroundImage: `url(${spot.img})` }}
                    />
                    <div
                      className={styles.cardContent}
                      onClick={() => {
                        justMoveMap(spot);
                      }}>
                      <p className={styles.spotTitle}>{spot.title}</p>
                      <div className={styles.address}>
                        <div className={styles.positionIcon} />
                        {spot.addr}
                      </div>
                      <div className={styles.cardCategory}>
                        <Image
                          src={CARD_CATEGORY[spot.contentType].img}
                          width={18}
                          height={18}
                          alt="icon"
                        />
                        <span
                          className={styles.categoryTitle}
                          style={{
                            color: `${CARD_CATEGORY[spot.contentType].color}`,
                          }}>
                          {CARD_CATEGORY[spot.contentType].name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.endFlex}>
                    <div
                      className={styles.cancelIcon}
                      onClick={() => {
                        removeSaveSpot(spot);
                      }}
                    />
                    <div
                      className={styles.cardMember}
                      style={{
                        backgroundImage: `url(${spot.profileImage})`,
                        border: `3px solid ${COLOR[spot.order]}`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyPlan}>여행지 목록이 비었습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotList;
