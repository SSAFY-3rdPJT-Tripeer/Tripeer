import axios from "axios";
import cookies from "js-cookie";

export default function SuperUserBtn() {
  const onClick = async () => {
    await axios
      .get("https://k10d207.p.ssafy.io/api/user/test/getsuper/1")
      .then((res) => {
        const accessToken = res.data.data.replace("Bearer ", "");
        // localStorage.setItem("accessToken", accessToken);
        cookies.set("Authorization", accessToken);
      });
  };

  return <button onClick={onClick}>딸깍</button>;
}
