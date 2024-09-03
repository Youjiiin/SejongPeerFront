import React, { useEffect, useState, useRef } from 'react';
import { addScrap, deleteScrap } from '../../study/studyPostDetail/api';
import { fetchAppliedStudies } from './api';
import styled from 'styled-components';
import COLORS from '../../../theme';
import { useNavigate } from 'react-router-dom';
import filledHeart from '../../../assets/image/filledHeart.svg';
import heart from '../../../assets/image/heart_postdetail.svg';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

const AppliedStudy = () => {
  const [appliedStudies, setAppliedStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAppliedStudies = async () => {
      try {
        const data = await fetchAppliedStudies();
        setAppliedStudies(
          data.data.map(study => ({
            ...study,
            isScrapped:
              localStorage.getItem(`isScrapped_${study.studyId}`) === 'true',
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isMounted.current) {
      getAppliedStudies();
      isMounted.current = true;
    }
  }, []);

  const handleStudyClick = studyId => {
    navigate(`/study/post/${studyId}`);
  };

  const handleScrapToggle = async (studyId, currentStatus, index) => {
    try {
      if (currentStatus) {
        // 스크랩 삭제 로직
        const scrapId = localStorage.getItem(`scrapId_${studyId}`);
        if (!scrapId) {
          throw new Error('스크랩 ID가 없음!');
        }

        const response = await deleteScrap(scrapId);
        if (response.status === 200) {
          const updatedStudies = [...appliedStudies];
          updatedStudies[index] = {
            ...updatedStudies[index],
            isScrapped: false,
            scrapCount: updatedStudies[index].scrapCount - 1,
          };
          setAppliedStudies(updatedStudies);
          localStorage.removeItem(`isScrapped_${studyId}`);
          localStorage.removeItem(`scrapId_${studyId}`);
        } else {
          console.error('Failed to delete scrap:', response);
        }
      } else {
        // 스크랩 추가 로직
        const response = await addScrap(studyId);
        if (response.status === 200) {
          const newScrapId = response.data.scrapId; // scrapId를 서버 응답에서 받아옴
          const updatedStudies = [...appliedStudies];
          updatedStudies[index] = {
            ...updatedStudies[index],
            isScrapped: true,
            scrapCount: updatedStudies[index].scrapCount + 1,
          };
          setAppliedStudies(updatedStudies);
          localStorage.setItem(`isScrapped_${studyId}`, 'true');
          localStorage.setItem(`scrapId_${studyId}`, newScrapId);
        } else {
          console.error('Failed to add scrap:', response);
        }
      }
    } catch (error) {
      console.error('Error toggling scrap status:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container>
      <SubHeader text="마이페이지" customBackLink="/mypage" />
      {appliedStudies.map((study, index) => (
        <PostWrapper
          key={study.studyId}
          onClick={() => handleStudyClick(study.studyId)}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <PostTop>
              <TagWrapper>
                <TagText>{study.type}</TagText>
              </TagWrapper>
              {study.tags.map((tag, index) => (
                <TagText1 key={index}>{tag}</TagText1>
              ))}
            </PostTop>
            <DateText>
              ~{new Date(study.recruitmentStartAt).toLocaleDateString()}
            </DateText>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <PostMiddle>
              <Title>{study.title}</Title>
            </PostMiddle>
            <Count>
              {study.participantsCount} / {study.recruitmentCount}
            </Count>
          </div>
          <PostBottom>
            <Like
              onClick={e => {
                e.stopPropagation(); // 스크랩 버튼 클릭 시 상세 페이지로 이동 방지
                handleScrapToggle(study.studyId, study.isScrapped, index);
              }}
            >
              <LikeIcon
                src={study.isScrapped ? filledHeart : heart}
                alt="heart"
              />
              <LikeNumber>{study.scrapCount}</LikeNumber>
            </Like>
          </PostBottom>
        </PostWrapper>
      ))}
    </Container>
  );
};

export default AppliedStudy;

const Container = styled.div``;
const PostWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${COLORS.line2};
  padding: 12px 16px;
`;

const PostTop = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 15px;
  height: 20px;
`;

const TagText = styled.p`
  margin: 0px;
  color: ${COLORS.main};
  gap: 5%;
  border-radius: 15px;
  border: 1px solid ${COLORS.main};
  padding: 2px 8px;
  font-size: 12px;
`;

const TagText1 = styled.p`
  margin: 0px;
  color: ${COLORS.font3};
  display: flex;
  align-items: center;
  gap: 5%;
  border-radius: 15px;
  border: 1px solid ${COLORS.line1};
  padding: 2px 8px;
  font-size: 12px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: ${COLORS.font4};
`;

const PostMiddle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  color: ${COLORS.main};
  font-weight: 600;
  font-size: 16px;
  margin: 0px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.font1};
  margin: 0px;
`;

const PostBottom = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5%;
  margin-top: 12px;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  gap: 8%;
  cursor: pointer;
`;

const LikeIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const LikeNumber = styled.p`
  color: ${COLORS.font3};
  margin: 0px;
`;
