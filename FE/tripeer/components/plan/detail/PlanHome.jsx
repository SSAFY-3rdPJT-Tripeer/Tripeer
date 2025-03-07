"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./planHome.module.css";
import api from "@/utils/api";

const PlanHome = (props) => {
  const { plan, online, provider, myInfo } = props;
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [towns, setTowns] = useState([]);
  const [townShow, setTownShow] = useState(0);
  const [titleChange, setTitleChange] = useState(false);
  const [onAdd, setOnAdd] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [yNotify, setYNotify] = useState(null);
  const titleInput = useRef(null);
  const notifyTextArea = useRef(null);
  const [mutes, setMutes] = useState({});
  const [inviteErr, setInviteErr] = useState(false);
  const [timer, setTimer] = useState(null);
  const [init, setInit] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

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
      setIsLoad(true);
      try {
        const res = await api.post("/plan/member", {
          planId: plan.planId,
          userId: member.userId,
        });
        if (res.status === 200) {
          setMembers([...members, member]);
        }
      } catch {
        setInviteErr(true);
        setInit(true);
        const timer = setTimeout(() => {
          setInviteErr(false);
          setTimer(timer);
        }, 3000);
      } finally {
        setIsLoad(false);
      }
    }
  };

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }, [timer]);

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

  const turnSpeaker = (userId, video) => {
    if (video) {
      const temp = Object.assign(mutes);
      mutes[userId] ? (temp[userId] = false) : (temp[userId] = true);
      video.muted = temp[userId];
      setMutes(temp);
    }
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

  const notifyChange = (e) => {
    if (yNotify) {
      const temp = e.target.value;
      yNotify.delete(0, yNotify.length);
      yNotify.insert(0, temp);
    }
  };

  useEffect(() => {
    if (provider && notifyTextArea.current) {
      const Quill = require("quill").default; // Quill을 클라이언트에서만 로드
      const QuillBinding = require("y-quill").QuillBinding; // QuillBinding을 클라이언트에서만 로드
      const textArea = provider.doc.getText("textArea");
      const editor = new Quill(notifyTextArea.current, {
        modules: {
          toolbar: [],
        },
        theme: "snow",
      });
      new QuillBinding(textArea, editor);
      setYNotify(textArea);
    }
  }, [provider]);

  return (
    <div className={styles.container}>
      {isLoad ? (
        <div className={styles.back}>
          <div className={styles.spinner}></div>
        </div>
      ) : null}
      {init ? (
        <div
          className={`${styles.warnBox} ${inviteErr ? styles.warnShow : styles.warnNo}`}>
          <div className={styles.warnIcon}></div>
          <p>초대한 회원의 일정이 이미 가득 차있습니다.</p>
        </div>
      ) : null}
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
            </div>
            <div className={styles.notifyContent}>
              <div
                className={styles.notifyText}
                id="textArea"
                ref={notifyTextArea}></div>
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
                      {member.nickname === myInfo.nickname ? null : (
                        <div className={styles.memberSounds}>
                          <div
                            className={
                              mutes[member.userId]
                                ? styles.noSpeaker
                                : styles.speaker
                            }
                            onClick={() => {
                              turnSpeaker(
                                member.userId,
                                document.querySelector(
                                  `.Tripeer${member.userId}`,
                                ),
                              );
                            }}></div>
                        </div>
                      )}
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
                  <div key={idx} style={{ width: "390px" }}>
                    <div className={styles.searchUserCard}>
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
                  </div>
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
