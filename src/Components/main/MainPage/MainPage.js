import { Link, useNavigate } from "react-router-dom";
import style from "./MainPage.module.css";
import MainBuddy from "./MainBuddy";
import MainHonbob from "./MainHonbob";
import reprot from "../../../Assets/report.png"
//import MainStudy from "./MainStudy";

const MainPage = () => {
  const navigate = useNavigate();
  const BuddyHandler = () => {
    navigate("/buddy/start1");
  };
  const HonbobHandler = () => {
    navigate("/honbob/start1");
  };
  const reportUserHandler = () => {
    alert("너 신고");
  };
  // const readyHandler = () => {
  //   alert("준비중임");
  // };

  return (
    <div className={style.container}>
      <button onClick={BuddyHandler} className={style.btn}>
        <MainBuddy />
      </button>
      <button onClick={HonbobHandler} className={style.btn}>
        <MainHonbob />
      </button>
      {/* <button className={style.btn} onClick={readyHandler}>
            <MainStudy />
        </button> */}
      <footer className={style.footer}>
        <div className={style.ftxtBox}>
          <Link to={"/personalinfo"} target="_blank" className={style.ftxt}>
            <span>개인정보처리방침</span>
          </Link>
          <span className={style.ftxt}> | </span>
          <Link to={"/useinfo"} target="_blank" className={style.ftxt}>
            <span>이용약관</span>
          </Link>
        </div>
        <div className={style.report_user_box}>
          <span>악성 유저 신고</span>
          <div className={style.reprot_icon} onClick={reportUserHandler}>
            <img src={reprot} alt="reprot"/> 
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
