import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import Buttons from "./Buttons";
import "./css/combbslist.css";

//console.log("현재 auth값은? " + window.localStorage.getItem("auth"));
console.log("현재 id는? " + window.localStorage.getItem("userId"));

function ComBbslist() {
    const [combbslist, setCombbslist] = useState([]);
    const [search, setSearch] = useState(""); //검색
    const [filteredCombbslist, setFilteredCombbslist] = useState([]); //검색
    const [page, setPage] = useState(1); //현재 페이지 저장
    const [totalCount, setTotalCount] = useState(0); // 글의 총개수

    const [loginUser, setLoginUser] = useState("");

    const [id, setId] = useState(window.localStorage.getItem("userId") || "");

    // // localStorage에서 login 꺼내와서 parsing하기
    // const login = JSON.parse(localStorage.getItem("login"));
    // // console.log(login);
    // console.log(login.auth);

    // 로그인 여부와 auth 값 가져오기
    //const auth = parseInt(window.localStorage.getItem("auth"));
    //const isLoggedIn = window.localStorage.getItem("userId");

    // 주소 접근 제한을 위한 조건 확인
    const navigate = useNavigate();

    const checkSessionUser = () => {
        axios
            .get(`http://localhost/user/getSessionUser`, {
                withCredentials: true,
            })
            .then((result) => {
                console.log(result.data.auth + " combblist auth");
                if (result.data.auth === 2) {
                    localStorage.setItem("login", JSON.stringify(result.data)); // 로그인으로 저장
                    setLoginUser(localStorage.getItem("login")); // loginUser로 저장
                    getCombbslist(0);
                } else {
                    console.log("no auth User");
                    window.location.href = "/joblist";
                }
            });
    };

    // localStorage에서 login 꺼내와서 parsing하기    
    const login = JSON.parse(localStorage.getItem("login"));
    // console.log(login);
    // console.log(login.auth);

    // 서버에서 게시글 목록을 가져와서 state에 저장하는 함수
    function getCombbslist(page) {
        axios
            .get("http://localhost:80/combbslist", {
                params: { pageNumber: page },
            })
            .then(function (resp) {
                console.log(resp);
                // 검색어를 적용한 게시글 목록을 가져옴
                const filteredCombbslist = filterCombbslist(
                    resp.data.combbslist
                );
                // 서버에서 받아온 게시글 목록 데이터를 state로 저장
                setCombbslist(filteredCombbslist);
                setFilteredCombbslist(filteredCombbslist);
                // 페이징 처리를 위해 전체 게시글 수를 저장
                setTotalCount(resp.data.totalCount);
            })
            .catch(function (err) {
                alert(err);
            });
    }

    // 페이지가 로딩될 때 실행되는 useEffect hook
    useEffect(() => {
        if (!login || login === "" || login.auth !== 2) {
            navigate("/joblist");
        } else {
            //navigate("/combbslist");
            getCombbslist(0);
            // checkSessionUser
            // console.log("로그인" + login);
            // console.log("auth" + login.auth);
        }
    }, []);

    // 검색 기능 (백엔드 없이 프론트로만 구현)
    // 검색어를 입력받아 검색어 state를 업데이트
    function handleSearch(event) {
        setSearch(event.target.value);
    }

    // 검색어에 따라 게시글 목록을 필터링하는 함수
    function filterCombbslist(combbslist) {
        return combbslist.filter((com) =>
            com.comname.toLowerCase().includes(search.toLowerCase())
        );
    }
    // 검색 버튼을 눌렀을 때 실행되는 함수

    function handleSearchSubmit(event) {
        event.preventDefault();
        const filteredList = combbslist.filter((item) =>
            item.comname.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCombbslist(filteredList); // 필터링된 게시글 목록을 저장
    }

    // 페이지 변경 시 실행되는 함수
    function pageChange(page) {
        //page:선택한 page
        setPage(page);
        console.log("페이지 : " + page);
        getCombbslist(page - 1); // 인덱스는 0부터 시작하므로 page-1
    }

    // 필터링된 게시글 목록을 사용하여 TableRow를 렌더링하는 함수
    function renderTableRows() {
        // 검색어가 있는 경우 필터링된 게시글 목록을 사용하여 TableRow를 렌더링하고
        // 검색어가 없는 경우 전체 게시글 목록을 사용하여 TableRow를 렌더링함
        const targetList = search ? filteredCombbslist : combbslist;
        return targetList.map(function (com, i) {
            return <TableRow combbs={com} totalCount={i + 1} key={i} />;
        });
    }

    const buttons1 = [
        { to: "/joblist", label: "채용공고" },
        { to: "/jobcalendar", label: "채용일정" },
    ];
    const buttons2 = [{ to: "/registration", label: "기업회원" }];
    const buttons3 = [{ to: "/combbswrite", label: "글쓰기" }];

    const jobWriteClick = () => {
        navigate("/combbswrite");
    };

    return (
        <div>
            <div className="buttons-container">
                <Buttons buttons={buttons1} />
                <Buttons buttons={buttons2} />
            </div>
            <div className="job-search">
                {/* form 내부에서 input 요소 사용할 때, 엔터 클릭시 submit이벤트 발생 가능(기본문법) */}
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="회사 이름으로 검색"
                        value={search}
                        onChange={handleSearch}
                    />
                    <button type="submit">검색</button>
                </form>
            </div>
            <div className="jobcom-list">
                <table className="joblist-table">
                    <colgroup>
                        {/* <col width="100" />
                    <col width="400" />
                    <col width="200" />
                    <col width="100" /> */}
                    </colgroup>
                    <thead>
                        <tr className="job-header">
                            <th>번호</th>
                            <th>제목</th>
                            <th>회사이름</th>
                            <th>작성자</th>
                        </tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                </table>
                <br />

                <Pagination
                    activePage={page}
                    itemsCountPerPage={10}
                    totalItemsCount={totalCount}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={pageChange}
                />

                <button className="job-write" onClick={jobWriteClick}>
                    글작성
                </button>
                <br />
                <br />
            </div>
            <br />
            <br />
        </div>
    );
}

function TableRow(props) {
    return (
        <tr>
            <td>{props.combbs.seq}</td>

            {BbsTitleProc(props)}
            <td>{props.combbs.comname}</td>
            <td>{props.combbs.id}</td>
        </tr>
    );
}

function BbsTitleProc(props) {
    if (
        props.combbs &&
        (props.combbs.comdel === 0 || props.combbs.comdel === false)
    ) {
        return (
            <td style={{ textAlign: "left" }}>
                <Link
                    to={`/combbsdetail/${props.combbs.seq}`}
                    style={{ textDecoration: "none" }}
                >
                    {props.combbs.title}
                </Link>
            </td>
        );
    } else {
        return <td>*** 이 글은 작성자에 의해서 삭제되었습니다 ***</td>;
    }
}

export default ComBbslist;
