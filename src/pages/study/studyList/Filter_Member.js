import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import style from './Filter_Member.module.css';
import { useContext } from 'react';
import { MyContext } from '../../../App';
import useFilterStore from './useFilterStore';
import { searchHandler } from './api';

const Filter_Member = ({ closeModal }) => {
  const { setModalOpen } = useContext(MyContext);
  
  const trackStyle = {
    backgroundColor: '#FF4B4B',
  };
  const handleStyle = {
    backgroundColor: '#FF4B4B',
    border: 'solid 2px #FF4B4B',
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    opacity: '1',
    boxShodow: '0 0 0 3px #FFF',
  };
  const sliderwidth = {
    width: '95%',
  };

  const { member, setMember } = useFilterStore();
  const handleSliderChange = value => {
    setMember(value); // 슬라이더 값을 업데이트
  };

  const submitHandler = async () => {
    try {
      const { category, member, recruiting } = useFilterStore.getState();
      console.log("djdjdjd" + category, member, recruiting)
      const filterValues = { category, member, recruiting };
      const data = await searchHandler(filterValues);
      console.log(data);
      if (closeModal) {
        closeModal();
      }
    } catch (error) {
      console.error('Error during submit:', error);
    }
  };
  
  

  return (
    <div className={style.container}>
      <header className={style.header}>
        <span>모집인원</span>
      </header>
      <div className={style.filter_wrapper}>
        <Slider
          // range
          min={1}
          max={7}
          step={1}
          defaultValue={member}
          allowCross={false}
          trackStyle={trackStyle}
          handleStyle={handleStyle}
          style={sliderwidth}
          onChange={handleSliderChange}
        />
        <div className={style.member_value}>
          <span className={style.member_num}>1명</span>
          <span className={style.member_num}>3명</span>
          <span className={style.member_num}>5명</span>
          <span className={style.member_num}>7명</span>
        </div>
      </div>
      <div className={style.text}>*본인제외입니다.</div>
      <div className={style.finish} onClick={submitHandler}>
        <span>확인</span>
      </div>
    </div>
  );
};

export default Filter_Member;
