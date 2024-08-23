import { useState, useEffect } from 'react';

import style from './InputTextBox.module.css';

const IDCheckBox = props => {
  const [username, setUsername] = useState('');
  const [rightIdMessage, setRightIdMessage] = useState('');

  //중복되지 않은 아이디를 입력한 경우
  const RightIdHandler = message => {
    setRightIdMessage(message);
  };
  // 사용자 입력 처리 핸들러
  const handleUsernameChange = event => {
    setUsername(event.target.value);
    if (props.idData) props.idData(event.target.value); // 상위 컴포넌트로 입력 데이터를 전달
    setRightIdMessage('');
  };

  const isValidUsername = username => {
    const regexp = /^[a-zA-Z0-9]{4,24}$/;
    return regexp.test(username);
  };

  const validateAccountMsg =
    '아이디는 공백없이 4자 이상 24자 이하로 작성해주세요';
  const existAccountMsg = '중복되는 아이디 입니다. 다른 아이디를 입력하세요';
  const availableAccountMsg = '사용 가능한 아이디입니다.';

  // 아이디 중복 확인 요청을 처리하는 핸들러
  const checkUsernameDuplicate = async () => {
    if (!isValidUsername(username)) {
      props.errorHandler(validateAccountMsg);
    } else {
      props.errorHandler('');
    }
    //아이디 영어+숫자 최소 4자 이상 24자 이하
    if (!isValidUsername(username)) {
      toast.info(validateAccountMsg);
    } else {
      try {
        // 서버에 아이디 중복 확인 요청.
        const response = await fetch(
          `${process.env.REACT_APP_BACK_SERVER}/member/check-account?account=${username}`,
          {
            method: 'GET',
          }
        );
        const data = await response.json();

        if (data.data.isExist) {
          toast.error(existAccountMsg);
          props.errorHandler(existAccountMsg);
          props.idExistHandler(true);
        } else {
          toast.error(availableAccountMsg);
          RightIdHandler(availableAccountMsg);
          props.idExistHandler(false); // 아이디가 존재 X 사용 O
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
          value={props.idValue}
          onChange={handleUsernameChange}
          placeholder="아이디를 입력하세요"
        />
        <button
          className={style.idcheckBtn}
          onClick={() => {
            checkUsernameDuplicate();
          }}
        >
          중복 확인
        </button>
        {rightIdMessage && (
          <div className={style.RightId}>{rightIdMessage}</div>
        )}
      </div>
    </div>
  );
};

export default IDCheckBox;
