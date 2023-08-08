import axios from "axios";
import React, { useState, useEffect } from "react";
import "./css/registration.css";
import Buttons from "./Buttons";
import { useNavigate } from "react-router-dom";
import SweetAlert from "sweetalert2";

//국세청 사업자등록번호 진위여부 확인
//API https://www.data.go.kr/data/15081808/openapi.do#/%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D%EC%A0%95%EB%B3%B4%20%EC%A7%84%EC%9C%84%ED%99%95%EC%9D%B8%20API/validate

function Registration() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bNo, setBNo] = useState(""); //사업자번호
    const [id, setId] = useState(window.localStorage.getItem("userId") || "");

    let currentId = useState(window.localStorage.getItem("userId"));
    // console.log("현재 auth값은? " + window.localStorage.getItem("auth"));
    // console.log("현재 login id는? " + window.localStorage.getItem("userId"));

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));

    // console.log(login);
    // console.log(login.auth);

    //사업자등록번호 틀렸을 때
    // 10자 미만 : 숫자 10자리 입력해주세요, 10자 : 올바른 사업자 등록번호를 입력해주세요
    const fetchBusinessmanStatus = async () => {
        // 입력된 번호에서 '-' 제거
        const formattedBNo = bNo.replace(/-/g, "");
        // 사업자번호 유효성 검사
        if (!/^[0-9]{10}$/.test(formattedBNo)) {
            await SweetAlert.fire({
                html: "숫자 10자리를 입력해주세요",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return;
        }
        setLoading(true);

        // 인코딩
        // 5To0nK9KY0UaHIukqs9YLdqnKUtz9USkjCy8peOPWOvSk95ZzpMgelfiiEQ0Jpct3SzTJ%2F%2BKjpjFA6kwMTQQGA%3D%3D
        // 디코딩
        // 5To0nK9KY0UaHIukqs9YLdqnKUtz9USkjCy8peOPWOvSk95ZzpMgelfiiEQ0Jpct3SzTJ/+KjpjFA6kwMTQQGA==

        const serviceKey =
            "5To0nK9KY0UaHIukqs9YLdqnKUtz9USkjCy8peOPWOvSk95ZzpMgelfiiEQ0Jpct3SzTJ%2F%2BKjpjFA6kwMTQQGA%3D%3D";
        const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey.trim()}`;
        const data = {
            b_no: [bNo], // 사업자번호 "bNo" 로 조회
        };
        try {
            const response = await axios.post(url, JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                withCredentials: false,
            });
            setResult(response.data);
            console.log(response.data);
            //추가
            const b_stt = response.data.data[0].b_stt;
            if (b_stt === "계속사업자") {
                SweetAlert.fire({
                    html: "사업자 등록번호가 인증되었습니다",
                    confirmButtonText: "확인",
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios
                            .post(
                                "http://localhost:80/user/updateCompanyAuth",
                                null,
                                {
                                    params: {
                                        id: id,
                                        auth: 2,
                                        email: login && login.email,
                                    },
                                }
                            )
                            .then((res) => {
                                console.log(res.data);
                                if (res.status === 200) {
                                    window.localStorage.setItem(
                                        "login",
                                        JSON.stringify(res.data)
                                    );
                                    if (res.data.auth === 2) {
                                        window.location.href = "/combbslist";
                                    }
                                } else {
                                    alert("auth 업데이트 실패");
                                }
                            })
                            .catch(function (err) {
                                alert(err);
                            });
                    }
                });
            } else {
                await SweetAlert.fire({
                    html: "올바른 사업자 등록번호를 입력해주세요.",
                    icon: "warning",
                    confirmButtonText: "확인",
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        // 입력된 번호에서 '-' 제거하여 저장
        setBNo(event.target.value.replace(/-/g, ""));
    };
    {
        /* 4036900021 2053523594 */
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
                <Buttons buttons={buttons2} />
            </div>
            {/* <p>1208800767 또는 120-88-00767</p> */}
            <br />
            <br />
            <div className="registration-container">
                <h3 className="registration-title">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    기업회원이면 먼저 <br /> 사업자등록번호를 인증해주세요😊
                </h3>
                <p className="ex-regi">예시) 1234567890 또는 123-45-67890 </p>
                <input
                    onChange={handleInputChange}
                    type="text"
                    className="registration-input"
                    placeholder="사업자등록번호를 입력하세요"
                />
                <button
                    type="button"
                    onClick={fetchBusinessmanStatus}
                    className="registration-button"
                >
                    확인
                </button>

                {loading ? (
                    <div className="registration-loading">Loading...</div>
                ) : result ? (
                    <div className="registration-result">
                        <div>사업자 상태: {result.data[0].b_stt}</div>
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default Registration;
