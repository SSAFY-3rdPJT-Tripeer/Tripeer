import PlaceSearchBar from "@/components/place/placeSearchBar";

import styles from "./page.module.css";

export default function PlacePage() {
  return (
    <main className={styles.main}>
      <section className={styles.sectionTop}>
        <p className={styles.p}>우리 이번엔 어디로 갈까?</p>
        <PlaceSearchBar />
      </section>
      <section></section>
    </main>
  );
}
