import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../../App';

import SignUpElement from './SignUpElement';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

import style from './SignUp.module.css';
import { toast } from 'sonner';

const SignUp = props => {
  // const { name, setName } = useContext(MyContext);
  // const { studentNum, setStudentNum } = useContext(MyContext);
  // const { grade, setGrade } = useContext(MyContext);

  const name = localStorage.getItem('name');
  const studentId = localStorage.getItem('studentId');
  const grade = localStorage.getItem('grade');
  const [idValue, setIdValue] = useState('');
  const [pwdValue, setPwdValue] = useState('');
  const [pwdCheckValue, setPwdCheckValue] = useState(''); //비밀번호 확인 추가

  const [nameValue, setNameValue] = useState(name);
  const [studentNumberValue, setStudentNumberValue] = useState(studentId);
  const [gradeValue, setGradeValue] = useState(grade);

  const [nicknameValue, setNicknameValue] = useState('');
  const [kakaoidValue, setKakaoValue] = useState('');
  const [phoneNumberValue, setPhoneNumberValue] = useState('');
  const [genderValue, setGenderValue] = useState('');
  const [collegeValue, setCollegeValue] = useState('');
  const [majorValue, setMajorValue] = useState('');
  const [doublemajorValue, setDoubleMajorValue] = useState('');
  const [doubleCollegeValue, setDoubleCollegeValue] = useState('');

  const [error, setError] = useState('가입완료 되었습니다.');
  const [step, setStep] = useState(1);
  const [fadeEffect, setFadeEffect] = useState('');
  const [doubleMajorChecked, setDoubleMajorChecked] = useState(false); // Checkbox state for 복수/부전공
  const navigate = useNavigate();

  //중복확인 시 응답 받아오는 함수 (true 일 경우 중복된 아이디, false 인 경우 사용 가능한 아이디)
  const [isIdExist, setIsIdExist] = useState(true);
  const [isNicknameExist, setIsNicknameExist] = useState(true);

  const SignUpErrorHandler = error => {
    setError(error);
    if (error === '') {
      setError('가입완료 되었습니다.');
    }
  };

  const idExistHandler = exist => {
    setIsIdExist(exist);
  };

  const nicknameExistHandler = nick => {
    setIsNicknameExist(nick);
  };

  const nextStepHandler = () => {
    //중복 아이디일 경우 다음 단계로 못 넘어감
    if (isIdExist) {
      toast.error('아이디 중복확인을 해주세요.');
    } else {
      setStep(prevStep => prevStep + 1);
    }
  };

  const gradeData = userData => {
    setGradeValue(userData);
  };

  const idData = userId => {
    setIdValue(userId);
  };
  const pwdData = userPwd => {
    setPwdValue(userPwd);
  };
  const pwdCheckData = userPwd => {
    setPwdCheckValue(userPwd);
  };

  const nameData = userName => {
    setNameValue(userName);
  };
  const kakaoData = userKakaoId => {
    setKakaoValue(userKakaoId);
  };

  const phoneNumData = userPhoneNum => {
    setPhoneNumberValue(userPhoneNum);
  };
  const genderData = userGender => {
    setGenderValue(userGender);
  };

  const collegeData = userCollege => {
    setCollegeValue(userCollege);
  };

  const majorData = userMajor => {
    setMajorValue(userMajor);
  };

  const doublemajorData = userDoubleMajor => {
    setDoubleMajorValue(userDoubleMajor);
  }; //복수전공데이터추가

  const doubleCollegeData = userDoubleCollege => {
    setDoubleCollegeValue(userDoubleCollege);
  };
  const studentNumData = userStudentNum => {
    setStudentNumberValue(userStudentNum);
  };

  const nickNameData = userNickName => {
    setNicknameValue(userNickName);
  }; //추가

  const prevStepHandler = () => {
    //회원가입 뒤로가기
    setStep(1);
  };

  //POST
  async function submitHandler(e) {
    e.preventDefault();
    // 복수전공 체크 여부에 따라 변수 값을 조정
    const finalDoubleCollegeValue = doubleCollegeValue
      ? doubleCollegeValue
      : null;
    const finalDoubleMajorValue = doubleMajorChecked ? doublemajorValue : null;
    let errorClassName = '';

    if (
      idValue === '' ||
      pwdValue === '' ||
      pwdCheckValue === '' ||
      nameValue === '' ||
      studentNumberValue === '' ||
      gradeValue === '' ||
      nicknameValue === '' ||
      kakaoidValue === '' ||
      phoneNumberValue === '' ||
      genderValue === '' ||
      collegeValue === '' ||
      majorValue === ''
    ) {
      toast.error('모든 양식의 작성을 완료해주세요');
      e.preventDefault();
    } else if (isNicknameExist) {
      toast.error('닉네임 중복검사를 진행해주세요.');
    } else {
      if (error === '가입완료 되었습니다.') {
        let join = {
          account: idValue,
          password: pwdValue,
          passwordCheck: pwdCheckValue,
          name: nameValue,
          studentId: studentNumberValue,
          college: collegeValue,
          major: majorValue,
          // subCollege: doubleCollegeValue,
          // subMajor: doublemajorValue,
          subCollege: finalDoubleCollegeValue,
          subMajor: finalDoubleMajorValue,
          grade: gradeValue,
          gender: genderValue,
          phoneNumber: phoneNumberValue,
          nickname: nicknameValue,
          kakaoAccount: kakaoidValue,
        };
        try {
          const response = await fetch(
            process.env.REACT_APP_BACK_SERVER + '/member/sign-up',
            {
              method: 'POST',
              body: JSON.stringify(join),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await response.json();
          if (data.data !== null) {
            errorClassName = data.data.errorClassName;

            if (!response.ok) {
              throw new Error(data.message);
            }
          }
          toast.success('로그인 페이지로 이동합니다.');

          navigate('/login');
        } catch (err) {
          console.log(err.message);
          if (
            errorClassName == 'DUPLICATED_STUDENT_ID' ||
            errorClassName == 'DUPLICATED_PHONE_NUMBER'
          ) {
            toast.error(
              '한 학번과 전화번호 당 한 개의 계정만 생성할 수 있습니다.'
            );
          }
          // else if (errorClassName == "MethodArgumentNotValidException") {
          //   alert("닉네임은 2자 이상 8자 이하 한글, 영어, 숫자만 입력해주세요.");
          // }
          else {
            toast.error(
              ' 실패했습니다. 다시 시도해주세요. (에러 내용: ' +
                err.message +
                ')'
            );
          }
          e.preventDefault();
        }
      } else {
        console.log(error);
        toast.error(error);
        e.preventDefault();
      }
    }
  }

  return (
    <div className={style.entire_Container}>
      <SubHeader text="회원가입" />
      <div className={style.container}>
        <h2 className={style.h2}>기본정보</h2>
        <div className={`${style.form} ${fadeEffect}`}>
          {step === 1 && (
            <>
              {/* <IDCheckBox idData={idData} errorHandler={SignUpErrorHandler} setIsIdExist={setIsIdExist} /> */}
              <SignUpElement
                id="userId"
                title="아이디 입력(공백 없이 4-24자)"
                name="아이디 입력"
                idData={idData}
                SignUpErrorHandler={SignUpErrorHandler}
                idExistHandler={idExistHandler}
                isIdExist={isIdExist}
                idValue={idValue}
              />
              <div className="special-gap">
                <SignUpElement
                  id="pwd"
                  title="비밀번호(10자 이상의 영문, 숫자)"
                  name="비밀번호 입력"
                  pwdData={pwdData}
                  SignUpErrorHandler={SignUpErrorHandler}
                  pwdValue={pwdValue}
                />
              </div>
              <div className="special-gap">
                <SignUpElement
                  id="pwdCheck"
                  name="비밀번호 확인"
                  pwdCheckData={pwdCheckData}
                  SignUpErrorHandler={SignUpErrorHandler}
                  pwdValue={pwdValue}
                  pwdCheckValue={pwdCheckValue}
                />
              </div>
              <SignUpElement
                id="name"
                title="이름"
                name={name}
                nameData={nameData}
                SignUpErrorHandler={SignUpErrorHandler}
              />
              <SignUpElement
                id="studentNum"
                title="학번"
                name={studentId}
                studentNumData={studentNumData}
                SignUpErrorHandler={SignUpErrorHandler}
              />
              <SignUpElement
                id="grade"
                title="학년"
                name={grade}
                gradeData={gradeData}
                SignUpErrorHandler={SignUpErrorHandler}
              />
              <button className={style.submitBtn} onClick={nextStepHandler}>
                다음
              </button>
            </>
          )}
        </div>
        <div className={`${style.form} ${fadeEffect}`}>
          {step === 2 && (
            <>
              <SignUpElement
                id="nickname"
                title="닉네임 입력"
                name="닉네임 입력"
                nickNameData={nickNameData}
                SignUpErrorHandler={SignUpErrorHandler}
                nicknameExistHandler={nicknameExistHandler}
                nicknameValue={nicknameValue}
              />
              <SignUpElement
                id="kakaoid"
                title="카카오톡 아이디"
                name="카카오톡 아이디 입력(매칭 상대방에게 전달)"
                kakaoData={kakaoData}
                SignUpErrorHandler={SignUpErrorHandler}
                kakaoidValue={kakaoidValue}
              />
              <SignUpElement
                id="phoneNum"
                title="전화번호"
                name="전화번호 - 없이 입력"
                phoneNumData={phoneNumData}
                SignUpErrorHandler={SignUpErrorHandler}
                phoneNumberValue={phoneNumberValue}
              />
              <div className={style.Info}>
                *전화번호로 매칭 정보가 전달됩니다. 정확하게 작성해주세요.{' '}
              </div>
              <SignUpElement
                id="gender"
                title="성별"
                name="준비중"
                genderData={genderData}
                SignUpErrorHandler={SignUpErrorHandler}
                genderValue={genderValue}
              />
              <SignUpElement
                id="major"
                title="단과대/학과"
                name="단과대/학과 선택"
                majorData={majorData}
                collegeData={collegeData}
                SignUpErrorHandler={SignUpErrorHandler}
                collegeValue={collegeValue}
                majorValue={majorValue}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: doubleMajorChecked ? 'black' : 'grey',
                }}
              >
                <input
                  type="checkbox"
                  id="double_major_checkbox"
                  checked={doubleMajorChecked}
                  onChange={e => setDoubleMajorChecked(e.target.checked)}
                  style={{
                    marginRight: '10px',
                    marginTop: '15px',
                    cursor: 'pointer',
                  }}
                />
                <label
                  htmlFor="double_major_checkbox"
                  style={{ marginTop: '10px' }}
                >
                  복수/부전공
                </label>
              </div>
              {doubleMajorChecked && (
                <SignUpElement
                  id="double_major"
                  name="복수전공/부전공 선택"
                  doublemajorData={doublemajorData}
                  doubleCollegeData={doubleCollegeData}
                  SignUpErrorHandler={SignUpErrorHandler}
                  doublemajorValue={doublemajorValue}
                  doubleCollegeValue={doubleCollegeValue}
                />
              )}
              <div className={style.Info}>
                *학과선택은 2024 수강편람을 기준으로 정리되었습니다.{' '}
              </div>
              <button
                type="submit"
                className={style.submitBtn}
                onClick={submitHandler}
              >
                가입하기
              </button>
              <p className={style.prevPageText} onClick={prevStepHandler}>
                이전 페이지
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
