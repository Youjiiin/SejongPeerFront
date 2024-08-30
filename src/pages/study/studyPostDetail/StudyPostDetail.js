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

  const [isImgOpen, setImgOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isWriter, setIsWriter] = useState(false);
  const [ismodalOpen, setIsmodalOpen] = useState(false);

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
        setStudyData(data);

        // 서버에서 지원 여부 상태 가져오기
        setApplied(data.data.isApplied);

        // 서버에서 스크랩 여부 상태 가져오기
        setScrapped(data.data.isScrapped); // 서버 데이터의 isScrapped 사용

        // 지원 여부 로컬 스토리지에서 불러오기 또는 서버 데이터 사용
        const appliedStatus = localStorage.getItem(`isApplied_${studyId}`);
        setApplied(
          appliedStatus ? JSON.parse(appliedStatus) : data.data.isApplied
        );

        // 스크랩 카운트 설정
        const scrapData = await fetchScrapCount(studyId);
        setScrapCount(scrapData.data);
      } catch (error) {
        toast.error('스터디 데이터를 가져오는데 실패했습니다!', error);
      }
    };

    fetchData();
  }, [studyId, setStudyData, setScrapped, setApplied, setScrapCount]);

  useEffect(() => {
    const getNick = localStorage.getItem('nickname');
    if (studyData && getNick === studyData.data.writerNickname) {
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
          setApplied(false);
          localStorage.setItem(`isApplied_${studyId}`, JSON.stringify(false));
        } else {
          console.error('Failed to cancel study application:', response);
        }
      } else {
        const response = await applyForStudy(studyId);
        if (response.status === 201) {
          toast.success('지원 완료!');
          setApplied(true);
          localStorage.setItem(`isApplied_${studyId}`, JSON.stringify(true));
        } else {
          console.error('Failed to apply for study:', response);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('이미 신청한 스터디입니다!');
        setApplied(true);
        localStorage.setItem(`isApplied_${studyId}`, JSON.stringify(true));
      } else if (error.response.status === 403) {
        toast.error('1시간 패널티 부과 중입니다!');
      } else {
        console.error('Error applying for study:', error);
      }
    }
  };

  const toggleScrapHandler = async () => {
    try {
      // 서버와 통신하여 스크랩 상태를 토글
      const response = await toggleScrap(studyId, isScrapped);
      if (response.status === 200) {
        const newScrappedStatus = !isScrapped;
        setScrapped(newScrappedStatus); // 서버 응답에 따라 스크랩 상태 업데이트

        if (newScrappedStatus) {
          toast.success('스크랩에 추가합니다!');
          setScrapCount(scrapCount + 1); // 스크랩 카운트 증가
        } else {
          toast.error('스크랩에서 제거합니다!');
          setScrapCount(scrapCount - 1); // 스크랩 카운트 감소
        }
      } else {
        console.error('Failed to toggle scrap:', response);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('권한이 없음.');
      } else {
        console.error('Failed to toggle scrap:', error);
        toast.error('스크랩 상태 변경 중 오류가 발생했습니다.');
      }
    }
  };

  if (!studyData) {
    return <div>Loading..</div>;
  }

  return (
    <Container>
      <SubHeader text="세종스터디" />
      <Wrapper>
        <Title>
          {studyData.data.title}
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
          <Title2>{studyData.data.writerMajor}</Title2>
          <Nickname>{studyData.data.writerNickname}</Nickname>
        </FlexContainer>
        <FlexContainer>
          <ApplicationPeriod>지원기간</ApplicationPeriod>
          <ApplicationPeriod2>
            {studyData.data.recruitmentStart}
          </ApplicationPeriod2>{' '}
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
        <FlexContainer2>
          <Tag>
            <TagText>{studyData.data.categoryName}</TagText>
          </Tag>
          {studyData.data.tags.map((tag, index) => (
            <Tag2 key={index}>
              <TagText2>{tag}</TagText2>
            </Tag2>
          ))}
        </FlexContainer2>
        <Line />
        <Content>{studyData.data.content}</Content>
        <TagContainer>
          {studyData.data.imgUrlList &&
            studyData.data.imgUrlList.map(image => (
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
              }}
              src={selectedImage.imgUrl}
              alt={`Image ${selectedImage.imageId}`}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Modal>

        <CommentContainer>
          <ScrapButton onClick={toggleScrapHandler}>
            <ScrapImage src={isScrapped ? filledHeart : heart} alt="heart" />
            <ScrapCount>{scrapCount}</ScrapCount>
          </ScrapButton>
          {isWriter ? (
            <ApplyButton onClick={() => navigate('/mypost')}>
              {`신청현황 보기 (${studyData.data.participantCount} / ${studyData.data.totalRecruitmentCount})`}
            </ApplyButton>
          ) : (
            <ApplyButton onClick={applyForStudyHandler}>
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
