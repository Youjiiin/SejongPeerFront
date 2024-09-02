import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import check from '../../../assets/image/check2.png';
import check2 from '../../../assets/image/check3.png';
import box from './Agree.module.css';
import sub from './SignUp.module.css';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

const Agree = () => {
  const [agree, setAgree] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  const navigate = useNavigate();

  const agreeHandler = () => {
    if (agree1 !== true && agree2 !== true) {
      setAgree1(true);
      setAgree2(true);
      setAgree(true);
    } else if (agree1 !== true && agree2 === true) {
      setAgree1(true);
      setAgree2(true);
      setAgree(true);
    } else if (agree1 === true && agree2 !== true) {
      setAgree1(true);
      setAgree2(true);
      setAgree(true);
    } else {
      setAgree1(false);
      setAgree2(false);
      setAgree(false);
    }
  };

  const agree1Handler = () => {
    if (agree1 === false) {
      setAgree1(true);
      if (agree2 === true) {
        setAgree(true);
      }
    } else {
      setAgree1(false);
      setAgree(false);
    }
  };
  const agree2Handler = () => {
    if (agree2 === false) {
      setAgree2(true);
      if (agree1 === true) {
        setAgree(true);
      }
    } else {
      setAgree2(false);
      setAgree(false);
    }
  };

  // const goSignUp = () => {
  //   if (agree !== true) {
  //     alert("모두 동의를 해야 회원가입이 가능합니다.");
  //   } else {
  //     navigate("/login/SignUp");
  //   }
  // };
  const moveToAuth = () => {
    if (agree !== true) {
      toast.error('모두 동의를 해야 회원가입이 가능합니다.');
    } else {
      navigate('/login/auth');
      // navigate("/checksejong");
    }
  };

  const agreeborder = agree ? box.agreebox_agree : box.agreebox;

  const agree1border = agree1 ? box.agreebox_agree : box.agreebox;

  const agree2border = agree2 ? box.agreebox_agree : box.agreebox;

  return (
    <div className={box.entire_Container}>
      <SubHeader text="회원가입" />
      <div className={box.container}>
        <div className={box.auto}>
          <div className={box.inputText}>
            <span className={box.text}>전체 약관 동의</span>
            <button className={agreeborder} onClick={agreeHandler}>
              {agree ? (
                <img src={check2} className={box.agree} alt="check2" />
              ) : (
                <img src={check} className={box.agree} alt="check" />
              )}
            </button>
          </div>

          <div className={box.flex}>
            <div className={box.left}>
              <p className={box.essential}>[필수]</p>
              <Link to={'/personalinfo'} className={box.link} target="_blank">
                개인정보 수집 동의 &gt;
              </Link>
            </div>
            <button className={agree1border} onClick={agree1Handler}>
              {agree1 ? (
                <img src={check2} className={box.agree} alt="check2" />
              ) : (
                <img src={check} className={box.agree} alt="check" />
              )}
            </button>
          </div>

          <div className={box.flex}>
            <div className={box.left}>
              <p className={box.essential}>[필수]</p>
              <Link to={'/personalinfo2'} className={box.link} target="_blank">
                이용약관 동의 &gt;
              </Link>
            </div>
            <button className={agree2border} onClick={agree2Handler}>
              {agree2 ? (
                <img src={check2} className={box.agree} alt="check2" />
              ) : (
                <img src={check} className={box.agree} alt="check" />
              )}
            </button>
          </div>

          <button onClick={moveToAuth} className={sub.submitBtn}>
            동의 및 회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agree;
