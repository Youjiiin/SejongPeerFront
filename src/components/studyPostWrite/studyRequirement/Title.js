import style from '../StudyRequirement.module.css';
import usePostStore from '../../../pages/study/studyPostWrite/usePostStore';
const Title = () => {
  const { title, setTitle } = usePostStore();

  const handleChange = e => {
    const newValue = e.target.value;
    if (newValue.length <= 50) {
      setTitle(newValue);
    }
  };

  return (
    <input
      placeholder="제목(50자 이하)"
      className={style.titleInput}
      type="text"
      value={title}
      onChange={handleChange}
    />
  );
};

export default Title;
