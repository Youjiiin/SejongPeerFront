import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, createContext, useEffect } from 'react';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import { toast, Toaster } from 'sonner';

// 메인 컴포넌트
import StartLoading from './pages/main/landing/StartLoading.js';
import MainPage from './pages/main/mainPage/MainPage.js';

// 버디 컴포넌트
import BuddyStart1 from './pages/buddy/info/BuddyStart1.js';
import BuddyStart2 from './pages/buddy/info/BuddyStart2.js';
import BuddyMatching from './pages/buddy/matching/js/Buddy_Matching.js';
import BuddyWaiting from './pages/buddy/waiting/BuddyWaiting.js';
import BuddyAccept from './pages/buddy/accept/BuddyAccept.js';
import BuddySuccess from './pages/buddy/success/BuddySuccess.js';
import Confirm from './components/modal/Confirm.js';

// 혼밥 컴포넌트
import Honbob_Matching from './pages/honbob/matching/js/Honbob_Matching.js';
import HonbobWaiting from './pages/honbob/waiting/HonbobWaiting.js';
import HonbobSuccess from './pages/honbob/success/HonbobSuccess.js';
import HonbobStart1 from './pages/honbob/info/HonbobStart1.js';

// 회원가입/로그인
import SignIn from './pages/login/signIn/SignIn.js';
import SignUp from './pages/login/signUp/SignUp.js';
import Auth from './pages/login/signUp/auth/Auth.js';
import Major from './components/modal/Major.js';
import FindId from './pages/login/find/findId/FindId.js';
import ResetPwd from './pages/login/find/resetPwd/ResetPwd.js';
import Agree1 from './constants/privacyPolicy/Agree1.js';
import Agree2 from './constants/privacyPolicy/Agree2.js';
import Agree3 from './constants/privacyPolicy/Agree3.js';
import Agree from './pages/login/signUp/Agree.js';

// 마이페이지
import MyPage from './pages/myPage/mypage/MyPage.js';
import Modify from './pages/myPage/modify/Modify.js';
import MyPageScrapList from './pages/myPage/mypage/MyPageScrapList.js';
import MyPost from './pages/myPage/myPost/myPost.js';
import AppliedStudy from './pages/myPage/mypage/AppliedStudy';

// 스터디
import StudyList from '../src/pages/study/studyList/StudyList.js';
import StudyPostDetail from '../src/pages/study/studyPostDetail/StudyPostDetail.js';
import StudyPostWrite from './pages/study/studyPostWrite/StudyPostWrite.js';
import StudyFilter from '../src/pages/study/studyFilterPage/StudyFIlterPage.js';
import StudyModify from './pages/study/studyModify/studyModify.js';

// 축제
import AnimalApply from './pages/festival/animalApply/AnimalApply.js';
import AnimalApply2 from './pages/festival/animalApply2/AnimalApply2.js';
import AnimalApply3 from './pages/festival/animalApply3/AnimalApply3.js';
import AnimalApply4 from './pages/festival/animalApply4/AnimalApply4.js';
import AnimalApply5 from './pages/festival/animalApply5/AnimalApply5.js';
import ApplyComplete from './pages/festival/applyComplete/ApplyComplete.js';
import AnimalMatchInfo from './pages/festival/animalMatchResult/AnimalMatchInfo.js';
import AnimalMatchResult from './pages/festival/animalMatchResult/AnimalMatchResult.js';
import AnimalCheck from './pages/festival/animalCheck/AnimalCheck.js';
import AnimalResult from './pages/festival/animalResult/AnimalResult.js';
import { Buddy } from 'pages/buddy/Buddy';

