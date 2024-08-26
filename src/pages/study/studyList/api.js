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
  //console.log(response.data.data);
  //console.log(response.data.data.content[0].id);
  return response.data.data.content;
};

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    altoast.errorert('재로그인 해야합니다!');
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
  const studyTypeUpper = studyType ? studyType.toUpperCase() : null;

  let page = 1;  // 시작 페이지 번호
  let allData = [];  // 모든 데이터를 저장할 배열
  console.log("인원 수 " + member);
  console.log("모집 중 " + recruiting);
  console.log("카테고리 " + category);

  const filterData = {
    studyType: studyTypeUpper,
    //page: page,
    isRecruiting: recruiting === null ? null : recruiting,
    searchWord: null,
    categoryId: category === 0 ? null : category,
    recruitmentPersonnel: member === 0 ? null : member,
  };

  console.log(filterData)

  try {
    // while(true) {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_SERVER}/study/post/search`,
        {
          params: filterData,
          headers: getAuthHeaders(),
        }
      );
      const data = response.data;
      console.log(data);
  
      // 응답 데이터가 빈 배열이면, 더 이상 데이터가 없다는 뜻이므로 루프를 종료합니다.
      // if (data.data.length === 0) {
      //   break;
      // }
  
      // 받아온 데이터를 allData 배열에 추가합니다.
      allData = allData.concat(data);
  
      // 페이지 번호를 증가시킵니다.
      page += 1;
    // }
    console.log('All data fetched:', allData);
    return allData;  // 모든 페이지의 데이터를 반환합니다.


  } catch (error) {
    console.error('Error during search:', error);
    throw error;
  }
};