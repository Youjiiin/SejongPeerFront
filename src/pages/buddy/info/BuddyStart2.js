import { useNavigate } from 'react-router-dom';
import BuddyStart from '../../../assets/image/buddyStart2.png';
import style from './BuddyStart.module.css';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

const BuddyStart2 = () => {
  const navigate = useNavigate();

  const BuddyHandler = async () => {
    navigate('/buddy/matching');
  };

  const BackHandler = () => {
    navigate('/buddy/start1');
  };

  return (
    <div className={style.container}>
      <SubHeader text="세종버디" />
      <div className={style.top}>
        {/* <div className={style.imgBack}> */}
        <img className={style.buddyImg2} src={BuddyStart} alt="BuddyStart" />
        {/* </div> */}
        <div className={style.wrapper}>
          <p className={style.title}>세종버디란?</p>
          <p className={style.text}>세종버디(Buddy)는</p>
          <p className={style.text}>
            <span className={style.text_red}>맞춤형 캠퍼스 짝꿍</span>을 찾는
            서비스입니다.
          </p>
          <p className={style.text2}>
            한명의 학우와 한 학기 동안 버디로 매칭 되며, 다음 학기에 새로운
            버디를 찾을 수 있습니다.
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
