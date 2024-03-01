import { useState } from 'react';
import style from './InputTextBox.module.css';
import { useEffect } from 'react';


const IDCheckBox = (props) => {
    const [username, setUsername] = useState('');
    const [rightIdMessage, setRightIdMessage] = useState('');

    //중복되지 않은 아이디를 입력한 경우
    const RightIdHandler = (message) =>{
        setRightIdMessage(message);
    }
    // 사용자 입력 처리 핸들러
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        if (props.idData) props.idData(event.target.value); // 상위 컴포넌트로 입력 데이터를 전달
        setRightIdMessage('');
    };

    // 아이디 중복 확인 요청을 처리하는 핸들러
    const checkUsernameDuplicate = async () => {
        if (username.length < 4 || username.length > 24) {
            props.errorHandler("아이디는 4자 이상 24자 이하로 작성해주세요");
        } else {
            props.errorHandler("");
        }
        //아이디 영어+숫자 최소 4자 이상 24자 이하
        if (username.length < 4 || username.length > 24 ) {
            alert('아이디는 4자 이상 24자 이하로 작성해주세요');
        }
        else {
            try {
                // 서버에 아이디 중복 확인 요청. 
                const response = await fetch(
                    `${process.env.REACT_APP_BACK_SERVER}/member/check-account?account=${username}`,
                    {
                        method: 'GET',
                    }
                );
                const data = await response.json();

                if (data.data.isExist) {
                    alert('중복되는 아이디 입니다. 다른 아이디를 입력하세요');
                    props.errorHandler("중복되는 아이디 입니다. 다른 아이디를 입력하세요");
                    props.idExistHandler(true); 
                    console.log("isIdExist 값 : " + data.data.isExist);
                    console.log("중복 O : " + props.isIdExist); // 아이디가 존재 X 사용 O
                } else {
                    alert('사용 가능한 아이디입니다.');
                    RightIdHandler("사용 가능한 아이디 입니다.");
                    props.idExistHandler(false); // 아이디가 존재 X 사용 O
                    console.log("isIdExist 값 : " + data.data.isExist);
                    console.log("중복 X : " + props.isIdExist); // 아이디가 존재 X 사용 O
                }
            } catch (error) {
                console.error('There was an error!', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };



    return (
        <div className={style.relative}>
            <div className={style.emailContainer}>
                <input
                    className={style.inputText}
                    value={props.idValue}
                    onChange={handleUsernameChange}
                    placeholder="아이디를 입력하세요 (8자 이상)"
                />
                <button className={style.idcheckBtn} onClick={() => {
                    checkUsernameDuplicate();
                }}>중복 확인</button>
                {rightIdMessage && <div className={style.RightId}>{rightIdMessage}</div>}
            </div>
        </div>
    );
};

export default IDCheckBox;
