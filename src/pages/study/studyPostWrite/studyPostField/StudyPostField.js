import { useState, useEffect, useContext } from 'react';
import style from './StudyPostField.module.css';
import search from '../../../../assets/image/search_gray.png';

//zustand
import useTimeTableStore from '../../timeTable/useTimeTableStore';
import usePostStore from '../usePostStore';
import { MyContext } from '../../../../App';

import getTimeTable from '../../timeTable/getTimeTable';
const StudyPostField = () => {
  const { tableInfos, setTableInfos, showData, setShowData, setSubjectName } =
    useTimeTableStore();
  const { setCategory } = usePostStore();
  const [selectingState, setSelectingState] = useState('college');

  //모달 닫기
  const { setModalOpen } = useContext(MyContext);
  
  const selectHandle = (item, state) => {
    if (state === 'college') {
      const newTableInfo = tableInfos.filter(row => row[1] === item);
      setTableInfos(newTableInfo);
      setShowData(
        Array.from(new Set(newTableInfo.map(row => row[2]).filter(Boolean)))
      );
      setSelectingState('department');
    } else if (state === 'department') {
      const newTableInfo = tableInfos.filter(row => row[2] === item);
      setTableInfos(newTableInfo);
      setShowData(
        Array.from(
          new Set(newTableInfo.map(row => [row[3], row[4]]).filter(Boolean))
        )
      );
      setSelectingState('subsProfs');
    } else if (state === 'subsProfs') {
      const newTableInfo = tableInfos.filter(row => {
        if (row[3] === item[0] && row[4] === item[1]) {
          return row;
        }
      });
      setCategory(newTableInfo[0][0]);
      setSubjectName(item[0]);
      const fetchAndSetTimeTable = async () => {
        const data = await getTimeTable();
        setTableInfos(data.tableInfos);
        setShowData(data.showData);
      };

      fetchAndSetTimeTable();
      setSelectingState('college');
      setModalOpen(false);
    }
  };

  return (
    <div className={style.container}>
      <header className={style.header}>
        <span>학교수업 스터디</span>
      </header>
      <div className={style.search_container}>
        <div className={style.search_wrapper}>
          <img src={search} alt="search" />
          <input
            className={style.search_input}
            type="text"
            placeholder="검색어 입력"
          />
        </div>
      </div>
      <div className={style.filter_study}>
        <div>
          {showData.map((item, index) => (
            <div
              className={style.cateGoryItem}
              key={index}
              onClick={() => selectHandle(item, selectingState)}
            >
              {selectingState === 'subsProfs' ? (
                <div className={style.subsProfsDiv}>
                  <span>{item[0]}</span>
                  <span>{item[1]}</span>
                </div>
              ) : (
                item
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPostField;
