import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from './api';

import useStudyStore from './useStudyStore';
import useTimeTableStore from './useTimetableStore';
import useFilterStore from './useFilterStore';
import getTimeTable from '../timeTable/getTimeTable';
import { searchHandler } from './api';

import { SubHeader } from '../../../components/headerRefactor/SubHeader';
import StudyListPost from './StudyListPost';
import BottomModal from '../../../components/modal/BottomModal';
import Filter_now from './Filter_now';
import Filter_Member from './Filter_Member';
import Filter_Field from './Filter_Field';
import Filter_Field2 from './Filter_Field2';
import Loading from './Loading';

import COLORS from '../../../theme';
import select from '../../../assets/image/select.png';
import close from '../../../assets/image/close_red.png';
import styled from 'styled-components';

const StudyList = () => {
  const { posts, setPosts } = useStudyStore();
  const [modalOpen, setModalOpen] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef();
  const { setTableInfos, setFilteredInfos, setShowData, subjectName } =
    useTimeTableStore();
  const {
    category,
    member,
    recruiting,
    setRecruiting,
    setMember,
    setCategory,
  } = useFilterStore();
  const studyType = localStorage.getItem('studyType');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('로딩중...');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setLoadingMessage('로딩중...');
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
        setIsLoading(false);
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

  const handleDeleteFilter = async filterType => {
    try {
      if (filterType === 'category') await setCategory(0);
      if (filterType === 'member') await setMember(0);
      if (filterType === 'recruiting') await setRecruiting(null);

      const { category, member, recruiting } = useFilterStore.getState();
      const filterValues = { category, member, recruiting };

      const data = await searchHandler(filterValues);
      setPosts(data[0].data);
    } catch (error) {
      console.error('Error during submit:', error);
    }
  };

  return (
    <Container>
      <SubHeader text="세종스터디" customBackLink="/main" />
      <FilterBox>
        {category === 0 ? (
          <Filter
            onClick={() => {
              setIsClickedStudy(true);
              setModalOpen(modalOpen === 'study' ? null : 'study');
            }}
          >
            <p
              style={{
                fontSize: '14px',
              }}
            >
              카테고리
            </p>
            <SelectImage src={select} alt="select" />
          </Filter>
        ) : (
          <Filter onClick={() => handleDeleteFilter('category')}>
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
            <SelectImage2 src={close} alt="close" />
          </Filter>
        )}

        {member === 0 ? (
          <Filter
            onClick={() => {
              setIsClickedStudy(true);
              setModalOpen(modalOpen === 'members' ? null : 'members');
            }}
          >
            <p
              style={{
                fontSize: '14px',
              }}
            >
              모집인원
            </p>
            <SelectImage src={select} alt="select" />
          </Filter>
        ) : (
          <Filter onClick={() => handleDeleteFilter('member')}>
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
            <SelectImage2 src={close} alt="close" />
          </Filter>
        )}

        {recruiting === null ? (
          <Filter
            onClick={() =>
              setModalOpen(modalOpen === 'status' ? null : 'status')
            }
          >
            <p
              style={{
                fontSize: '14px',
              }}
            >
              모집여부
            </p>
            <SelectImage src={select} alt="select" />
          </Filter>
        ) : (
          <Filter onClick={() => handleDeleteFilter('recruiting')}>
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
            <SelectImage2 src={close} alt="close" />
          </Filter>
        )}
      </FilterBox>
      <ListWrapper>
        {isLoading ? (
          <Loading text={loadingMessage} />
        ) : (
          posts.map(post => (
            <div key={post.id} onClick={() => goPostDetail(post.id)}>
              <StudyListPost post={post} />
            </div>
          ))
        )}
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
const SelectImage2 = styled.img`
  width: 10px;
  height: 10px;
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
  position: fixed;
  margin: 0 auto;
  left: 0;
  right: 0;
  bottom: 5vh;
  z-index: 2;
`;
