import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BuddyStart from '../../../Assets/buddyStart2.png';
import style from './BuddyStart.module.css';

const BuddyStart2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const BuddyHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/buddy/check-matching-status',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(data.message);
      console.log(data.data.status);
      //console.log(response.data);

      if (data.data.status === null || data.data.status === 'CANCEL') {
        navigate('/buddy/matching');
      } else if (data.data.status === 'IN_PROGRESS') {
        navigate('/buddy/waiting');
      } else if (data.data.status === 'FOUND_BUDDY') {
        navigate('/buddy/accept')
      } else if (data.data.status === "MATCHING_COMPLETED") {
        navigate()
      }

    } catch (error) {
      alert('에러가 발생했습니다.');
      console.log(error.message);
    }
  };

  const BackHandler = () => {
    navigate('/buddy/start1');
  };

  return (
    <div className={style.container}>
      <div className={style.top}>
        <div className={style.imgBack}>
          <img className={style.buddyImg2} src={BuddyStart} alt="BuddyStart" />
        </div>
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
