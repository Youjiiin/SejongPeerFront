import { useNavigate } from 'react-router-dom';
import BuddyStart from '../../../assets/image/buddyStart2.png';
import style from './BuddyStart.module.css';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';
import { toast } from 'sonner';

const BuddyStart2 = () => {
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');

  const BuddyHandler = async () => {
    if (refreshToken === null || accessToken === null) {
      toast.error('로그인 후 이용 가능한 서비스입니다!');
      navigate('/login');
    } else navigate('/buddy/matching');
  };

  const BackHandler = () => {
    navigate('/buddy/start1');
  };

  return (
    <div className={style.container}>
      <SubHeader text="세종버디" customBackLink="/buddy/start1" />
      <div className={style.top}>
        {/* <div className={style.imgBack}> */}
        <img className={style.buddyImg2} src={BuddyStart} alt="BuddyStart" />
        {/* </div> */}
        <div className={style.wrapper}>
          <p className={style.title}>세종버디란?</p>
          <p className={style.text}>세종버디(Buddy)는</p>
          <p className={style.text} style={{ marginTop: '10px' }}>
            <span className={style.text_red}>맞춤형 캠퍼스 짝꿍</span>을 찾는
            서비스입니다.
          </p>
          <p className={style.text2}>
            한명의 학우와 한 학기 동안 버디로 매칭 되며,
          </p>
          <p className={style.text2}>
            다음 학기에 새로운 버디를 찾을 수 있습니다.
          </p>
        </div>
      </div>
      <div className={style.bottom}>
        <button onClick={BuddyHandler} className={style.btn2}>
          다음 페이지
        </button>
        <button onClick={BackHandler} className={style.back}>
          이전 페이지
        </button>
      </div>
    </div>
  );
};

export default BuddyStart2;
