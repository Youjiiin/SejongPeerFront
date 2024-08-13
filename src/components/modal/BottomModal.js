import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { MyContext } from '../../App';
import style from './BottomModal.module.css';

const BottomModal = forwardRef(({ state = null, children }, ref) => {
  const [animate, setAnimate] = useState(false);
  const { modalOpen, setModalOpen } = useContext(MyContext);

  useEffect(() => {
    if (!modalOpen) {
      setAnimate(false);
    } else {
      setAnimate(true);
    }
  }, [modalOpen]);

  const cancelHandler = () => {
    console.log(1);
    setModalOpen(false);
  };

  return (
    <div className={style.modal}>
      <div onClick={cancelHandler} className={style.backdrop} />
      <div ref={ref} className={`${style.container} ${animate ? style.animate : ''}`}>
        {children}
      </div>
    </div>
  );
});

BottomModal.displayName = 'BottomModal';

export default BottomModal;
