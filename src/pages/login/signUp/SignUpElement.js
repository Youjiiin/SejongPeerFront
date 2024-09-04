import { useEffect, useState } from 'react';
import InputTextBox from './InputTextBox';

import GenderSignUp from './GenderSignUp';
import MajorSignUp from './MajorSignUp';
import IDCheckBox from './IDCheckBox';
import NickNameBox from './NickNameBox';

import style from './SignUpElement.module.css';

const SignUpElement = props => {
  const [isError, setIsError] = useState('');
  const [isID, setIsID] = useState(false);
  const [isNickname, setIsNickname] = useState(false);

  const isGender = props.id === 'gender';
  const isMajor = props.id === 'major';
  const isDoubleMajor = props.id === 'double_major';

  const errorHandler = error => {
    setIsError(error);
    props.SignUpErrorHandler(error);
  };

  // useEffect(() => {
  //   if (props.id === "email") {
  //     setIsEmail(true);
  //   } else {
  //     setIsEmail(false);
  //   }
  // }, [props.id]);

  useEffect(() => {
    setIsNickname(props.id === 'nickname'); // 닉네임 필드 식별
    setIsID(props.id === 'userId');
  }, [props.id]);

  return (
    <div className={style.container}>
      {props.id !== 'check' && <p className={style.title}>{props.title}</p>}

      {isNickname ? (
        <NickNameBox
          id={props.id}
          name={props.name}
          value={props.nickNameData} // 수정: 닉네임 데이터를 올바르게 전달
          errorHandler={errorHandler}
          nickNameData={props.nickNameData} // 닉네임 데이터를 상위 컴포넌트로 전달하는 함수
          nicknameExistHandler={props.nicknameExistHandler}
          nicknameValue={props.nicknameValue}
        />
      ) : isID ? (
        <IDCheckBox
          id={props.id}
          name={props.name}
          idData={props.idData}
          errorHandler={errorHandler}
          idExistHandler={props.idExistHandler}
          isIdExist={props.isIdExist}
          idValue={props.idValue}
        />
      ) : isGender ? (
        <GenderSignUp
          id={props.id}
          name={props.name}
          genderData={props.genderData}
          genderValue={props.genderValue}
        />
      ) : isMajor ? (
        <MajorSignUp
          id={props.id}
          name={props.name}
          majorData={props.majorData}
          collegeData={props.collegeData}
          collegeValue={props.collegeValue}
          majorValue={props.majorValue}
        />
      ) : isDoubleMajor ? (
        <MajorSignUp
          id={props.id}
          name={props.name}
          doublemajorData={props.doublemajorData}
          doubleCollegeData={props.doubleCollegeData}
          doubleCollegeValue={props.doubleCollegeValue}
          doublemajorValue={props.doublemajorValue}
        />
      ) :
        (
          <InputTextBox
            id={props.id}
            idData={props.idData}
            name={props.name}
            errorHandler={errorHandler}
            pwdData={props.pwdData}
            pwdValue={props.pwdValue}
            pwdCheckValue={props.pwdCheckValue}
            pwdCheckData={props.pwdCheckData}
            nameData={props.nameData}
            kakaoData={props.kakaoData}
            phoneNumData={props.phoneNumData}
            studentNumData={props.studentNumData}
            gradeData={props.gradeData}
            kakaoidValue={props.kakaoidValue}
            phoneNumberValue={props.phoneNumberValue}
          />
        )}

      {isError && <div style={{
        display: 'flex',
        gap: '5px',
      }}>
      <p className={style.error}>* </p>
      <p className={style.error}>{isError}</p>  
      </div>}
    </div>
  );
};

export default SignUpElement;
