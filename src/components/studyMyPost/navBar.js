import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import COLORS from 'theme';

import useMypostStore from './myPostStore/useMypostStore';
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const [activeBtn, setActiveBtn] = useState(type || 'lecture');

  const { state, setState } = useMypostStore();
  const handleClick = type => {
    setActiveBtn(type);
    setState(!state);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('type', type);
    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  };

  return (
    <Container>
      <Btn
        onClick={() => handleClick('lecture')}
        isActive={activeBtn === 'lecture'}
      >
        학교 수업 스터디
      </Btn>
      <Btn
        onClick={() => handleClick('external')}
        isActive={activeBtn === 'external'}
      >
        수업 외 활동
      </Btn>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-around;
  position: relative;
  border-bottom: 1px solid ${COLORS.line2};
`;

const Btn = styled.button`
  width: 50%;
  background-color: ${COLORS.back2};
  font-size: 1rem;
  font-weight: ${props => (props.isActive ? '600' : '400')};
  position: relative;
  border: none;
  cursor: pointer;
  color: ${COLORS.font1};

  &::after {
    content: '';
    display: ${props => (props.isActive ? 'block' : 'none')};
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 25%;
    height: 5px;
    transform: translateX(-50%);
    background-color: ${COLORS.font1};
  }
  @media (min-width: 768px) {
    font-size: 1.3rem;
    &::after {
      width: 20%;
      height: 7px;
    }
  }
`;

export default NavBar;
