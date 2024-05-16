// import dynamic from "next/dynamic";
// const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

import styles from "./block.module.css";
// import lottieJson from "@/components/loading/assets/loading1.json";

export default function Block() {
  return (
    <main className={styles.main}>
      {/*<Lottie*/}
      {/*  loop*/}
      {/*  animationData={lottieJson}*/}
      {/*  play*/}
      {/*  style={{ width: 150, height: 150 }}*/}
      {/*/>*/}
      <p className={styles.p}>최단거리 계산중</p>
      <div className={styles.spinContainer}>
        <div className={styles.spinner}></div>
      </div>
    </main>
  );
}
