import { useEffect, useRef, useState } from "react";
import style from "./HonbobSuccess.module.css";
import { useNavigate } from "react-router-dom";


const HonbobSuccess = () => {
    const navigate = useNavigate();
    const isFirstRender = useRef(true);
    const [major, setMajor] = useState('');
    const [grade, setGrade] = useState('');
    const [name, setName] = useState('');
    const [kakao, setKakao] = useState('');
    const [menu, setMenu] = useState('');
    //상태변환
    useEffect(() => {
        if (isFirstRender.current) {
            getInfoHandler();
        }
    }, []);

    const getInfoHandler = () => {
        fetch(process.env.REACT_APP_BACK_SERVER + '/honbab/partner/information', {
            method: 'GET',
            headers : {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Refresh-Token': localStorage.getItem('refreshToken'),
            }
          })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setMajor(data.data.collegeMajor);
            setGrade(data.data.grade);
            setName(data.data.name);
            setKakao(data.data.kakaoAccount);
            setMenu(data.data.menuCategoryOption);
            console.log(data.data.collegeMajor);
            console.log(data.data.grade);
            console.log(data.data.name);
            console.log(data.data.kakaoAccount);
          })
          .catch((error) => console.log(error))
    };

    const goHome = () => {
        navigate('/main');
    };

    return (
        <div className={style.container}>
            <div className={style.Text}>밥짝꿍 매칭 성공!</div>
            <div className={style.imgBox} />
            <div className={style.informBox}>
                <div className={style.innerBox}>
                    <div className={style.name}>{name}</div>
                    <div className={style.prefer}>{menu} 선호</div>
                    <div className={style.IdBox}>
                        <div className={style.KaKaoTitle}>카카오톡 아이디</div>
                        <div className={style.KaKaoId}>{kakao}</div>
                    </div>
                </div>
            </div>
            <button onClick={goHome} className={style.moveToHome}>홈페이지로 이동</button>
        </div>
    );
}

export default HonbobSuccess;