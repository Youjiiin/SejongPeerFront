import { create } from 'zustand';

const useFilterStore = create(set => ({
  category : '',
  member : 0,
  recruiting: null,
  setRecruiting: recruiting => set({ recruiting }),
  setMember: member => set({ member }),
  setCategory: category => set({ category }),
}));
export default useFilterStore;
