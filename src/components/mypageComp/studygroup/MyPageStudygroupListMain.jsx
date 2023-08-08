import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";

import './myPageStudygroupListMain.css';
import MyPageStudygroupListItemComponent from './MyPageStudygroupListItemComponent';

function MyPageStudygroupListMain() {
    const [studygroupAmount, setStudygroupAmount] = useState(-1);
    const [studygroupList, setStudygroupList] = useState([]);

    const [position, setPosition] = useState();
    const [technologyStack, setTechnologyStack] = useState();

    let tempPageNumber = window.localStorage.getItem("nowPageNumber");
    const [nowPageNumber, setNowPageNumber] = useState(tempPageNumber === null ? 1 : parseInt(tempPageNumber));
    const startNumber = studygroupAmount - ((nowPageNumber-1) * 10);

    function fetchStudygroupAmount() {
        axios.get("http://localhost/studygroup/mng/amount").then(response => {
            if(response.status === 200) {
                setStudygroupAmount(response.data);
            }
        });
    }

    function fetchStudygroupList() {
        axios.get("http://localhost/studygroup/mng/list/"+nowPageNumber).then(response => {
            if(response.status === 200) {
                setStudygroupList(response.data);
            }
        });
    }

    const fetchPosition = () => {
        axios.get("http://localhost/studygroup/filter/position").then(response => {
            setPosition(response.data);
        });
    }

    const fetchTechnologyStack = () => {
        axios.get("http://localhost/studygroup/filter/technology_stack").then(response => {
            setTechnologyStack(response.data);
        });
    }

    useEffect(function() {
        fetchStudygroupAmount();
    }, []);

    useEffect(function() {
        if(studygroupAmount > 0) {
            fetchPosition();
            fetchTechnologyStack();
        }
    }, [studygroupAmount]);

    useEffect(function() {
        fetchStudygroupList();
    }, [nowPageNumber, studygroupAmount]);

    function clickPageNumber(nowPageNumber) {
        window.localStorage.setItem("nowPageNumber", nowPageNumber);
        setNowPageNumber(nowPageNumber);
    }

    return(
        <>
            <div className="listWrapper">
                {studygroupAmount === 0 && 
                    <div className="listEmpty">
                        <h1>등록된 모집 글이 없습니다</h1>
                        <h2>모집 글을 작성 하고 스터디를 시작하세요!</h2>
                        <div>
                        <button type="button" className="btn btn-primary">글 작성 하러 가기</button>
                        </div>
                    </div>
                }
                {(studygroupAmount > 0 && position !== undefined && technologyStack !== undefined) && (
                    <>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">번호</th>
                                    <th scope="col">제목</th>
                                    <th scope="col">마감일</th>
                                    <th scope="col">모집분야</th>
                                    <th scope="col">기술스택</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {studygroupList.map((studygroupInfo, index) => {
                                    return <MyPageStudygroupListItemComponent
                                                number={startNumber-index}
                                                studygroupInfo={studygroupInfo}
                                                key={studygroupInfo.seq}
                                                essentialData={{positionData: position, technologyStackData: technologyStack}}
                                                setNowPageNumber={setNowPageNumber}
                                                fetchStudygroupAmount={fetchStudygroupAmount}
                                        />
                                })}
                            </tbody>
                        </table>

                        <Pagination
                            activePage={nowPageNumber}             // 현재 선택된 페이지 번호
                            itemsCountPerPage={10}                 // 한 페이지당 보여줄 아이템의 개수
                            totalItemsCount={studygroupAmount}     // 전체 아이템의 개수(전체 글 개수)
                            pageRangeDisplayed={5}                 // 한번에 표시할 페이지 개수 1/2/3/4/5
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={clickPageNumber}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default MyPageStudygroupListMain;