import styles from "./page.module.css";
import TopSection from "@/components/place/detail/topSection";
import BottomSection from "@/components/place/detail/bottomSection";

export default function PlaceDetailPage({ params }) {
  return (
    <main className={styles.main}>
      <TopSection params={params} />
      <BottomSection />
    </main>
  );
}
