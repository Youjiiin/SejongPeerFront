import { useState } from 'react';

import check from '../../../../assets/image/check.png';
import buddyImg5 from '../../../../assets/image/buddyImg5.png';
import btn3 from '../css/B_Btn3.module.css';
import con from '../css/B_Container.module.css';

const GradeDiff = props => {
  const [firstClicked, setFirstClicked] = useState(false);
  const [secondClicked, setSecondClicked] = useState(false);
  const [thirdClicked, setThirdClicked] = useState(false);
  const [fourthClicked, setFourthClicked] = useState(false);
  const [anyClicked, setAnyClicked] = useState(false);

  const click1BtnHandler = () => {
    setFirstClicked(true);
    setSecondClicked(false);
    setThirdClicked(false);
    setFourthClicked(false);
    setAnyClicked(false);
    props.sendGradeDiffData('1');
  };
  const click2BtnHandler = () => {
    setFirstClicked(false);
    setSecondClicked(true);
    setThirdClicked(false);
    setFourthClicked(false);
    setAnyClicked(false);
    props.sendGradeDiffData('2');
  };
  const click3BtnHandler = () => {
    setFirstClicked(false);
    setSecondClicked(false);
    setThirdClicked(true);
    setFourthClicked(false);
    setAnyClicked(false);
    props.sendGradeDiffData('3');
  };
  const click4BtnHandler = () => {
    setFirstClicked(false);
    setSecondClicked(false);
    setThirdClicked(false);
    setFourthClicked(true);
    setAnyClicked(false);
    props.sendGradeDiffData('4');
  };
  const click5BtnHandler = () => {
    setFirstClicked(false);
    setSecondClicked(false);
    setThirdClicked(false);
    setFourthClicked(false);
    setAnyClicked(true);
    props.sendGradeDiffData('상관없음');
  };

  const clickFirstBtnColor = firstClicked ? btn3.clicked : btn3.selectBtn3;
  const clickSecondBtnColor = secondClicked ? btn3.clicked : btn3.selectBtn3;
  const clickThirdBtnColor = thirdClicked ? btn3.clicked : btn3.selectBtn3;
  const clickFourthBtnColor = fourthClicked ? btn3.clicked : btn3.selectBtn3;
  const clickAnyBtnColor = anyClicked ? btn3.clicked : btn3.selectBtn3;

  return (
    <div className={con.container}>
      <p className={con.title}>원하는 버디의 학년을 선택하세요</p>
      <div className={con.btn3}>
        <button className={clickFirstBtnColor} onClick={click1BtnHandler}>
          <span>1학년</span>
          {firstClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
        <button className={clickSecondBtnColor} onClick={click2BtnHandler}>
          <span>2학년</span>
          {secondClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
        <button className={clickThirdBtnColor} onClick={click3BtnHandler}>
          <span>3학년</span>
          {thirdClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
        <button className={clickFourthBtnColor} onClick={click4BtnHandler}>
          <span>4학년</span>
          {fourthClicked && (
            <img className={btn3.check} src={check} alt="check" />
          )}
        </button>
        <button className={clickAnyBtnColor} onClick={click5BtnHandler}>
          <span>상관없음</span>
          {anyClicked && <img className={btn3.check} src={check} alt="check" />}
        </button>
      </div>
      <img
        style={{ width: '203px', height: '100px', marginTop: '14px' }}
        src={buddyImg5}
        alt="buddyImg3"
      />
    </div>
  );
};

export default GradeDiff;
