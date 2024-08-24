import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import buddyStart1 from '../../../assets/image/buddyStart1.png';
import style from './BuddyStart.module.css';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

const BuddyStart1 = () => {
  const [countBuddy, setCountBuddy] = useState(0);
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      countBuddyHandler();
    }
  }, []);

  const BuddyHandler = () => {
    navigate('/buddy/start2');
  };
  const infoHandler = () => {
    window.open('https://sejongbuddy.simple.ink/', '_blank');
  };

  const countBuddyHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/buddy/active-count',
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setCountBuddy(data.data.count);

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <SubHeader text="세종버디" />
      <div className={style.container}>
        {/* <SubHeader /> */}
        <div className={style.top}>
          <div className={style.inform_con}>
            <button onClick={infoHandler} className={style.informBtn}>
              <p>이용방법 확인</p>
              <div className={style.informImg}></div>
            </button>
          </div>

          <img className={style.buddyImg} src={buddyStart1} alt="buddyStart1" />
          <p className={style.explain}>캠퍼스 짝꿍이 필요할 땐?</p>
          <p className={style.sejongbuddy}>세종버디</p>
        </div>

        <div className={style.bottom}>
          <p className={style.text}>
            {countBuddy}명의 학생들이 버디를 찾고 있어요
          </p>
          <button onClick={BuddyHandler} className={style.btn1}>
            세종버디 신청하기
          </button>
        </div>
      </div>
    </>
  );
};

export default BuddyStart1;
