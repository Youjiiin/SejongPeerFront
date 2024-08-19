import { create } from 'zustand';
const useStudyInfoStore = create(set => ({
  //studyType: lecture || external_activity
  studyType: 'lecture',
  setStudyType: studyType => set({ studyType }),
}));

export default useStudyInfoStore;
