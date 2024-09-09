import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../../../App';
import axios from 'axios';

import Loading from '../../../../components/load/Loading';
import { SubHeader } from '../../../../components/headerRefactor/SubHeader';
import style from '../auth/Auth.module.css';
import { toast } from 'sonner';

const Auth = () => {
  const [Id, setId] = useState('');
  const [passWord, setPassWord] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const isSejong = () => {
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACK_SERVER + '/auth/sejong-auth',
        {
          id: Id,
          pw: passWord,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(response => {
        let result = response.data.data.isAuth;
        if (result === false)
          toast.error('아이디 및 비밀번호가 일치하지 않습니다');
        else if (result === true) {
          toast.success('인증 완료');
          setName(response.data.data.name);
          setGrade(response.data.data.grade);
          setStudentNum(Id);
          setLoading(false);
          localStorage.setItem('name', response.data.data.name);
          localStorage.setItem('grade', response.data.data.grade);
          localStorage.setItem('studentId', Id);
          navigate('/login/signup');
        }
        setLoading(false);
      })
      .catch(err => console.log(err.message));
  };

  const { name, setName } = useContext(MyContext);
  const { studentNum, setStudentNum } = useContext(MyContext);
  const { grade, setGrade } = useContext(MyContext);

  const handleId = e => {
    setId(e.target.value);
  };
  const handlePassWord = e => {
    setPassWord(e.target.value);
  };
  return (
    <div className={style.entire_Container}>
      <SubHeader text="회원가입" customBackLink="/login/agree" />
      <div className={style.container}>
        <div className={style.innerBox}>
          <div className={style.auto}>
            <div className={style.topBox}>
              <div className={style.topInnerBox}>
                <div style={{ fontSize: '2.5vh', fontWeight: '700' }}>
                  세종대학교 학생 인증
                </div>
                <div style={{ fontSize: '1.8vh', fontWeight: '500' }}>
                  세종대학교 통합 로그인을 통해 인증합니다.
                </div>
                <div style={{ fontSize: '1.8vh', fontWeight: '500' }}>
                  (세종대학교 포털 ID/PW)
                </div>
              </div>
            </div>
            <div className={style.inputBox}>
              <input
                className={style.inputContent}
                type="text"
                placeholder="포털 로그인 아이디(학번)"
                onChange={handleId}
              />
              <input
                className={style.inputContent}
                type="password"
                placeholder="포털 로그인 비밀번호"
                onChange={handlePassWord}
              />
            </div>
            <div className={style.authBox}>
              <button className={style.authBtn} onClick={isSejong}>
                통합 로그인 인증
              </button>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={style.authA}
                href="http://portal.sejong.ac.kr"
              >
                http://portal.sejong.ac.kr
              </a>
            </div>
          </div>
          {loading ? <Loading /> : null}
        </div>
      </div>
    </div>
  );
};

export default Auth;
