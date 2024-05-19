import { useEffect, useRef, useState } from "react";
import styles from "./planModal.module.css";
import REGION from "@/public/region/cityTown.json";
import Slider from "./Slider.jsx";

const PlanModal = (props) => {
  const { setStep, setNewPlan, newPlan } = props;
  const [canNext, setCanNext] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [regions, setRegions] = useState([]);
  const selectList = useRef(new Set());
  const [finalList, setFinalList] = useState([]);

  const nextPage = () => {
    if (canNext) {
      const data = Object.assign(newPlan);
      data.townList = finalList;
      setStep(1);
      setNewPlan(data);
    }
  };

  const filterRegion = (e) => {
    const keyword = e.currentTarget.value;
    const filterling = REGION.filter((region) => {
      if (region.name.search(keyword) !== -1) return region;
    });
    setRegions(filterling);
  };

  const selectRegion = (region) => {
    if (!selectList.current.has(region.idx)) {
      selectList.current.add(region.idx);
      const templist = [...finalList];
      templist.push(region);
      setFinalList(templist);
    }
    setSearchFocus(false);
  };

  const cancel = (region) => {
    selectList.current.delete(region.idx);
    const tempList = finalList.filter((data) => data.idx !== region.idx);
    setFinalList(tempList);
  };

  const focusOut = (e) => {
    if (e.currentTarget === e.target) {
      setSearchFocus(false);
    }
  };

  useEffect(() => {
    finalList.length > 0 ? setCanNext(true) : setCanNext(false);
  }, [finalList]);

  return (
    <section
      onClick={(e) => {
        focusOut(e);
      }}
      style={{ width: "100%", height: "100%" }}>
      <header className={styles.header}>
        <p className={styles.title}>여행지를 선택해주세요.</p>
        <p
          className={`${styles.btn} ${canNext ? styles.able : styles.disable}`}
          onClick={() => {
            nextPage();
          }}>
          다음
        </p>
      </header>
      <div
        className={`${styles.searchBar} ${searchFocus ? styles.focusSearch : ""}`}>
        <input
          type="text"
          className={searchFocus ? styles.focusInput : styles.searchInput}
          onFocus={() => {
            setSearchFocus(true);
          }}
          onChange={(e) => {
            filterRegion(e);
          }}
          placeholder="여행하고 싶은 지역을 모두 추가해주세요."
        />
        {searchFocus ? (
          <div className={styles.searchList}>
            {regions.map((region) => {
              return (
                <div
                  key={region.idx}
                  onClick={() => {
                    selectRegion(region);
                  }}>
                  <hr className={styles.resultLine} />
                  <p className={styles.result}>
                    <span>{region.name}</span>
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className={styles.searchResult}>
        {finalList.map((region) => {
          return (
            <div key={region.idx}>
              <span className={styles.select}>
                {region.name}
                <div
                  className={styles.cancel}
                  onClick={() => {
                    cancel(region);
                  }}
                />
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.sliderContainer}>
        <Slider></Slider>
      </div>
    </section>
  );
};

export default PlanModal;
