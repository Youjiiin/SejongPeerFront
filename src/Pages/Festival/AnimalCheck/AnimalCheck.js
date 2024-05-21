import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../../App';
import { useNavigate } from 'react-router-dom';

import style from './AnimalCheck.module.css'

const AnimalCheck = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const { setAnimalType } = useContext(MyContext);
  const navigate = useNavigate();

  // 입력 확인 핸들러
  const inputHandler = (e) => {
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
  const getResult = async() => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_FEST_SERVER}/measurements/download`, {
            params: {
                studentId: verificationCode
            }
        });

        // 사용자가 있는지 확인
        if (response.data && response.data.data && Array.isArray(response.data.data.scores)) {
          const sort_result = response.data.data.scores.sort((a, b) => b.score - a.score);
          setAnimalType(sort_result);
          navigate('/fest/animalresult');
        } else {
          throw new Error('해당 사용자를 찾을 수 없습니다.');
        }
    } catch (error) {
        alert(error.message);
    }
  }

  return (
    <div className={style.container}>
      <div
        style={{
          width: '30vh',
          height: '30vh',
          backgroundColor: '#D9D9D9',
          marginBottom: '2vh',
          borderRadius: '20px',
        }}
      ></div>
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
        <p className={style.p}>결과 확인</p>
      </button>
    </div>
  );
}

export default AnimalCheck;