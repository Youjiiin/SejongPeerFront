import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from './api';
import StudyListPost from './StudyListPost';
import BottomModal from '../../../components/modal/BottomModal';
import Filter_now from './Filter_now';
import select from '../../../assets/image/select.png';
import useStudyStore from './useStudyStore';
import useTimeTableStore from './useTimetableStore';
import Filter_Member from './Filter_Member';
import useFilterStore from './useFilterStore';
import Filter_Field from './Filter_Field';
import getTimeTable from '../timeTable/getTimeTable';

import styled from 'styled-components';
import COLORS from '../../../theme';
import Filter_Field2 from './Filter_Field2';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

const StudyList = () => {
  const { posts, setPosts } = useStudyStore();
  const [modalOpen, setModalOpen] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef();
  const { setTableInfos, setFilteredInfos, setShowData, subjectName } =
    useTimeTableStore();
  const { category, member, recruiting } = useFilterStore();
  const studyType = localStorage.getItem('studyType');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        //console.log(fetchedPosts);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    loadPosts();
  }, [setPosts]);

  const goPost = () => {
    navigate('/study/post');
  };

  const goPostDetail = index => {
    navigate(`/study/post/${index}`);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  // 모달 오픈,
  const [isClickedStudy, setIsClickedStudy] = useState(false);
  const [isClickedMember, setIsClickedMember] = useState(false);

  const studyFilterHandler = () => {
    if (modalOpen) return;
    setModalOpen(true);
    setIsClickedStudy(true);
    setIsClickedMember(false);
  };

  const deleteHandler = () => {
    setModalOpen(false);
    setIsClickedStudy(false);
    setIsClickedMember(false);
  };
  const [isCategory, setIsCategory] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isNow, setIsNow] = useState(false);

  const tagStyle = 1;

  useEffect(() => {
    if (isCategory !== '') {
      setIsCategory(true);
    }
    if (isMember !== 0) {
      setIsMember(true);
    }
    if (isNow !== null) {
      setIsNow(true);
    }
  }, [isCategory, isMember, isNow]);

  const handleClick = () => {
    setModalOpen(modalOpen === 'study' ? null : 'study');
    studyFilterHandler();
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

  // 게시글 초기화
  const reset = useFilterStore(state => state.reset);
  const resetCategory = useTimeTableStore(state => state.reset);
  useEffect(() => {
    reset();
    resetCategory();
  }, []);

  return (
    <Container>
      <SubHeader text="세종스터디" />
      <FilterBox>
        <Filter
          onClick={() => {
            setIsClickedStudy(true);
            setModalOpen(modalOpen === 'study' ? null : 'study');
          }}
        >
          {category === 0 ? (
            <p style={{
              fontSize: '14px',
            }}>카테고리</p>
          ) : (
            <p
              style={{
                color: `${COLORS.main}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
              }}
            >
              {subjectName}
            </p>
          )}
          <SelectImage src={select} alt="select" />
        </Filter>
        <Filter
          onClick={() => {
            setIsClickedStudy(true);
            setModalOpen(modalOpen === 'members' ? null : 'members');
          }}
        >
          {member === 0 ? (
            <p style={{
              fontSize: '14px',
            }}>모집인원</p>
          ) : (
            <p
              style={{
                color: `${COLORS.main}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
              }}
            >
              {member}명
            </p>
          )}
          <SelectImage src={select} alt="select" />
        </Filter>

        <Filter
          onClick={() => setModalOpen(modalOpen === 'status' ? null : 'status')}
        >
          {recruiting === null ? (
            <p style={{
              fontSize: '14px',
            }}>모집여부</p>
          ) : (
            <p
              style={{
                color: `${COLORS.main}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
              }}
            >
              {recruiting === true ? '모집 중' : '모집 마감'}
            </p>
          )}
          <SelectImage src={select} alt="select" />
        </Filter>
      </FilterBox>
      <ListWrapper>
        {posts.map(post => (
          <div key={post.id} onClick={() => goPostDetail(post.id)}>
            <StudyListPost post={post} />
          </div>
        ))}
      </ListWrapper>
      <WriteButton onClick={goPost}>모집글 작성</WriteButton>
      {modalOpen && (
        <BottomModal
          ref={modalRef}
          setModalOpen={setModalOpen}
          deleteHandler={deleteHandler}
        >
          {modalOpen === 'study' ? (
            studyType === 'lecture' ? (
              <Filter_Field deleteHandler={deleteHandler} />
            ) : (
              <Filter_Field2 deleteHandler={deleteHandler} />
            )
          ) : null}
          {modalOpen === 'members' && (
            <Filter_Member closeModal={() => setModalOpen(null)} />
          )}
          {modalOpen === 'status' && (
            <Filter_now deleteHandler={deleteHandler} />
          )}
        </BottomModal>
      )}
    </Container>
  );
};

export default StudyList;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  @media (min-width: 768px) {
    width: 400px;
    height: 100vh;
    position: relative;
    margin-top: 2vh;
  }
`;

const Header = styled.div`
  width: 100%;
  height: 7%;
  @media (min-width: 768px) {
    width: 100%;
    height: 7%;
  }
`;

const FilterBox = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  padding: 6px 16px;
  background-color: #fafafa;
  border-bottom: 3px solid #e5e5e5;
  gap: 6px;
  @media (min-width: 768px) {
    width: 400px;
  }
`;

const Filter = styled.div`
  min-width: 10%;
  max-width: 160px;
  padding: 6px 8px;
  border: 1px solid ${COLORS.line1};
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  flex-basis: auto;
  p {
    font-size: 1rem;
    white-space: nowrap;
    margin: 0;
    color: ${COLORS.font3};
  }
  img {
    margin: 0;
  }
`;

const SelectImage = styled.img`
  width: 10px;
  height: 6px;
  margin-left: 4%;
`;

const ListWrapper = styled.div`
  width: 100vw;
  height: auto;
  @media (min-width: 768px) {
    width: 100%;
  }
`;

const WriteButton = styled.div`
  width: 40%;
  max-width: 200px;
  height: 6%;
  max-height: 60px;
  background-color: ${COLORS.main};
  border-radius: 35px;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  margin: 0 auto;
  left: 0;
  right: 0;
  bottom: 5vh;
  z-index: 2;
`;
