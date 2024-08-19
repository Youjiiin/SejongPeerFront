import { useState, useEffect, useContext } from 'react';
import style from './StudyPostField.module.css';
import search from '../../../../assets/image/search_gray.png';
//api
import { fetchData } from './api';

//zustand

import usePostStore from '../usePostStore';
import useTimeTableStore from '../../timeTable/useTimeTableStore';

import { MyContext } from '../../../../App';

const StudyPostExternalField = () => {
  const { setModalOpen } = useContext(MyContext);

  const studyType = localStorage.getItem('studyType');

  const { setCategory } = usePostStore();
  const [datas, setDatas] = useState([]);
  const { setSubjectName } = useTimeTableStore();
  useEffect(() => {
    console.log('상태: ', studyType);
    const loadPosts = async () => {
      try {
        const fetchedData = await fetchData();

        setDatas(fetchedData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    loadPosts();
  }, []);

  const selectHandle = data => {
    setSubjectName(data.categoryName);
    setCategory(data.id);
    setModalOpen(false);
  };
  return (
    <div className={style.container}>
      <header className={style.header}>
        <span>스터디 선택</span>
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
        {datas &&
          datas.map(data => (
            <div
              className={style.cateGoryItem_E}
              key={data.id}
              onClick={() => selectHandle(data)}
            >
              <div className={style.subsProfsDiv}>
                <span>{data.categoryName}</span>
                <span className={style.DesText}>
                  {data.categoryDescription}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StudyPostExternalField;
