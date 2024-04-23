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
      style1: null,
      setStyle1: (style1) => set({ style1 }),
      style2: null,
      setStyle2: (style2) => set({ style2 }),
      style3: null,
      setStyle3: (style3) => set({ style3 }),
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
