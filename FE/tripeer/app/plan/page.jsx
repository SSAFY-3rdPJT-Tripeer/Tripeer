import style from "./page.module.css";
import Cards from "@/components/plan/Cards";

const Plan = () => {
  return (
    <main className={style.container}>
      <header className={style.header}>
        <p className={style.title}>여행 계획을 선택하거나 추가해보세요</p>
        <p className={style.description}>
          최대 6개의 계획을 추가할 수 있습니다.
        </p>
      </header>
      <Cards></Cards>
    </main>
  );
};

export default Plan;
