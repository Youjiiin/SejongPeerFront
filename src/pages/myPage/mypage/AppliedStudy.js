import React, { useEffect, useState, useRef } from 'react';
import { fetchAppliedStudies } from './api';
import styled from 'styled-components';
import COLORS from '../../../theme';
import { useNavigate } from 'react-router-dom';

const AppliedStudy = () => {
  const [appliedStudies, setAppliedStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(false);
  const navigate = useNavigate();

  const handleStudyClick = studyId => {
    navigate(`/study/post/${studyId}`);
  };
  useEffect(() => {
    const getAppliedStudies = async () => {
      try {
        const data = await fetchAppliedStudies();
        console.log(data);
        setAppliedStudies(data.data);
      } catch (err) {
        console.log(err);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container>
      {appliedStudies.map(study => (
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
        </PostWrapper>
      ))}
    </Container>
  );
};

export default AppliedStudy;

const Container = styled.div`
  margin-top: 7vh;
`;
const PostWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${COLORS.line2};
  padding: 16px 12px;
  @media (max-width: 768px) {
  }
`;

const PostTop = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  @media (max-width: 768px) {
  }
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
  padding: 0 1.2%;
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
  height: 30%;
  display: flex;
  align-items: center;
  gap: 5%;
  padding: 0 1.2%;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  gap: 8%;
`;

const LikeIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const LikeNumber = styled.p`
  color: ${COLORS.font3};
`;
