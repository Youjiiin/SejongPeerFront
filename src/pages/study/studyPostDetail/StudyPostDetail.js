import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { SubHeader } from '../../../components/headerRefactor/SubHeader';
import Modal from '../../../components/modal/Modal';
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
  deletePostHandler,
  addScrap,
  deleteScrap, // 추가: 스크랩 삭제 함수 가져오기
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
  } = usePopupStroe();

  const { studyId } = useParams();
  const navigate = useNavigate();

  const [isImgOpen, setImgOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isWriter, setIsWriter] = useState(false);
  const [ismodalOpen, setIsmodalOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (studyData) {
      console.log(studyData.recruitmentStatus);
      if (studyData.recruitmentStatus === '마감') {
        setIsFinished(true);
      }
    }
  }, [studyData]);

  const modifyHandler = () => {
    navigate(`/study/modify/${studyId}`);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setImgOpen(true);
  };

  const deleteHandler = async () => {
    try {
      await deletePostHandler(studyId);
      toast.success('게시글이 삭제되었습니다!');
      navigate('/study');
    } catch (error) {
      toast.error('게시글 삭제 실패!', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStudyData(studyId);
        console.log(data.data.isScraped);
        setStudyData(data.data);

        // 서버에서 지원 여부 상태 가져오기
        setApplied(data.data.isApplied); // 서버 응답의 isApplied 상태로 설정
        setScrapped(data.data.isScraped); // 서버에서 받은 isScrapped 상태로 설정
        setScrapCount(data.data.scrapCount); // 서버에서 받은 scrapCount 설정
      } catch (error) {
        toast.error('스터디 데이터를 가져오는데 실패했습니다!', error);
      }
    };

    fetchData();
  }, [studyId, setStudyData, setScrapped, setApplied, setScrapCount]);

  useEffect(() => {
    const getNick = localStorage.getItem('nickname');
    if (studyData && getNick === studyData.writerNickname) {
      setIsWriter(true);
    } else {
      setIsWriter(false);
    }
  }, [studyData]);

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
          setApplied(false); // 지원 취소 응답에 따라 상태 업데이트
        } else {
          console.error('Failed to cancel study application:', response);
        }
      } else {
        const response = await applyForStudy(studyId);
        if (response.status === 201) {
          toast.success('지원 완료!');
          setApplied(true); // 지원 완료 응답에 따라 상태 업데이트
        } else {
          console.error('Failed to apply for study:', response);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('이미 신청한 스터디입니다!');
        setApplied(true); // 이미 신청한 상태로 설정
      } else if (error.response.status === 403) {
        toast.error('1시간 패널티 부과 중입니다!');
      } else {
        console.error('Error applying for study:', error);
      }
    }
  };

  const handleScrapToggle = async () => {
    try {
      if (isScrapped) {
        // 스크랩 삭제 로직
        const response = await deleteScrap(studyId);
        if (response.status === 200) {
          toast.success('스크랩에서 제거되었습니다!');
          setScrapped(false); // 스크랩 삭제 후 상태 업데이트
          setScrapCount(scrapCount - 1);
        } else {
          toast.error('스크랩에 실패했습니다!', response);
        }
      } else {
        // 스크랩 추가 로직
        const response = await addScrap(studyId);
        if (response.data.status === 201) {
          const newScrapId = response.data.data.scrapId; // scrapId를 서버 응답에서 받아옴
          toast.success('스크랩에 추가되었습니다!');
          setScrapped(true); // 스크랩 추가 후 상태 업데이트
          setScrapCount(scrapCount + 1);
        } else {
          toast.error('스크랩에 실패했습니다!', response);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('스크랩 처리 중 오류가 발생했습니다.');
    }
  };

  if (!studyData) {
    return <div>Loading..</div>;
  }

  return (
    <Container>
      <SubHeader text="세종스터디" customBackLink="/study" />
      <Wrapper>
        <Title>
          {studyData.title}
          {isWriter && (
            <img
              src={more}
              style={{ width: '24px', height: '24px' }}
              alt="more"
              onClick={() => setIsmodalOpen(!ismodalOpen)}
            />
          )}
        </Title>
        {ismodalOpen && (
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
        )}
        <FlexContainer>
          <Title2>{studyData.writerMajor}</Title2>
          <Nickname>{studyData.writerNickname}</Nickname>
        </FlexContainer>
        <FlexContainer>
          <ApplicationPeriod>지원기간</ApplicationPeriod>
          <ApplicationPeriod2>
            {studyData.recruitmentStart}
          </ApplicationPeriod2>{' '}
          ~<ApplicationPeriod3>{studyData.recruitmentEnd}</ApplicationPeriod3>
        </FlexContainer>
        <FlexContainer>
          <Title2>방식</Title2>
          <StudyMethod>
            {studyData.studyFrequency} • {studyData.studyMethod}
          </StudyMethod>
        </FlexContainer>
        <FlexContainer>
          <Title2>문의</Title2>
          <StudyMethod>{studyData.questionKakaoLink}</StudyMethod>
        </FlexContainer>
        <FlexContainer2>
          <Tag>
            <TagText>{studyData.categoryName}</TagText>
          </Tag>
          {studyData.tags.map((tag, index) => (
            <Tag2 key={index}>
              <TagText2>{tag}</TagText2>
            </Tag2>
          ))}
        </FlexContainer2>
        <Line />
        <Content>{studyData.content}</Content>
        <TagContainer>
          {studyData.imgUrlList &&
            studyData.imgUrlList.map(image => (
              <img
                style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                key={image.imageId}
                src={image.imgUrl}
                alt={`Image ${image.imageId}`}
                onClick={() => handleImageClick(image)}
              />
            ))}
        </TagContainer>
        <Modal isOpen={isImgOpen} onClose={() => setImgOpen(false)}>
          {selectedImage ? (
            <img
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '8px',
                margin: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
              src={selectedImage.imgUrl}
              alt={`Image ${selectedImage.imageId}`}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Modal>

        <CommentContainer>
          <ScrapButton onClick={handleScrapToggle}>
            <ScrapImage src={isScrapped ? filledHeart : heart} alt="heart" />
            <ScrapCount>{scrapCount}</ScrapCount>
          </ScrapButton>
          {isFinished ? (
            <FinishedButon>모집완료</FinishedButon>
          ) : isWriter ? (
            <ApplyButton onClick={() => navigate('/mypost')}>
              {`신청현황 보기 (${studyData.participantCount} / ${studyData.totalRecruitmentCount})`}
            </ApplyButton>
          ) : (
            <ApplyButton onClick={applyForStudyHandler}>
              {isApplied
                ? '지원취소'
                : `지원하기 (${studyData.participantCount} / ${studyData.totalRecruitmentCount})`}
            </ApplyButton>
          )}
        </CommentContainer>

        {isPopupVisible && (
          <Popup
            title={popupTitle}
            message={popupMessage}
            message2="*스터디 신청 후 취소할 시, 취소한 스터디의 지원에 1시간 제한이 생깁니다."
            onClose={closePopup}
          />
        )}
      </Wrapper>
    </Container>
  );
};

export default StudyListPostDetail;

const Container = styled.div`
  /* margin: auto; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 85%;
  background-color: ${COLORS.back1};
  position: relative;
`;

const Wrapper = styled.div`
  margin-top: 16px;
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

const FlexContainer2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
  gap: 4px;
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
  letter-spacing: -0.3333px;
  text-align: left;
  white-space: pre-wrap;
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

const Tag2 = styled.button`
  display: flex;
  padding: 4px 8px;
  align-items: flex-start;
  gap: 10px;
  font-weight: 500;
  border-radius: 15px;
  border: 1px solid ${COLORS.font3};
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
const TagText2 = styled.div`
  color: ${COLORS.font3};
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
  margin-bottom: 30px;
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

const FinishedButon = styled.button`
  width: 287px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 28px;
  background-color: ${COLORS.line2};
  color: #fff;
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
  top: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background-color: #fafafa;
  border: 1px solid #e5e5e5;
`;
