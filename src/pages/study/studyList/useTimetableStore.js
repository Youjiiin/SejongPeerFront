import { create } from 'zustand';
const useTimeTableStore = create(set => ({
  //tableInfos : 전체 데이터 , filteredInfos: 필터링 된 행, showData: 필터링 된 행 중 보여줘야 되는 열만 저장
  tableInfos: [],
  filteredInfos:[],
  showData: [],
  subjectName: '',

  setTableInfos: tableInfos => set({ tableInfos }),
  setFilteredInfos:filteredInfos=>set({filteredInfos}),
  setShowData: showData => set({ showData }),
  setSubjectName: subjectName => set({ subjectName }),
  reset: () =>
    set({
      tableInfos: [],
      showData: [],
      subjectName: '',
    }),
}));

export default useTimeTableStore;
