import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../../App';
import useFilterStore from './useFilterStore';

import style from './Filter_now.module.css';
import check from '../../../assets/image/check.png';

const Filter_now = props => {
  const { setModalOpen } = useContext(MyContext);
  const [isNowCheck, SetIsNowCheck] = useState(false);
  const [isFinishCheck, SetIsFinishNowCheck] = useState(false);
  
  const checkNowHandler = () => {
    SetIsNowCheck(true);
    SetIsFinishNowCheck(false);
  };
  const checkFinishHandler = () => {
    SetIsNowCheck(false);
    SetIsFinishNowCheck(true);
  };
  
  const { setRecruiting } = useFilterStore();
  const onSubmitHandler = () => {
    if (isNowCheck) {
      setRecruiting(true);
    } else {
      setRecruiting(false);
    }

    setModalOpen(false);
    props.deleteHandler();
  };

  const finishBtn = isNowCheck || isFinishCheck ? style.finish : style.finish_n;

  return (
    <div className={style.container}>
      <header className={style.header}>
        <span>모집여부</span>
      </header>
      <div className={style.filter_wrapper}>
        <div className={style.filter_check_wrapper}>
          <p>모집 중</p>
          <div onClick={checkNowHandler}>
            {isNowCheck && (
              <img className={style.check} src={check} alt="check" />
            )}
          </div>
        </div>
        <div className={style.filter_check_wrapper}>
          <p>모집 마감</p>
          <div onClick={checkFinishHandler}>
            {isFinishCheck && (
              <img className={style.check} src={check} alt="check" />
            )}
          </div>
        </div>
      </div>
      <button
        className={finishBtn}
        onClick={onSubmitHandler}
        disabled={!isNowCheck && !isFinishCheck}
      >
        <span>확인</span>
      </button>
    </div>
  );
};

export default Filter_now;
