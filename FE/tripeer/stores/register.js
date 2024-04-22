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
          return item ? JSON.parse(item) : undefined;
        },
        setItem: (name, value) => {
          const valueToStore = JSON.stringify(value);
          localStorage.setItem(name, valueToStore);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export default useRegisterStore;
