import React from "react";
import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";
import { Container} from 'react-bootstrap';
import './mypage.css';

import MyPageMemberInfoMain from "./memberInfo/MyPageMemberInfoMain";
import MyPageStudygroupListMain from "./studygroup/MyPageStudygroupListMain";


function MyPage(){
    return(
        <div className="container">
            <h2>마이페이지</h2>
            <div className="mypageMain">
                <section className="mainBoxLeft">
                    <div><Link to="/mypage/memberinfo">회원정보</Link></div>
                    <div>
                        <span>내가 쓴 글</span>
                        <ul className="depthWrapper depth1">
                            <li className="depthList depth1">
                                <Link to="/mypage/studygroup">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                    <span>스터디 그룹</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* <div>회원탈퇴</div> */}
                </section>
                <Container>
                    <Routes>
                        <Route path="" element={<MyPageMemberInfoMain />} />
                        <Route path="memberinfo" element={<MyPageMemberInfoMain />} />
                        <Route path="studygroup" element={<MyPageStudygroupListMain />} />
                    </Routes>
                </Container>
            </div>
        </div>
    )
}

export default MyPage;