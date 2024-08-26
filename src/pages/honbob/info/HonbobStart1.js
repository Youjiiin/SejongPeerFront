import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import style from './HonbobStart.module.css';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

const HonbobStart1 = () => {
  const [countHonbab, setCountHonbab] = useState(0);
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      countHonbabHandler();
    }
  }, []);

  const HonbobHandler = async () => {
    navigate('/honbob/matching');
  };

  const infoHandler = () => {
    window.open('https://sejonghonbab.simple.ink/', '_blank');
  };

  const countHonbabHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/honbab/active-count',
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setCountHonbab(data.data.count);

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    countHonbabHandler();
  }, []);

  return (
    <div className={style.Container}>
      <SubHeader text="혼밥탈출" />
      <div className={style.InnerContainer}>
        <div className={style.top}>
          <button onClick={infoHandler} className={style.informBtn}>
            이용방법 확인 <div className={style.informImg}></div>
          </button>
        </div>
        <div className={style.middle}>
          <div className={style.honbobLogo}></div>
          <div className={style.informContext}>
            <div className={style.context1}>
              '혼축탈출'는 대동제 기간(5월 29일~5월 31일)동안
            </div>
            <div className={style.context1}>
              <b>함께 다닐 수 있는 학우를 구할 수 있는 프로그램입니다.</b>
            </div>
          </div>
          <div className={style.findContext}>
            <div className={style.raccoon}></div>{' '}
            <div>
              <b>
                <span style={{ fontWeight: '700' }}>{countHonbab}</span>명의
                학생들이 대동지를 찾고있어요!
              </b>
            </div>
          </div>
          <button className={style.submitBtn} onClick={HonbobHandler}>
            혼축탈출 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HonbobStart1;
