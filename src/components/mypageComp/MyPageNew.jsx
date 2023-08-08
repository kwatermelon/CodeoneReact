import React from "react";
import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";
import { Container} from 'react-bootstrap';
import './mypage.css';
import styled from 'styled-components';


import MyPageMemberInfoMain from "./memberInfo/MyPageMemberInfoMain";
import MyPageStudygroupListMain from "./studygroup/MyPageStudygroupListMain";
import MyPageMemberInfoMainNew from "./memberInfo/MyPageMemberInfoMainNew";

const MyPageMainContainer = styled.div`
  background: transparent;
  width: 100%;
  height: 900px;
  border: none;
  overflow : auto;
`


function MyPageNew(){
    return(
        <MyPageMainContainer>
          

                {/* <section className="mainBoxLeft">
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
                </section> */}
                <Container>
                    <h1 style={{fontSize:"xx-large", textAlign:'center'}}>마이 페이지</h1>
                    <Routes>
                    {/* <Route path="memberinfo" element={<MyPageMemberInfoMain />} /> */}
                    <Route path="" element={<MyPageMemberInfoMainNew />} />
                        {/* <Route path="studygroup" element={<MyPageStudygroupListMain />} /> */}
                    </Routes>
                </Container>

        </MyPageMainContainer>
    )
}

export default MyPageNew;