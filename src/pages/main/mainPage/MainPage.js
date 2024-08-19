import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../../App';
import { toast } from 'sonner';

import MainBuddy from './MainBuddy';
import MainHonbob from './MainHonbob';
import kakao from '../../../assets/image/kakao.png';

import honbobUse from '../../../assets/image/honbobUse.png';
import peerUse from '../../../assets/image/peerUse.png';
import buddyUse from '../../../assets/image/buddyUse.png';
import buddy_button from '../../../assets/image/buddy_button.png';
import honbobButton from '../../../assets/image/honbobButton.png';
import style from './MainPage.module.css';
import { BuddyHandler, HonbobHandler } from './api';

const images = [honbobUse, buddyUse, peerUse];

const MainPage = () => {
  localStorage.removeItem('studyType');
  const navigate = useNavigate();
  const { setBuddyCount } = useContext(MyContext);

  const StudyHandler = type => {
    localStorage.setItem('studyType', type);
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    if (refreshToken === null || accessToken === null) {
      toast.error('로그인 후 이용 가능한 서비스입니다!');
      navigate('/login');
    } else {
      navigate('/study');
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideIn, setSlideIn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIn(false);
      setTimeout(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        setSlideIn(true);
      }, 200);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const urls = [
    'https://sejonghonbab.simple.ink/', // 혼밥 이용방법
    'https://sejongbuddy.simple.ink/', // 세종버디 이용방법
    'https://sejongpeer.simple.ink/', // FAQ
  ];

  // 이미지 클릭 이벤트 핸들러, 인덱스에 해당하는 URL로 이동
  const onImageClick = index => {
    const url = urls[index];
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
      script.onload = () => {
        const key = process.env.REACT_APP_KAKAO_KEY;
        window.Kakao.init(key);
      };
      document.head.appendChild(script);
    }
  }, []);

  const kakaoChat = () => {
    if (window.Kakao) {
      window.Kakao.Channel.chat({
        channelPublicId: '_AgxobG', // 여기에 채널의 고유 ID를 입력하세요.
      });
    }
  };

  return (
    <div className={style.container}>
      <div
        style={{
          padding: '2vh',
        }}
        className={style.wrapper}
      >
        <img
          className={style.useImg}
          src={images[currentImageIndex]}
          onClick={() => onImageClick(currentImageIndex)}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '4%',
            marginTop: '1vh',
          }}
        >
          <img
            src={buddy_button}
            className={style.btn1}
            onClick={() => BuddyHandler(navigate, setBuddyCount)}
          />
          <img
            src={honbobButton}
            className={style.btn1}
            onClick={() => HonbobHandler(navigate)}
          />
        </div>
        {/* 세종 스터디 버튼 임시로 숨겨둠 - 축제 때문에 */}
        <div className={style.festButton}>
          <div className={style.studyText}>
            <h3 className={style.title}>세종스터디</h3>
            <p className={style.title} style={{ fontFamily: 'Pretendard' }}>
              인생 팀원 구하기
            </p>
          </div>
          <div className={style.studyContainer}>
            <button
              className={style.school}
              onClick={() => StudyHandler('lecture')}
            ></button>
            <button
              className={style.except}
              onClick={() => StudyHandler('external_activity')}
            ></button>
          </div>
        </div>
        <button
          className={style.kakao}
          onClick={kakaoChat}
          style={{ gap: '10px' }}
        >
          <img src={kakao} alt="카카오톡 문의하기" />
          카카오톡 문의하기
        </button>
      </div>
    </div>
  );
};

export default MainPage;
