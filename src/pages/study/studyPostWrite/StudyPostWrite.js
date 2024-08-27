// src/pages/StudyPostWrite.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from '../../../App';

// modal
import BottomModal from '../../../components/modal/BottomModal';
import ConfirmModal from './confirmModal/ConfirmModal';

// modal components
import StudyPostField from './studyPostField/StudyPostField';
import StudyPostExternalField from './studyPostField/StudyPostExternalField';
import StudyMember from './studyMember/StudyMember';

// components
import PostHeader from '../../../components/studyPostWrite/PostHeader';
import StudyRequirement from '../../../components/studyPostWrite/StudyRequirement';
import PostInput from '../../../components/studyPostWrite/PostInput';
import Inquire from '../../../components/studyPostWrite/studyRequirement/Inquire';
import ImageUpload from '../../../components/studyPostWrite/ImageUpload';
import StudyLink from '../../../components/studyPostWrite/studyRequirement/StudyLink';
import Tag from '../../../components/studyPostWrite/studyRequirement/Tag';

import style from './StudyPostWrite.module.css';
import './StudyPostWriteBasic.css';
import SubmitBtn from '../../../components/button/submitButton/SubmitBtn';

//팝업
import Popup from '../../../components/studyPopup/Popup';

//zustand
import usePostStore from './usePostStore';
import usePopupStroe from '../../../components/studyPopup/usePopupStore';
import useTimeTableStore from '../timeTable/useTimeTableStore';
import { format } from 'date-fns';
// import Category from '../../../components/studyPostWrite/studyRequirement/Category';

import { useNavigate } from 'react-router-dom';

