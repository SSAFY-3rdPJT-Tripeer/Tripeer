"use client";

// 외부 모듈
import Image from "next/image";

// 내부 모듈
import styles from "./photoModal.module.css";
import { useEffect, useState } from "react";
import defaultImg from "./assets/defaultImg.png";

const PhotoModal = (props) => {
  const { gallery, setIsModal, clickId } = props;
  const [imageData, setImageData] = useState(null);
  const [step, setStep] = useState(null);

  useEffect(() => {
    if (gallery.length > 0 && clickId !== null) {
      setImageData(gallery);
      setStep(clickId);
    }
    // setImageData(gallery[clickId]);
    // console.log(imageData);
  }, [gallery, clickId]);

  const stepController = (direction) => {
    let nextStep = step + direction;
    if (nextStep >= imageData) {
      setStep(0);
    } else if (nextStep < 0) {
      setStep(imageData.length - 1);
    } else {
      setStep(nextStep);
    }
  };

  const focusOut = (e) => {
    if (e.currentTarget === e.target) {
      setIsModal(false);
    }
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        focusOut(e);
      }}>
      <div className={styles.modalBox}>
        <div className={styles.imageIndex} style={{ position: "relative" }}>
          <Image
            src={imageData ? imageData[step].img : defaultImg}
            className={styles.image}
            sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
            fill
            priority={false}
            alt="memberImg"></Image>
          <div className={styles.userBox}>
            <div className={styles.userImgBox} style={{ position: "relative" }}>
              <Image
                src={imageData ? imageData[step].userImg : defaultImg}
                className={styles.userImg}
                sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
                fill
                priority={false}
                alt="memberImg"></Image>
            </div>
            {imageData ? (
              <div className={styles.userName}>
                {imageData[step].userNickname}
              </div>
            ) : (
              <></>
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
      </div>
    </div>
  );
};

export default PhotoModal;
