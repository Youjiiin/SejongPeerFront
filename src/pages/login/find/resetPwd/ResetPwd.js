import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignInBox from '../../signIn/SignInBox.js';
import style from '../../signIn/SignIn.module.css';
import css from './ResetPwd.module.css';
import { toast } from 'sonner';

const ResetPwd = () => {
  const [inputPwd, setInputPwd] = useState('');
  const [inputPwd2, setInputPwd2] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // location.state -> findAccount 데이터에 접근
  const findAccount = location.state?.findAccount;
  const studentNum = location.state?.studentNum;

  const resetPwdHandler = () => {
    if (inputPwd === inputPwd2) {
      axios
        .put(
          `${process.env.REACT_APP_BACK_SERVER}/member/help/reset-password`,
          {
            studentId: studentNum,
            account: findAccount,
            password: inputPwd,
            passwordCheck: inputPwd2,
          }
        )
        .then(response => {
          toast.success('비밀번호 변경이 정상적으로 이루어 졌습니다.'),
            navigate('/login');
        })
        .catch(err => console.log(err.data));
    } else {
      toast.error('비밀번호가 일치하지 않습니다.');
    }
  };

  const inputPwdHandler = inputPwd => {
    setInputPwd(inputPwd);
  };

  const inputPwdHandler2 = inputPwd2 => {
    setInputPwd2(inputPwd2);
  };

  return (
    <div className={style.entire_Container}>
      <div className={style.container}>
        <div className={css.explain_box}>
          <p className={css.explain}>회원님의 ID는</p>
          <div className={css.show_id}>{findAccount}</div>
          <p className={css.explain}>입니다.</p>
        </div>
        <div className={css.reset_title}>
          <span className={css.explain} value={inputPwd}>
            비밀번호 변경하기
          </span>
          <p className={css.explain_sub} value={inputPwd2}>
            새로운 비밀번호(10-16자의 영문 + 숫자)
          </p>
        </div>
        <div className={css.resetPwdWrapper}>
          <SignInBox inputPwd={inputPwdHandler} id="pwd" name="비밀번호 입력" />
          <SignInBox
            inputPwd={inputPwdHandler2}
            id="pwd"
            name="비밀번호 재입력"
          />
          <button className={style.signInBtn} onClick={resetPwdHandler}>
            비밀번호 변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPwd;
