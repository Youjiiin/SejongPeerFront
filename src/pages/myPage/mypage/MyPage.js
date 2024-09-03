import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './MyPage.module.css';
import { toast } from 'sonner';
import { SubHeader } from '../../../components/headerRefactor/SubHeader';

const MyPage = () => {
  const [myPageData, setMyPageData] = useState({});

  const navigate = useNavigate();
  const goModify = () => {
    navigate('/mypage/modify');
  };

  const handleAppliedStudy = () => {
    navigate('/mypage/appliedStudy');
  };
  // 탈퇴하기
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '회원 탈퇴 시 같은 학번으로 다시 회원가입이 불가합니다. 그래도 하시겠습니까?'
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_BACK_SERVER}/member/my-page`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Refresh-Token': localStorage.getItem('refreshToken'),
            },
          }
        );
        if (response.status === 200) {
          // 성공적으로 탈퇴 처리됨
          toast.success('계정이 성공적으로 삭제되었습니다.');
          // 로컬 스토리지에서 사용자 정보 제거
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // 사용자를 로그인 페이지 또는 메인 페이지로 리디렉션
          navigate('/main');
        }
      } catch (error) {
        console.error('탈퇴 처리 중 오류 발생:', error);
        toast.error('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };
  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('account');
    localStorage.removeItem('grade');
    localStorage.removeItem('gender');
    localStorage.removeItem('major');
    localStorage.removeItem('minor');
    localStorage.removeItem('name');
    localStorage.removeItem('nickname');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('studentId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('kakaoAccount');
    localStorage.removeItem('pwd');
    localStorage.removeItem('userId');
    console.log('로그아웃 성공');
    toast.success('로그아웃 되었습니다');
    navigate('/main');
  };

  const gender = localStorage.getItem('gender');
  let gender_text = '';
  if (gender === 'male') {
    gender_text = '남자';
  }
  if (gender === 'female') {
    gender_text = '여자';
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const kakaoId = localStorage.getItem('kakaoId');
  const phoneNum = localStorage.getItem('phoneNum');
  const major = localStorage.getItem('major');
  const name = localStorage.getItem('name');

  // 내 정보 조회
  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_SERVER}/member/my-page`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Refresh-Token': refreshToken,
            },
          }
        );

        if (response.status === 200) {
          setMyPageData(response.data.data);
        } else {
          // Handle response error
          throw new Error('Failed to fetch my page data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (accessToken && refreshToken) {
      fetchMyPageData();
    } else {
      navigate('/login');
    }
  }, [accessToken, refreshToken, navigate]);

  //버디 매칭상대 확인
  const BuddyHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/buddy/matching-status',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );
      const data = await response.json();
      //상태 관리
      if (data.data === null) {
        toast.error('아직 신청한 내역이 없습니다!');
        navigate('/buddy/start1');
      } else {
        statusHandler(data.data.status, data.data.matchingCompletedCount);
      }
    } catch (error) {
      toast.warning('에러가 발생했습니다.');
      console.log(error.message);
    }
  };

  //버디 - 상태에따른 처리
  const statusHandler = (status, count) => {
    //취소, 거절 패널티 해제
    if (status === 'CANCEL' || status === 'REACTIVATE') {
      if (count > 0) {
        navigate('/buddy/success');
      } else {
        navigate('/buddy/start1');
      }
      // 거절 당함
    } else if (status === 'DENIED') {
      toast.error('상대방이 거절했습니다. 다시 신청해 주세요.');
      if (count > 0) {
        navigate('/buddy/success');
      } else {
        navigate('/buddy/start1');
      }
      //매칭 최종 완료
    } else if (status === 'MATCHING_COMPLETED') {
      toast.success('매칭에 성공했습니다. 정보를 확인해주세요!');
      navigate('/buddy/success');
      //매칭 수락
    } else if (status === 'ACCEPT') {
      toast.success(
        '신청 수락을 했습니다. 상대방이 수락할때까지 기다려 주세요.'
      );
      //매칭 거절
    } else if (status === 'REJECT') {
      toast.error(
        '거절 패널티 1시간이 부과되었습니다. 1시간 이후에 다시 신청해 주세요.'
      );
      //매칭 중
    } else if (status === 'IN_PROGRESS') {
      toast.info('매칭중입니다!');
      navigate('/buddy/waiting');
      //매칭 완료
    } else if (status === 'FOUND_BUDDY') {
      toast.success('버디를 찾았습니다!');
      navigate('/buddy/accept');
    }
  };

  //혼밥 매칭상대 확인
  const HonbobHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACK_SERVER + '/honbab/check-matching-status',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok'); // 응답 상태가 좋지 않을 경우 에러를 발생시킴
      }
      const data = await response.json(); // 주석 해제하여 JSON 응답을 파싱
      if (data.data === null || data.data.status === 'CANCEL') {
        navigate('/honbob/start1');
      } else if (
        data.data.status === 'TIME_OUT' ||
        data.data.status === 'EXPIRED'
      ) {
        navigate('/honbob/start1');
      } else if (data.data.status === 'IN_PROGRESS') {
        toast.info('매칭 중입니다!');
        navigate('/honbob/waiting');
      } else if (data.data.status === 'MATCHING_COMPLETED') {
        toast.success('매칭에 성공했습니다!');
        navigate('/honbob/success');
      }
    } catch (error) {
      console.error('에러 체크:', error);
      toast.error('매칭 체크 실패!');
    }
  };

  //혼밥 사용방법
  const honbabInfoHandler = () => {
    window.open('https://sejonghonbab.simple.ink/', '_blank');
  };
  //버디 사용방법
  const buddyInfoHandler = () => {
    window.open('https://sejongbuddy.simple.ink/', '_blank');
  };

  return (
    <div className={styles.Container}>
      <SubHeader text="마이페이지" customBackLink="/main" />
      <div className={styles.container}>
        {myPageData && (
          <>
            <div className={styles.outerContainer}>
              <div className={styles.container1}>
                <div className={styles.informTitleBox}>
                  <span className={styles.br}></span>
                  <p
                    style={{ fontWeight: '800', marginBottom: '0px' }}
                    className={styles.informTitle}
                  >
                    매칭정보
                  </p>
                </div>
                <div className={styles.matchingBox}>
                  <button className={styles.matchingButton}>
                    <div className={styles.leftBox}>
                      <div
                        className={`${styles.redWord} ${styles.checkWord}`}
                        onClick={handleAppliedStudy}
                      >
                        지원한 스터디 확인
                      </div>
                      <div
                        className={`${styles.blackWord} ${styles.checkWord}`}
                        style={{ fontWeight: '800' }}
                      >
                        내가 지원한 스터디 현황 확인하기
                      </div>
                    </div>
                    <div className={styles.rightImg}></div>
                  </button>
                  <button
                    className={styles.matchingButton}
                    onClick={() => navigate('/mypost')}
                  >
                    <div className={styles.leftBox}>
                      <div className={`${styles.redWord} ${styles.checkWord}`}>
                        내 스터디 게시글 관리
                      </div>
                      <div
                        className={`${styles.blackWord} ${styles.checkWord}`}
                        style={{ fontWeight: '800' }}
                      >
                        내가 업로드한 게시글, 신청자 관리하기
                      </div>
                    </div>
                    <div className={styles.rightImg}></div>
                  </button>
                  {/*<button className={styles.hideBtn}></button>*/}
                  <button
                    onClick={BuddyHandler}
                    className={styles.matchingButton}
                  >
                    <div className={styles.leftBox}>
                      <div className={`${styles.redWord} ${styles.checkWord}`}>
                        세종버디
                      </div>
                      <div
                        className={`${styles.blackWord} ${styles.checkWord}`}
                        style={{ fontWeight: '800' }}
                      >
                        매칭 상대 확인
                      </div>
                    </div>
                    <div className={styles.buddyImg}></div>
                  </button>
                  <button
                    onClick={HonbobHandler}
                    className={styles.matchingButton}
                  >
                    <div className={styles.leftBox}>
                      <div className={`${styles.redWord} ${styles.checkWord}`}>
                        혼밥탈출
                      </div>
                      <div
                        className={`${styles.blackWord} ${styles.checkWord}`}
                        style={{ fontWeight: '800' }}
                      >
                        밥짝꿍 확인
                      </div>
                    </div>
                    <div className={styles.honbobImg}></div>
                  </button>
                </div>
              </div>

              <div className={styles.container5}>
                <div className={styles.informTitleBox}>
                  <span className={styles.br}></span>
                  <p
                    style={{ fontWeight: '800', marginBottom: '0px' }}
                    className={styles.informTitle}
                  >
                    세종스터디
                  </p>
                </div>

                <div className={styles.matchingBox}>
                  <button
                    className={styles.matchingButton}
                    onClick={() => navigate('/mypage/scraplist')}
                  >
                    {' '}
                    <div className={styles.leftBox}>
                      <div className={`${styles.redWord} ${styles.checkWord}`}>
                        스크랩 한 글
                      </div>
                    </div>
                    <div className={styles.rightImg}></div>
                  </button>
                  {/* <button className={styles.matchingButton}>
                    <div className={styles.leftBox}>
                      <div className={`${styles.redWord} ${styles.checkWord}`}>
                        댓글 단 글
                      </div>
                    </div>
                    <div className={styles.rightImg}></div>
                  </button> */}
                  {/*<button className={styles.hideBtn}></button>*/}
                </div>
              </div>
              <div className={styles.container2}>
                <div className={styles.informTitleBox}>
                  <p style={{ fontWeight: '800' }}>내 정보</p>
                </div>

                <div className={styles.myInformBox}>
                  <button className={styles.myInformBtn} onClick={goModify}>
                    <div className={styles.leftBox}>
                      <div
                        className={`${styles.blackWord} ${styles.myInformWord}`}
                        style={{ fontWeight: '800', fontSize: '1.8vh' }}
                      >
                        {myPageData.name}
                      </div>
                      <div
                        className={`${styles.blackWord} ${styles.myInformWord}`}
                      >
                        {myPageData.major}
                      </div>
                    </div>
                    <div className={styles.rightArrow}></div>
                  </button>
                </div>
              </div>
              <div className={styles.container3}>
                <div className={styles.informTitleBox}>
                  <p style={{ fontWeight: '800' }}>사용방법</p>
                </div>
                <div className={styles.useInformBox}>
                  <button className={styles.useInformBtn}>
                    <div
                      className={styles.redWord2}
                      style={{ fontWeight: '400', fontFamily: 'jalnan' }}
                    >
                      세종스터디
                    </div>
                    <div style={{ fontWeight: 'bold' }}>사용법</div>
                  </button>
                  <button
                    onClick={buddyInfoHandler}
                    className={styles.useInformBtn}
                  >
                    <div
                      className={styles.redWord2}
                      style={{ fontWeight: '400', fontFamily: 'jalnan' }}
                    >
                      세종버디
                    </div>
                    <div style={{ fontWeight: 'bold' }}>사용법</div>
                  </button>
                  <button
                    onClick={honbabInfoHandler}
                    className={styles.useInformBtn}
                  >
                    <div
                      className={styles.redWord2}
                      style={{ fontWeight: '400', fontFamily: 'jalnan' }}
                    >
                      혼밥탈출
                    </div>
                    <div style={{ fontWeight: 'bold' }}>사용법</div>
                  </button>
                </div>
              </div>
              <div className={styles.container4}>
                <div className={styles.informTitleBox}>
                  <p style={{ fontWeight: '800', marginBottom: '0px' }}>
                    이용안내
                  </p>
                </div>
                <div className={styles.ruleBox}>
                  <Link
                    to={'/personalinfo'}
                    style={{ textDecoration: 'underline', color: '#333333' }}
                    target="_blank"
                  >
                    개인정보처리방침
                  </Link>
                  <Link
                    to={'/useinfo'}
                    style={{ textDecoration: 'underline', color: '#333333' }}
                    target="_blank"
                  >
                    이용약관
                  </Link>
                  <div style={{ textDecoration: 'underline' }}>
                    <Link
                      to={'https://sejongpeerguide.simple.ink/'}
                      style={{ color: '#000' }}
                    >
                      커뮤니티 이용규칙
                    </Link>
                  </div>
                  <div style={{ textDecoration: 'underline' }}>공지사항</div>
                </div>
              </div>
              <button
                style={{ cursor: 'pointer' }}
                className={styles.logout}
                onClick={handleLogout}
              >
                <p
                  style={{
                    fontWeight: '800',
                    fontSize: '1.3em',
                  }}
                >
                  로그아웃
                </p>
              </button>
              <button
                style={{ cursor: 'pointer' }}
                className={styles.secession}
                onClick={handleDeleteAccount}
              >
                탈퇴하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPage;
