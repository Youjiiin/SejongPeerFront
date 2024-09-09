import style from './InputTextBox.module.css';

const InputTextBox = props => {
  const isPWD = props.id === 'pwd';
  const isPWDCheck = props.id === 'pwdCheck';
  const isAuthData =
    props.id === 'studentNum' || props.id === 'grade' || props.id === 'name';
  const isKakao = props.id === 'kakaoid';
  const isPhone = props.id === 'phoneNum';

  const inputHandler = event => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*?]{10,}$/;


    let inputValue = event.target.value;
    //아이디
    if (props.id === 'userId') {
      props.idData(inputValue);
      if (inputValue.length >= 8) {
        props.errorHandler('');
      } else {
        //props.errorHandler('* 아이디는 8자 이상 작성해주세요');
      }
      //패스워드
    } else if (props.id === 'pwd') {
      props.pwdData(inputValue);
      // 영어와 숫자를 모두 포함하는지 확인하는 정규 표현식

      if (inputValue.length >= 10) {
        if (regex.test(inputValue)) {
          props.errorHandler('');
        } else {
          props.errorHandler(
            `영어와 숫자를 모두 포함해야 합니다.\n \t(특수문자는 !@#$%^&*?만)`
          );
        }
      } else {
        props.errorHandler('비밀번호는 10자이상으로 작성해주세요');
      }
      //패스워드 확인
    } else if (props.id === 'pwdCheck') {
      props.pwdCheckData(inputValue);

      if (inputValue !== props.pwdValue) {
        props.errorHandler('동일하게 비밀번호를 입력해 주세요');
      } else if (!regex.test(inputValue)) {
        props.errorHandler('비밀번호는 영어와 숫자를 모두 포함해야 합니다.');
      } else if (inputValue.length < 10) {
        props.errorHandler('비밀번호는 10자이상으로 작성해주세요');
      } else {
        props.errorHandler(''); // 에러 메시지를 지웁니다.
      }
    } //이름
    else if (props.id === 'name') {
      props.nameData(inputValue);
    } //학번
    else if (props.id === 'studentNum') {
      props.studentNumData(inputValue);
      //학년
    } else if (props.id === 'grade') {
      props.gradeData(inputValue);
    } //닉네임
    else if (props.id === 'nickname') {
      props.nickNameData(inputValue);
    } //카카오아이디
    else if (props.id === 'kakaoid') {
      props.kakaoData(inputValue);
    } //전화번호
    else if (props.id === 'phoneNum') {
      props.phoneNumData(inputValue);
      if (inputValue.includes('-')) {
        props.errorHandler('하이픈(-)은 빼고 작성해주세요');
      } else {
        if (inputValue.length < 11) {
          props.errorHandler('전화번호는 11자리로 입력해주세요');
        } else if (inputValue.length === 11) {
          props.errorHandler('');
        } else if (inputValue.length > 11) {
          props.errorHandler('전화번호는 11자리로 입력해주세요');
          event.preventDefault();
        }
      } //성별
    } else if (props.id === 'gender') {
      props.genderData(inputValue);
    } //단과대
    else if (props.id === 'major') {
      props.majorData(inputValue);
    } //학과
    else if (props.id === 'college') {
      props.collegeData(inputValue);
    } //(복수전공)단과대
    else if (props.id === 'double_major') {
      props.doublemajorData(inputValue);
    } //(복수전공)학과
    else if (props.id === 'double_college') {
      props.doubleCollegeData(inputValue);
    } else {
      console.log('Unhandled input type: ', props.id);
    }
  };

  return (
    <div className={style.relative}>
      {isPWD ? ( //패스워드입력
        <input
          className={style.inputText}
          type="password"
          placeholder={props.name}
          onChange={inputHandler}
          value={props.pwdValue}
        />
      ) : isPWDCheck ? ( //패스워드입력
        <input
          className={style.inputText}
          type="password"
          placeholder={props.name}
          onChange={inputHandler}
          value={props.pwdCheckValue}
        />
      ) : isKakao ? (
        <input
          value={props.kakaoidValue}
          className={style.inputText}
          placeholder={props.name}
          onChange={inputHandler}
        />
      ) : isPhone ? (
        <input
          className={style.inputText}
          placeholder={props.name}
          onChange={inputHandler}
          value={props.phoneNumberValue}
        />
      ) : (
        <input
          className={style.inputText}
          placeholder={props.name}
          onChange={inputHandler}
          disabled={isAuthData}
        />
      )}
    </div>
  );
};

export default InputTextBox;
