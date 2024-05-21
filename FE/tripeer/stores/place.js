import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePlaceStore = create(
  persist(
    (set) => ({
      allData: null,
      setAllData: (allData) => set({ allData }),
      category: "숙박",
      setCategory: (category) => set({ category }),
      cityData: null,
      setCityData: (cityData) => set({ cityData }),
      townData: null,
      setTownData: (townData) => set({ townData }),
      stayList: null,
      setStayList: (stayList) => set({ stayList }),
      restaurantList: null,
      setRestaurantList: (restaurantList) => set({ restaurantList }),
      meccaList: null,
      setMeccaList: (meccaList) => set({ meccaList }),
    }),
    {
      name: "placeStore",
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

export default usePlaceStore;
