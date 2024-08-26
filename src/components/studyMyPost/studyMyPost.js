import React from 'react';
import styled from 'styled-components';
import COLORS from '../../theme';

import { useEffect, useState } from 'react';

import Popup from '../studyPopup/Popup';
import usePopupStroe from '../studyPopup/usePopupStore';
import useMypostStore from './myPostStore/useMypostStore';
import { fetchMyPost } from './api/fetchMyPost';
import { applicantSelection } from './api/applicantSelection';
import { earlyClose } from './api/earlyClose';

const StudyMyPost = () => {
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const [isLectures, setIsLectures] = useState(type || 'lecture');
  const [externals, setExternals] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [isEndBtnClick, setIsEndBtnClick] = useState(false);
  const { state } = useMypostStore();
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
  };
  useEffect(() => {}, [isEndBtnClick]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    setIsLectures(type || 'lecture');
  }, [state]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchMyPost();
        console.log(fetchedPosts);
        setExternals(fetchedPosts.external);
        setLectures(fetchedPosts.lecture);
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
    toast.info(`${msg}되었습니다`);
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
      {(isLectures === 'lecture' ? lectures : externals).map((post, index) => (
        <OuterBox key={index} status={post.recruitmentStatus}>
          <HeaderStyle>
            <Title status={post.recruitmentStatus}>
              {post.studyTitle}{' '}
              {post.recruitmentStatus === 'RECRUITING' ? (
                <ApplicantNum status={post.recruitmentStatus}>
                  {post.participantsCount}/{post.recruitmentCount}
                </ApplicantNum>
              ) : null}
            </Title>
            {post.recruitmentStatus === 'RECRUITING' ? (
              <HeaderBottom>
                <EndBtn
                  status={post.recruitmentStatus}
                  onClick={() => CancelHandle(post.studyId)}
                >
                  모집마감하기
                </EndBtn>
              </HeaderBottom>
            ) : (
              <HeaderBottom>
                <ApplicantNum status={post.recruitmentStatus}>
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
                      <ApplicantText>
                        {applicant.grade}학년{' '}
                        <ApplicantSpan>{applicant.nickname}</ApplicantSpan>
                      </ApplicantText>
                      <ApplicantText>{applicant.major}</ApplicantText>
                    </ApplicantInfo>
                    {applicant.studyMatchingStatus === 'ACCEPT' ||
                    applicant.studyMatchingStatus === 'REJECT' ? (
                      <MsgBox>
                        {applicant.studyMatchingStatus === 'ACCEPT'
                          ? '수락되었습니다.'
                          : '거절되었습니다.'}
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
  height: 87%;
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
  height: 9vh;
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
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  /* color: ${props => (props.status === 'RECRUITING' ? 'black' : 'gray')}; */
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
const HeaderBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ApplicantNum = styled.div`
  color: ${COLORS.main};
  font-size: ${props => (props.status === 'RECRUITING' ? '1.1rem' : '0.9rem')};
  font-weight: 600;
  width: ${props => (props.status === 'RECRUITING' ? '10%' : '30%')};
  display: flex;
  justify-content: ${props =>
    props.status === 'RECRUITING' ? 'flex-end' : 'flex-start'};
  @media (min-width: 768px) {
    font-size: ${props =>
      props.status === 'RECRUITING' ? '1.5rem' : '1.2rem'};
  }
`;
const EndBtn = styled.button`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  background-color: ${props =>
    props.status === 'RECRUITING' ? `${COLORS.back2}` : `${COLORS.back1}`};
  color: ${COLORS.font4};
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0;
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
  align-items: center;
`;
const ApplicantInfo = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  /* justify-content: flex-start; */
  flex-direction: column;
  gap: 1px;
  height: 42px;
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;
const ApplicantText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;
const ApplicantSpan = styled.span`
  font-weight: 700;
  font-size: 1rem;
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
  color: ${COLORS.font1};
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
  height: 30px;
  background-color: ${COLORS.main};
  border-radius: 32px;
  color: ${COLORS.back2};
  font-size: 0.9rem;
  padding-bottom: 2px;
`;

const RefuseBtn = styled.button`
  display: block;
  width: 55px;
  height: 30px;
  background-color: ${COLORS.back2};
  border-radius: 32px;
  border: 1px solid ${COLORS.line2};
  font-size: 0.9rem;
  padding-bottom: 2px;
`;
