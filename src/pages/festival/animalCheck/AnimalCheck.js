import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../../App';
import { useNavigate } from 'react-router-dom';

import titleImg from '../../../assets/image/animalTitle.png';
import style from './AnimalCheck.module.css';
import { toast } from 'sonner';

const AnimalCheck = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const { setAnimalType, setPhotoUrl } = useContext(MyContext);
  const navigate = useNavigate();

  // 입력 확인 핸들러
  const inputHandler = e => {
    setVerificationCode(e.target.value);
  };
  // verificationCode 상태가 변경될 때마다 실행
  useEffect(() => {
    if (verificationCode.length >= 4) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [verificationCode]);
  // 인증 확인
  const getResult = async () => {
    // console.log(process.env.REACT_APP_FEST_SERVER);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_FEST_SERVER}/measurements/download`,
        {
          params: {
            studentId: verificationCode,
          },
        }
      );
      // 사용자가 있는지 확인
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.scores)
      ) {
        const sort_result = response.data.data.scores.sort(
          (a, b) => b.score - a.score
        );
        setAnimalType(sort_result);
        console.log(response.data);
        setPhotoUrl(response.data.data.photoUrl); // photoUrl 설정
        console.log(response.data.data.photoUrl);
        localStorage.setItem('photoUrl', response.data.data.photoUrl);
        navigate('/fest/animalresult');
      } else {
        throw new Error('해당 사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={style.container}>
      <img src={titleImg} className={style.titleImg} />
      <p style={{ marginTop: '4vh' }} className={style.p}>
        고유번호 입력
      </p>
      <input
        type="text"
        placeholder="학번 입력(외부인의 경우, 전화번호 입력)"
        value={verificationCode}
        onChange={inputHandler}
        maxLength="8"
        className={style.certificationNum}
      />
      <button
        style={{
          backgroundColor: isButtonActive ? '#FF4B4B' : '#F3F3F3',
          color: isButtonActive ? '#FFFFFF' : '#111',
        }}
        className={style.apply}
        disabled={!isButtonActive}
        onClick={getResult}
      >
        결과 확인
      </button>
    </div>
  );
};

export default AnimalCheck;
