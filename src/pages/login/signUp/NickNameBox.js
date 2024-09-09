import { useState } from 'react';
import style from './InputTextBox.module.css';
import { toast } from 'sonner';

const NickNameBox = props => {
  const [nickname, setNickname] = useState('');

  // 사용자 입력 처리 핸들러
  const handleNicknameChange = event => {
    setNickname(event.target.value);
    if (props.nickNameData) props.nickNameData(event.target.value); // 상위 컴포넌트로 입력 데이터를 전달
  };

  function isValidNickname(nickname) {
    const regexp = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ0-9]{2,8}$/;
    return regexp.test(nickname);
  }
  const validateNicknameMsg =
    '공백없이 2자 이상 8자 이하 한글, 영어, 숫자만 작성해주세요.';
  const existNicknameMsg = '중복되는 닉네임 입니다. 다른 닉네임을 입력하세요.';

  // 닉네임 중복 확인 요청을 처리 핸들러
  const checkNicknameDuplicate = async () => {
    // 사용 예시
    if (!isValidNickname(nickname)) {
      props.errorHandler(validateNicknameMsg);
    } else {
      props.errorHandler('');
    }

    //닉네임 최소 2자, 8자 이하
    if (!isValidNickname(nickname)) {
      toast.error(validateNicknameMsg);
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_SERVER}/member/check-nickname?nickname=${nickname}`,
          {
            method: 'GET',
          }
        );

        const data = await response.json();

        // 서버로부터 받은 응답을 바탕으로 중복 여부
        if (data.data.isExist) {
          toast.error(existNicknameMsg);
          props.errorHandler(existNicknameMsg);
          props.nicknameExistHandler(true);
        } else {
          toast.success('사용 가능한 닉네임입니다.');
          props.nicknameExistHandler(false);
        }
      } catch (error) {
        console.error('There was an error!', error);
        toast.error('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className={style.relative}>
      <div className={style.emailContainer}>
        <input
          className={style.inputText}
          value={props.nicknameValue}
          onChange={handleNicknameChange}
          placeholder="닉네임을 입력해주세요"
        />
        <button
          className={style.idcheckBtn}
          onClick={() => {
            checkNicknameDuplicate();
          }}
        >
          중복 확인
        </button>
      </div>
    </div>
  );
};

export default NickNameBox;
