import style from '../StudyRequirement.module.css';
import usePostStore from '../../../pages/study/studyPostWrite/usePostStore';
const Tag = () => {
  const { tags, setTags } = usePostStore();
  const handleTags = e => {
    const list = e.target.value;
    const tagSplit = list
      .replace(/(\s*)/g, '')
      .split('#')
      .filter(e => e !== '');

    setTags(list);
  };
  return (
    <div className={style.inputWrapper}>
      <input
        onChange={handleTags}
        placeholder="(선택) #태그입력_최대_3개 (예: #팀플, #프로젝트)"
        className={style.titleInput}
        type="text"
        value={tags}
      />
    </div>
  );
};

export default Tag;
