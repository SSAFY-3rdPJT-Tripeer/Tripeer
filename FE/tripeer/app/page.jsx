import Landing1 from "./landingPage/Landing1";
import Landing2 from "./landingPage/Landing2";
import Landing3 from "./landingPage/Landing3";
import Landing4 from "./landingPage/Landing4";
import Landing5 from "./landingPage/Landing5";
import Landing6 from "./landingPage/Landing6";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <Landing1 />
      <Landing2 />
      <Landing3 />
      <Landing4 />
      <Landing5 />
      <Landing6 />
    </main>
  );
}
