import { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../../../App.js';
import { useNavigate } from 'react-router-dom';

import H_Gender from './H_Gender.js';
import H_Menu from './H_Menu.js';
import H_informCheck from './H_InformCheck.js';
import ProgressBar from '../../progressBar/ProgressBar_Honbob.js';

import style from '../css/Honbob_Matching.module.css';
import { toast } from 'sonner';
import { SubHeader } from '../../../../components/headerRefactor/SubHeader.js';

const Honbob_Matching = () => {
  const [slide, setSlide] = useState(0);
  const [choiceGenderHonbob, setChoiceGender] = useState('');
  const [choiceGenderKorean, setChoiceGenderKorean] = useState('');
  const [choiceMenu, setChoiceMenu] = useState('');
  const [choiceMenuKorean, setChoiceMenuKorean] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId === null) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [userId]);

  // 화면 넘기기 (다음 / 이전)

  // 화면 넓이 설정
  const [width, setWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      let wrapperWidth = width;
      if (window.innerWidth < 415) {
        wrapperWidth = window.innerWidth;
      } else {
        wrapperWidth = 414;
      }
      setWidth(wrapperWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  const mediaWidth = {
    width: width,
  };

  //다음
  const MoveNext = () => {
    setSlide(slide + 1);
    if (slide >= 3) {
      setSlide(2);
    }
  };

  //이전
  const MoveBefore = () => {
    setSlide(slide - 1);
    if (slide <= 0) {
      setSlide(0);
    }
  };

  const slideMove = page => {
    setSlide(page);
  };

  // 슬라이드별 이동
  const Slide = {
    transform: 'translateX(' + -width * slide + 'px)',
  };

  //사용자가 입력한 정보

  const GenderChoiceData = choiceGenderHonbob => {
    setChoiceGender(choiceGenderHonbob);
  };
  const menuChoiceData = choiceMenu => {
    setChoiceMenu(choiceMenu);
  };

  const { honbobSubmit, setHonbobSubmit } = useContext(MyContext);

  let sameGender = {};

  if (choiceGenderHonbob === '동성') {
    sameGender = 'true';
  } else {
    sameGender = 'false';
  }

  //수정->alert?
  let kakaoId = isLoggedIn ? localStorage.getItem('kakaoId') : null;
  let phoneNumber = isLoggedIn ? localStorage.getItem('phoneNum') : null;

  const honbobSubmitHandler = async e => {
    let matchingInfo = {
      genderOption: choiceGenderHonbob,
      menuCategoryOption: choiceMenu,
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/honbab/register',
        {
          method: 'POST',
          body: JSON.stringify(matchingInfo),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );

      const data = await response.json(); // data 변수를 await로 초기화

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('제출 성공');
      setHonbobSubmit(false);
      navigate('/honbob/waiting');
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (honbobSubmit === true && slide === 2) {
      honbobSubmitHandler();
    }
  }, [honbobSubmit]);

  return (
    <div className={style.wrapper} style={mediaWidth}>
      <SubHeader text="혼밥탈출" customBackLink="/honbob/start1" />
      <div className={style.formWrapper} style={Slide}>
        <H_Gender
          sendChoiceGenderData={GenderChoiceData}
          setChoiceGenderKorean={setChoiceGenderKorean}
        />
        <H_Menu
          setChoiceMenu={setChoiceMenu}
          setChoiceMenuKorean={setChoiceMenuKorean}
        />
        <H_informCheck
          choiceMenuKorean={choiceMenuKorean}
          choiceGenderKorean={choiceGenderKorean}
        />
      </div>
      <div className={style.barWrapper}>
        <ProgressBar
          moveNext={MoveNext}
          moveBefore={MoveBefore}
          slide={slide}
          setSlide={setSlide}
          choiceGenderHonbob={choiceGenderHonbob}
          choiceMenu={choiceMenu}
          slideMove={slideMove}
        />
      </div>
    </div>
  );
};

export default Honbob_Matching;
