import { useEffect, useRef, useState } from "react";
import styles from "./planHome.module.css";
import api from "@/utils/api";

const PlanHome = (props) => {
  const { plan, online, provider, myInfo, mouseInfo } = props;
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [towns, setTowns] = useState([]);
  const [townShow, setTownShow] = useState(0);
  const [titleChange, setTitleChange] = useState(false);
  const [onAdd, setOnAdd] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const titleInput = useRef(null);

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

  const invite = async (member) => {
    if (members.length < 8) {
      const res = await api.post("/plan/member", {
        planId: plan.planId,
        userId: member.userId,
      });
      if (res.status === 200) {
        setMembers([...members, member]);
      }
    }
  };

  const search = async (e) => {
    const value = e.currentTarget.value;
    if (value.length > 0) {
      const res = await api.get(`/user/search/${value}`);
      setSearchResult(res.data.data);
    }
  };

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
    const getMember = async () => {
      const res = await api.get(`/plan/member/${plan.planId}`);
      setMembers(res.data.data);
    };
    if (plan) {
      setTitle(plan.title);
      setTowns(plan.townList);
      getMember();
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
                            border: `3px solid ${COLOR[member.order]}`,
                          }}>
                          <div
                            className={
                              online.find((mem) => mem?.id == member.userId)
                                ? styles.onLine
                                : styles.offLine
                            }
                          />
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
              <div
                className={styles.addMember}
                onClick={() => {
                  setOnAdd(true);
                }}>
                <div />
                멤버 추가
              </div>
            </div>
          </div>
        </aside>
      </article>
      {onAdd ? (
        <div
          className={styles.addContainer}
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setOnAdd(false);
          }}>
          <div className={styles.addMemberBox}>
            <div className={styles.addHeader}>
              <div>멤버 추가</div>
            </div>
            <hr className={styles.notifyLine} style={{ margin: "12px 0px" }} />
            <div className={styles.addContent}>
              <input
                type="text"
                className={styles.addInput}
                placeholder="추가할 멤버의 닉네임을 입력해주세요."
                maxLength={10}
                onChange={(e) => {
                  search(e);
                }}
              />
            </div>
            <div className={styles.addSearch}>
              {searchResult.map((member, idx) => {
                return (
                  <>
                    <div className={styles.searchUserCard} key={idx}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <div
                          className={styles.searchUserImg}
                          style={{
                            backgroundImage: `url(${member.profileImage})`,
                          }}
                        />
                        <div className={styles.searchUserName}>
                          {member.nickname}
                        </div>
                      </div>
                      <div
                        className={
                          members.find((m) => m.userId === member.userId)
                            ? styles.noBtn
                            : styles.addBtn
                        }
                        onClick={() => {
                          invite(member);
                        }}>
                        초대
                      </div>
                    </div>
                    <hr className={styles.addLine} key={`line${idx}`} />
                  </>
                );
              })}
              {searchResult.length === 0 ? (
                <div className={styles.noSearch}>검색 결과가 없습니다.</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PlanHome;
