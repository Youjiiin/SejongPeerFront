import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import COLORS from 'theme';

import backArrow from '../../assets/image/backArrow.png';
import user from '../../assets/image/user.png';
import searchWhite from 'assets/image/searchWhite.png';

export const SubHeader = ({ text, customBackLink }) => {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserClick = () => {
    if (token) {
      navigate('/mypage'); // 유저 아이콘 클릭 시 /mypage로 이동
    } else {
      navigate('/login'); // 로그인 텍스트 클릭 시 /login으로 이동
    }
  };

  const handleGoBack = () => {
    // 커스텀 링크가 제공된 경우 해당 링크로 이동
    if (customBackLink) {
      navigate(customBackLink);
    } else if (location.state?.from) {
      // location.state에 이전 페이지 정보가 있는 경우 해당 경로로 이동
      navigate(-1);
    } else {
      // 기본적으로 홈으로 이동하거나 다른 기본 경로 설정 가능
      navigate('/');
    }
  };

  return (
    <Container>
      <Container2>
        <GoBack src={backArrow} onClick={handleGoBack} alt="Go Back" />
        <Text>{text}</Text>
      </Container2>
      <RightContainer>
        <Login src={user} onClick={handleUserClick} alt="User Icon" />
      </RightContainer>
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

const RightContainer = styled.div`
  display: flex;
  gap: 10px;
`;
const Search = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
