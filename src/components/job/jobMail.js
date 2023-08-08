import "./css/jobMail.css";
import emailjs from "@emailjs/browser";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SweetAlert from "sweetalert2";
import { useNavigate } from "react-router-dom";

//emailJS API : https://dashboard.emailjs.com/admin/templates/me8suob/content

const JobMail = () => {
    let history = useNavigate();
    const [item, setItem] = useState({});

    const form = useRef();
    //seq값 받아오기
    let params = useParams();
    let seq = params.seq;

    //글목록 가지고 오기
    const jobData = async (seq) => {
        await axios
            .get("http://localhost/job/view", { params: { seq: seq } })
            .then(function (resp) {
                console.log(resp.data.view.view);
                setItem(resp.data.view.view); // item 넣어주기
            })
            .catch(function (err) {
                console.log(err);
            });
    };
    useEffect(() => {
        jobData(seq);
    }, [seq]);

    const sendEmail = (e) => {
        e.preventDefault();
        //서비스아이디 : service_te2yf4o
        //템플릿아이디 : template_tasoa3m
        //이메일 : kwonhn1@gmail.com
        //퍼블릭키 : V4qQ4smuv82ZrLuQY
        //프라이빗 키 : 4-pAie8yv2tR8ezaRkdqv
        emailjs
            .sendForm(
                "service_te2yf4o",
                "template_tasoa3m",
                form.current,
                "V4qQ4smuv82ZrLuQY"
            )
            .then(
                (result) => {
                    console.log(result.text);
                    // SweetAlert2 팝업창 띄우기
                    SweetAlert.fire("입사지원서를 제출하였습니다.");
                    history("/joblist");
                },
                (error) => {
                    console.log(error.text);
                }
            );
    };

    return (
        <div id="form-wrapper ">
            <form id="regiform" ref={form} onSubmit={sendEmail}>
                <br />
                <p name="regi">✔입사지원서</p>
                <br />
                <p name="info">지원자 인적사항</p>
                <br />
                <table name="regitable" border="1">
                    <colgroup>
                        <col width="100px" />
                        <col width="1000px" />
                    </colgroup>

                    <tbody>
                        <tr>
                            <th>*지원회사</th>
                            <td>
                                <input
                                    type="text"
                                    name="comname"
                                    value={item.comname}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>*지원분야</th>
                            <td>
                                <input
                                    type="text"
                                    name="comjobname"
                                    value={item.comjobname}
                                    // value값 변경 가능하게 하는 onChange
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>*이름</th>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={window.localStorage.getItem(
                                        "userName"
                                    )}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>*휴대폰</th>
                            <td>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={window.localStorage.getItem(
                                        "phoneNumber"
                                    )}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>*이메일</th>
                            <td>
                                <input
                                    type="email"
                                    name="email"
                                    value={window.localStorage.getItem(
                                        "userEmail"
                                    )}
                                />
                            </td>
                        </tr>
                        <tr>
                            {/* 경력만 수정 가능 */}
                            <th>경력</th>
                            <td>
                                <input
                                    type="text"
                                    name="comcareer"
                                    value={item.comcareer}
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            comcareer: e.target.value,
                                        })
                                    }
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>블로그</th>
                            <td>
                                <input type="text" name="blog" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <p name="intro">자기소개서</p>
                <table name="introtable">
                    <tbody>
                        <tr>
                            <th>1. 성장과정</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea name="intro1"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>2. 지원동기</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea name="intro2"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>3. 성격 및 장단점</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea name="intro3"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <input
                                type="text"
                                name="freeText"
                                placeholder="4. 자유서술 (수정해주세요)"
                            />
                        </tr>
                        <tr>
                            <td>
                                <textarea name="intro4"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br />
                <br />
                <p name="comMail">회사 이메일</p>
                <input
                    type="email"
                    name="companyMail"
                    value={item.comEmail}
                ></input>
                <button type="submit" name="subbutton">
                    제출하기
                </button>
            </form>
            <br />
            <br />
            <br />
        </div>
    );
};
export default JobMail;
