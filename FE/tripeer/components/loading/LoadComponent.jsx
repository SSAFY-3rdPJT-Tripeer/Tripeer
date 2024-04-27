"use client";

// 외부 모듈
import Lottie from "react-lottie-player";

// 내부 모듈
import lottieJson from "./assets/loading1.json";
import styles from "./loading.module.css";

/*
    1. 필요시 부모한테서 step={step}으로 <Loading/> 가져와서 사용하면 됨.
    2. useEffect setTimeOut으로 원하는 시간만큼 시간 걸어두고 사용하면 됨.
    3. 예시는 test 페이지에 있음

*/

const LoadComponent = (props) => {
  const { step } = props;
  let isShow = false;
  let fade = "";

  switch (step) {
    case 1: // on -> off 애니메이션 실행
      isShow = true;
      fade = "fadeOut";
      break;
    case 2: // off -> on
      isShow = true;
      fade = "";
      break;
    default: // 디폴트값 명시적 작성
      isShow = false;
  }

  return (
    <div className={styles.container + ` ${styles[fade]}`}>
      {isShow ? (
        <Lottie
          loop
          animationData={lottieJson}
          play
          style={{ width: 150, height: 150 }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default LoadComponent;
