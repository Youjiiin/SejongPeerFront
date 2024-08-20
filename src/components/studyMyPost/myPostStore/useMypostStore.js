import { create } from 'zustand';

const useMypostStore = create(set => ({
  state: true,
  setState: state => set({ state }),
}));

export default useMypostStore;
