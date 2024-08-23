// api.js

import { toast } from 'sonner';

// Buddy 상태 확인
export const BuddyHandler = async (navigate, setBuddyCount) => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');

  if (refreshToken === null || accessToken === null) {
    toast.error('로그인 후 이용 가능한 서비스입니다!');
    navigate('/login');
  } else {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/buddy/matching-status',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Refresh-Token': refreshToken,
          },
        }
      );
      const data = await response.json();

      if (data.data !== null) setBuddyCount(data.data.matchingCompletedCount);
      else setBuddyCount(0);

      statusHandler(
        data.data.status,
        data.data.matchingCompletedCount,
        navigate
      );
    } catch (error) {
      toast.error('에러가 발생했습니다.');
      console.log(error.message);
    }
  }
};

const statusHandler = (status, count, navigate) => {
  switch (status) {
    case 'CANCEL':
    case 'REACTIVATE':
      navigate(count > 0 ? '/buddy/success' : '/buddy?page=start1');
      break;
    case 'DENIED':
      toast.error('상대방이 거절했습니다. 다시 신청해 주세요.');
      navigate(count > 0 ? '/buddy/success' : '/buddy/start1');
      // toast.error('상대방이 거절했습니다. 다시 신청해 주세요.');
      navigate(count > 0 ? '/buddy/success' : '/buddy?page=start1');
      break;
    case 'MATCHING_COMPLETED':
      toast.success('매칭에 성공했습니다. 정보를 확인해주세요!');
      navigate('/buddy/success');
      break;
    case 'ACCEPT':
      toast.info('신청 수락을 했습니다. 상대방이 수락할때까지 기다려 주세요.');
      break;
    case 'REJECT':
      toast.error(
        '거절 패널티 1시간이 부과되었습니다. 1시간 이후에 다시 신청해 주세요.'
      );
      break;
    case 'IN_PROGRESS':
      toast.info('매칭중입니다!');
      navigate('/buddy/waiting');
      break;
    case 'FOUND_BUDDY':
      toast.success('버디를 찾았습니다!');
      navigate('/buddy/accept');
      break;
    default:
      break;
  }
};

export const HonbobHandler = async navigate => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');

  if (refreshToken === null || accessToken === null) {
    toast.info('로그인 후 이용 가능한 서비스입니다!');
    navigate('/login');
  } else {
    try {
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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      switch (data.data.status) {
        case 'CANCEL':
        case 'TIME_OUT':
        case 'EXPIRED':
          navigate('/honbob/start1');
          break;
        case 'IN_PROGRESS':
          toast.info('매칭 중입니다!');
          navigate('/honbob/waiting');
          break;
        case 'MATCHING_COMPLETED':
          toast.info('매칭에 성공했습니다!');
          navigate('/honbob/success');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('에러 체크:', error);
      toast.error('매칭 체크 실패!');
    }
  }
};
