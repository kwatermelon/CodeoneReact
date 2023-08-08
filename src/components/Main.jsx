import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";
import imageDefault from "../assets/blog/imageDefault.png";
import visibility from "../assets/blog/visibility.png";

import favorite from "../assets/blog/favorite.png";
import BlogCard from "./blog/BlogCard";
import Chatbox from "./main/Chatbox";
import "./Main.css";

import chatbutton from "../assets/job/chatbutton.png"; //챗봇 추가

import { Swiper, SwiperSlide } from "swiper/react"; // basic
import SwiperCore, { Navigation, Pagination } from "swiper";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import banner1 from '../assets/main/banner1.jpg';
import banner2 from '../assets/main/banner2.jpg';
import banner3 from '../assets/main/banner3.jpg';
import job1 from '../assets/main/home.png';
import job2 from '../assets/main/money.png';
import job3 from '../assets/main/time.png';
import job4 from '../assets/main/wallet.png';
import lecture1 from '../assets/main/good.png';
import lecture2 from '../assets/main/thumb.png';
import lecture3 from '../assets/main/book.png';
import lecture4 from '../assets/main/data.png';
SwiperCore.use([Navigation, Pagination]);

const ColoredText = styled.span`
    color: #e6b74a;
`;

const SearchResultContainer = styled.div`
    //   display: flex;
    width: 100%;
    height: 3000px;
    margin: 0 auto;
    justify-content: center;
`;
//채용
const ChatboxContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    /* 추가적인 스타일 속성은 필요에 따라 추가합니다 */
`;

const Main = () => {
    const [blogList, setBlogList] = useState([]);

    // 블로그 가져오기
    const getAllBlogs = async () => {
        const res = await axios({
            method: "get",
            url: "http://localhost:/blog/getAllBlogs", // => url 맞는거로 바꾸기
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        setBlogList(res.data);
    };

    const printRows = (blogList) => {
        let roofAmount = parseInt(blogList.length / 5) + 1;

        let components = [];

        for (let i = 0; i < 2; i++) {
            let component = (
                <div key={i} className="row">
                    <Row blogList={blogList} start={i * 5} />
                </div>
            );

            components.push(component);
        }

        return components;
    };

    const readBlog = (seq) => {
        window.location.href = `/blogReadForm/${seq}`;
    };

    const Row = (props) => {
        let blogList = props.blogList;
        let start = props.start;
        let end = start + 5;
        if (blogList.length < end) {
            end = blogList.length;
        }

        let components = [];

        while (start < end) {
            let blog = blogList[start++];
            let seq = blog.seq;
            let title = blog.title;
            let writer = blog.writer;
            let thumbnail = imageDefault;
            if (blog.thumbnail) {
                thumbnail = blog.thumbnail;
            }
            let likes = blog.likes;
            let replies = blog.replies;
            let content = blog.content;


            let component = (
                <BlogCard
                    key={seq}
                    seq={seq}
                    title={title}
                    thumbnail={thumbnail}
                    likes={likes}
                    replies={replies}
                    writer={writer}
                    content={content}
                ></BlogCard>
            );

            components.push(component);
        }

        return components;
    };

    //chatbot(하나 추가)
    const [isChatboxVisible, setChatboxVisible] = useState(false);

    const toggleChatbox = () => {
        setChatboxVisible(!isChatboxVisible);
    };

    useEffect(function () {
        getAllBlogs();
        // if(inView) {
        //   console.log(inView, " 무한 스크롤 요청");
        //   productFetch();
        // }
    }, []);

    function activateTab(tabId) {
        // 모든 탭 내용 숨기기
        var tabContents = document.getElementsByClassName('tabPane');
        for (var i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = 'none';
        }
    
        // 선택한 탭 내용 보이기
        var selectedTab = document.getElementById(tabId);
        selectedTab.style.display = 'block';

        
        var selectedLi = document.querySelector('.lec_menu li.' + tabId);
        if (selectedLi) {
            var activeLi = document.querySelector('.lec_menu li.active');
            if (activeLi) {
                activeLi.classList.remove('active');
            }
            selectedLi.classList.add('active');
        }
        
    }

    return (
        <SearchResultContainer>

        <div className="mainWrap">
                <div className="slideWrap">
                <Swiper
                spaceBetween={50}
                slidesPerView={1}
                scrollbar={{ draggable: true }}
                navigation
                pagination={{ clickable: true }}
                loop= {true}
                >
                <SwiperSlide><img src={banner1} alt="" /></SwiperSlide>
                <SwiperSlide><img src={banner2} alt="" /></SwiperSlide>
                <SwiperSlide><img src={banner3} alt="" /></SwiperSlide>
                
                </Swiper>
                </div>

                <div className="blogWrap">
                    <div className='blog_txt'>
                        <h3>금주의 Hot Blog 🔥</h3>
                        <a href="http://localhost:3000/blog">More Blog {'>'}</a>
                    </div>

                    <div className="blog_list">
                        {blogList.length > 0 ? (
                            printRows(blogList)
                        ) : (
                            // searchResult의 결과가 0개일때
                            <>
                                <h1> 게시물이 없습니다. </h1>                                                                      
                            </>  
                        )}
                    </div>
                </div>

                <div className="lectureWrap">
                <div className="lec_txt">
                    <p>강의샵</p>
                    <h3>무엇을 더 공부하면<br/>좋을지 고민이신가요?</h3>
                    <a href="http://localhost:3000/lecturelist">더보기 {'>'}</a>
                </div>
                <div className="lec_right">
                    <div className="lec_menu">
                        <ul>
                            <li onClick={() => activateTab('tab1')} className="tab1 active">프론트엔드</li>
                            <li onClick={() => activateTab('tab2')} className="tab2">백엔드</li>
                            <li onClick={() => activateTab('tab3')} className="tab3">데이터/머신러닝</li>
                        </ul>
                    </div>
                    <div class="tabContents">
                        <div id="tab1" class="tabPane active">
                            <div className="lecWrap">
                                <div className="tab_content">
                                    <div className="contwrap">
                                        <div className="cont_txt">
                                            <p>[핸즈온] 만들면서 배우는 프론트엔드(Next.js,TypeScript)</p>
                                            <p>49,000 원</p>
                                        </div>
                                        <div className="cont_img">
                                            <img src={lecture1} alt="" />
                                        </div>
                                    </div>
                                    <a href="http://localhost:3000/lecturelist">강의보러가기</a>
                                </div>
                                <div className="tab_content">
                                    <div className="contwrap">
                                        <div className="cont_txt">
                                            <p>FE 채용 과제로 배우는 자바 스크립트</p>
                                            <p>100,000원</p>
                                        </div>
                                        <div className="cont_img">
                                            <img src={lecture2} alt="" />
                                        </div>
                                    </div>
                                    <a href="http://localhost:3000/lecturelist">강의보러가기</a>
                                </div>
                            </div>
                        </div>

                        <div id="tab2" class="tabPane">
                        <div className="lecWrap">
                                <div className="tab_content">
                                    <div className="contwrap">
                                        <div className="cont_txt">
                                            <p>백엔드 데브코스 배움공유 다같이 배우는 JAVA</p>
                                            <p>79,000 원</p>
                                        </div>
                                        <div className="cont_img">
                                            <img src={lecture3} alt="" />
                                        </div>
                                    </div>
                                    <a href="http://localhost:3000/lecturelist">강의보러가기</a>
                                </div>
                                <div className="tab_content">
                                    <div className="contwrap">
                                        <div className="cont_txt">
                                            <p>[라이브/2기] 상위 서비스 back-end 개발자들과 진행하는 모의 면접 부트 캠프</p>
                                            <p>390,000원</p>
                                        </div>
                                        <div className="cont_img">
                                            <img src={lecture1} alt="" />
                                        </div>
                                    </div>
                                    <a href="http://localhost:3000/lecturelist">강의보러가기</a>
                                </div>
                            </div>
                        </div>

                        <div id="tab3" class="tabPane">
                        <div className="lecWrap">
                            <div className="tab_content">
                                    <div className="contwrap">
                                        <div className="cont_txt">
                                            <p>[라이브/13기] 실리콘밸리에서 날아온 데이터 엔지니어링 스타터 키트 with Python</p>
                                            <p>450,000 원</p>
                                        </div>
                                        <div className="cont_img">
                                            <img src={lecture4} alt="" />
                                        </div>
                                    </div>
                                    <a href="http://localhost:3000/lecturelist">강의보러가기</a>
                                </div>
                                <div className="tab_content">
                                    <div className="contwrap">
                                        <div className="cont_txt">
                                            <p>MariaDB 클라이언트 개발, HeidiSQL</p>
                                            <p>90,000원</p>
                                        </div>
                                        <div className="cont_img">
                                            <img src={lecture4} alt="" />
                                        </div>
                                    </div>
                                    <a href="http://localhost:3000/lecturelist">강의보러가기</a>
                                </div>

                            </div>
                        </div>
                    </div> 
                    
                </div>
                </div>

                <div className="job">
                    <h3>채용공고</h3>
                    <p>지원하고싶은 공고를 찾아보세요</p>
                    <div className="job_list">
                        <ul>
                            <li><a href="http://localhost:3000/joblist">
                                <article><img src={job1} alt="" /></article>
                                <p>재택근무</p>
                            </a></li>
                            <li><a href="http://localhost:3000/joblist">
                                <article><img src={job2} alt="" /></article>
                                <p>인센티브</p>
                            </a></li>
                            <li><a href="http://localhost:3000/joblist">
                                <article><img src={job3} alt="" /></article>
                                <p>유연근무제</p>
                            </a></li>
                            <li><a href="http://localhost:3000/joblist">
                                <article><img src={job4} alt="" /></article>
                                <p>신입연봉 4천이상</p>
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <button className="chat-open" onClick={toggleChatbox}>
                <img src={chatbutton} alt="Chat Button" />
            </button>
            {isChatboxVisible && <Chatbox />}
        </SearchResultContainer>
    );
};

export default Main;
