import axios from "axios";

export default function SuperUserBtn() {
  const onClick = async () => {
    await axios
      .get("https://k10d207.p.ssafy.io/api/user/test/getsuper/1")
      .then((res) => {
        const accessToken = res.data.data.replace("Bearer ", "");
        localStorage.setItem("accessToken", accessToken);
      });
  };

  return <button onClick={onClick}>딸깍</button>;
}