export const MyContext = createContext();

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [majorValue, setMajorValue] = useState('단과대/학과 선택');
  const [doubleMajorValue, setDoubleMajorValue] = useState('복수/부전공 선택');
  const [doubleCollegeValue, setDoubleCollegeValue] = useState('');
  const [collegeValue, setCollegeValue] = useState('');
  const [buddySubmit, setBuddySubmit] = useState(false);
  const [honbobSubmit, setHonbobSubmit] = useState(false);
  const [isLogined, setIsLogined] = useState(false);
  const [name, setName] = useState('');
  const [studentNum, setStudentNum] = useState('');
  const [grade, setGrade] = useState('');
  const [peerId, setPeerId] = useState('');
  const [buddyCount, setBuddyCount] = useState(0);

  const [animalType, setAnimalType] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(''); // photoUrl 상태 추가

  // 타이머 재설정
  const initializeApp = () => {
    const token = localStorage.getItem('refreshToken');
    if (token) {
      setLogoutTimer(token);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // 토큰 유효기간 타이머
  const setLogoutTimer = token => {
    const decodeToken = jwtDecode(token);
    const cuurentTime = Date.now();
    const expTime = decodeToken.exp * 1000;
    const timeUntilLogout = expTime - cuurentTime;

    setTimeout(() => {
      // console.log('logout');
      toast.message('로그아웃 되었습니다. 재로그인이 필요합니다!');
      logout();
    }, timeUntilLogout);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <MyContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        setModalContent,
        majorValue,
        setMajorValue,
        doubleMajorValue,
        setDoubleMajorValue,
        doubleCollegeValue,
        setDoubleCollegeValue,
        buddySubmit,
        setBuddySubmit,
        honbobSubmit,
        setHonbobSubmit,
        setCollegeValue,
        collegeValue,
        setIsLogined,
        isLogined,
        name,
        setName,
        grade,
        setGrade,
        studentNum,
        setStudentNum,
        peerId,
        setPeerId,
        setLogoutTimer,
        setBuddyCount,
        buddyCount,
        animalType,
        setAnimalType,
        photoUrl,
        setPhotoUrl,
      }}
    >
      <Router>
        <Toaster position="bottom-center" richColors />
        <div className="wrapper">
          {modalOpen && (
            <>
              {modalContent === 'buddyConfirm' && (
                <Confirm
                  firstTitle="제출"
                  secondTitle="세종버디를 신청하시겠습니까?"
                  ok="신청"
                />
              )}
              {modalContent === 'selectMajor' && <Major />}
              {modalContent === 'selectDoubleMajor' && <Major id="double" />}
            </>
          )}
          {/* <Header /> */}
          <main className={modalContent === 'buddyConfirm' ? 'fixed' : ''}>
            <Routes>
              <Route exact path="/" element={<StartLoading />} />
              <Route path="/main" element={<MainPage />} />

              <Route path="/buddy" element={<Buddy />} />
              <Route path="/buddy/start1" element={<BuddyStart1 />} />
              <Route path="/buddy/start2" element={<BuddyStart2 />} />
              <Route path="/buddy/matching" element={<BuddyMatching />} />
              <Route path="/buddy/waiting" element={<BuddyWaiting />} />
              <Route path="/buddy/accept" element={<BuddyAccept />} />
              <Route path="/buddy/success" element={<BuddySuccess />} />

              <Route path="/honbob/matching" element={<Honbob_Matching />} />
              <Route path="/honbob/waiting" element={<HonbobWaiting />} />
              <Route path="/honbob/start1" element={<HonbobStart1 />} />
              <Route path="/honbob/cancel" element={<HonbobWaiting />} />
              <Route path="/honbob/success" element={<HonbobSuccess />} />

              <Route path="/login" element={<SignIn />} />
              <Route path="/login/SignUp" element={<SignUp />} />
              <Route path="/login/auth" element={<Auth />} />
              <Route path="/login/findid" element={<FindId />} />
              <Route path="/login/resetpwd" element={<ResetPwd />} />
              <Route path="/login/agree" element={<Agree />} />

              <Route path="/personalinfo" element={<Agree1 />} />
              <Route path="/useinfo" element={<Agree2 />} />
              <Route path="/personalinfo2" element={<Agree3 />} />

              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/appliedstudy" element={<AppliedStudy />} />
              <Route path="/mypage/modify" element={<Modify />} />
              <Route path="/mypage/scraplist" element={<MyPageScrapList />} />
              <Route path="/mypost" element={<MyPost />} />

              <Route path="/study" element={<StudyList />} />
              <Route
                path="/study/post/:studyId"
                element={<StudyPostDetail />}
              />
              <Route path="/study/post" element={<StudyPostWrite />} />
              <Route path="/study/filter" element={<StudyFilter />} />
              <Route path="/study/modify/:studyId" element={<StudyModify />} />

              <Route path="/fest/AnimalApply" element={<AnimalApply />} />
              <Route path="/fest/AnimalApply2" element={<AnimalApply2 />} />
              <Route path="/fest/AnimalApply3" element={<AnimalApply3 />} />
              <Route path="/fest/AnimalApply4" element={<AnimalApply4 />} />
              <Route path="/fest/AnimalApply5" element={<AnimalApply5 />} />
              <Route path="/fest/ApplyComplete" element={<ApplyComplete />} />
              <Route
                path="/fest/AnimalMatchInfo"
                element={<AnimalMatchInfo />}
              />
              <Route
                path="/fest/AnimalMatchResult"
                element={<AnimalMatchResult />}
              />
              <Route path="/fest/animalcheck" element={<AnimalCheck />} />
              <Route path="/fest/animalresult" element={<AnimalResult />} />
            </Routes>
          </main>
        </div>
      </Router>
    </MyContext.Provider>
  );
};

export default App;
