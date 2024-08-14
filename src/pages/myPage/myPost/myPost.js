import React from 'react';
import styled from 'styled-components';
import StudyMyPost from '../../../components/studyMyPost/studyMyPost';
import NavBar from '../../../components/studyMyPost/navBar';
import COLORS from '../../../theme';
import { useState } from 'react';
const MyPost = () => {
  return (
    <Container>
      <InnerContainer>
        <NavBar />
        <Notice>
          *모집마감 버튼을 누르면 인원 수와 상관없이 모집이 마감됩니다.
        </Notice>
        <StudyMyPost />
      </InnerContainer>
    </Container>
  );
};

export default MyPost;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: ${COLORS.back2};
`;

const InnerContainer = styled.div`
  width: 100vw;
  background-color: #fbe4e4;
  margin-top: 7vh;
  @media (min-width: 768px) {
    width: 674px;
    margin-top: 8vh;
  }
`;

const Notice = styled.div`
  background-color: white;
  width: 100%;
  height: 6%;
  /* margin-top: 7vh; */
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;
