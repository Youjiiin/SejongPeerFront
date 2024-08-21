import { useState, useContext } from 'react';
import { MyContext } from '../../../App';

//zustand
import useTimeTableStore from '../../study/timeTable/useTimeTableStore';
import useFilterStore from './useFilterStore';
import getTimeTable from '../../study/timeTable/getTimeTable';

import style from './Filter_Field.module.css';
import search from '../../../assets/image/search_gray.png';

const Filter_Field = () => {
    const { tableInfos, setTableInfos, showData, setShowData, setSubjectName } = useTimeTableStore();
    const { setCategory } = useFilterStore();
    const [selectingState, setSelectingState] = useState('college');

    //모달 닫기
    const { modalOpen, setModalOpen } = useContext(MyContext);
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
            setModalOpen(null);
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

export default Filter_Field;
