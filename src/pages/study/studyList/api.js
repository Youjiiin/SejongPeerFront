// src/api/study.js
import axios from 'axios';

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
