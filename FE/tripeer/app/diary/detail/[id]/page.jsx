"use client";

// 외부 모듈
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// 내부 모듈
import styles from "./page.module.css";
import DiaryDetailCard from "@/components/diary/DiaryDetailCard";
import api from "@/utils/api";
import QRCode from "qrcode.react";

const DiaryDetail = () => {
  const [detailData, setDetailData] = useState(null);
  const [isCostModal, setIsCostModal] = useState(false);
  const [isQRModal, setIsQRModal] = useState(false);
  const router = useRouter();
  const params = useParams();

  const getDiaryDetail = async () => {
    try {
      const res = await api.get(`history/${params.id}`);
      setDetailData(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getDayOfWeek = (inputDate) => {
    const week = ["일", "월", "화", "수", "목", "금", "토"];

    const dayOfWeek = week[new Date(inputDate).getDay()];

    return `${inputDate.replace(/-/g, ".")} (${dayOfWeek})`;
  };

  const focusOut = (e) => {
    if (e.currentTarget === e.target) {
      setIsCostModal(false);
    }
  };

  useEffect(() => {
    getDiaryDetail();
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.backBox}>
          <div
            className={styles.backIcon}
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                router.back();
              }
            }}></div>
          <div
            className={styles.backText}
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                router.back();
              }
            }}>
            뒤로가기
          </div>
        </div>
        <div
          className={styles.qrBox}
          onClick={() => {
            setIsQRModal(true);
          }}>
          <div className={styles.qrImg}></div>
          <div className={styles.qrText}>QR코드</div>
        </div>
      </div>
      {detailData ? (
        <header className={styles.header}>
          <div style={{ position: "relative" }} className={styles.imageBox}>
            <Image
              className={styles.headerImg}
              src={
                "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default2.png"
              }
              alt="이미지"
              fill
              quality={100}
              unoptimized={false}
              sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
              loader={() => {
                if (detailData.diaryDetail) {
                  return detailData.diaryDetail.img;
                }
                return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default2.png";
              }}
            />
          </div>
          <div className={styles.headerImg}></div>
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              {detailData.diaryDetail.title}
            </div>

            <div className={styles.placeBox}>
              <div className={styles.iconBox}>
                <div className={styles.mapIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행지</div>
                <div className={styles.subTitle}>
                  {detailData.diaryDetail.townList}
                </div>
              </div>
            </div>

            <div className={styles.scheduleBox}>
              <div className={styles.iconBox}>
                <div className={styles.scheduleIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행 날짜</div>
                <div className={styles.subTitle}>
                  {getDayOfWeek(detailData.diaryDetail.startDay)} -{" "}
                  {getDayOfWeek(detailData.diaryDetail.endDay)}
                </div>
              </div>
            </div>

            <div className={styles.memberBox}>
              <div className={styles.iconBox}>
                <div className={styles.membereIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행 인원</div>
                <div className={styles.memberList}>
                  {detailData.diaryDetail.member ? (
                    detailData.diaryDetail.member.map((mem, idx) => {
                      return (
                        <div key={idx} className={styles.nameBox}>
                          <div
                            className={styles.memberImg}
                            style={{
                              backgroundImage: `url(${mem.profileImage})`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              height: "50px",
                              width: "50px",
                              borderRadius: "50px",
                              marginRight: "3px",
                              flex: "none",
                            }}></div>

                          <span className={styles.nickname}>
                            {mem.nickname}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <></>
      )}
      <article className={styles.articleBox}>
        {detailData?.diaryDayList?.map((item, cardIdx) => {
          return (
            <div key={cardIdx} style={{ marginBottom: "50px" }}>
              <DiaryDetailCard
                diaryDayList={item}
                getDayOfWeek={getDayOfWeek}
                setIsCostModal={setIsCostModal}
              />
            </div>
          );
        })}
      </article>
      {isCostModal && (
        <div
          className={styles.editCostModalBack}
          onClick={(e) => {
            focusOut(e);
          }}>
          <div className={styles.editCostModalBox}>
            <div className={styles.editCostModalText}>
              해당 금액이 저장되었습니다.
            </div>
            <div
              className={styles.editCostModalBtn}
              onClick={() => {
                setIsCostModal(false);
              }}>
              확인
            </div>
          </div>
        </div>
      )}
      {isQRModal ? (
        <div
          className={styles.back}
          onClick={(e) => {
            if (e.currentTarget == e.target) {
              setIsQRModal(false);
            }
          }}>
          <div className={styles.modalBox}>
            <QRCode value={`https://k10d207.p.ssafy.io/trip/${params.id}`} />
            <div className={styles.btnFlex}>
              <div
                className={styles.exitBtn}
                onClick={() => {
                  window.location.replace(
                    `https://k10d207.p.ssafy.io/trip/${params.id}`,
                  );
                }}>
                여행 바로 가기
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default DiaryDetail;
