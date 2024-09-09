import { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../../App';

//zustand
import useTimeTableStore from './useTimetableStore';
import useFilterStore from './useFilterStore';

import { fetchData } from '../studyPostWrite/studyPostField/api';
import { searchHandler } from './api';

import style from './Filter_Field.module.css';
import search from '../../../assets/image/search_gray.png';
import useStudyStore from './useStudyStore';

const Filter_Field2 = ({ deleteHandler }) => {
  const { setModalOpen } = useContext(MyContext);
  const { setPosts } = useStudyStore();

  const studyType = localStorage.getItem('studyType');

  const { setCategory } = useFilterStore();
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

  const selectHandle = async(data) => {
    setSubjectName(data.categoryName);
    setCategory(data.id);

    const { category, member, recruiting } = useFilterStore.getState();
    const filterValues = { category, member, recruiting };
    const result = await searchHandler(filterValues);
    setPosts(result[0].data);
    
    deleteHandler();
  };

  return (
    <div className={style.container}>
      <header className={style.header}>
        <span>스터디 선택</span>
      </header>
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

export default Filter_Field2;
