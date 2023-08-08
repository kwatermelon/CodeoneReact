import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import {Button, Row, Col, Container, Nav, Tab, Tabs} from 'react-bootstrap';
import '../studygroup/myPageStudygroupListMain.css';
import MyPageBloggroupListItemComponent from './MyPageBloggroupListItemComponent';
import MyPageLikeBloggroupListItemComponent from './MyPageLikeBloggroupListItemComponent';

function MyPageBloggroupListMain() {
    const [bloggroupAmount, setBloggroupAmount] = useState(-1);
    const [bloggroupLikeAmount, setBloggroupLikeAmount] = useState(-1);
    const [bloggroupList, setBloggroupList] = useState([]);
    const [bloggroupLikeList, setBloggroupLikeList] = useState([]);
    // const [position, setPosition] = useState();
    // const [technologyStack, setTechnologyStack] = useState();

    let tempBlogPageNumber = window.localStorage.getItem("nowBlogPageNumber");
    const [nowBlogPageNumber, setNowBlogPageNumber] = useState(tempBlogPageNumber === null ? 1 : parseInt(tempBlogPageNumber));
    const blogstartNumber = bloggroupAmount - ((nowBlogPageNumber-1) * 5);
    


    
    let tempLikePageNumber = window.localStorage.getItem("nowLikePageNumber");
    const [nowLikePageNumber, setNowLikePageNumber] = useState(tempLikePageNumber === null ? 1 : parseInt(tempLikePageNumber));
    const startLikeNumber = bloggroupLikeAmount - ((nowLikePageNumber-1) * 5);


    function fetchBloggroupAmount() {
        axios.get("http://localhost/bloggroup/mng/amount").then(response => {
            if(response.status === 200) {
                console.log(response.data + " blog ammount")
                setBloggroupAmount(response.data);
            }
        });
    }


    function fetchLikeBloggroupAmount() {
        axios.get("http://localhost/bloggroup/mng/likeamount").then(response => {
            if(response.status === 200) {
                console.log(response.data + " like ammount")
                setBloggroupLikeAmount(response.data);
            }
        });
    }



    function fetchBloggroupList() {
        console.log(nowBlogPageNumber)
        axios.get("http://localhost/bloggroup/mng/list/"+nowBlogPageNumber).then(response => {
            if(response.status === 200) {
                console.log(response.data)
                setBloggroupList(response.data);
            }
        });
    }



    function fetchLikeBloggroupList() {
        axios.get("http://localhost/bloggroup/mng/likelist/"+nowLikePageNumber).then(response => {
            if(response.status === 200) {
                console.log(response.data + " likelist")
                setBloggroupLikeList(response.data);
            }
        });
    }


    useEffect(function() {
        fetchBloggroupAmount();
        fetchLikeBloggroupAmount();
    }, []);


    useEffect(function() {
        fetchBloggroupList();        
    }, [nowBlogPageNumber, bloggroupAmount]);

    useEffect(function() {
        fetchLikeBloggroupList();        
    }, [nowLikePageNumber, bloggroupLikeAmount]);


    function clickBlogPageNumber(nowBlogPageNumber) {
        window.localStorage.setItem("nowBlogPageNumber", nowBlogPageNumber);
        setNowBlogPageNumber(nowBlogPageNumber);
    }

    
    function clickLikePageNumber(nowLikePageNumber) {
        window.localStorage.setItem("nowLikePageNumber", nowLikePageNumber);
        setNowLikePageNumber(nowLikePageNumber);
    }

    return(
        <>
            <div className="listWrapper">
                    <>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                <Row>
                                    <Col sm={2}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link className=''  eventKey="first">내가 쓴 글</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="second">좋아요한 글</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    </Col>
                                    <Col sm={10}>

                                    <Tab.Content>
                                    {bloggroupAmount === 0 && 
                                        <div className="listEmpty">
                                            <h1>등록된 블로그가 없습니다</h1>
                                            <h2>블로그를 작성해보세요!</h2>
                                        </div>
                                    }

                                    {bloggroupAmount > 0 && 
                                        <Tab.Pane eventKey="first">

                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">번호</th>
                                                            <th scope="col">제목</th>
                                                            <th scope="col">작성일</th>
                                                            <th scope="col">좋아요</th>
                                                            <th scope="col">댓글</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bloggroupList.map((blog, index) => {
                                                            return <MyPageBloggroupListItemComponent
                                                                        number={blogstartNumber-index}
                                                                        blog={blog}
                                                                        key={blog.seq}
                                                                        setNowBlogPageNumber={setNowBlogPageNumber}
                                                                        // fetchStudygroupAmount={fetchBloggroupAmount} // 삭제 시 사용
                                                                />
                                                    
                                                        })}
                                                    </tbody>
                                                </table>

                                                <Pagination
                                                    activePage={nowBlogPageNumber}             // 현재 선택된 페이지 번호
                                                    itemsCountPerPage={5}                 // 한 페이지당 보여줄 아이템의 개수
                                                    totalItemsCount={bloggroupAmount}     // 전체 아이템의 개수(전체 글 개수)
                                                    pageRangeDisplayed={5}                 // 한번에 표시할 페이지 개수 1/2/3/4/5
                                                    prevPageText={"‹"}
                                                    nextPageText={"›"}
                                                    onChange={clickBlogPageNumber}
                                                />
                                        </Tab.Pane>                                    
                                    }
                                    {bloggroupLikeAmount === 0 && 
                                        <div className="listEmpty">
                                            <h1>등록된 블로그가 없습니다</h1>
                                            <h2>블로그를 작성해보세요!</h2>
                                        </div>
                                    }


                                    {bloggroupLikeAmount > 0 &&  
                                    
                                        <Tab.Pane eventKey="second">
                                                <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">번호</th>
                                                                <th scope="col">제목</th>
                                                                <th scope="col">작성일</th>
                                                                <th scope="col">좋아요</th>
                                                                <th scope="col">댓글</th>
                                                                <th scope="col"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bloggroupLikeList.map((bloglike, index) => {
                                                                return <MyPageLikeBloggroupListItemComponent
                                                                            number={startLikeNumber-index}
                                                                            blog={bloglike}
                                                                            key={bloglike.seq}
                                                                            setNowLikePageNumber={setNowLikePageNumber}
                                                                            // fetchStudygroupAmount={fetchLikeBloggroupAmount}
                                                                    />
                                                        
                                                            })}
                                                        </tbody>
                                                    </table>         
                                                    <Pagination
                                                        activePage={nowLikePageNumber}             // 현재 선택된 페이지 번호
                                                        itemsCountPerPage={5}                 // 한 페이지당 보여줄 아이템의 개수
                                                        totalItemsCount={bloggroupLikeAmount}     // 전체 아이템의 개수(전체 글 개수)
                                                        pageRangeDisplayed={5}                 // 한번에 표시할 페이지 개수 1/2/3/4/5
                                                        prevPageText={"‹"}
                                                        nextPageText={"›"}
                                                        onChange={clickLikePageNumber}
                                                    />                                   
                                        </Tab.Pane>                        
                                    }


                                        </Tab.Content>
                                    </Col>
                                </Row>
                                </Tab.Container>


                    </>
 
            </div>
        </>
    );
}

export default MyPageBloggroupListMain;