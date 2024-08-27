import style from './StudyLink.module.css';
import usePostStore from '../../../pages/study/studyPostWrite/usePostStore';
const StudyLink = () => {
  const { studyLink, setStudyLink } = usePostStore();
  const handleLinkChange = e => {
    setStudyLink(e.target.value);
  };
  return (
    <div className={style.openChatBox}>
      <p>모집 마감 시, 오픈채팅 링크(카카오ID)가 신청자에게 전달됩니다.</p>
      <input
        onChange={handleLinkChange}
        value={studyLink}
        className={style.openChatInput}
        placeholder="오픈채팅 링크,또는 카카오ID 입력"
      />
    </div>
  );
};

export default StudyLink;
