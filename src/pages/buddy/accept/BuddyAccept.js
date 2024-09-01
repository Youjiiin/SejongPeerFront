import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import findBuddy from '../../../assets/image/findBuddy.png';

import style from './BuddyAccept.module.css';
import { toast } from 'sonner';
import { SubHeader } from 'components/headerRefactor/SubHeader';

const BuddyAccept = () => {
  const [isAccept, setIsAccept] = useState('');
  const [buddyMajor, setBuddyMajor] = useState('');
  const [buddyGrade, setBuddyGrade] = useState('');
  const isFirstRender = useRef(true);
  const navigate = useNavigate();

  // 버튼클릭 핸들러
  const acceptClick = () => {
    setIsAccept(true);
  };
  const declineClick = () => {
    setIsAccept(false);
  };

  //상태변환
  useEffect(() => {
    if (isFirstRender.current) {
      getInfoHandler();
      isFirstRender.current = false;
    } else {
      acceptHandler(isAccept);
    }
  }, [isAccept]);

  //확인/전송
  const acceptHandler = accept => {
    console.log(accept);
    if (accept) {
      if (confirm('매칭을 수락하시겠습니까?')) {
        console.log('수락');
        sendResult(true);
      } else {
        setIsAccept('');
      }
    } else if (accept === false) {
      if (
        confirm(
          '매칭을 거절하면 1시간동안 매칭을 못하는 패널티가 부과됩니다.\n그래도 매칭을 거절하시겠습니까?'
        )
      ) {
        console.log('거절');
        sendResult(false);
      } else {
        setIsAccept('');
      }
    }
  };

  // 수락/거절 통신
  const sendResult = accept => {
    let acceptInfo = {
      isAccept: accept,
    };

    fetch(process.env.REACT_APP_BACK_SERVER + '/buddyMatching/status', {
      method: 'POST',
      body: JSON.stringify(acceptInfo),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Refresh-Token': localStorage.getItem('refreshToken'),
      },
    })
      .then(response => response.json())
      .then(data => {
        if (accept) {
          toast.success(
            '매칭이 수락되었습니다! \n상대방이 매칭을 수락할 때까지 기다려주세요.'
          );
          navigate('/main');
        } else {
          toast.error(
            '매칭이 거절되었습니다. \n거절 패널티로 1시간동안 매칭을 등록할 수 없습니다.'
          );
          navigate('/main');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  //상대 정보 가져오기
  const getInfoHandler = () => {
    fetch(process.env.REACT_APP_BACK_SERVER + '/buddy/partner/details', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Refresh-Token': localStorage.getItem('refreshToken'),
      },
    })
      .then(response => response.json())
      .then(data => {
        setBuddyMajor(data.data.collegeMajor);
        setBuddyGrade(data.data.grade);
      })
      .catch(error => console.log(error));
  };

  return (
    <div className={style.container}>
      <SubHeader text="세종버디" />
      <p className={style.title}>버디를 찾았습니다!</p>
      <img className={style.find_buddy} src={findBuddy} alt="findBuddy" />

      <div className={style.info_box}>
        <span className={style.info}>{buddyMajor}</span>
        <div className={style.dot}></div>
        <span className={style.info}>{buddyGrade}학년</span>
      </div>

      <div>
        <p className={style.explain}>서로 수락하면 매칭 상대에게</p>
        <p className={style.explain}>이름과 카카오톡ID가 추가로 전달 됩니다!</p>
      </div>

      <div className={style.btn_box}>
        <button onClick={declineClick} className={style.decline_btn}>
          거절하기
        </button>
        <button onClick={acceptClick} className={style.accept_btn}>
          수락하기
        </button>
      </div>
    </div>
  );
};

export default BuddyAccept;
