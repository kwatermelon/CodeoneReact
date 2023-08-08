import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard"; // 링크복사 라이브러리

import "./css/combbsdetail.css";
import Jobkakaomap from "./Jobkakaomap"; //카카오맵 컴포넌트
import Jobkakaomsg from "./jobkakaomsg"; //카카오톡 공유하기 컴포넌트
import Buttons from "./Buttons"; //버튼 부트스트랩 컴포넌트
import SweetAlert from "sweetalert2";

//이미지파일
import company from "../../assets/job/company.png";
import download from "../../assets/job/download.png";
import gmail from "../../assets/job/gmail.png";
import date from "../../assets/job/date.png";
import location from "../../assets/job/location.png";
import link from "../../assets/job/link.png";
import upup from "../../assets/job/upup.png";

function Combbsdetail() {
    const [item, setItem] = useState({}); // 객체로 초기화해주기
    const [isVisible, setvisible] = useState(false);

    let params = useParams(); // seq 값 받아오기
    let seq = params.seq;
    let userId;
    const navigate = useNavigate();
    // alert(seq);

    function handleClick() {
        navigate("/JobMail");
    }

    const jobData = async (seq) => {
        await axios
            .get("http://localhost/job/view", { params: { seq: seq } })
            .then(function (resp) {
                console.log(resp.data.view.view);
                setItem(resp.data.view.view); // item 넣어주기
                setvisible(resp.data.view.view.id === userId);
                console.log("isVisible: " + isVisible);
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    //주소값
    const commapy = useLocation();
    console.log(location);
    let url = "http://localhost:3000" + commapy.pathname;

    //다운로드
    // 다운로드 버튼 클릭 시 실행되는 함수
    const handleDownload = () => {
        // GET 요청 보내기
        axios
            .get(`http://localhost:80/downloadFile?fileName=${item.comfile}`, {
                responseType: "blob",
            })
            .then((res) => {
                // 다운로드 수행
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", item.comfile);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        // initialize 용도
        jobData(seq);
        userId = window.localStorage.getItem("userId");
    }, [seq]);

    // 수정 버튼 클릭 시 이벤트 처리
    const handleEdit = () => {
        navigate(`/combbsupdate/${seq}`); // 수정 페이지로 이동
    };

    // 삭제 버튼 클릭 시 이벤트 처리
    const handleDelete = async () => {
        // 삭제할건지 확인창 띄워주기
        SweetAlert.fire({
            title: "게시글 삭제",
            text: "게시글을 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 삭제 로직 실행
                try {
                    const response = await axios.post(
                        "http://localhost/deleteJob",
                        null,
                        {
                            params: {
                                seq: seq,
                            },
                        }
                    );
                    console.log("delete resp data: " + response.data);
                    if (response.data === "YES") {
                        // 삭제 성공 시 목록 페이지로 이동
                        SweetAlert.fire(
                            "삭제 완료",
                            "글이 삭제되었습니다.",
                            "success"
                        );
                        navigate("/combbslist");
                    } else {
                        SweetAlert.fire(
                            "삭제 실패",
                            "삭제에 실패했습니다.",
                            "error"
                        );
                    }
                } catch (error) {
                    console.log(error);
                    SweetAlert.fire(
                        "오류",
                        "삭제 중 오류가 발생했습니다.",
                        "error"
                    );
                }
            } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                SweetAlert.fire("삭제 취소", "삭제가 취소되었습니다.", "info");
            }
        });
    };

    //스크롤 위로 올리기
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    //링크 복사
    const currentUrl = window.location.href;

    const handleCopyToClipboard = () => {
        alert("링크가 복사되었습니다.");
    };

    const buttons1 = [
        { to: "/joblist", label: "채용공고" },
        { to: "/jobcalendar", label: "채용일정" },
    ];
    const buttons2 = [{ to: "/registration", label: "기업회원" }];

    return (
        <>
            <div className="buttons-container">
                <Buttons buttons={buttons1} />
                <Buttons buttons={buttons2} />
            </div>
            <div className="job-detail">
                {/* 회사이름 */}
                <span id="jobname">
                    {" "}
                    <img src={company} alt="company" className="job-company" />
                    {item.comname}
                </span>{" "}
                &nbsp;
                {/* 채용 전형+기술+복지 */}
                <div className="job-tag">
                    <p id="comjobname">🙎{item.comjobname}</p>
                    <span>💙{item.comskill}</span>{" "}
                    <span id="tagline">💙{item.comtag}</span> <br />
                </div>
                {/* 시작일 ~ 마감일 */}
                <p id="startdead">
                    <img src={date} alt="date" className="job-start" />
                    &nbsp;
                    {item.startline} ~ {item.deadline}
                    {/* 수정, 삭제 버튼  */}
                    <div className="edit-del">
                        {isVisible ? (
                            <button onClick={handleEdit}>수정</button>
                        ) : null}
                        {isVisible ? (
                            <button onClick={handleDelete}>삭제</button>
                        ) : null}
                    </div>
                </p>
                {/* 게시글 사진 + 내용 */}
                <div className="content-container">
                    <div className="content-line"></div>
                    <br />
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    <br />
                </div>
                {/* 회사 위치 카카오맵 API */}
                <div className="location-container">
                    <div className="location-line"></div>
                    <p>
                        {" "}
                        <img
                            src={location}
                            alt="findjob"
                            className="job-down"
                        />
                        근무 지역
                    </p>

                    <Jobkakaomap
                        comname={item.comname}
                        address={item.commapy}
                    />
                    <p>{item.commapy}</p>
                </div>
                <br />
                {/* 이력서 다운로드 */}
                <div className="download-container">
                    <div className="download-line"></div>
                    <span>[{item.comname}]의 이력서 다운로드하기</span>
                    {/* 이력서 다운로드 버튼 */}
                    <button id="down" onClick={handleDownload}>
                        <img
                            src={download}
                            alt="findjob"
                            className="job-down"
                        />
                    </button>
                </div>
                <br />
                <br />
                <div className="jobQNA">
                    <div className="qna-line"></div>
                    <span>
                        [{item.comname}] 담당자에게 문의하기 &nbsp;
                        <img src={gmail} alt="findjob" className="job-qna" />
                        &nbsp;
                    </span>
                    <span>
                        <a
                            href={`mailto:${item.comEmail}?subject=CodeOne:문의드립니다&body=사용자 id :%0D%0A%0D%0A사용자 이름 :%0D%0A%0D%0A문의내역 :`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contact Us
                        </a>
                    </span>
                </div>
                <br />
                <br />
            </div>
            <br />
            <br />
            {/* 오른쪽 nav */}
            <div className="job-nav">
                <p id="jobnav">
                    {item.comname} <br />
                    {item.comjobname}
                </p>
                <p>경력: {item.comcareer}</p>
                <p>연봉 : {item.comsalary}</p>
                <p>마감일 : {item.deadline}</p>
                <div>
                    <a href={`/jobMail/${item.seq}`}>
                        <button onClick={handleClick}>지원하기</button>
                    </a>
                </div>
                {/* 카카오톡 공유 */}
                <div className="job-msg">
                    <Jobkakaomsg link={`/jobdetail/${seq}`} />
                </div>

                {/* 공유 링크 복사  */}
                <div className="job-link">
                    <CopyToClipboard
                        text={currentUrl}
                        onCopy={handleCopyToClipboard}
                    >
                        <img
                            src={link}
                            alt="link"
                            className="job-link"
                            style={{ cursor: "pointer" }}
                        />
                    </CopyToClipboard>
                </div>
            </div>

            {/* 스크롤 up */}
            <div className="job-up">
                <img
                    src={upup}
                    alt="up"
                    className="job-upup"
                    onClick={scrollToTop}
                    style={{ cursor: "pointer" }}
                />
            </div>
        </>
    );
}

export default Combbsdetail;
