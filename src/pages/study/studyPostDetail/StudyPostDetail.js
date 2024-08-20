import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import Popup from '../../../components/studyPopup/Popup';
import styled from 'styled-components';
import useStore from './useStore';
import usePopupStroe from '../../../components/studyPopup/usePopupStore';
import COLORS from '../../../theme';
import heart from '../../../assets/image/heart_postdetail.svg';
import filledHeart from '../../../assets/image/filledHeart.svg';
import more from '../../../assets/image/more.png';

import {
  fetchStudyData,
  applyForStudy,
  cancelStudyApplication,
  toggleScrap,
  fetchScrapCount,
  deletePostHandler,
} from './api';

const StudyListPostDetail = () => {
  const {
    studyData,
    isApplied,
    isScrapped,
    scrapCount,
    setStudyData,
    setApplied,
    setScrapped,
    setScrapCount,
  } = useStore();
  const {
    isPopupVisible,
    popupMessage,
    popupTitle,
    setPopupVisible,
    setPopupMessage,
    setPopupTitle,
  } = usePopupStroe();

  const { studyId } = useParams();

  const navigate = useNavigate();
  const modifyHandler = () => {
    navigate(`/study/modify/${studyId}`);
  };

  const deleteHandler = async () => {
    try {
      const data = await deletePostHandler(studyId);
      console.log(data);
      toast.success('게시글이 삭제되었습니다!');
      navigate('/study');
    } catch (error) {
      console.error('Error fetching study data:', error);
    }
  };

  const [ismodalOpen, setIsmodalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStudyData(studyId);
        setStudyData(data);

        const scrapped = localStorage.getItem(`isScrapped_${studyId}`);
        setScrapped(scrapped ? JSON.parse(scrapped) : data.data.isScrapped);

        const appliedStatus = localStorage.getItem(`isApplied_${studyId}`);
        if (appliedStatus) {
          setApplied(JSON.parse(appliedStatus));
        }

        // fetchScrapCount 함수에서 올바른 데이터를 받고 있는지 확인합니다.
        const scrapData = await fetchScrapCount(studyId);
        console.log('scrapData:', scrapData); // 콘솔에 스크랩 데이터 출력
        setScrapCount(scrapData.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [studyId, setStudyData, setScrapped, setApplied, setScrapCount]);

  const [isWriter, setIsWriter] = useState(false);
  useEffect(() => {
    const getNick = localStorage.getItem('nickname');

    if (studyData && getNick === studyData.data.writerNickname) {
      setIsWriter(true);
    } else {
      setIsWriter(false);
    }
  }, [studyData]);

  if (!studyData) {
    return <div>Loading..</div>;
  }

  const togglePopup = message => {
    setPopupMessage(message);
    setPopupVisible(!isPopupVisible);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const applyForStudyHandler = async () => {
    try {
      if (isApplied) {
        const response = await cancelStudyApplication(studyId);
        if (response.status === 200) {
          toast.success('지원 취소 완료');
          setApplied(false);
          localStorage.setItem(`isApplied_${studyId}`, false);
        } else {
          console.error('Failed to cancel study application:', response);
        }
      } else {
        const response = await applyForStudy(studyId);
        if (response.status === 201) {
          toast.success(
            '지원 완료! 모집자가 수락 후, 모집인원이 다 차거나 마감일이 되면 메시지로 오픈채팅 링크가 전달됩니다.'
          );
          setApplied(true);
          localStorage.setItem(`isApplied_${studyId}`, true);
        } else {
          console.error('Failed to apply for study:', response);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('이미 신청한 스터디입니다!');

        setApplied(true);
        localStorage.setItem(`isApplied_${studyId}`, true);
      } else {
        console.error('Error applying for study:', error);
      }

      if (error.response.status === 403) {
        toast.error('1시간 패널티 부과 중입니다!');
      }
    }
  };

  const toggleScrapHandler = async () => {
    try {
      const response = await toggleScrap(studyId, isScrapped);
      if (response.status === 200) {
        const newScrappedStatus = !isScrapped;
        setScrapped(newScrappedStatus);
        localStorage.setItem(`isScrapped_${studyId}`, newScrappedStatus);

        if (newScrappedStatus) {
          toast.success('스크랩에 추가합니다!');
          localStorage.setItem(`scrapId_${studyId}`, response.data.data);
          setScrapCount(scrapCount + 1);
        } else {
          toast.error('스크랩에서 제거합니다!');
          localStorage.removeItem(`scrapId_${studyId}`);
          setScrapCount(scrapCount - 1);
        }
      } else {
        console.error('스크랩 실패:', response);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('권한이 없음.');
      } else {
        console.error('스크랩 실패:', error);
      }
    }
  };
  // console.log(studyData.data.img)

  return (
    <Container>
      <Wrapper>
        <Title>
          {studyData.data.title}
          {isWriter ? (
            <img
              src={more}
              style={{
                width: '24px',
                height: '24px',
              }}
              alt="more"
              onClick={() => {
                setIsmodalOpen(!ismodalOpen);
              }}
            />
          ) : (
            <></>
          )}
        </Title>
        {ismodalOpen ? (
          <MoreModal>
            <div
              style={{
                width: '90%',
                display: 'flex',
                justifyContent: 'space-evenly',
                borderBottom: '1px solid #E5E5E5',
              }}
              onClick={modifyHandler}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: '#555555',
                  fontWeight: '700',
                  margin: '8px',
                }}
              >
                수정하기
              </p>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: '#555555',
                fontWeight: '700',
                margin: '8px',
              }}
              onClick={deleteHandler}
            >
              삭제하기
            </p>
          </MoreModal>
        ) : (
          <></>
        )}
        <FlexContainer>
          <Title2>{studyData.data.writerMajor}</Title2>
          <Nickname>{studyData.data.writerNickname}</Nickname>
        </FlexContainer>
        <FlexContainer>
          <ApplicationPeriod>지원기간</ApplicationPeriod>
          <ApplicationPeriod2>
            {studyData.data.recruitmentStart}
          </ApplicationPeriod2>
          ~
          <ApplicationPeriod3>
            {studyData.data.recruitmentEnd}
          </ApplicationPeriod3>
        </FlexContainer>
        <FlexContainer>
          <Title2>방식</Title2>
          <StudyMethod>
            {studyData.data.studyFrequency} • {studyData.data.studyMethod}
          </StudyMethod>
        </FlexContainer>
        <FlexContainer>
          <Title2>문의</Title2>
          <StudyMethod>{studyData.data.questionKakaoLink}</StudyMethod>
        </FlexContainer>
        <Tag>
          <TagText>{studyData.data.categoryName}</TagText>
        </Tag>
        <Line />
        <Content>{studyData.data.content}</Content>
        <TagContainer>
          {studyData.data.imgUrlList &&
            studyData.data.imgUrlList.map(image => (
              <img
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '8px',
                }}
                key={image.imageId}
                src={image.imgUrl}
                alt={`Image ${image.imageId}`}
              />
            ))}
        </TagContainer>

        <CommentContainer>
          <ScrapButton onClick={toggleScrapHandler}>
            <ScrapImage src={isScrapped ? filledHeart : heart} alt="heart" />
            <ScrapCount>{scrapCount}</ScrapCount>
          </ScrapButton>
          {isWriter ? (
            <ApplyButton>
              {`신청현황 보기 (${studyData.data.participantCount} / ${studyData.data.totalRecruitmentCount})`}
            </ApplyButton>
          ) : (
            <ApplyButton onClick={applyForStudyHandler} isApplied={isApplied}>
              {isApplied
                ? '지원취소'
                : `지원하기 (${studyData.data.participantCount} / ${studyData.data.totalRecruitmentCount})`}
            </ApplyButton>
          )}
        </CommentContainer>
        {isPopupVisible && (
          <Popup
            title={popupTitle}
            message={popupMessage}
            message2={
              '*스터디 신청 후 취소할 시, 취소한 스터디의 지원에 1시간 제한이 생깁니다.'
            }
            onClose={closePopup}
          />
        )}
      </Wrapper>
    </Container>
  );
};

