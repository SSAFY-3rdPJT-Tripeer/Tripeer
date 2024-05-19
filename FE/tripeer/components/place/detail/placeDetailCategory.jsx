import styles from "./placeDetailCategory.module.css";
import PlaceDetailCategoryBtn from "@/components/place/detail/placeDetailCategoryBtn";

import stay from "@/public/place/stay.png";
import stayCheck from "@/public/place/stayCheck.png";
import place from "@/public/place/place.png";
import placeCheck from "@/public/place/placeCheck.png";
import food from "@/public/place/food.png";
import foodCheck from "@/public/place/foodCheck.png";

export default function PlaceDetailCategory() {
  return (
    <main className={styles.main}>
      <PlaceDetailCategoryBtn
        title={"명소"}
        src={place}
        checkSrc={placeCheck}
        idx={"mecca"}
      />
      <PlaceDetailCategoryBtn
        title={"맛집"}
        src={food}
        checkSrc={foodCheck}
        idx={"restaurant"}
      />
      <PlaceDetailCategoryBtn
        title={"숙박"}
        src={stay}
        checkSrc={stayCheck}
        idx={"stay"}
      />
    </main>
  );
}
