import "./css/joblist.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select"; //select 라이브러리

import reset2 from "../../assets/job/reset2.png"; //초기화버튼 사진 추가
import BootRadio from "./Radio"; //라디오 부트스트랩
import Buttons from "./Buttons"; //버튼 부트스트랩
import CheckSwitch from "./CheckSwitch"; //채용중만보기 부트스트랩
import { useInView } from "react-intersection-observer"; //무한스크롤 라이브러리
import upup from "../../assets/job/upup.png";
import SweetAlert from "sweetalert2";
import fullheart from "../../assets/store/heart.png";
import heart from "../../assets/store/emptyheart.png";

function JobList() {
    const history = useNavigate();

    const [joblist, setJobList] = useState([]);
    const [comname, setComname] = useState(""); // 회사이름

    const [comcate, setComcate] = useState(""); //직군
    const [comjobname, setComjobname] = useState(""); //직무
    const [comcareer, setComcareer] = useState(""); //경력
    const [comlocation, setComlocation] = useState(""); //지역
    const [comskill, setComskill] = useState(""); //기술
    const [comtag, setComtag] = useState(""); //태그
    const [startline, setStartline] = useState(""); //채용시작일
    const [deadline, setDeadline] = useState("");

    const [comcatelist, setComcatelist] = useState([]);
    const [comjobnamelist, setComjobnamelist] = useState([]);
    const [comcareerlist, setComcareerlist] = useState([]);
    const [comlocationlist, setComlocationlist] = useState([]);
    const [comsklist, setComSklist] = useState([]);
    const [comtaglist, setComtaglist] = useState([]); //태그

    // 선택한 조건
    // 직군 선택
    const [selectedComCate, selectComcate] = useState(null);
    // 직무 선택
    const [selectedComJobName, selectComJobName] = useState(null);
    // 경력 선택
    const [selectedComCareer, selectComCareer] = useState(null);
    // 지역 선택
    const [selectedComLocation, selectLocation] = useState(null);
    // 스킬 선택
    const [selectedComSkill, selectComSkill] = useState(null);
    // 복지 선택
    const [selectedComTag, selectComTag] = useState(null);
    const [showRecruitingOnly, setShowRecruitingOnly] = useState(false); //모집중
    const [currentUser, setCurrentUser] = useState(""); //현재 로그인한 아이디

    //무한스크롤
    const [ref, inView] = useInView();
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const infiJoblist = (page) => {
        if (isLoading) return;
        setIsLoading(true);
        axios
            .get("http://localhost:/job/list", {
                params: {
                    comname: comname,
                    comcate: null,
                    comjobname: selectedComJobName,
                    comcareer: selectedComCareer,
                    comlocation: selectedComLocation,
                    comskill: selectedComSkill,
                    comtag: selectedComTag,
                    pageNumber: page,
                },
            })
            .then((response) => {
                // console.log("정상");
                console.log("=========joblist==========");
                console.log(response.data.list);
                console.log("===================");

                const jobList = response.data.list;
                jobList.forEach((item) => {
                    if (item.whoLiked == "") {
                        item.whoLiked = "[]";
                    }
                });
                let filteredList = jobList;
                if (showRecruitingOnly) {
                    // 채용중인 공고만 필터링
                    const currentDate = new Date().toISOString(); //현재 날짜 구하기
                    filteredList = jobList.filter(
                        //현재날자가 startline보다 크고 deadline보다 작은 경우
                        (job) =>
                            job.startline <= currentDate &&
                            job.deadline >= currentDate
                    );
                }
                setJobList((prevList) => [...prevList, ...filteredList]);
                setIsLoading(false);
                console.log(
                    "현재 auth값은? " + window.localStorage.getItem("auth")
                );
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        // initialize 용도
        infiJoblist(page);
    }, [page]);

    // 무한 스크롤
    useEffect(() => {
        // inView가 true 일때만 실행한다.
        if (inView) {
            console.log(inView, "무한 스크롤 요청 ");

            setPage((page) => page + 1);
            infiJoblist(page);
        }
    }, [inView]);

    //검색(회사이름)
    const comnameHandler = (e) => {
        e.preventDefault();
        setComname(e.target.value);
    };

    //검색
    const handleFilter = () => {
        axios
            .get("http://localhost:/job/list", {
                params: {
                    comname: comname,
                    comcate: null,
                    comjobname: selectedComJobName,
                    comcareer: selectedComCareer,
                    comlocation: selectedComLocation,
                    comskill: selectedComSkill,
                    comtag: selectedComTag,
                },
            })
            .then((response) => {
                // console.log("정상");
                console.log("=========joblist==========");
                console.log(response.data.list.list);
                console.log("===================");
                console.log(response.data.list);

                const jobList = response.data.list;
                //whoLiked를 가져올때 ""값이면 [] 형태로 바꿔주기 (처음부터 배열형태로 가져오기 위해)
                jobList.forEach((item) => {
                    if (item.whoLiked == "") {
                        item.whoLiked = "[]";
                    }
                });
                let filteredList = jobList;
                if (showRecruitingOnly) {
                    // 채용중인 공고만 필터링
                    const currentDate = new Date().toISOString(); //현재 날짜 구하기
                    filteredList = jobList.filter(
                        //현재날자가 startline보다 크고 deadline보다 작은 경우
                        (job) =>
                            job.startline <= currentDate &&
                            job.deadline >= currentDate
                    );
                }

                setJobList(filteredList);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // 채용중만 보기 스위치 핸들러 ->페이지
    const handleRecruitingSwitch = () => {
        setShowRecruitingOnly((prev) => !prev); // 이전 상태의 반대로 업데이트
        handleFilter(!showRecruitingOnly); // showRecruitingOnly 상태값을 전달하여 handleFilter 함수 호출
    };

    //검색버튼 누르지 않고 바로바로 필터링 되게 handleFilter(검색) 함수를 호출하기
    useEffect(() => {
        handleFilter();
    }, [
        // comname,     //검색값은 검색 버튼 눌러야 검색됨. (바로바로 검색되면 한글자 쓸때마다 검색되므로)
        selectedComJobName,
        selectedComCareer,
        selectedComLocation,
        selectedComSkill,
        selectedComTag,
        showRecruitingOnly,
    ]);

    //직군
    const getComCate = () => {
        axios
            .get("http://localhost:/job/code/list", {
                params: {
                    group_seq: 1,
                    parent_code_seq: comcate,
                },
            })
            .then((response) => {
                // console.log(response.data);
                setComcatelist(response.data.list.list);
                selectComcate(response.data.list.list.value);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //직무
    const getComjobname = (value) => {
        setComcate(value);
        axios
            .get("http://localhost:/job/code/list", {
                params: {
                    group_seq: 1,
                    parent_code_seq: null,
                },
            })
            .then((response) => {
                // console.log(response);
                setComjobnamelist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //경력
    const getComCareer = () => {
        axios
            .get("http://localhost:/job/code/list", {
                params: {
                    group_seq: 2,
                },
            })
            .then((response) => {
                // console.log(response);
                setComcareerlist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //지역
    const getComLocation = () => {
        axios
            .get("http://localhost:80/job/code/list?group_seq=3")
            .then((response) => {
                // console.log(response);
                setComlocationlist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //기술
    const skillButtonClick = (value) => {
        setComskill(value);
    };

    const getComSkill = () => {
        axios
            .get("http://localhost:80/job/code/list?group_seq=4")
            .then((response) => {
                // console.log("ASBNCKLNASKLCNKLASCNLKCNASKL");
                // console.log(response.data.list.list);
                //   setComSklist(response.data?.list?.list);
                setComSklist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //태그
    const tagButtonClick = (value) => {
        setComskill(value);
    };

    const getComTag = () => {
        axios
            .get("http://localhost:80/job/code/list?group_seq=5")
            .then((response) => {
                // console.log(response);
                setComtaglist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //검색 초기화 버튼 함수
    const handleReset = () => {
        // 검색어 초기화
        setComname("");
        // 필터 초기화
        selectComcate(null);
        selectComJobName(null);
        selectComCareer(null);
        selectLocation(null);
        selectComSkill(null);
        selectComTag(null);
        // 채용중 중인 공고만 보기 초기화
        setShowRecruitingOnly(false);
        // 검색 초기화
        handleFilter();
        // 페이지 초기화
        setPage(1); //페이지 1페이지로 초기화 해줘야 검색 초기화 할 때 무한스크롤된 데이터를 다시 불러옴.
    };

    //좋아요 : 누가 좋아요 했는지 DB에 넣기 ( post->두번째 인자 null )
    const setWhoLiked = (m_seq, m_whoLiked) => {
        axios
            .post("http://localhost:/job/whoLiked", null, {
                params: {
                    seq: m_seq,
                    whoLiked: m_whoLiked,
                },
            })
            .then((res) => {
                console.log(res);
                console.log("요청 성공!");
                // console.log("whoLiked data :" + res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        console.clear();
        handleFilter();
        getComCate();
        getComjobname();
        getComCareer();
        getComLocation();
        getComSkill();
        getComTag();
        // getWhoLiked();

        setCurrentUser(window.localStorage.getItem("userId")); //userId를 currentUser에 저장해놓음.
        // setJobList2(test);
    }, []);

    //현재 로그인한 아이디를 받아오는 코드 : window.localStorage.getItem("userId")

    console.log("CurrentUser 아이디 : " + currentUser); //userId를 currentUser에 저장해놓음=현재 로그인한 아이디

    const doLike = (seq) => {
        // if (!currentUser) {
        //     // currentUser 값이 null 인 경우, 알림을 표시하고 함수를 종료한다.
        //     SweetAlert.fire("먼저 로그인을 해주세요");
        //     return;
        // }

        //joblist수정하기 위해 temp만듬
        const temp = [...joblist];
        console.log(temp);
        temp.forEach((item) => {
            if (item.seq === seq) {
                //=== 3개
                // console.log(item.whoLiked)
                //wholiked null 배열형태로 안바꾸게

                //DB의 특수기호 디코딩 %5B%22test%22%2C%22hanam4321%22%5D -> hana4321hana1234
                const temp2 = decodeURIComponent(item.whoLiked);
                console.log(temp2);
                const likeArray = JSON.parse(temp2); //hana4321을 배열 형태로 바꾸기 likeArray에는  ["hana4321"] 처럼 배열 형태로 담기게됨.
                likeArray.push(currentUser); //배열에 현재 로그인 아이디 넣기
                console.log(likeArray);
                item.whoLiked = JSON.stringify(likeArray); //DB 자료형은 string이므로 다시 문자열로 바꾸기
                console.log("하트 클릭한 후" + item.whoLiked); //item.whoLiked는 ['kwon', 'hana4321'] 이런 형태!
                SweetAlert.fire({
                    title: "좋아요",
                    text: "좋아요 하시겠습니까?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "네",
                    cancelButtonText: "아니오",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setWhoLiked(seq, encodeURIComponent(item.whoLiked));
                        setJobList(temp);
                        SweetAlert.fire(
                            "좋아요😍",
                            `${item.comname} 회사를 좋아합니다`,
                            "success"
                        );
                    }
                });

                setWhoLiked(seq, encodeURIComponent(item.whoLiked)); //DB저장시 특수기호 ["",]때문에 오류나므로 특수기호 인코딩 시켜서 DB에 저장
                //이렇게 인코딩해서 저장하면 DB에 %5B%22hana4321%22%5D  이라고 담기게됨
            }
        });
        // // console.log(temp);
        setJobList(temp);
    };

    const doUnLike = (seq) => {
        const temp = [...joblist];
        temp.forEach((item) => {
            if (item.seq === seq) {
                const temp3 = decodeURIComponent(item.whoLiked);
                console.log(temp3);
                let likeArray = JSON.parse(temp3); //배열 형태로 바꾸기

                likeArray = likeArray.filter(function (element) {
                    return element != currentUser; // currentId와 같지 않은 다른 아이디들의 새로운 배열 만들기->좋아요 해제한 아이디가 배열에서 제외됨.
                });
                item.whoLiked = JSON.stringify(likeArray); //다시 문자열로 바꾸기
                console.log("하트 해제한 후 " + item.whoLiked);
                SweetAlert.fire({
                    title: "좋아요 취소",
                    text: "좋아요를 취소하시겠습니까?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "네",
                    cancelButtonText: "아니오",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setWhoLiked(seq, encodeURIComponent(item.whoLiked));
                        setJobList(temp);
                        SweetAlert.fire(
                            "좋아요 취소😥",
                            "좋아요가 취소되었습니다",
                            "success"
                        );
                    }
                });
            }
        });
    };

    //기업회원 로그인 검증
    const comButtonClick = () => {
        if (!currentUser) {
            // currentUser 값이 null 인 경우, 알림을 표시하고 함수를 종료 -> 로그인 페이지로 이동
            SweetAlert.fire({
                html: "먼저 로그인을 해주세요.<br/>",
                confirmButtonText: "확인",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "http://localhost:3000/login";
                }
            });
        }
    };

    //스크롤 up
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const buttons1 = [
        { to: "/joblist", label: "채용공고" },
        { to: "/jobcalendar", label: "채용일정" },
    ];
    const buttons2 = [{ to: "/registration", label: "기업회원" }];

    return (
        <>
            <div className="buttons-container">
                <Buttons buttons={buttons1} />
                <Buttons
                    buttons={buttons2}
                    onClick={(e) => comButtonClick(e.target.getAttribute("to"))}
                />
            </div>

            <div className="tonetenets">
                <div className="main_visual">
                    <div className="total-search">
                        <div>
                            <input
                                type="text"
                                placeholder="회사 이름을 입력해주세요"
                                value={comname}
                                onChange={comnameHandler}
                                //엔터 치면 검색되게 하기
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        handleFilter();
                                    }
                                }}
                            />
                        </div>

                        <div className="jobfilter">
                            <Select
                                options={comjobnamelist}
                                placeholder="직무"
                                onChange={(e) => selectComJobName(e.label)}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        width: "260px",
                                    }),
                                }}
                            />
                        </div>

                        <div className="careerlocation">
                            <div className="select-wrapper">
                                <Select
                                    options={comcareerlist}
                                    placeholder="경력"
                                    onChange={(e) => selectComCareer(e.label)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "260px",
                                        }),
                                    }}
                                />
                            </div>
                            <div className="select-wrapper">
                                <Select
                                    options={comlocationlist}
                                    placeholder="지역"
                                    onChange={(e) => selectLocation(e.label)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "260px",
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="handlebutton">
                            <button onClick={handleFilter}>검색</button>
                        </div>

                        {/* 기술스택 */}
                        <div className="job-skill">
                            <BootRadio
                                options={comsklist.map((item) => ({
                                    label: item.label,
                                    value: item.label,
                                }))}
                                type="radio"
                                onChange={(e) => selectComSkill(e.target.value)}
                            />
                        </div>

                        {/* 태그(복지) */}
                        <div className="slide">
                            <BootRadio
                                options={comtaglist.map((item) => ({
                                    label: item.label,
                                    value: item.label,
                                }))}
                                type="radio"
                                onChange={(e) => selectComTag(e.target.value)}
                            />
                        </div>
                        {/* 초기화 버튼 */}
                        <div>
                            <img
                                src={reset2}
                                alt="reset"
                                style={{
                                    cursor: "pointer",
                                    width: "28px",
                                    height: "28px",
                                }}
                                onClick={handleReset}
                            />
                        </div>
                    </div>
                    {/* total-search 끝   */}
                </div>
                <br />
                {/* 채용중만 보기 */}
                <div className="switch">
                    <CheckSwitch
                        showRecruitingOnly={showRecruitingOnly}
                        handleRecruitingSwitch={handleRecruitingSwitch}
                    />
                </div>
                <br /> <br />
                {/* 데이터 보기 */}
                <div className="card-list">
                    {joblist.length > 0 ? (
                        joblist.map((item) => (
                            <div className="item" key={item.seq}>
                                <a href={`/jobdetail/${item.seq}`}>
                                    <div className="img">
                                        <img
                                            src={item.comimage}
                                            alt="이미지"
                                            style={{
                                                width: "210px",
                                                height: "130px",
                                            }}
                                        />
                                    </div>
                                </a>

                                <div className="job-txt">
                                    <strong className="job-comname">
                                        {item.comname}
                                    </strong>
                                    {/* 좋아요 */}
                                    <div className="job-like">
                                        {/* includes : whoLiked 에 현재 id가 들어있으면 true */}
                                        {item.whoLiked &&
                                        item.whoLiked.includes(currentUser) ? (
                                            // 이미 좋아요를 누른 경우
                                            <img
                                                src={fullheart}
                                                alt=""
                                                style={{
                                                    width: "18px",
                                                    height: "18px",
                                                }}
                                                onClick={() => {
                                                    doUnLike(item.seq);
                                                }}
                                            />
                                        ) : (
                                            // 좋아요를 누르지 않은 경우
                                            <img
                                                src={heart}
                                                alt=""
                                                style={{
                                                    width: "18px",
                                                    height: "18px",
                                                }}
                                                onClick={() => {
                                                    if (!currentUser) {
                                                        // currentUser 값이 null 인 경우, 알림을 표시하고 함수를 종료 -> 로그인 페이지로 이동
                                                        SweetAlert.fire({
                                                            html: "먼저 로그인을 해주세요.<br/>",
                                                            confirmButtonText:
                                                                "확인",
                                                        }).then((result) => {
                                                            if (
                                                                result.isConfirmed
                                                            ) {
                                                                window.location.href =
                                                                    "http://localhost:3000/login";
                                                            }
                                                        });
                                                        return;
                                                    }
                                                    doLike(item.seq);
                                                }}
                                            />
                                        )}
                                        {/* 좋아요 개수 세기(디코딩 한 후 세야함) */}

                                        {
                                            JSON.parse(
                                                decodeURIComponent(
                                                    item.whoLiked
                                                )
                                            ).length
                                        }
                                    </div>
                                    <br />

                                    {item.comjobname}
                                    <br />
                                    {item.comskill}
                                    <br />
                                    {item.comcareer}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-result">
                            검색결과가 없어요😥
                            <br />
                            필터를 재설정하거나 검색어를 다시 입력해보세요!
                        </div>
                    )}
                    {/* 이 부분이 보이면 스크롤됨 */}
                    <div ref={ref}></div>
                </div>
                <div className="job-up">
                    <img
                        src={upup}
                        alt="up"
                        className="job-upup"
                        onClick={scrollToTop}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            </div>
        </>
    );
}

export default JobList;
