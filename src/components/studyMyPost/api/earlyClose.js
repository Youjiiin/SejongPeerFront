import axios from 'axios';

export const earlyClose = async studyId => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    throw new Error('Tokens not found in local storage.');
  }

  const response = await axios.patch(
    `${process.env.REACT_APP_BACK_SERVER}/study/relations/early-close/${studyId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Refresh-token': refreshToken,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response;
};
