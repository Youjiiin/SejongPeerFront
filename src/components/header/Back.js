import { useNavigate, useLocation } from 'react-router-dom';

import backicon from '../../assets/image/back_white.png';
import sejongpeertext from '../../assets/image/sejongpeertext.png';
import sejongBuddy from '../../assets/image/sejongBuddy.png';
import sejongStudy from '../../assets/image/sejongStudy.png';
import sejongHonbob from '../../assets/image/sejongHonbob.png';
import login from '../../assets/image/login.png';
import mypage from '../../assets/image/mypage.png';
import meeting from '../../assets/image/meeting.png';

import style from './Back.module.css';

const Back = () => {
  const navigate = useNavigate();
  const backHandler = () => {
    if (location.pathname === '/main') {
      navigate('/main');
    } else {
      navigate(-1);
    }
  };

  const warningMessage = () => {
    const backToMain = window.confirm(
      '확인을 누르면 메인 화면으로 이동합니다.\n지금까지 작성한 내용들이 모두 초기화 됩니다.'
    );
    if (backToMain) {
      navigate('/main');
    }
  };

  const location = useLocation();

  const ChangeBack = () => {
    if (location.pathname === '/buddy/matching') {
      warningMessage();
    } else {
      backHandler();
    }
  };
  const isMain = location.pathname === '/main' ? true : false;
  // 로그인
  const isLoginPath = location.pathname.startsWith('/login');
  // 회원가입
  const isFestPath = location.pathname.startsWith('/fest');
  const isBuddyPath = location.pathname.startsWith('/buddy');
  const isStudyPath = location.pathname.startsWith('/study');
  const isHonbobPath = location.pathname.startsWith('/honbob/');
  const ismyPage = location.pathname.startsWith('/mypage');

  return (
    <button onClick={ChangeBack} className={style.wrapper}>
      {location.pathname !== '/main' && (
        <img className={style.backicon} src={backicon} alt="backicon" />
      )}
      {isMain && (
        <img
          className={style.sejongpeertext}
          src={sejongpeertext}
          alt="textLogo"
        />
      )}
      {isLoginPath && (
        <img className={style.sejongpeertext} src={login} alt="textLogo" />
      )}
      {isBuddyPath && (
        <img
          className={style.sejongpeertext}
          src={sejongBuddy}
          alt="textLogo"
        />
      )}
      {isStudyPath && (
        <img
          className={style.sejongpeerlogo}
          src={sejongStudy}
          alt="sejongpeerlogo"
        />
      )}
      {isHonbobPath && (
        <img
          className={style.sejonghonboblogo}
          src={sejongHonbob}
          alt="sejongpeerlogo"
        />
      )}
      {ismyPage && (
        <img className={style.mypagelogo} src={mypage} alt="mypage" />
      )}
      {isFestPath && (
        <img className={style.mypagelogo} src={meeting} alt="mypage" />
      )}

      {/* {isStudy && (
        <img
          className={style.sejongpeerlogo}
          src={sejongStudy}
          alt="sejongpeerlogo"
        />
      )}
      {isStudyDetail && (
        <img
          className={style.sejongpeerlogo}
          src={sejongStudy}
          alt="sejongpeerlogo"
        />
      )}
      {isPost && (
        <img
          className={style.sejongpeerlogo}
          src={sejongStudy}
          alt="sejongpeerlogo"
        />
      )} */}
    </button>
  );
};

export default Back;
