import { useState } from 'react';

import check from '../../../../assets/image/check.png';
import buddyImg4 from '../../../../assets/image/buddyImg4.png';
import con from '../css/B_Container.module.css';
import btn3 from '../css/B_Btn3.module.css';

const Grade = props => {
  const [isSeniorClicked, setIsSeniorClicked] = useState(false);
  const [isJuniorClicked, setIsJuniorClicked] = useState(false);
  const [isMateClicked, setIsMateClicked] = useState(false);
  const [isAnyClicked, setIsAnyClicked] = useState(false);

  const clickSeniorBtnHandler = () => {
    setIsSeniorClicked(true);
    setIsJuniorClicked(false);
    setIsMateClicked(false);
    setIsAnyClicked(false);

    const grade = '선배';
    props.sendGradeData(grade);
  };

  const clickJuniorBtnHandler = () => {
    setIsSeniorClicked(false);
    setIsJuniorClicked(true);
    setIsMateClicked(false);
    setIsAnyClicked(false);

    const grade = '후배';
    props.sendGradeData(grade);
  };
  const clickMateBtnHandler = () => {
    setIsSeniorClicked(false);
    setIsJuniorClicked(false);
    setIsMateClicked(true);
    setIsAnyClicked(false);

    const grade = '동기';
    props.sendGradeData(grade);
  };

  const clickAnyBtnHandler = () => {
    setIsSeniorClicked(false);
    setIsJuniorClicked(false);
    setIsMateClicked(false);
    setIsAnyClicked(true);

    const grade = '상관없음';
    props.sendGradeData(grade);
  };

  const clickSeniorBtnColor = isSeniorClicked ? btn3.clicked : btn3.selectBtn3;
  const clickJuniorBtnColor = isJuniorClicked ? btn3.clicked : btn3.selectBtn3;
  const clickMateBtnColor = isMateClicked ? btn3.clicked : btn3.selectBtn3;
  const clickAnyBtnColor = isAnyClicked ? btn3.clicked : btn3.selectBtn3;

  return (
    <div className={con.container}>
      <div className={con.title_box}>
        <p className={con.title2}>(학번기준)</p>
        <p className={con.title}>선/후배/동기 중 원하는 조건을 선택하세요.</p>
      </div>
      <div className={con.btn3}>
        <button className={clickSeniorBtnColor} onClick={clickSeniorBtnHandler}>
          <span>선배</span>
          {isSeniorClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
        <button className={clickJuniorBtnColor} onClick={clickJuniorBtnHandler}>
          <span>후배</span>
          {isJuniorClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
        <button className={clickMateBtnColor} onClick={clickMateBtnHandler}>
          <span>동기</span>
          {isMateClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
        <button className={clickAnyBtnColor} onClick={clickAnyBtnHandler}>
          <span>상관없음</span>
          {isAnyClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
      </div>

      <img
        style={{ width: '231px', height: '164px', marginTop: '18px' }}
        src={buddyImg4}
        alt="buddyImg4"
      />
    </div>
  );
};

export default Grade;
