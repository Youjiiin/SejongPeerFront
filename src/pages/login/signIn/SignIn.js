import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { MyContext } from '../../../App';
import SignInBox from './SignInBox';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';
import style from './SignIn.module.css';
import { toast } from 'sonner';

const SignIn = () => {
  const { setLogoutTimer } = useContext(MyContext);
  const navigate = useNavigate();
  const goSignUpHandler = () => {
    navigate('/login/agree');
  };
  const goFindIdHandler = () => {
    navigate('/login/findid');
  };

  const [id, setId] = useState('');
  const [pwd, setPWd] = useState('');

  const inputID = idinput => {
    setId(idinput);
  };
  const inputPwd = pwdinput => {
    setPWd(pwdinput);
  };

  const LoginHandler = async e => {
    e.preventDefault(); // 기본 이벤트를 방지합니다.

    let login = {
      account: id,
      password: pwd,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/auth/sign-in',
        {
          method: 'POST',
          body: JSON.stringify(login),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        toast.error('아이디나 비밀번호가 일치하지 않습니다.');
        const errorData = await response.json(); // 오류 응답을 처리합니다.
        throw new Error(errorData.message);
      }

      const data = await response.json(); // data 변수를 await로 초기화
      toast.success('로그인에 성공했습니다. 메인화면으로 이동합니다!');
      // 로그인 성공 후, 로컬 스토리지에 저장
      localStorage.setItem('kakaoAccount', data.data.kakaoAccount);
      localStorage.setItem('name', data.data.name);
      localStorage.setItem('grade', data.data.grade);
      localStorage.setItem('major', data.data.major);
      localStorage.setItem('minor', data.data.minor); // null 값이 가능하므로 처리 필요 없음
      localStorage.setItem('nickname', data.data.nickname);
      localStorage.setItem('phoneNumber', data.data.phoneNumber);
      localStorage.setItem('account', data.data.account);
      localStorage.setItem('studentId', data.data.studentId);
      localStorage.setItem('gender', data.data.gender);

      //토큰
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      //로그인 타이머
      setLogoutTimer(data.data.refreshToken);
      navigate('/main');
    } catch (error) {
      console.error(error.message);
      // toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={style.entire_Container}>
      <SubHeader text="로그인" customBackLink="/login" />
      <div className={style.container}>
        <SignInBox inputID={inputID} name="아이디" />
        <SignInBox inputPwd={inputPwd} name="비밀번호" id="pwd" />
        <button className={style.signInBtn} onClick={LoginHandler}>
          로그인
        </button>
        <div>
          <button onClick={goFindIdHandler} className={style.findBtn}>
            ID • PW 찾기
          </button>
          <span className={style.line}> | </span>
          <button onClick={goSignUpHandler} className={style.signUpBtn}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
