import { useContext, useEffect } from 'react';
import { MyContext } from '../../../../App';
import { useNavigate } from 'react-router-dom';

import styles from '../css/Buddy_Final.module.css';
import con from '../css/B_Container.module.css';
import { toast } from 'sonner';

const Final = props => {
  //각 정보 클릭 시, 페이지 이동
  const Page1 = () => {
    const page = 0;
    props.slideMove(page);
  };
  const Page2 = () => {
    const page = 1;
    props.slideMove(page);
  };
  const Page3 = () => {
    const page = 2;
    props.slideMove(page);
  };
  const Page4 = () => {
    const page = 3;
    props.slideMove(page);
  };

  const { buddySubmit, setBuddySubmit } = useContext(MyContext);

  // 버디 성별
  let sameGender;
  if (props.choiceGender === '동성') {
    sameGender = 'SAME';
  } else {
    sameGender = 'NO_MATTER';
  }

  //버디 범위
  let buddyRange = {};
  if (props.major === '우리 학과 버디') {
    buddyRange = 'SAME_DEPARTMENT';
  } else if (props.major === '우리 단과대 버디') {
    buddyRange = 'SAME_COLLEGE';
  } else {
    buddyRange = 'NO_MATTER';
  }
  //복수/부전공
  let sub = props.subMajor;

  //버디 관계
  let buddyType = {};
  if (props.grade === '선배') {
    buddyType = 'SENIOR';
  } else if (props.grade === '후배') {
    buddyType = 'JUNIOR';
  } else if (props.grade === '동기') {
    buddyType = 'MATE';
  } else {
    buddyType = 'NO_MATTER';
  }

  //버디 학년
  let buddyGrades = {};
  let buddyText = '';
  if (props.gradeDiff === '1') {
    buddyGrades = 'GRADE_1';
    buddyText = '1학년';
  } else if (props.gradeDiff === '2') {
    buddyGrades = 'GRADE_2';
    buddyText = '2학년';
  } else if (props.gradeDiff === '3') {
    buddyGrades = 'GRADE_3';
    buddyText = '3학년';
  } else if (props.gradeDiff === '4') {
    buddyGrades = 'GRADE_4';
    buddyText = '4학년';
  } else {
    buddyGrades = 'NO_MATTER';
    buddyText = '상관없음';
  }

  //전화번호 / 카톡아이디
  let phoneNumber = localStorage.getItem('phoneNumber');
  let kakaoId = localStorage.getItem('kakaoAccount');

  const navigate = useNavigate();

  //통신 함수
  const buddySubmitHandler = async e => {
    let matchingInfo = {
      genderOption: sameGender,
      classTypeOption: buddyType,
      collegeMajorOption: buddyRange,
      gradeOption: buddyGrades,
      isSubMajor: sub,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/buddy/register',
        {
          method: 'POST',
          body: JSON.stringify(matchingInfo),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );

      const data = await response.json(); // data 변수를 await로 초기화

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('제출 성공');
      setBuddySubmit(false);
      navigate('/buddy/waiting');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(error.message);
      setBuddySubmit(false);
    }
  };

  useEffect(() => {
    if (buddySubmit === true) {
      buddySubmitHandler();
    }
  }, [buddySubmit]);

  return (
    <div className={con.container}>
      <p className={con.title}>입력하신 정보를 확인해주세요</p>

      <div className={styles.wrapper}>
        <div className={styles.infoWrapper} onClick={Page1}>
          <div className={styles.titleWrapper}>
            <div className={styles.complete}></div>
            <span>버디성별</span>
          </div>
          <div className={styles.textWrapper}>{props.choiceGender}</div>
        </div>

        <div className={styles.infoWrapper} onClick={Page2}>
          <div className={styles.titleWrapper}>
            <div className={styles.complete}></div>
            <span>버디범위</span>
          </div>
          <div className={styles.textWrapper_grade}>
            <span>{props.major}</span>
            {sub ? (
              <span className={styles.sub}>(복수/부전공 기준)</span>
            ) : (
              <span></span>
            )}
          </div>
        </div>

        <div className={styles.flex}>
          <div className={styles.infoWrapperHalf} onClick={Page3}>
            <div className={styles.titleWrapper}>
              <div className={styles.complete}></div>
              <span>버디관계</span>
            </div>
            <div className={styles.textWrapperHalf}>{props.grade}</div>
          </div>
          <div className={styles.infoWrapperHalf} onClick={Page4}>
            <div className={styles.titleWrapper}>
              <div className={styles.complete}></div>
              <span>버디학년</span>
            </div>
            <div className={styles.textWrapperHalf}>{buddyText}</div>
          </div>
        </div>

        <div className={styles.infoWrapper}>
          <div className={styles.titleWrapper}>
            <div className={styles.complete}></div>
            <span>카카오톡 아이디</span>
          </div>
          <div className={styles.textWrapper}>{kakaoId}</div>
        </div>

        <div className={styles.infoWrapper}>
          <div className={styles.titleWrapper}>
            <div className={styles.complete}></div>
            <span>전화번호</span>
          </div>
          <div className={styles.textWrapper}>{phoneNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default Final;
