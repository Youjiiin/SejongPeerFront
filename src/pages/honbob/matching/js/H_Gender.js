import { useState } from 'react';
import con from '../css/H_Container.module.css';
import btn2 from '../css/H_Btn2.module.css';

const H_Gender = props => {
  const [isSameClicked, setIsSameClicked] = useState(false);
  const [isDontCareClicked, setIsDontCareClicked] = useState(false);

  const clickSameBtnHandler = () => {
    setIsSameClicked(true);
    setIsDontCareClicked(false);
    const choiceGender = 'SAME';
    props.setChoiceGenderKorean('동성');
    props.sendChoiceGenderData(choiceGender);
  };

  const clickDontCareBtnHandler = () => {
    setIsSameClicked(false);
    setIsDontCareClicked(true);
    const choiceGender = 'NO_MATTER';
    props.setChoiceGenderKorean('상관없음');
    props.sendChoiceGenderData(choiceGender);
  };

  const clickSameBtnColor = isSameClicked ? btn2.clicked : btn2.selectBtn;
  const clickDontCareBtnColor = isDontCareClicked
    ? btn2.clicked
    : btn2.selectBtn;

  return (
    <div className={con.container}>
      <p className={con.title}>원하는 밥짝꿍 성별을 선택해주세요!</p>
      <div className={con.btnContainer}>
        <button className={clickSameBtnColor} onClick={clickSameBtnHandler}>
          동성
        </button>
        <button
          className={clickDontCareBtnColor}
          onClick={clickDontCareBtnHandler}
        >
          상관없음
        </button>
      </div>
      {/* <div className={con.fightImg}></div> */}
    </div>
  );
};

export default H_Gender;
