import create from "zustand";

const useRegisterStore = create((set) => ({
  nickName: "",
  setNickName: (newNickName) => set({ nickName: newNickName }),
}));

export default useRegisterStore;
