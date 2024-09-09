import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../../App';

import BuddyInfoBox from './BuddyInfoBox';

import buddySucces from '../../../assets/image/buddySuccess.png';
import prev from '../../../assets/image/back_gray.png';
import next from '../../../assets/image/next_gray.png';
import style from './BuddySuccess.module.css';
import { SubHeader } from 'components/headerRefactor/SubHeader';

const BuddySuccess = () => {
  const [major, setMajor] = useState('');
  const [grade, setGrade] = useState('');
  const [name, setName] = useState('');
  const [kakao, setKakao] = useState('');

  const [major2, setMajor2] = useState('');
  const [grade2, setGrade2] = useState('');
  const [name2, setName2] = useState('아직 매칭된 버디가 없습니다.');
  const [kakao2, setKakao2] = useState('');

  const [major3, setMajor3] = useState('');
  const [grade3, setGrade3] = useState('');
  const [name3, setName3] = useState('아직 매칭된 버디가 없습니다.');
  const [kakao3, setKakao3] = useState('');

  const [slide, setSlide] = useState(0);
  const isFirstRender = useRef(true);
  const navigate = useNavigate();
  const { buddyCount } = useContext(MyContext);

  const goHome = () => {
    navigate('/main');
  };

  const restart = () => {
    navigate('/buddy/matching');
  };

  const MoveNext = () => {
    setSlide(prevSlide => {
      if (prevSlide >= 2) {
        return 2;
      } else {
        return prevSlide + 1;
      }
    });
  };

  // 이전
  const MoveBefore = () => {
    setSlide(prevSlide => {
      if (prevSlide <= 0) {
        return 0;
      } else {
        return prevSlide - 1;
      }
    });
  };

  const Slide = {
    transform: 'translateX(' + -33.33 * slide + '%)',
  };

  //상태변환
  useEffect(() => {
    if (isFirstRender.current) {
      getBuddyInfoHandler();
    }
  }, []);

  const getBuddyInfoHandler = () => {
    fetch(
      process.env.REACT_APP_BACK_SERVER + '/buddy/matched-partner/details',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Refresh-Token': localStorage.getItem('refreshToken'),
        },
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMajor(data.data[0].collegeMajor);
        setGrade(data.data[0].grade);
        setName(data.data[0].name);
        setKakao(data.data[0].kakaoAccount);

        setMajor2(data.data[1].collegeMajor);
        setGrade2(data.data[1].grade);
        setName2(data.data[1].name);
        setKakao2(data.data[1].kakaoAccount);

        setMajor3(data.data[2].collegeMajor);
        setGrade3(data.data[2].grade);
        setName3(data.data[2].name);
        setKakao3(data.data[2].kakaoAccount);
      })
      .catch(error => console.log(error));
  };
  console.log(buddyCount);

  return (
    <div className={style.container}>
      <SubHeader text="세종버디" customBackLink="/main" />
      <p className={style.title}>버디를 찾았습니다!</p>
      <img className={style.buddy_succes} src={buddySucces} alt="buddySucces" />

      <div className={style.info_container}>
        <img src={prev} className={style.prev} onClick={MoveBefore} />
        <img src={next} className={style.next} onClick={MoveNext} />
        <div className={style.inner_container} style={Slide}>
          <BuddyInfoBox major={major} grade={grade} name={name} kakao={kakao} />

          <BuddyInfoBox
            major={major2}
            grade={grade2}
            name={name2}
            kakao={kakao2}
          />

          <BuddyInfoBox
            major={major3}
            grade={grade3}
            name={name3}
            kakao={kakao3}
          />
        </div>
      </div>
      <p className={style.tip}>*옆으로 넘겨 다른 버디를 확인해주세요</p>
      <button onClick={goHome} className={style.go_home}>
        홈페이지로 이동
      </button>
      {buddyCount < 3 ? (
        <button className={style.cancelBtn} onClick={restart}>
          새로운 버디 찾기! (최대 3명)
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BuddySuccess;