//강의 시간표
import getTimeTable from '../timeTable/getTimeTable';
import { toast } from 'sonner';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';
const StudyPostWrite = props => {
  const {
    title,
    category,
    startDate,
    endDate,
    memberNum,
    selectedWay,
    selectedFrequency,
    questionLink,
    content,
    studyLink,
    tags,
    setTitle,
    setCategory,
    setStartDate,
    setEndDate,
    setMemberNum,
    setSelectedWay,
    setSelectedFrequency,
    setContent,
    setStudyLink,
    setQuestionLink,
    setTags,
  } = usePostStore();

  const {
    isPopupVisible,
    popupMessage,
    popupTitle,
    setPopupVisible,
    setPopupMessage,
  } = usePopupStroe();
  const studyType = localStorage.getItem('studyType');
  const { setTableInfos, setFilteredInfos, setShowData } = useTimeTableStore();
  console.log(
    title,
    category,
    startDate,
    endDate,
    memberNum,
    selectedWay,
    selectedFrequency,
    questionLink,
    content,
    studyLink,
    tags
  );
  // 게시글 초기화
  const reset = usePostStore(state => state.reset);
  const resetCategory = useTimeTableStore(state => state.reset);
  useEffect(() => {
    reset();
    resetCategory();
  }, []);

  const navigate = useNavigate();

  const handleDatePickerFocus = event => {
    event.target.blur();
  };

  //강의 시간표 get
  useEffect(() => {
    const fetchAndSetTimeTable = async () => {
      const data = await getTimeTable();
      setTableInfos(data.tableInfos);
      setFilteredInfos(data.filteredInfos);
      setShowData(data.showData);
    };

    fetchAndSetTimeTable();
  }, []);

  // 모달 오픈,
  const [isClickedStudy, setIsClickedStudy] = useState(false);
  const [isClickedMember, setIsClickedMember] = useState(false);
  const { modalOpen, setModalOpen } = useContext(MyContext);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const studyFilterHandler = () => {
    if (modalOpen) return;
    setModalOpen(true);
    setIsClickedStudy(true);
    setIsClickedMember(false);
  };

  const memberFilterHandler = () => {
    if (modalOpen) return;
    setModalOpen(true);
    setIsClickedMember(true);
    setIsClickedStudy(false);
  };

  const deleteHandler = () => {
    setModalOpen(false);
    setIsClickedStudy(false);
    setIsClickedMember(false);
  };

  //이미지 업로드
  const [imgFiles, setImgFiles] = useState([]);
  const imgRef = useRef();

  const ImgHandler = event => {
    const files = Array.from(event.target.files);
    const newImgFiles = [...imgFiles];

    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (newImgFiles.length < 3) {
          newImgFiles.push(reader.result);
          setImgFiles([...newImgFiles]);
        }
      };
    });
    event.target.value = '';
  };

  const ImgDeleteHandler = index => {
    const newImgFiles = imgFiles.filter((_, i) => i !== index);
    setImgFiles(newImgFiles);
  };

  //이미지 업로드 통신
  const imgUpload = async id => {
    const imgs = [...imgFiles];

    const imgData = {
      studyId: id,
      base64ImagesList: imgs,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACK_SERVER}/image/study/upload`,
        {
          method: 'POST',
          body: JSON.stringify(imgData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );

      console.log('error???????????????' + response.status);
      if (response.status === 413) {
        return 'imgError';
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (err) {
      console.log('ErrorMessage : ', err.message);
      throw err;
    }
  };

  //유효성 검사 팝업 핸들러
  const togglePopup = message => {
    setPopupMessage(message);
    setPopupVisible(!isPopupVisible);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const [isFilled, setIsFilled] = useState(true);
  //게시글 작성 통신
  const submitHandler = async e => {
    //제목/모집기간/모집인원/내용/오픈채팅 링크/카테고리
    const validation = (name, text) => {
      if (text === '' || text === null) {
        if (name === '카테고리') return `${name}를 선택해주세요`;
        return `${name}을(를) 입력해주세요`;
      }
    };

    const errorMessage =
      validation('카테고리', category) ||
      validation('제목', title) ||
      validation('모집 시작일', startDate) ||
      validation('모집 종료일', endDate) ||
      validation('내용', content) ||
      validation('오픈채팅 링크', studyLink) ||
      null;

    if (errorMessage) {
      togglePopup(errorMessage);
      return;
    }

    if (imgFiles.length > 0) {
      console.log('11111111111111111111111111111111');
      try {
        await imgUpload(studyId);
        console.log(await imgUpload(studyId));
      } catch (err) {
        togglePopup(`이미지 용량 혹은 형식을 확인하세요`);
        return;
      }
    }
    const formStartDate = format(startDate, 'yyyy-MM-dd HH:mm:ss');
    const formEndDate = format(endDate, 'yyyy-MM-dd HH:mm:ss');
    const tagSplit =
      tags.length === 0
        ? []
        : tags
            .replace(/(\s*)/g, '')
            .split('#')
            .filter(e => e !== '');
    const studyData =
      studyType === 'lecture'
        ? {
            title: title,
            content: content,
            recruitmentCount: memberNum,
            method: selectedWay,
            frequency: selectedFrequency,
            kakaoLink: studyLink,
            questionLink: questionLink,
            lectureId: category,
            recruitmentStartAt: formStartDate,
            recruitmentEndAt: formEndDate,
            tags: tagSplit,
            images: null,
          }
        : {
            title: title,
            content: content,
            recruitmentCount: memberNum,
            method: selectedWay,
            frequency: selectedFrequency,
            kakaoLink: studyLink,
            questionLink: questionLink,
            externalActivityId: category,
            recruitmentStartAt: formStartDate,
            recruitmentEndAt: formEndDate,
            tags: tagSplit,
            images: null,
          };
    console.log(studyData);
    const studyTypeM =
      studyType === 'lecture' ? studyType : 'external-activity';
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACK_SERVER}/study/${studyTypeM}`,
        {
          method: 'POST',
          body: JSON.stringify(studyData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      const studyId = data.data.id;
      toast.success('게시글 작성 완료');

      setTimeout(() => {
        navigate(`/study/post/${studyId}`);
      }, 100); // 2초 후에 이동
      // 게시글 초기화 함수
      reset();
      resetCategory();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.log('ErrorMessage : ', err.message);
      e.preventDefault();
    }
  };

  //수정 통신
  const modifyHandler = async e => {
    //제목/모집기간/모집인원/내용/오픈채팅 링크/카테고리
    const validation = (name, text) => {
      if (text === '' || text === null) return `${name}을(를) 입력해주세요`;
    };

    const errorMessage =
      validation('제목', title) ||
      validation('모집 시작일', startDate) ||
      validation('모집 종료일', endDate) ||
      validation('내용', content) ||
      validation('오픈채팅 링크', studyLink) ||
      null;

    if (errorMessage) {
      togglePopup(errorMessage);
      return;
    }
    const formStartDate = format(startDate, 'yyyy-MM-dd HH:mm:ss');
    const formEndDate = format(endDate, 'yyyy-MM-dd HH:mm:ss');
    const tagSplit = tags
      .replace(/(\s*)/g, '')
      .split('#')
      .filter(e => e !== '');
    const studyData = {
      title: title,
      content: content,
      recruitmentCount: memberNum,
      method: selectedWay,
      frequency: selectedFrequency,
      kakaoLink: studyLink,
      questionLink: questionLink,
      lectureId: category,
      recruitmentStartAt: formStartDate,
      recruitmentEndAt: formEndDate,
      tags: tagSplit,
      images: null,
    };
    console.log(studyData);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACK_SERVER}/study/${props.studyId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(studyData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.data !== null) {
        errorClassName = data.data.errorClassName;
      }
      alert('게시글 수정 완료');

      //게시글 초기화
      reset();
      resetCategory();

      navigate(`/study/post/${props.studyId}`);
    } catch (err) {
      console.log('ErrorMessage : ', err.message);

      e.preventDefault();
    }
  };

  const [isPost, setIsPost] = useState(true);
  useEffect(() => {
    if (window.location.pathname.startsWith('/study/modify')) {
      setIsPost(false);
    } else {
      setIsPost(true);
    }
  }, []);
  const btnOnclick = isPost ? submitHandler : modifyHandler;

  return (
    <div className={style.container}>
      <SubHeader text="세종스터디" />
      <div className={style.innerConatiner}>
        <PostHeader onOpenConfirmModal={openConfirmModal} />
        <div className={style.contentContainer}>
          <StudyRequirement
            handleDatePickerFocus={handleDatePickerFocus}
            studyFilterHandler={studyFilterHandler}
            memberFilterHandler={memberFilterHandler}
          />
          <PostInput />
          <Inquire />
          <ImageUpload
            imgFiles={imgFiles}
            ImgHandler={ImgHandler}
            imgRef={imgRef}
            ImgDeleteHandler={ImgDeleteHandler}
            imgUrlList={props.imgUrl}
          />
          <StudyLink />
          <Tag />
        </div>
      </div>

      <div className={style.postConainer} onClick={btnOnclick}>
        <SubmitBtn
          name={isPost ? '모집글 올리기' : '모집글 수정하기'}
          ready={isFilled}
        />
      </div>

      {modalOpen && (
        <BottomModal
          deleteHandler={deleteHandler}
          state={isClickedStudy ? 'studyPostField' : null}
        >
          {isClickedStudy ? (
            studyType === 'lecture' ? (
              <StudyPostField />
            ) : (
              <StudyPostExternalField />
            )
          ) : null}
          {isClickedMember && <StudyMember />}
        </BottomModal>
      )}
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} />
      {isPopupVisible && (
        <Popup title={popupTitle} message={popupMessage} onClose={closePopup} />
      )}
    </div>
  );
};

export default StudyPostWrite;
