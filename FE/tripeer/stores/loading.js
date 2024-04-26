import { create } from "zustand";

const useLoadingStore = create((set) => ({
  loading: false,
  setLoading: (newValue) => set({ loading: newValue }),
}));

export default useLoadingStore;
