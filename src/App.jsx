import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/themeProvider";
import { GlobalStyle } from "./theme/GlobalStyles";

import AppLayout from "./components/AppLayout";

import Main from "./components/Main";

import Login from "./components/loginComp/login";
import SignupEmail from "./components/loginComp/signUpEmail";
import SignUpInfo from "./components/loginComp/signUpInfo";
import SignUpBefore from "./components/loginComp/signUpBefore";
import SignUpAf from "./components/loginComp/signUpAf";
import MyPageMain from "./components/mypageComp/MyPageMain";
import LoginAf from "./components/loginComp/loginAf";

import MyPageMemberInfoMain from "./components/mypageComp/memberInfo/MyPageMemberInfoMain";
import MyPageStudygroupListMain from "./components/mypageComp/studygroup/MyPageStudygroupListMain";

import Blog from "./components/blog/Blog";
import BlogWriteForm from "./components/blog/BlogWriteForm";
import BlogReadForm from "./components/blog/BlogReadForm";

import StudygroupMain from "./components/studygroup/StudygroupMain";
import StudygroupForm from "./components/studygroup/StudygroupForm";

import StoreDetail from "./components/store/storedetail";
import StoreList from "./components/store/storelist";
import StoreWrite from "./components/store/storewrite";
import Calendar from "./components/calendar/Calendar";

import Joblist from "./components/job/joblist";
import Jobdetail from "./components/job/jobdetail";
import Registration from "./components/job/registration";
import Combbslist from "./components/job/combbslist";
import Combbswrite from "./components/job/combbswrite";
import Combbsdetail from "./components/job/combbsdetail";
import Combbsupdate from "./components/job/combbsupdate";

import Jobcalendar from "./components/job/jobcalendar";
import JobMail from "./components/job/jobMail";

import StoreUpdate from "./components/store/storeupdate";
import LectureWrite from "./components/lecture/lecturewrite";
import LectureList from "./components/lecture/lecturelist";
import LectureDetail from "./components/lecture/lecturedetail";
import LectureUpdate from "./components/lecture/lectureupdate";
import LectureRegi from "./components/lecture/lectureregi";
import LectureRegiAf from "./components/lecture/lectureregiAf";

import Error from "./components/error/errorPage";
import ErrorNoUser from "./components/error/errorNoUser";
import BlogUpdateForm from "./components/blog/BlogUpdateForm";
import BlogReadModal from "./components/blog/BlogReadModal";
import Chat from "./components/store/storechat";
import Star from "./components/lecture/star";
import MyPageNew from "./components/mypageComp/MyPageNew";

