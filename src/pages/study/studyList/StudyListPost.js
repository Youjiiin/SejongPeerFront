import React from 'react';
import styled from 'styled-components';
import heart from '../../../assets/image/heart.png';
import filledHeart from '../../../assets/image/filledHeart.svg'; // 채워진 하트 아이콘
import picture from '../../../assets/image/image.png';
import COLORS from '../../../theme';

const StudyListPost = ({ post }) => {
  const {
    title,
    hasImage,
    categoryName,
    id,
    tags,
    totalRecruitmentCount,
    participantCount,
    recruitmentStatus,
    recruitmentEndAt,
    isScraped,
  } = post;

  const formatDate = dateString => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <PostWrapper $recruitmentStatus={recruitmentStatus}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <PostTop>
          <TagWrapper>
            <TagText>{categoryName}</TagText>
          </TagWrapper>
          {tags.map((tag, index) => (
            <TagText1 key={index}>{tag}</TagText1>
          ))}
        </PostTop>
        <DateText>~{formatDate(recruitmentEndAt)}</DateText>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '6px 0',
        }}
      >
        <PostMiddle>
          <Title>{title}</Title>
          {hasImage && <ImageIcon src={picture} alt="hasImage" />}
        </PostMiddle>
        {recruitmentStatus === '모집 중' ? (
          <Count>
            {participantCount} / {totalRecruitmentCount}
          </Count>
        ) : (
          <Finish>모집완료</Finish>
        )}
      </div>

      <PostBottom>
        <Like>
          <LikeIcon src={isScraped ? filledHeart : heart} alt="like" />
          <LikeNumber>{post.scrapCount}</LikeNumber>
        </Like>
      </PostBottom>
    </PostWrapper>
  );
};

export default StudyListPost;

const PostWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${COLORS.line2};
  padding: 12px 16px;
  background-color: ${({ $recruitmentStatus }) =>
    $recruitmentStatus === '모집 중' ? '#FFF' : '#EEEEEE'};
`;

const PostTop = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5%;
  border-radius: 15px;
`;

const TagText = styled.p`
  margin: 0;
  color: ${COLORS.main};
  text-align: 20px;
  border-radius: 15px;
  border: 1px solid ${COLORS.sub};
  padding: 2px 8px;
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
`;

const TagText1 = styled.p`
  margin: 0;
  color: ${COLORS.font3};
  border-radius: 15px;
  border: 1px solid ${COLORS.line1};
  padding: 2px 8px;
  max-width: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
`;

const DateText = styled.div`
  color: ${COLORS.font4};
`;

const PostMiddle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  color: ${COLORS.main};
  font-weight: 600;
  font-size: 16px;
  margin: 0px;
`;
const Finish = styled.div`
  display: flex;
  align-items: center;
  color: ${COLORS.font4};
  font-weight: 600;
  font-size: 16px;
  margin: 0px;
`;

const Title = styled.p`
  font-weight: 600;
  color: ${COLORS.font1};
  margin: 0;
`;

const ImageIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const PostBottom = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-tozzzzzzzzp: 6px;
  display: inline-block;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LikeIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const LikeNumber = styled.p`
  color: ${COLORS.font3};
  margin: 0;
  margin-bottom: 0.6px;
`;
