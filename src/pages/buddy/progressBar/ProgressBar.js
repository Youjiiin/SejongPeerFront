import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../../App.js';

import styles from './ProgressBar.module.css';

const ProgressBar = props => {
  const [step, setStep] = useState(Array(5).fill(false));
  const [canMoveNext, setCanMoveNext] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(false);
  const { setModalOpen } = useContext(MyContext);
  const { setModalContent } = useContext(MyContext);
  const [clickedPrev, setClickedPrev] = useState(false);
  const navigate = useNavigate();

  const moveRightHandler = () => {
    props.moveNext();
  };
  const moveLeftHandler = () => {
    setClickedPrev(true);
    props.moveBefore();
  };
  const submitHandler = () => {
    setModalOpen(true);
    setModalContent('buddyConfirm');
  };
  const moveMainHandler = () => {
    const backToMain = window.confirm(
      '확인을 누르면 메인 화면으로 이동합니다.\n지금까지 작성한 내용들이 모두 초기화 됩니다.'
    );
    if (backToMain) {
      navigate('/main');
    }
  };

  useEffect(() => {
    const updateStep = [...step];
    let next = false;
    let prev = false;

    if (props.slide === 0) {
      updateStep[0] = true;
      updateStep[1] = false;
      updateStep[2] = false;
      updateStep[3] = false;
      updateStep[4] = false;

      prev = false;
      if (props.choiceGender !== '') {
        next = true;
        if (!clickedPrev) {
          props.moveNext();
        }
      }
      setIsFirstPage(true);
    } else {
      setIsFirstPage(false);
    }

    if (props.slide === 1) {
      updateStep[1] = true;
      updateStep[2] = false;
      updateStep[3] = false;
      updateStep[4] = false;
      prev = true;
      next = false;
      if (props.major !== '') {
        next = true;
        if (!clickedPrev) {
          props.moveNext();
        }
      }
    }
    if (props.slide === 2) {
      updateStep[2] = true;
      updateStep[3] = false;
      updateStep[4] = false;
      prev = true;
      next = false;
      if (props.grade !== '') {
        next = true;
        if (!clickedPrev) {
          props.moveNext();
        }
      }
    }
    if (props.slide === 3) {
      updateStep[3] = true;
      updateStep[4] = false;
      prev = true;
      next = false;
      if (props.gradeDiff !== '') {
        next = true;
        if (!clickedPrev) {
          props.moveNext();
        }
      }
    }
    if (props.slide === 4) {
      updateStep[4] = true;
      prev = true;
      next = true;
      setIsLastPage(true);
    } else {
      setIsLastPage(false);
    }

    setStep(updateStep);
    setCanMoveNext(next);
  }, [
    props.choiceGender,
    props.grade,
    props.major,
    props.gradeDiff,
    props.slide,
  ]);

  const nextClass = canMoveNext
    ? styles.controller_next
    : styles.controller_next_none;

  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.test}>
        <div className={styles.controllerWrapper}>
          {isFirstPage ? (
            <button
              className={styles.controller_prev}
              onClick={moveMainHandler}
            >
              나가기
            </button>
          ) : (
            <button
              className={styles.controller_prev}
              onClick={moveLeftHandler}
            >
              뒤로
            </button>
          )}
          {isLastPage ? (
            <button className={styles.controller_next} onClick={submitHandler}>
              제출
            </button>
          ) : (
            <button
              className={nextClass}
              onClick={moveRightHandler}
              disabled={!canMoveNext}
            >
              다음
            </button>
          )}
        </div>
        <div className={styles.barWrapper}>
          {step.map((step, index) => (
            <div
              key={index}
              className={styles.progress}
              style={{
                backgroundColor: step ? '#FF4B4B' : '#ccc',
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
