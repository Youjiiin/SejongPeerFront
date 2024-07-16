// src/api/study.js
import axios from 'axios';

export const fetchStudyData = async studyId => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    throw new Error('토큰이 없음!');
  }

  const response = await axios.get(
    `${process.env.REACT_APP_BACK_SERVER}/study/post/${studyId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Refresh-token': `${refreshToken}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};

export const applyForStudy = async studyId => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    throw new Error('토큰이 없음!');
  }

  const response = await axios.post(
    `${process.env.REACT_APP_BACK_SERVER}/study/relations`,
    { studyId: parseInt(studyId) },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Refresh-token': `${refreshToken}`,
      },
    }
  );

  return response;
};

// 스터디 스크랩 함수
export const toggleScrap = async (studyId, isScrapped) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const scrapId = localStorage.getItem(`scrapId_${studyId}`);
  // console.log(accessToken);
  // console.log(refreshToken);
  // console.log(scrapId);
  if (!accessToken || !refreshToken) {
    throw new Error('토큰이 없음!');
  }

  if (isScrapped) {
    if (!scrapId) {
      throw new Error('스크랩 ID가 없음!');
    }
    // DELETE 요청
    const url = `${process.env.REACT_APP_BACK_SERVER}/scraps/${scrapId}`;
    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Refresh-token': refreshToken,
      },
    });
    // console.log(response.data);
    return response;
  } else {
    // POST 요청
    const url = `${process.env.REACT_APP_BACK_SERVER}/scraps/study/${studyId}`;
    const scrapId = localStorage.getItem(`scrapId_${studyId}`);
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Refresh-token': refreshToken,
        },
      }
    );
    // console.log(response.data);
    return response;
  }
};

// 단건 게시물 별 스크랩 수 조회
export const fetchScrapCount = async studyId => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    throw new Error('토큰이 없음!');
  }

  const response = await axios.get(
    `${process.env.REACT_APP_BACK_SERVER}/scraps/study/${studyId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Refresh-token': `${refreshToken}`,
      },
    }
  );

  return response.data;
};
