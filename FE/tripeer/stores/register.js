import { create } from "zustand";
import { persist } from "zustand/middleware";

const useRegisterStore = create(
  persist(
    (set) => ({
      nickName: "",
      setNickName: (nickName) => set({ nickName }),
      year: "",
      setYear: (year) => set({ year }),
      month: "",
      setMonth: (month) => set({ month }),
      day: "",
      setDay: (day) => set({ day }),
      style: -1,
      setStyle: (style) => set({ style }),
    }),
    {
      name: "registerStore",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : undefined; // 데이터를 불러올 때 JSON으로 파싱
        },
        setItem: (name, value) => {
          const valueToStore = JSON.stringify(value); // 데이터를 저장할 때 JSON으로 직렬화
          localStorage.setItem(name, valueToStore);
        },
        removeItem: (name) => {
          localStorage.removeItem(name); // 데이터 삭제
        },
      },
    },
  ),
);

export default useRegisterStore;
