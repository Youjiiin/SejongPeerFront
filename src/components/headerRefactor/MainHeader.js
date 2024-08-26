import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import COLORS from 'theme';

import logo from '../../assets/image/peerLogo.png';
import userIcon from '../../assets/image/user.png';

export const MainHeader = () => {
  const token = localStorage.getItem('accessToken'); // localStorage에서 토큰 가져오기
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (token) {
      navigate('/mypage'); // 유저 아이콘 클릭 시 /my-page로 이동
    } else {
      navigate('/login'); // 로그인 텍스트 클릭 시 /login-page로 이동
    }
  };

  return (
    <Container>
      <Container2>
        <Logo src={logo} alt="Logo" />
        {token ? (
          <UserIcon src={userIcon} alt="User Icon" onClick={handleLoginClick} />
        ) : (
          <Login onClick={handleLoginClick}>로그인</Login>
        )}
      </Container2>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 48px;
  background-color: ${COLORS.main};
  display: flex;
  justify-content: center;
`;

const Container2 = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.img`
  width: 86px;
  height: 20px;
`;

const Login = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
`;

const UserIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
