import { useState, useEffect } from 'react';
import { searchHandler } from './api';

//zustand
import useTimeTableStore from './useTimetableStore';
import useFilterStore from './useFilterStore';
import useStudyStore from './useStudyStore';

import style from './Filter_Field.module.css';
import search from '../../../assets/image/search_gray.png';
import back from '../../../assets/image/back_black.png';

const Filter_Field = ({ deleteHandler }) => {
  const {
    tableInfos,
    setFilteredInfos,
    showData,
    setShowData,
    setSubjectName,
  } = useTimeTableStore();

  const { setPosts } = useStudyStore();

  const { category, setCategory } = useFilterStore();
  const [selectingState, setSelectingState] = useState(0); //0->단과대,1->학과,2->과목이 띄워짐
  const [college, setCollege] = useState(null);
  const [department, setDepartment] = useState(null);

  //이전 값으로 초기화
  const filteringBefore = state => {
    if (state === 0) {
      setFilteredInfos(tableInfos);
      setShowData(
        Array.from(new Set(tableInfos.map(row => row[1]).filter(Boolean)))
      );
    } else if (state === 1) {
      const newTableInfo = tableInfos.filter(row => {
        if (row[1] === college) {
          return row;
        }
      });
      setFilteredInfos(newTableInfo);
      setShowData(
        Array.from(new Set(newTableInfo.map(row => row[2]).filter(Boolean)))
      );
    }
  };

  //다음 데이터 갱신
  const selectHandle = async (item, state) => {
    if (state === 0) {
      const newTableInfo = tableInfos.filter(row => row[1] === item);
      setFilteredInfos(newTableInfo);
      setShowData(
        Array.from(new Set(newTableInfo.map(row => row[2]).filter(Boolean)))
      );
      setCollege(item);
      setSelectingState(s => s + 1);
    } else if (state === 1) {
      const newTableInfo = tableInfos.filter(row => {
        if (row[1] === college && row[2] === item) {
          return row;
        }
      });
      setFilteredInfos(newTableInfo);
      setShowData(
        Array.from(
          new Set(newTableInfo.map(row => [row[3], row[4]]).filter(Boolean))
        )
      );
      setDepartment(item);
      setSelectingState(s => s + 1);
    } else if (state === 2) {
      const newTableInfo = tableInfos.filter(row => {
        if (
          row[1] === college &&
          row[2] === department &&
          row[3] === item[0] &&
          row[4] === item[1]
        ) {
          return row;
        }
      });

      //최종 결정
      setCategory(newTableInfo[0][0]);
      setSubjectName(item[0]);

      //다시 초기화
      setFilteredInfos([...tableInfos]);
      setShowData(
        Array.from(new Set(tableInfos.map(row => row[1]).filter(Boolean)))
      );

      setSelectingState(0);
      await submitHandler();

      //모달 닫기
      deleteHandler();
    }
  };

  const clickBack = () => {
    //다음값 데이터 초기화
    filteringBefore(selectingState - 1);

    //상태 값 초기화
    if (selectingState === 1) {
      setCollege(null);
    } else if (selectingState) {
      setDepartment(null);
    }

    //이전 단계로 돌아가기
    setSelectingState(s => s - 1);
  };

  // 검색 핸들러
  const submitHandler = async () => {
    try {
      const { category, member, recruiting } = useFilterStore.getState();
      const filterValues = { category, member, recruiting };
      const data = await searchHandler(filterValues);
      setPosts(data[0].data);

    } catch (error) {
      console.error('Error during submit:', error);
    }
  };

  return (
    <div className={style.container}>
      <header className={style.header}>
        {selectingState > 0 ? (
          <img
            className={style.backImg}
            src={back}
            alt="back"
            onClick={clickBack}
          />
        ) : null}
        <span>학교수업 스터디</span>
      </header>
      <div className={style.search_container}>
        <div className={style.search_wrapper}>
          <img src={search} alt="search" />
          <input
            className={style.search_input}
            type="text"
            placeholder="과목명 입력"
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
              {selectingState === 2 ? (
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

export default Filter_Field;
