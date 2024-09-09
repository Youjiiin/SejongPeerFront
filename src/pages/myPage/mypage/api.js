import axios from 'axios';

export const fetchScraps = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    throw new Error('토큰 없음!');
  }
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_SERVER}/scraps/all`,
    {
      params: {
        studyType: 'LECTURE',
        page: 0,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-token': refreshToken,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
  console.log(response.data.data);
  return response.data.data;
};

// 내가 지원한 스터디 리스트 조회
export const fetchAppliedStudies = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    throw new Error('토큰 없음!');
  }

  const response = await axios.get(
    `${process.env.REACT_APP_BACK_SERVER}/study/relations/applied`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-token': refreshToken,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
  console.log(response.data.data);
  return response.data;
};

export const fetchMyPageData = async (accessToken, refreshToken) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_SERVER}/member/my-page`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-Token': refreshToken,
      },
    }
  );
  return response;
};

export const deleteAccount = async (accessToken, refreshToken) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_BACK_SERVER}/member/my-page`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-Token': refreshToken,
      },
    }
  );
  return response;
};

export const checkBuddyMatchingStatus = async (accessToken, refreshToken) => {
  const response = await fetch(
    process.env.REACT_APP_BACK_SERVER + 'buddy/matching-status',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-Token': refreshToken,
      },
    }
  );
  return response.json();
};

export const checkHonbobMatchingStatus = async (accessToken, refreshToken) => {
  const response = await fetch(
    process.env.REACT_APP_BACK_SERVER + '/honbab/check-matching-status',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-Token': refreshToken,
      },
    }
  );
  return response.json();
};
