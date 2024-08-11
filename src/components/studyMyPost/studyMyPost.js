import React from 'react';
import styled from 'styled-components';
import COLORS from '../../theme';

import { useEffect, useState } from 'react';

import Popup from '../studyPopup/Popup';
import usePopupStroe from '../studyPopup/usePopupStore';

import { fetchMyPost } from './api/fetchMyPost';
import { applicantSelection } from './api/applicantSelection';
import { earlyClose } from './api/earlyClose';

const StudyMyPost = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [isEndBtnClick, setIsEndBtnClick] = useState(false);

  const {
    isPopupVisible,
    popupMessage,
    popupTitle,
    setPopupVisible,
    setPopupMessage,
    setPopupTitle,
  } = usePopupStroe();

  const togglePopup = ({ message, title }) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(!isPopupVisible);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setIsEndBtnClick(false);
    console.log('팝업 닫힘');
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchMyPost();
        console.log(fetchedPosts);
        setMyPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    loadPosts();
  }, []);

  const AcceptHandle = async (studyId, nickname, value) => {
    const patchData = {
      studyId: studyId,
      applicantNickname: nickname,
      isAccept: value,
    };
    try {
      const response = await applicantSelection(patchData);
      console.log('Response:', response);
    } catch (error) {
      console.log(error);
    }
    const msg = value === true ? '수락' : '거절';
    alert(`${msg}되었습니다`);
  };
  const CancelHandle = async studyId => {
    try {
      const response = await earlyClose(studyId);
      console.log('Response:', response);
      setIsEndBtnClick(true);
      const popUpData = {
        title: '스터디 마감 완료',
        message: '수락한 지원자들에겐 오픈채팅방 링크가 전달됩니다.',
      };
      togglePopup(popUpData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      {myPosts.map((post, index) => (
        <OuterBox key={index} status={post.recruitmentStatus}>
          <HeaderStyle>
            <Title status={post.recruitmentStatus}>{post.studyTitle}</Title>
            {post.recruitmentStatus === 'RECRUITING' ? (
              <HeaderBottom>
                <ApplicantNum>
                  수락: {post.participantsCount}명 / 정원:{' '}
                  {post.recruitmentCount}명
                </ApplicantNum>

                <EndBtn
                  status={post.recruitmentStatus}
                  onClick={() => CancelHandle(post.studyId)}
                >
                  모집마감하기
                </EndBtn>
              </HeaderBottom>
            ) : (
              <HeaderBottom>
                <ApplicantNum>
                  지원인원: {post.participantsCount}명
                </ApplicantNum>

                <EndBtn status={post.recruitmentStatus}>모집완료</EndBtn>
              </HeaderBottom>
            )}
          </HeaderStyle>

          {post.applicants.length > 0 &&
            post.recruitmentStatus === 'RECRUITING' && (
              <BottomStyle>
                {post.applicants.map((applicant, appIndex) => (
                  <ApplicantBox key={appIndex}>
                    <ApplicantInfo>
                      {applicant.major} {applicant.grade}학년
                    </ApplicantInfo>
                    {applicant.studyMatchingStatus === '수락' ||
                    applicant.studyMatchingStatus === '거절' ? (
                      <MsgBox>
                        {applicant.studyMatchingStatus}되었습니다.
                      </MsgBox>
                    ) : (
                      <BtnBox>
                        <AcceptBtn
                          onClick={() =>
                            AcceptHandle(post.studyId, applicant.nickname, true)
                          }
                        >
                          수락
                        </AcceptBtn>
                        <RefuseBtn
                          onClick={() =>
                            AcceptHandle(
                              post.studyId,
                              applicant.nickname,
                              false
                            )
                          }
                        >
                          거절
                        </RefuseBtn>
                      </BtnBox>
                    )}
                  </ApplicantBox>
                ))}
              </BottomStyle>
            )}
        </OuterBox>
      ))}
      {isEndBtnClick && (
        <Popup title={popupTitle} message={popupMessage} onClose={closePopup} />
      )}
    </Container>
  );
};
export default StudyMyPost;

const Container = styled.div`
  overflow: auto;
  width: 100%;
  height: 84%;
  background-color: #fbe4e4;
  display: flex;
  flex-direction: column;
  gap: 0.8%;
`;

const OuterBox = styled.div`
  background-color: ${props =>
    props.status === 'RECRUITING' ? `${COLORS.back2}` : `${COLORS.back1}`};
`;
const HeaderStyle = styled.div`
  height: 10vh;
  padding: 15px;
  display: flex;
  flex-direction: column;

  justify-content: center;
  gap: 15%;
  border-bottom: 1px solid ${COLORS.line2};
  @media (min-width: 768px) {
    height: 9vh;
    gap: 15%;
  }
`;
const Title = styled.p`
  width: 100%;
  height: 20px;
  margin: 0 0 3px 0;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 700;
  /* color: ${props => (props.status === 'RECRUITING' ? 'black' : 'gray')}; */
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
const HeaderBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ApplicantNum = styled.span`
  color: ${COLORS.main};
  font-size: 0.9rem;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;
const EndBtn = styled.button`
  /* background-color: ${COLORS.back2}; */
  background-color: ${props =>
    props.status === 'RECRUITING' ? `${COLORS.back2}` : `${COLORS.back1}`};
  color: ${COLORS.font4};
  font-size: 0.9rem;
  font-weight: 500;
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BottomStyle = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ApplicantBox = styled.div`
  height: 35px;
  display: flex;
  justify-content: space-between;
`;
const ApplicantInfo = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;
const BtnBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 125px;
  gap: 2%;
`;
const MsgBox = styled.button`
  background-color: ${COLORS.back2};
  color: ${COLORS.font4};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AcceptBtn = styled.button`
  display: block;
  width: 55px;
  height: 35px;
  background-color: ${COLORS.main};
  border-radius: 32px;
  color: ${COLORS.back2};
  font-size: 1rem;
`;

const RefuseBtn = styled.button`
  display: block;
  width: 55px;
  height: 35px;
  background-color: ${COLORS.back2};
  border-radius: 32px;
  border: 1px solid ${COLORS.line2};
  font-size: 1rem;
`;
