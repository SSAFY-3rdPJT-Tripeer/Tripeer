"use client";

// 외부 모듈
import Image from "next/image";

// 내부 모듈
import styles from "./photoModal.module.css";
import { useEffect, useState } from "react";
import defaultImg from "./assets/defaultImg.png";

const PhotoModal = (props) => {
  const { gallery, setIsModal, clickId } = props;
  const [step, setStep] = useState(null);

  const stepController = (direction) => {
    // 새로운 step 계산, 배열 경계 확인
    let nextStep = step + direction;
    if (nextStep >= gallery.length) {
      nextStep = 0; // 배열의 끝을 넘어가면 처음으로
    } else if (nextStep < 0) {
      nextStep = gallery.length - 1; // 배열의 시작 전으로 가면 마지막으로
    }
    setStep(nextStep);
  };

  const focusOut = (e) => {
    if (e.currentTarget === e.target) {
      setIsModal(false);
    }
  };

  useEffect(() => {
    // 클릭된 사진의 인덱스를 찾아 초기 step을 설정
    const initialIndex = gallery.findIndex(
      (photo) => photo.galleryId === clickId,
    );
    if (initialIndex >= 0) {
      setStep(initialIndex);
    }
  }, [gallery, clickId]);

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        focusOut(e);
      }}>
      <div className={styles.modalBox}>
        {gallery.length > 0 && step !== null && (
          <div className={styles.imageIndex} style={{ position: "relative" }}>
            <Image
              src={gallery[step].img || defaultImg}
              loader={() => gallery[step].img}
              className={styles.image}
              sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
              fill
              priority={false}
              alt="Photo"></Image>
            <div className={styles.userBox}>
              <div
                className={styles.userImgBox}
                style={{ position: "relative" }}>
                <Image
                  src={gallery[step].userImg || defaultImg}
                  loader={() => gallery[step].userImg}
                  className={styles.userImg}
                  sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
                  fill
                  priority={false}
                  alt="memberImg"></Image>
              </div>
              {gallery.length > 0 && step !== null && (
                <div className={styles.userName}>
                  {gallery[step].userNickname}
                </div>
              )}
            </div>
            <div
              className={styles.postArrow}
              onClick={() => {
                stepController(-1);
              }}></div>
            <div
              className={styles.nextArrow}
              onClick={() => {
                stepController(1);
              }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;
