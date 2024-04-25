"use client";

/* eslint-disable */

// 외부 모듈
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./cards.module.css";
import PlanModal from "./PlanModal.jsx";
import TitleModal from "./TitleModal";
import DateModal from "./DateModal";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

const Cards = () => {
  const [plans, setPlans] = useState([]);
  const [showPlans, setShowPlans] = useState([]);
  const [flag, setFlag] = useState(0);
  const [noPlans, setNoPlans] = useState(2); // 레이아웃 비율 유지를 위한 빈 플랜
  const [onModal, setOnModal] = useState(false);
  const [step, setStep] = useState(0);
  const [newPlan, setNewPlan] = useState({});
  const [removePlan, setRemovePlan] = useState(null);
  const router = useRouter();
  const MAX_PLANS_CNT = 6; // 만들 수 있는 최대 계획
  const Per_PAGE_CNT = 3; // 한 페이지에 랜더할 계획의 갯수

  const changeFlag = () => {
    flag === 0 ? setFlag(1) : setFlag(0);
  };

  const offModal = (e) => {
    if (e.currentTarget === e.target) {
      setOnModal(false);
      setStep(0);
    }
  };

  const removeModal = (e, plan) => {
    if (e.currentTarget !== e.target) return;
    setRemovePlan(plan);
  };

  const getPlans = async () => {
    try {
      const res = await api.get("/plan");
      setPlans(res.data.data);
    } catch (err) {
      alert("에러발생! 버러지 컷");
    }
  };

  const goPlan = (id) => {
    router.push(`/plan/detail/${id}`);
  };

  const remove = async () => {
    try {
      const res = await api.delete(`/plan/${removePlan.planId}`);
      await getPlans();
      setRemovePlan(null);
    } catch {
      alert("에러발생");
    }
  };

  useEffect(() => {
    let arr = [];
    if (flag === 0) {
      for (let i = 0; i < MAX_PLANS_CNT / 2; i++) {
        if (i === plans.length) break;
        arr.push(plans[i]);
      }
    } else {
      for (let i = 3; i < MAX_PLANS_CNT; i++) {
        if (i === plans.length) break;
        arr.push(plans[i]);
      }
    }
    setShowPlans(arr);
  }, [plans, flag]);

  useEffect(() => {
    switch (showPlans.length) {
      case 0:
        setNoPlans(2);
        break;
      case 1:
        setNoPlans(1);
        break;
      case 4:
        setNoPlans(1);
        break;
      default:
        setNoPlans(0);
        break;
    }
  }, [showPlans]);

  useEffect(() => {
    if (step === 0) {
      getPlans();
    }
  }, [step]);

  const modalContent = useMemo(() => {
    return [
      <PlanModal
        setNewPlan={setNewPlan}
        setStep={setStep}
        newPlan={newPlan}
        key={"PlanModal"}
      />,
      <DateModal
        setNewPlan={setNewPlan}
        setStep={setStep}
        newPlan={newPlan}
        key={"DateModal"}
      />,
      <TitleModal
        setNewPlan={setNewPlan}
        setStep={setStep}
        newPlan={newPlan}
        setOnModal={setOnModal}
        key={"TitleModal"}
      />,
    ];
  }, []);

  return (
    <main className={styles.container}>
      <aside className={styles.direction}>
        {plans.length >= Per_PAGE_CNT ? (
          <div
            className={styles.left}
            onClick={() => {
              changeFlag();
            }}
          />
        ) : null}
      </aside>
      <article className={`${styles.cardBox}  ${styles.cardAni} `}>
        {showPlans.map((plan, idx) => (
          <div className={styles.card} key={idx}>
            <section
              className={styles.cardBody}
              style={{ position: "relative" }}>
              <Image
                src={plan.img}
                placeholder="blur"
                blurDataURL="/altImg.png"
                alt="picture"
                quality={100}
                fill
                style={{ borderRadius: "15px" }}
                onClick={() => {
                  goPlan(plan.planId);
                }}
              />

              <div
                className={styles.cardContent}
                onClick={() => {
                  goPlan(plan.planId);
                }}>
                <div className={styles.title}>
                  <span>{plan.title}</span>
                  <div className={styles.person}>
                    <div className={styles.personIcon} />
                    <span className={styles.personFont}>
                      {plan.member.length}명
                    </span>
                    {/* <div className={styles.personToggle} /> */}
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.destination}>
                    <div className={styles.destinationIcon} />
                    {plan.townList.map((town, id) => (
                      <span key={id} className={styles.destinationTitle}>
                        {id === plan.townList.length - 1 ? (
                          <span>{town}</span>
                        ) : (
                          <span>{`${town} ,`}</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <div className={styles.calendar}>
                    <div className={styles.calendarIcon} />
                    <span className={styles.calendarTitle}>
                      {plan.startDay} ~ {plan.endDay}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.newIcon}>
                <span>New</span>
              </div>
              <div
                className={styles.removeList}
                style={{ pointerEvents: "fill" }}
                onClick={(e) => {
                  removeModal(e, plan);
                }}></div>
            </section>
          </div>
        ))}

        {showPlans.length < Per_PAGE_CNT ? (
          <div className={styles.card}>
            <section
              className={styles.cardBody}
              onClick={() => {
                setOnModal(true);
              }}>
              <div className={styles.addCard}>
                <div className={styles.addBtn}>
                  <div className={styles.btn}>
                    <div className={styles.plus} />
                  </div>
                  <p className={styles.addContent}>계획 추가하기</p>
                </div>
              </div>
            </section>
          </div>
        ) : null}
        {[...new Array(noPlans)].map((_, idx) => (
          <div className={styles.card} key={idx} />
        ))}
      </article>
      <aside className={styles.direction}>
        {plans.length >= Per_PAGE_CNT ? (
          <div
            className={styles.right}
            onClick={() => {
              changeFlag();
            }}
          />
        ) : null}
      </aside>
      {onModal ? (
        <article
          className={styles.back}
          onMouseDown={(e) => {
            offModal(e);
          }}>
          <section className={styles.modalContainer}>
            {modalContent[step]}
          </section>
        </article>
      ) : null}
      {removePlan ? (
        <div className={styles.removeBack}>
          <div className={styles.removeContainer}>
            <p className={styles.removeTitle}>
              정말 해당 플랜에서 나가시겠습니까?
            </p>
            <div className={styles.removeBtns}>
              <button
                className={styles.removeBtn}
                onClick={() => {
                  setRemovePlan(null);
                }}>
                취소
              </button>
              <button
                className={`${styles.removeBtn} ${styles.removeConfirm}`}
                onClick={() => {
                  remove();
                }}>
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Cards;
