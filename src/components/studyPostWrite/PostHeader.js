import style from './PostHeader.module.css';
import cancelBtn from '../../assets/image/cancel.png';

const Header = ({ onOpenConfirmModal }) => {
  return (
    <div className={style.header}>
      <h3
        style={{
          fontFamily: 'jalnan',
          fontWeight: 500,
          fontSize: '20px',
          marginTop: '3px'
        }}
      >
        팀원 모으기
      </h3>
      <img src={cancelBtn} onClick={onOpenConfirmModal} alt="Cancel" />
    </div>
  );
};

export default Header;
