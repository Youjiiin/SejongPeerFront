// src/api/study.js
import axios from 'axios';
import useFilterStore from './useFilterStore';

export const fetchPosts = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const studyType = localStorage.getItem('studyType');

  if (!accessToken || !refreshToken) {
    throw new Error('Tokens not found in local storage.');
  }

  const response = await axios.get(
    'https://www.api-sejongpeer.shop/api/v1/study/post',
    {
      params: {
        studyType: studyType.toUpperCase(), // 'LECTURE' 또는 'EXTERNAL_ACTIVITY'
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
  console.log(response.data.data.content[0].id);
  return response.data.data.content;
};

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    alert('재로그인 해야합니다!');
    toast.error('재로그인 해야합니다!');
    throw new Error('토큰이 없음!');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Refresh-token': `${refreshToken}`,
  };
};

export const searchHandler = async ({ category, member, recruiting }) => {
  const studyType = localStorage.getItem('studyType');
  console.log(studyType, member, recruiting, category);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_SERVER}/study/post/search`,
      {
        params: {
          recruitmentPersonnel: member,
          isRecruiting: recruiting,
          searchWord: '',
          categoryId: category,
          studyType: studyType
        },
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during search:', error);
    throw error;
  }
};
