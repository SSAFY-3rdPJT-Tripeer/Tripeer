"use client";

import { useEffect } from "react";

const PageDetail = (props) => {
  useEffect(() => {
    console.log(props);
  }, [props]);
  return (
    <div>
      <h1>agdgadg</h1>
    </div>
  );
};

export default PageDetail;
