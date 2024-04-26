// 내부 모듈

import PlanFullNav from "./PlanFullNav";
import PlanShortNav from "./PlanShortNav";

const PlanNav = (props) => {
  const { current } = props;
  return (
    <>
      {current === 0 ? <PlanFullNav {...props} /> : <PlanShortNav {...props} />}
    </>
  );
};

export default PlanNav;
