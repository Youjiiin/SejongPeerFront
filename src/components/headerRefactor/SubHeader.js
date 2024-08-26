import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import COLORS from 'theme';

import backArrow from '../../assets/image/backArrow.png';
import user from '../../assets/image/user.png';

export const SubHeader = ({ text }) => {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (token) {
      navigate('/my-page'); // 유저 아이콘 클릭 시 /my-page로 이동
    } else {
      navigate('/login'); // 로그인 텍스트 클릭 시 /login-page로 이동
    }
  };

  const handleGoBack = () => {
    navigate(-1); // 뒤로 가기
  };

  return (
    <Container>
      <Container2>
        <GoBack src={backArrow} onClick={handleGoBack} alt="Go Back" />
        <Text>{text}</Text>
      </Container2>
      <Login src={user} onClick={handleUserClick} alt="User Icon" />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 48px;
  background-color: ${COLORS.main};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const Container2 = styled.div`
  width: 85%;
  display: flex;
  gap: 4px;
  align-items: flex-end;
`;

const GoBack = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Text = styled.p`
  font-family: 'jalnan';
  font-size: 18px;
  color: white;
  margin: 0px;
`;

const Login = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
