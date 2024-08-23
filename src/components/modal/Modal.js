import React from 'react';
import ReactDOM from 'react-dom';
import style from './Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains(style['modal-overlay'])) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className={style['modal-overlay']} onClick={handleBackgroundClick}>
      <div className={style['modal-content']} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
