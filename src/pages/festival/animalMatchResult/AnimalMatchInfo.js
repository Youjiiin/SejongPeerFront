import { useState } from 'react';
import { useNavigate, useContext } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const LocalGlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'jalnan2';
    src: url('../../../');
  }
  
  body {
    font-family: 'jalnan', sans-serif;
  }
`;

const AnimalMatchInfo = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const navigate = useNavigate();

  const handleMeetingStart = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_FEST_SERVER}/user/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phoneNumber }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // console.log(data.data.id);
      localStorage.setItem('userId', data.data.id);
      localStorage.setItem('gender', data.data.gender);
      toast.info('매칭 결과페이지로 이동합니다!');
      navigate('/fest/AnimalMatchResult');
    } else {
      console.error('Error:', response.statusText);
      toast.error('아직 매칭되지 않았습니다!');
    }
  };

  return (
    <EntireContainer>
      <Container>
        <Title>미팅 정보 입력</Title>
        <Box>
          <Input
            placeholder="이름입력"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Box>
        <Box>
          <Input
            placeholder="전화번호입력"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
        </Box>
        <MeetingStart onClick={handleMeetingStart}>미팅 결과 확인</MeetingStart>
      </Container>
    </EntireContainer>
  );
};
export default AnimalMatchInfo;

const EntireContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10vh;
`;

const Title = styled.h2`
  overflow: hidden;
  color: var(--Font-02_black, #111);
  text-align: center;
  text-overflow: ellipsis;
  font-family: 'jalnan';
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
  letter-spacing: -0.5px;
  margin: 20px 0 40px 0;
`;

const MeetingStart = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 311px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 26px;
  background: #ff4b4b;
  color: white;
  color: var(--Font-01_White, #fff);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px; /* 144.444% */
  letter-spacing: -0.45px;
  margin-top: 20px;
  cursor: pointer;
`;

const Box = styled.div`
  height: 52px;
  border-radius: 35px;
  padding: 24px;
  background-color: #ffffff;
  border-color: #e5e5e5;
  font-size: 16px;
  display: flex;
  width: 311px;
  padding: 14px 20px;
  border-radius: 100px;
  border: 1px solid #c5c5c5;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
`;
