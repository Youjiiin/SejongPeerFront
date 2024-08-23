import { useEffect, useState } from 'react';
import usePostStore from '../../../pages/study/studyPostWrite/usePostStore';
import style from '../StudyRequirement.module.css';
import arrow from '../../../assets/image/down_black.png';
import useTimeTableStore from '../../../pages/study/timeTable/useTimeTableStore';
import { toast } from 'sonner';
const Category = ({ studyFilterHandler }) => {
  const { category } = usePostStore();
  const { subjectName } = useTimeTableStore();

  const [isPost, setIsPost] = useState(true);
  useEffect(() => {
    if (window.location.pathname.startsWith('/study/modify')) {
      setIsPost(false);
    } else {
      setIsPost(true);
    }
  }, []);

  const modify = () => {
    toast.error('카테고리는 수정할 수 없습니다!');
  };

  return (
    <div
      className={style.flexWrapper}
      onClick={isPost ? studyFilterHandler : modify}
    >
      <label className={style.label}>
        {subjectName === '' ? '카테고리' : subjectName}
      </label>

      {isPost ? (
        <img src={arrow} className={style.arrowImg} alt="Arrow" />
      ) : (
        <p>{category}</p>
      )}
    </div>
  );
};

export default Category;