export default StudyListPostDetail;

const Container = styled.div`
  margin: auto;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 85%;
  background-color: ${COLORS.back1};
  position: relative;
`;

const Wrapper = styled.div`
  @media (min-width: 768px) {
    width: 375px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.333px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title2 = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: ${COLORS.font2};
  line-height: 20px;
  letter-spacing: -0.333px;
  text-align: left;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
`;

const StudyMethod = styled.div`
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.333px;
  text-align: left;
  margin-right: 10px;
`;

const Nickname = styled(Title2)`
  font-weight: 400;
  color: ${COLORS.font2};
`;

const ApplicationPeriod = styled(Title2)`
  /* color: ${COLORS.font1}; */
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.333px;
  text-align: left;
  margin-right: 10px;
`;

const ApplicationPeriod2 = styled.div`
  color: ${COLORS.font1};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.333px;
  text-align: left;
  margin-right: 1px;
`;

const ApplicationPeriod3 = styled(ApplicationPeriod2)``;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
`;

const Line = styled.div`
  height: 1px;
  width: 100vw;
  background-color: ${COLORS.line1};
  border-bottom: 5px solid #fff7f7;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: -50vw;
  left: 50%;
  position: relative;
`;

const Content = styled.div`
  max-width: 343px;
  width: 100%;
  flex-shrink: 0;
  color: ${COLORS.font1};
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.333px;
  text-align: left;
`;

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Tag = styled.button`
  display: flex;
  padding: 4px 8px;
  align-items: flex-start;
  gap: 10px;
  font-weight: 500;
  border-radius: 15px;
  border: 1px solid ${COLORS.sub};
  margin-top: 15px;
  background: none;
  cursor: pointer;
`;

const TagText = styled.div`
  color: ${COLORS.main};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.333px;
`;

const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ScrapButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 28px;
  border: 1px solid ${COLORS.line2};
  background: #fff;
  margin-top: 15px;
  cursor: pointer;
`;

const ScrapCount = styled.div`
  font-size: 12px;
  color: ${COLORS.font2};
  margin-top: 2px;
`;

const ScrapImage = styled.img`
  width: 20px;
  height: 20px;
`;

const ApplyButton = styled.button`
  width: 287px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 28px;
  background: ${props => (props.isApplied ? COLORS.line2 : COLORS.main)};
  color: ${props =>
    props.isApplied ? '#111' : '#fff'}; /* 글씨 색상 조건부 변경 */
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.333px;
  margin-top: 15px;
  cursor: pointer;
  border: none;
`;

const MoreModal = styled.div`
  width: 84px;
  height: 72px;
  border-radius: 12px;
  position: absolute;
  right: 16px;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background-color: #fafafa;
  border: 1px solid #e5e5e5;
`;
