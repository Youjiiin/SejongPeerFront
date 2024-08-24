import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../../App';
import { toast } from 'sonner';
import styled from 'styled-components';
import { MainHeader } from '../../../components/headerRefactor/MainHeader';

import kakao from '../../../assets/image/kakao.png';
import honbobUse from '../../../assets/image/honbobUse.png';
import peerUse from '../../../assets/image/peerUse.png';
import buddyUse from '../../../assets/image/buddyUse.png';
import buddy_button from '../../../assets/image/buddy_button.png';
import honbobButton from '../../../assets/image/honbobButton.png';
import schoolBtn from '../../../assets/image/school.png';
import externalBtn from '../../../assets/image/external.png';

import { BuddyHandler, HonbobHandler } from './api';
import COLORS from 'theme';

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
    <Container>
      <MainHeader />
      <Wrapper>
        <SliderImage
          src={images[currentImageIndex]}
          onClick={() => onImageClick(currentImageIndex)}
          className={slideIn ? 'slide-in' : 'slide-out'}
        />
        <ButtonRow>
          <ActionButton
            src={buddy_button}
            onClick={() => BuddyHandler(navigate, setBuddyCount)}
          />
          <ActionButton
            src={honbobButton}
            onClick={() => HonbobHandler(navigate)}
          />
        </ButtonRow>
        {/* 세종 스터디 버튼 임시로 숨겨둠 - 축제 때문에 */}
        <FestButton>
          <StudyText>
            <Title>세종스터디</Title>
            <Subtitle>인생 팀원 구하기</Subtitle>
          </StudyText>
          <StudyContainer>
            <StudyButton
              onClick={() => StudyHandler('lecture')}
              src={schoolBtn}
            />
            <StudyButton
              onClick={() => StudyHandler('external_activity')}
              src={externalBtn}
            />
          </StudyContainer>
        </FestButton>
        <KakaoButton onClick={kakaoChat}>
          <KakaoImage src={kakao} alt="카카오톡 문의하기" />
          <KakaoText>카카오톡 문의하기</KakaoText>
        </KakaoButton>
      </Wrapper>
    </Container>
  );
};

export default MainPage;

const Container = styled.div`
  width: 100vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff7f7;

  @media (max-width: 768px) {
    /* height: 85vh; */
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2vh;
`;

const SliderImage = styled.img`
  width: 343px;
  height: 112px;
  flex-shrink: 0;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
    height: 112px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: 1vh;
  gap: 10px;
`;

const ActionButton = styled.img`
  width: 166px;
  height: auto;
  flex-shrink: 0;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 45vw;
    height: auto;
    flex-shrink: 0;
    cursor: pointer;
  }
`;

const FestButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  background-color: white;
  height: 204px;
  width: 343px;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  margin-top: 2vh;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    height: 204px;
    width: 100%;
    margin-top: 10px;
  }
`;

const StudyText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-left: 16px;
`;

const Title = styled.p`
  font-family: 'jalnan';
  margin: 16px 4px 4px 0px;
`;

const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 14px;
  margin: 16px 4px 4px 0px;
`;

const StudyContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 7px;
`;

const StudyButton = styled.img`
  width: 152px;
  height: 136px;
  background-image: url(${props => props.backgroundImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: white;
  border: none;
`;

const KakaoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  height: 5vh;
  font-size: 16px;
  border: none;
  padding: 10px;
  background-color: white;
  border-radius: 50px;
  /* border: 1px solid var(--line_02, #e5e5e5); */
`;

const KakaoImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const KakaoText = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: ${COLORS.font2};
`;
