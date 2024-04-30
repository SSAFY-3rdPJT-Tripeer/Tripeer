import { useEffect, useState } from "react";
import styles from "./addConfirm.module.css";

const AddConfirm = (props) => {
  const { confirm, setConfirm, setOnModal } = props;
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [radio, setRadio] = useState(-1);
  const [newPlan, setNewPlan] = useState(false);
  const [warn, setWarn] = useState("");

  const setCategory = (idx) => {
    setRadio(idx);
  };

  const createPlan = () => {
    if (radio === -1) {
      setWarn("장소의 카테고리를 선택해주세요");
      return;
    }
  };

  useEffect(() => {
    if (confirm) {
      console.log(confirm);
      setTitle(confirm["place_name"]);
      setPlace(confirm["address_name"]);
    }
  }, [confirm]);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>신규 장소 등록</span>
        <div
          className={styles.backTo}
          onClick={() => {
            setConfirm(null);
          }}>
          <div className={styles.backIcon} />
          뒤로
        </div>
      </header>
      <section className={styles.content}>
        <div className={styles.placeInfo}>
          <p className={styles.placeHeader}>선택 장소</p>
          <div className={styles.placeContent}>
            <p className={styles.placeTitle}>{title}</p>
            <p className={styles.placeWhere}>{place}</p>
          </div>
        </div>
        <div className={styles.placeInfo}>
          <p className={styles.placeHeader}>선택 분류</p>
          <div className={styles.cateogryContent}>
            <label className={styles.label}>
              <input
                type="radio"
                style={{ accentColor: "black" }}
                name="radio"
                onClick={() => {
                  setCategory(0);
                }}
              />
              <span className={styles.category}>맛집</span>
            </label>
            <label className={styles.label}>
              <input
                type="radio"
                style={{ accentColor: "black" }}
                name="radio"
                onClick={() => {
                  setCategory(1);
                }}
              />
              <span className={styles.category}>숙박</span>
            </label>
            <label className={styles.label}>
              <input
                type="radio"
                style={{ accentColor: "black" }}
                name="radio"
                id="radio"
                onClick={() => {
                  setCategory(2);
                }}
              />
              <span className={styles.category}>명소</span>
            </label>
          </div>
        </div>
        <div className={styles.checkDiv}>
          <input
            type="checkbox"
            id="check"
            className={styles.checkBox}
            onChange={(e) => {
              setNewPlan(e.target.checked);
            }}
          />
          <label htmlFor="check" className={styles.checkLabel} />
          <span className={styles.checkInfo}>
            해당 장소를 등록하고, 여행계획에 추가하시겠습니까?
          </span>
        </div>
      </section>
      <div className={styles.warn}>{warn}</div>
      <footer className={styles.footer}>
        <div
          className={styles.nobtn}
          onClick={() => {
            setConfirm(null);
          }}>
          취소
        </div>
        <div
          className={styles.btn}
          onClick={() => {
            createPlan();
          }}>
          확인
        </div>
      </footer>
    </div>
  );
};

export default AddConfirm;
