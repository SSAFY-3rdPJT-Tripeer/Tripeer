import styles from "./page.module.css";
import TopSection from "@/components/place/detail/topSection";

export default function PlaceDetailPage({ params }) {
  return (
    <main className={styles.main}>
      <TopSection params={params} />
    </main>
  );
}