import Chatbox from "./components/main/Chatbox";

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <GlobalStyle />
                <Suspense fallback={<div>...loading</div>}>
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<Main />} />

                            {/* 챗봇 */}
                            <Route path="/Chatbox" element={<Chatbox />} />

                            {/* 회원가입, 로그인, 마이페이지 */}
                            <Route
                                path="/signupemail"
                                element={<SignupEmail />}
                            />

                            <Route
                                path="/signupinfo"
                                element={<SignUpInfo />}
                            />

                            {/* <Route path="/signup/:email/:emailKey" element={ <SignUp />} /> */}
                            {/* <Route path="/oauth2/google" element={ <GoogleRedirect /> } /> */}
                            <Route
                                path="/signupinfo"
                                element={<SignUpInfo />}
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/loginAf" element={<LoginAf />} />
                            <Route
                                path="/signUpBefore"
                                element={<SignUpBefore />}
                            />
                            <Route path="/signUpAf" element={<SignUpAf />} />
                            <Route path="/mypage/*" element={<MyPageMain />}>
                                <Route
                                    path=""
                                    element={<MyPageMemberInfoMain />}
                                />
                                <Route
                                    path="memberinfo"
                                    element={<MyPageMemberInfoMain />}
                                />
                                <Route
                                    path="studygroup"
                                    element={<MyPageStudygroupListMain />}
                                />
                            </Route>

                            <Route path="/mypagenew/*" element={<MyPageNew />}>
                                <Route path="" element={<MyPageMemberInfoMain />} />
                                <Route path="memberinfo" element={<MyPageMemberInfoMain />} />
                                <Route path="studygroup" element={<MyPageStudygroupListMain />} />
                            </Route>


                            {/* 샵인샵 */}
                            <Route
                                path="/storewrite"
                                element={<StoreWrite />}
                            />
                            <Route path="/storelist" element={<StoreList />} />
                            <Route
                                path="/storelist/:choice/:search"
                                element={<StoreList />}
                            ></Route>
                            <Route
                                path="/storedetail/:seq"
                                element={<StoreDetail />}
                            />
                            <Route
                                path="/storeupdate/:seq"
                                element={<StoreUpdate />}
                            />
                            <Route
                                path="/lecturewrite"
                                element={<LectureWrite />}
                            />
                            <Route
                                path="/lecturelist"
                                element={<LectureList />}
                            />
                            <Route
                                path="/lecturedetail/:seq"
                                element={<LectureDetail />}
                            />
                            <Route
                                path="/lectureupdate/:seq"
                                element={<LectureUpdate />}
                            />
                            <Route
                                path="/lectureregi/:seq"
                                element={<LectureRegi />}
                            />
                            <Route
                                path="/lectureregiAf/:seq"
                                element={<LectureRegiAf />}
                            />
                            {/* 채팅샘플 */}
                            <Route path="/storechat" element={<Chat />} />
                            <Route path="/star" element={<Star />} />

                            {/* 블로그 */}
                            <Route path="/blog" element={<Blog />} />
                            <Route
                                path="/blogWriteForm"
                                element={<BlogWriteForm />}
                            />
                            <Route
                                path="/blogReadForm/:seq"
                                element={<BlogReadForm />}
                            />
                            <Route
                                path="/blogUpdateForm/:seq"
                                element={<BlogUpdateForm />}
                            />

                            <Route
                                path="/blogReadModal"
                                element={<BlogReadModal />}
                            />

                            {/* 스터디 그룹 */}
                            <Route
                                path="/studygroup"
                                element={<StudygroupMain />}
                            ></Route>
                            <Route
                                path="/studygroup/form/"
                                element={
                                    <StudygroupForm id="studygroupWrite" />
                                }
                            ></Route>
                            <Route
                                path="/studygroup/form/:seq"
                                element={
                                    <StudygroupForm id="studygroupWrite" />
                                }
                            ></Route>

                            {/* 캘린더 */}
                            <Route path="/calendar" element={<Calendar />} />

                            {/* 채용 */}
                            <Route path="/joblist" element={<Joblist />} />
                            {/* <Route path="/jobdetail" element={<Jobdetail />} /> */}

                            <Route
                                path="/jobdetail/:seq"
                                exact
                                element={<Jobdetail />}
                            />

                            <Route
                                path="/combbslist"
                                element={<Combbslist />}
                            />
                            <Route
                                path="/combbswrite"
                                element={<Combbswrite />}
                            />
                            <Route
                                path="/combbsupdate/:seq"
                                exact
                                element={<Combbsupdate />}
                            />

                            <Route
                                path="/combbsdetail/:seq"
                                exact
                                element={<Combbsdetail />}
                            />
                            <Route
                                path="/jobcalendar"
                                element={<Jobcalendar />}
                            />

                            <Route
                                path="/registration"
                                element={<Registration />}
                            />

                            <Route
                                path="/jobMail/:seq"
                                exact
                                element={<JobMail />}
                            />

                            <Route path="/error" element={<Error />} />
                            <Route
                                path="/error/nouser"
                                element={<ErrorNoUser />}
                            />
                        </Routes>
                    </AppLayout>
                </Suspense>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
