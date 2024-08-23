import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../animalApply2/AnimalApply2.module.css';
import { toast } from 'sonner';

// 동물상 미팅 신청 2페이지
const AnimalApply2 = () => {
  const [personalInfoChecked, setPersonalInfoChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  // 미리 정의된 인증 코드
  const secretKeys = ['3545', '4859', '0789'];

  // 버튼 활성화 여부를 결정하는 함수
  const isButtonActive = personalInfoChecked && isCodeValid;

  const navigate = useNavigate();

  // 다음 페이지로 이동하는 함수
  const handleNextPage = () => {
    if (isButtonActive) {
      toast.success('인증 성공!');
      navigate('/fest/AnimalApply3'); // 버튼 활성화 시 다음 페이지 URL을 변경하세요.
    }
  };

  // 인증 코드 변경 핸들러
  const handleVerificationCodeChange = e => {
    const value = e.target.value;
    setVerificationCode(value);

    // 인증 코드가 유효한지 확인
    if (secretKeys.includes(value)) {
      setIsCodeValid(true);
      // alert('인증 성공!');
    } else {
      setIsCodeValid(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.container2}></div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '5px',
          marginTop: '20px',
        }}
      >
        <input
          type="checkbox"
          checked={personalInfoChecked}
          onChange={e => setPersonalInfoChecked(e.target.checked)}
        />{' '}
        <a href="https://sejongpeerprivacypolicy.simple.ink/">
          <p style={{ margin: '0' }}>개인정보 수집동의</p>
        </a>
      </div>
      <br />
      <p className={style.p}>인증번호 입력</p>
      <input
        type="text"
        placeholder="인증번호 4자리를 입력해 주세요"
        value={verificationCode}
        onChange={handleVerificationCodeChange}
        maxLength="4"
        className={style.certificationNum}
      />
      <br />
      <button
        style={{
          backgroundColor: isButtonActive ? '#FF4B4B' : '#F3F3F3',
          color: isButtonActive ? '#FFFFFF' : '#111',
        }}
        className={style.apply}
        disabled={!isButtonActive}
        onClick={handleNextPage}
      >
        <p className={style.p} style={{ margin: '0' }}>
          동물상 미팅 신청
        </p>
      </button>
    </div>
  );
};

export default AnimalApply2;
