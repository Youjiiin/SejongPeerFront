import { useState } from 'react';
import style from './InputTextBox.module.css';
import { toast } from 'sonner';

const EmailBox = props => {
  const [inputEmail, setInputEmail] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [modifyEmail, setModifyEmail] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [checkCode, setCheckCode] = useState(false);

  const inputEmailHandler = event => {
    let inputValue = event.target.value;
    setInputEmail(inputValue + '@sju.ac.kr');
    props.emailData(inputValue + '@sju.ac.kr');
    if (inputValue.includes('@')) {
      props.errorHandler('* @sju.ac.kr을 제외하고 작성해주세요');
    } else {
      if (sendEmail === false) {
        props.errorHandler('* 이메일 인증을 진행해주세요');
      } else {
        props.errorHandler('');
      }
    }
  };
  const inputCheckHandler = event => {
    let inputValue = event.target.value;
    setInputCode(inputValue);
  };

  //이메일 인증번호 전송
  const sendEmailHandler = async e => {
    if (inputEmail.includes('@sju.ac.kr@sju.ac.kr')) {
      toast.error('* @sju.ac.kr을 제외하고 작성해주세요');
    } else {
      toast.success('메일이 전송 되었습니다.');
      let emailSend = {
        email: inputEmail,
      };
      const backUrl = process.env.REACT_APP_BACK_SERVER;
      try {
        const response = await fetch(
          process.env.REACT_APP_BACK_SERVER + '/email/verification/send',
          {
            method: 'POST',
            body: JSON.stringify(emailSend),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json(); // data 변수를 await로 초기화

        if (!response.ok) {
          throw new Error(data.message);
        }

        setSendEmail(true);
        props.errorHandler('* 인증코드를 작성해주세요');
      } catch (error) {
        console.error('Error occurred:', error);
        console.error(error.message);
        toast.error(error.message);
        props.errorHandler(
          '* 이메일 전송을 실패했습니다. 이메일을 다시 확인해 주세요'
        );
        e.preventDefault();
      }
    }
  };

  //이메일 인증번호 확인
  async function checkEmailHandler(e) {
    const CheckEmail = {
      email: inputEmail,
      code: inputCode,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/email/verification/check',
        {
          method: 'POST',
          body: JSON.stringify(CheckEmail),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json(); // data 변수를 await로 초기화

      if (!response.ok) {
        throw new Error(data.message);
      }

      // console.log(data);
      setModifyEmail(true);
      setCheckCode(true);
      props.errorHandler('');
      toast.success('인증성공');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(
        '확인에 실패했습니다. 다시 시도해주세요. (에러 내용: ' +
          error.message +
          ')'
      );
      props.errorHandler('* 이메일 혹은 인증코드를 확인해주세요');
      e.preventDefault();
    }
  }

  //이메일 전송 성공했을시
  const checkNumber = sendEmail ? style.emailBtn : style.emailCheckBtn;
  //인증코드 확인 성공했을시
  const successCode = checkCode ? style.emailCheckBtn : style.emailBtn;

  return (
    <div className={style.relative}>
      <div className={style.emailContainer}>
        <input
          className={style.inputText}
          placeholder={props.name}
          onChange={inputEmailHandler}
          readOnly={modifyEmail}
        />
        <button
          type="button"
          className={successCode}
          onClick={sendEmailHandler}
          disabled={checkCode}
        >
          인증
        </button>
      </div>

      <div className={style.emailContainer}>
        <input
          className={style.inputText}
          placeholder="인증코드를 입력해 주세요"
          onChange={inputCheckHandler}
          readOnly={checkCode}
        />
        <button
          type="button"
          className={checkNumber}
          onClick={checkEmailHandler}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default EmailBox;
