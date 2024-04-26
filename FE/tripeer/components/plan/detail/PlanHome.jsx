import styles from "./planHome.module.css";
import { useEffect } from "react";

const PlanHome = () => {
  useEffect(() => {
    console.log("hi");
  }, []);
  return <div className={styles.hihi}></div>;
};

export default PlanHome;
