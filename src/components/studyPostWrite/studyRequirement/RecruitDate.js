import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import { format } from 'date-fns';

import style from '../StudyRequirement.module.css';
import usePostStore from '../../../pages/study/studyPostWrite/usePostStore';

const ReucruitDate = ({ handleDatePickerFocus }) => {
  const { startDate, endDate, setStartDate, setEndDate } = usePostStore();
  const datePickerRef = useRef(null);

  const handleWrapperClick = () => {
    datePickerRef.current.setFocus();
  };

  const setChangeDate = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setDateRange({ startDate: start, endDate: end });
    // console.log(start, ',', end);
  };

  const [dateRange, setDateRange] = useState({
    startDate: startDate,
    endDate: endDate,
  });

  return (
    <div className={style.flexWrapper} onClick={handleWrapperClick}>
      <div className={style.leftWrapper}>
        <label className={style.label}>모집 기간</label>

        <div className={style.valueText}>
          {startDate && endDate
            ? `${format(startDate, 'M월 d일')} ~ ${format(endDate, 'M월 d일')}`
            : null}
        </div>
      </div>

      <DatePicker
        ref={datePickerRef}
        className={style.datePicker}
        selectsRange={true}
        locale={ko}
        dateFormat="MM월dd일"
        selected={dateRange.endDate}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={dates => setChangeDate(dates)}
        onFocus={handleDatePickerFocus}
        showPopperArrow={false}
        minDate={new Date()}
      />
    </div>
  );
};

export default ReucruitDate;
