import con from '../css/H_Container.module.css';
import style from '../css/H_informCheck.module.css';
const H_informCheck = props => {
  const kakaoAccount = localStorage.getItem('kakaoAccount');
  const phoneNumber = localStorage.getItem('phoneNumber');
  return (
    <div className={con.container}>
      <p className={con.title}>입력하신 정보를 확인해주세요.</p>
      <div className={style.informContainer}>
        <div className={style.genderCon}>
          <div className={style.titleContainer}>
            <span
              style={{
                color: '#FF7474',
                fontSize: '2.5vh',
                fontWeight: 'bold',
              }}
            >
              •
            </span>{' '}
            <span className={style.font}>밥짝꿍 성별</span>
          </div>

          <div className={style.divBox}>{props.choiceGenderKorean}</div>
        </div>
        <div className={style.menuCon}>
          <div className={style.titleContainer}>
            <span
              style={{
                color: '#FF7474',
                fontSize: '2.5vh',
                fontWeight: 'bold',
              }}
            >
              •
            </span>{' '}
            <span className={style.font}>선호 메뉴</span>
          </div>
          <div className={style.divBox}>{props.choiceMenuKorean}</div>
        </div>
        <div className={style.kakaoCon}>
          <div className={style.titleContainer}>
            <span
              style={{
                color: '#FF7474',
                fontSize: '2.5vh',
                fontWeight: 'bold',
              }}
            >
              •
            </span>{' '}
            <span className={style.font}>카카오톡 아이디</span>
          </div>
          <div className={style.divBox}>{kakaoAccount}</div>
        </div>
        <div className={style.phoneNumCon}>
          <div className={style.titleContainer}>
            <span
              style={{
                color: '#FF7474',
                fontSize: '2.5vh',
                fontWeight: 'bold',
              }}
            >
              •
            </span>{' '}
            <span className={style.font}>전화번호</span>
          </div>
          <div className={style.divBox}>{phoneNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default H_informCheck;
