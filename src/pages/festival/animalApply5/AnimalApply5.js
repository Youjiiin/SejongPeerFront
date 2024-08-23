import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import style from '../animalApply5/AnimalApply5.module.css';
import { toast } from 'sonner';

// 동물상 미팅 신청 1페이지
const AnimalApply5 = () => {
  const navigate = useNavigate();

  const [meetingType, setMeetingType] = useState(null);
  const [forms, setForms] = useState([]);
  const [gender, setGender] = useState(null);

  const animalMapping = {
    강아지: 'DOG',
    고양이: 'CAT',
    토끼: 'RABBIT',
    공룡: 'DINOSAUR',
    곰: 'BEAR',
    늑대: 'WOLF',
    사막여우: 'DESERT_FOX',
    사슴: 'DEER',
    햄스터: 'HAMSTER',
  };

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 미팅 유형 및 성별을 가져와 상태를 설정
    const savedMeetingGroupType = localStorage.getItem('MeetingGroupType');
    const savedGender = localStorage.getItem('gender');
    let meetingTypeInt;

    if (savedMeetingGroupType) {
      switch (savedMeetingGroupType) {
        case 'ONE_ON_ONE':
          meetingTypeInt = 1;
          break;
        case 'TWO_ON_TWO':
          meetingTypeInt = 2;
          break;
        case 'THREE_ON_THREE':
          meetingTypeInt = 3;
          break;
        default:
          meetingTypeInt = 1;
      }
      setMeetingType(meetingTypeInt);
      setForms(Array(meetingTypeInt).fill({}));
    }

    if (savedGender) {
      setGender(savedGender);
    }
  }, []);

  const handleChange = (index, field, value) => {
    const newForms = forms.map((form, i) => {
      if (i === index) {
        return { ...form, [field]: value };
      }
      return form;
    });
    setForms(newForms);
  };

  // 성별에 따른 동물상 옵션
  const getAnimalOptions = gender => {
    if (gender === 'FEMALE') {
      return ['강아지', '고양이', '토끼', '공룡', '곰', '늑대'];
    } else if (gender === 'MALE') {
      return ['강아지', '고양이', '토끼', '사막여우', '사슴', '햄스터'];
    }
    return []; // 기본적으로 빈 배열 반환
  };

  // 성별에 따른 동물상 옵션
  const getAnimalOptions1 = gender1 => {
    if (gender1 === 'MALE') {
      return ['강아지', '고양이', '토끼', '공룡', '곰', '늑대'];
    } else if (gender1 === 'FEMALE') {
      return ['강아지', '고양이', '토끼', '사막여우', '사슴', '햄스터'];
    }
    return []; // 기본적으로 빈 배열 반환
  };

  const handleSubmit = async () => {
    const MeetingGroupType =
      meetingType === 1
        ? 'ONE_ON_ONE'
        : meetingType === 2
          ? 'TWO_ON_TWO'
          : 'THREE_ON_THREE';

    const data = forms.map(form => ({
      name: form.name,
      phoneNumber: form.phoneNumber,
      gender: gender,
      selfAnimalType: animalMapping[form.selfAnimalType] || 'NONE',
      firstAnimalType: animalMapping[form.firstAnimalType] || 'NONE',
      secondAnimalType: animalMapping[form.secondAnimalType] || 'NONE',
    }));

    // 요청 데이터 로그 출력
    // console.log('Submitting data:', data);
    // console.log('MeetingGroupType:', MeetingGroupType);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_FEST_SERVER}/user/register?groupType=${MeetingGroupType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success('미팅 신청 완료!');
        navigate('/fest/ApplyComplete'); // 성공 시 성공 페이지로 이동 (페이지 변경 시 적절히 수정)
      } else {
        toast.error('올바른 형태의 이름과 전화번호를 입력해주세요!');
        // console.error('Registration failed', response);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // 폼의 개수에 따라 컨테이너 높이 계산
  const formHeight = 436; // 각 폼의 높이
  const totalHeight = forms.length * formHeight + 200; // 전체 높이는 폼 높이의 합 + 여분의 여백

  return (
    <div className={style.container} style={{ height: `${totalHeight}px` }}>
      {forms.map((form, index) => (
        <div key={index}>
          <p className={style.student}>학생 {index + 1}</p>
          <div className={style.form}>
            <div className={style.formGroup}>
              <label>본인 동물상</label>
              <select
                className={`${style.input2} ${style.select}`}
                onChange={e =>
                  handleChange(index, 'selfAnimalType', e.target.value)
                }
                defaultValue=""
              >
                <option value="" disabled>
                  AI 측정 본인 동물상 선택
                </option>
                {getAnimalOptions1(gender).map(animal => (
                  <option key={animal} value={animal}>
                    {animal}
                  </option>
                ))}
              </select>
            </div>
            <div className={style.formGroup}>
              <label>이름</label>
              <input
                type="text"
                className={style.input}
                onChange={e => handleChange(index, 'name', e.target.value)}
                placeholder="이름 입력"
              />
            </div>
            <div className={style.formGroup}>
              <label>전화번호</label>
              <input
                type="text"
                className={style.input}
                onChange={e =>
                  handleChange(index, 'phoneNumber', e.target.value)
                }
                placeholder="전화번호 - 없이 입력"
              />
            </div>
            <div>
              <label>원하는 동물상</label>
              <div className={style.formGroup1}>
                <select
                  className={style.input2}
                  onChange={e =>
                    handleChange(index, 'firstAnimalType', e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    1순위 선택
                  </option>
                  {getAnimalOptions(gender).map(animal => (
                    <option key={animal} value={animal}>
                      {animal}
                    </option>
                  ))}
                </select>
                <select
                  className={style.input2}
                  onChange={e =>
                    handleChange(index, 'secondAnimalType', e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    2순위 선택
                  </option>
                  {getAnimalOptions(gender).map(animal => (
                    <option key={animal} value={animal}>
                      {animal}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className={style.apply} onClick={handleSubmit}>
        동물상 미팅 신청하기
      </button>
    </div>
  );
};

export default AnimalApply5;
