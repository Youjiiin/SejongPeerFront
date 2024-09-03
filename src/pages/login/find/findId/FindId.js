import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../../../App.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import SignInBox from '../../signIn/SignInBox.js';
import { SubHeader } from '../../../../components/headerRefactor/SubHeader.js';
import style from './FindId.module.css';
import Loading from '../../../../components/load/Loading.js';

const FindId = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pwd, setPWd] = useState('');
  const { setName, setStudentNum, studentNum, name } = useContext(MyContext);
  const [authState, setAuthState] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputID = idinput => {
    setId(idinput);
  };
  const inputPwd = pwdinput => {
    setPWd(pwdinput);
  };

  const isSejong = async () => {
    try {
      setLoading(true);

      // 세종어스 확인
      const response1 = await axios.post(
        process.env.REACT_APP_BACK_SERVER + '/auth/sejong-auth',
        {
          id: id,
          pw: pwd,
        }
      );

      let result = response1.data.data.isAuth;

      if (result === false) {
        toast.error('아이디 및 비밀번호가 일치하지 않습니다');
      } else if (result === true) {
        toast.success('인증 완료');
        console.log(id);
        setStudentNum(id);
        setName(response1.data.data.name);
        setLoading(false);
        setAuthState(true);
        // // handleFindAccount 함수를 비동기로 처리
        // await handleFindAccount();
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        console.log('404 에러 발생: ', err.response.status);
        toast.error('해당 정보로 가입된 계정이 존재하지 않습니다.');
      } else if (err.response && err.response.status === 400) {
        console.log('400 에러 발생: ', err.response.status);
        toast.error('아이디 또는 비밀번호를 입력하지 않았습니다.');
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState) {
      handleFindAccount();
    }
  }, [authState]);
  const handleFindAccount = async () => {
    try {
      console.log('id=', studentNum);
      console.log('name=', name);
      const response2 = await axios.post(
        process.env.REACT_APP_BACK_SERVER + '/member/help/find-account',
        {
          studentId: studentNum,
          name: name,
        }
      );

      let findAccount = response2.data.data.account;
      navigate('/login/resetpwd', { state: { findAccount, studentNum } });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('400 에러 발생: ', err.response.status);
        // alert("아이디 또는 비밀번호를 입력하지 않았습니다.");
      }
    }
  };

  return (
    <div className={style.entire_Container}>
      <SubHeader text="아이디/비밀번호 찾기" customBackLink="/login" />
      <div className={style.container}>
        <div className={style.explain_box2}>
          <p className={style.explain_title}>아이디/비밀번호 찾기</p>
          <p className={style.explain}>세종대학교 포털로그인</p>
        </div>
        <div className={style.aaa}>
          <SignInBox inputID={inputID} name="포털 로그인 아이디(학번)" />
          <SignInBox inputPwd={inputPwd} name="포털 로그인 비밀번호" id="pwd" />
          <button className={style.signInBtn} onClick={isSejong}>
            아이디/비밀번호 찾기
          </button>
          <a href="http://portal.sejong.ac.kr/" className={style.sejong}>
            http://portal.sejong.ac.kr/
          </a>
        </div>
        {loading ? <Loading /> : null}
      </div>
    </div>
  );
};

export default FindId;
