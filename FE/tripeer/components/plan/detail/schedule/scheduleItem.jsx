import Image from "next/image";

import styles from "./scheduleItem.module.css";
import exitSrc from "@/public/plan/exit.png";
import addressSrc from "@/public/plan/address.png";
import ScheduleCategoryChip from "@/components/plan/detail/schedule/scheduleCategoryChip";

export default function ScheduleItem({ data }) {
  return (
    <div className={styles.container}>
      <div className={styles.imgBox}>
        <Image
          className={styles.image}
          src={data.img}
          alt={""}
          fill
          loader={() => data.img}
          priority="true"
          sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
          quality={50}
        />
      </div>
      <section className={styles.content}>
        <p className={styles.name}>{data.title}</p>
        <div className={styles.box}>
          <Image src={addressSrc} alt={""} width={15} height={15} />
          <p className={styles.address}>{data.addr}</p>
        </div>
        {/*<ScheduleCategoryChip category={data.contentType} />*/}
      </section>
      <section className={styles.right}>
        <Image className={styles.exit} src={exitSrc} alt={""} />
        <div className={styles.profileBox}>
          <Image
            className={styles.profile}
            src={data.profileImage}
            alt={""}
            fill
            loader={() => data.profileImage}
            priority="true"
            sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
            quality={50}
          />
        </div>
      </section>
    </div>
  );
}
