import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudyPostWrite from '../studyPostWrite/StudyPostWrite';
import usePostStore from '../studyPostWrite/usePostStore';

const StudyModify = () => {
  const { studyId } = useParams();
  const [studyData, setStudyData] = useState(null);

  const {
    setTitle,
    setCategory,
    setStartDate,
    setEndDate,
    setMemberNum,
    setSelectedWay,
    setSelectedFrequency,
    setQuestionLink,
    setContent,
    setStudyLink,
    setTags,
  } = usePostStore();

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACK_SERVER + `/study/post/${studyId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Refresh-Token': localStorage.getItem('refreshToken'),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStudyData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching study data:', error);
      }
    };

    fetchStudyData();
  }, [studyId]);

  useEffect(() => {
    if (studyData) {
      if (studyData.data.studyFrequency === '주 1~2회') {
        setSelectedFrequency('ONCE_OR_TWICE_A_WEEK');
      } else if (studyData.data.studyFrequency === '주 3~4회') {
        setSelectedFrequency('THREE_TO_FOUR_TIMES_A_WEEK');
      } else {
        setSelectedFrequency('FIVE_OR_MORE_TIMES_A_WEEK');
      }

      if (studyData.data.studyMethod === '대면') {
        setSelectedWay('FACE_TO_FACE');
      } else if (studyData.data.studyMethod === '비대면') {
        setSelectedWay('NON_FACE_TO_FACE');
      } else {
        setSelectedWay('BOTH');
      }

      setTitle(studyData.data.title);
      setCategory(studyData.data.categoryName);
      setStartDate(studyData.data.recruitmentStart);
      setEndDate(studyData.data.recruitmentEnd);
      setMemberNum(studyData.data.totalRecruitmentCount);
      setContent(studyData.data.content);
      setQuestionLink(studyData.data.questionKakaoLink);
      setStudyLink(studyData.data.finalKakaoLink);
      setTags(studyData.data.tags);
    }
  }, [studyData]);

  return studyData ? (
    <StudyPostWrite studyId={studyId} imgUrl={studyData.data.imgUrlList} />
  ) : (
    <div>Loading...</div>
  );
};

export default StudyModify;
