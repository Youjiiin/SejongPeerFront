import { create } from 'zustand';

const useFilterStore = create(set => ({
  category : 0,
  member : 0,
  recruiting: null,
  setRecruiting: recruiting => set({ recruiting }),
  setMember: member => set({ member }),
  setCategory: category => set({ category }),
  reset: () =>
    set({
      category : 0,
      member : 0,
      recruiting: null,
    }),
}));
export default useFilterStore;
