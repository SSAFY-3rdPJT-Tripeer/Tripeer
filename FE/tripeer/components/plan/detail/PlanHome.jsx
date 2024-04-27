import { useEffect, useRef, useState } from "react";
import styles from "./planHome.module.css";
import api from "@/utils/api";

const PlanHome = (props) => {
  const { plan } = props;
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [towns, setTowns] = useState([]);
  const [townShow, setTownShow] = useState(0);
  const [titleChange, setTitleChange] = useState(false);
  const titleInput = useRef(null);

  const changeOn = () => {
    if (titleChange === true) {
      const input = titleInput.current.value;
      if (input.length === 0) {
        setTitleChange(!titleChange);
        return;
      }
      const data = {
        planId: plan.planId,
        title: input,
      };
      api.patch("/plan/title", data);
      setTitle(input);
    }
    titleInput.current.focus();
    setTitleChange(!titleChange);
  };

  const townTrans = (direct) => {
    let townCurrent = townShow + direct;
    if (townCurrent < 0) setTownShow(towns.length - 1);
    else if (townCurrent > towns.length - 1) setTownShow(0);
    else setTownShow(townCurrent);
  };

  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
      setTowns(plan.townList);
      setMembers(plan.coworkerList);
    }
  }, [plan]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={!titleChange ? "" : styles.visible}>{title}</span>
        <input
          className={`${styles.titleChange} ${!titleChange ? styles.visible : ""}`}
          type="text"
          placeholder={title}
          maxLength={10}
          ref={titleInput}
        />
        <div
          className={styles.editBtn}
          onClick={() => {
            changeOn();
          }}
        />
      </header>
      <article className={styles.contentBox}>
        <section className={styles.regionBox}>
          <div className={styles.regionHeader}>
            {" "}
            <div className={styles.pointerIcon} />
            <span className={styles.regionHeaderFont}>목적지</span>
          </div>
          <div className={styles.regions}>
            {towns.map((town, idx) => {
              return (
                <div
                  className={styles.region}
                  key={idx}
                  style={{ transform: `translateX(-${townShow * 100}%)` }}>
                  <p className={styles.regionTitle}>{town.title}</p>
                  <div className={styles.regionInfo}>{town.description}</div>
                  <div
                    className={styles.regionImg}
                    style={{ backgroundImage: `url(${town.img})` }}
                  />
                </div>
              );
            })}
            {towns.length < 2 ? null : (
              <div className={styles.direction}>
                <div
                  className={styles.leftDirect}
                  onClick={() => {
                    townTrans(-1);
                  }}
                />
                <div
                  className={styles.rightDirect}
                  onClick={() => {
                    townTrans(1);
                  }}
                />
              </div>
            )}
          </div>
        </section>
        <aside className={styles.functionBox}>
          <div className={styles.notifyBox}>
            <div className={styles.notifyHeader}>
              <p className={styles.functionTitle}>공지사항</p>
              <div className={styles.configIcon} />
            </div>
            <div className={styles.notifyContent}>
              <hr className={styles.notifyLine} />
              <p className={styles.notifyText}>공지사항이 없습니다.</p>
              <hr className={styles.notifyLine} />
            </div>
          </div>
          <div className={styles.memberBox}>
            <div className={styles.notifyHeader}>
              <p className={styles.functionTitle}>멤버 목록</p>
              <div className={styles.memberCnt}>
                <div className={styles.personIcon} />
                <p className={styles.memberFont}>{members.length}명</p>
              </div>
            </div>
            <div className={styles.memberContent}>
              <hr className={styles.notifyLine} />
              {members.map((member, idx) => {
                return (
                  <div key={idx}>
                    <div className={styles.member}>
                      <div className={styles.memberInfo}>
                        <div
                          className={styles.memberImg}
                          style={{
                            backgroundImage: `url(${member.profileImage})`,
                            backgroundSize: "cover",
                          }}>
                          <div className={styles.onLine} />
                        </div>
                        <p className={styles.memberName}>{member.nickname}</p>
                      </div>
                      <div className={styles.memberSounds}>
                        <div className={styles.mic}></div>
                        <div className={styles.speaker}></div>
                      </div>
                    </div>
                    <hr className={styles.notifyLine} />
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </article>
    </div>
  );
};

export default PlanHome;
