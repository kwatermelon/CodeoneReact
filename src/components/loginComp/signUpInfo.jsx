import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../mypageComp/signUpinfo.css";
import account from "../../assets/headerIcon/defaultAccount.png";
function SignUpInfo() {
    const BASE_USER_URL = "http://localhost/user";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profileUrl, setProfileUrl] = useState(account);
    const [checkedEmail, setCheckedEmail] = useState("");
    const [checkedId, setCheckedId] = useState("");
    const [checkedPhoneNumber, setCheckedPhoneNumber] = useState("");
    const input = document.createElement("input");
    const [multipartfile, setMultipartfile] = useState(null);
    const [isPictureChanged, setIsPictureChanged] = useState(false);
    const [isDefaultPicture, setIsDefaultPicture] = useState(false);
    // const [isIdDuplicated, setIsIdDuplicated] = useState(false); // 아이디 중복검사 여부
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const regPhone = /^\d{3}-?\d{3,4}-?\d{4}$/;
    const idRegex = /^[a-zA-Z0-9]{3,10}$/;
    const inputName = useRef(null);
    const inputEmailRef = useRef(null);
    const inputId = useRef(null);
    const inputPhone = useRef(null);
    // 주소 파라미터에서 메일키, 메일정보 받아오기
    const location = useLocation();

    const checkEmail = () => {
        const searchParams = new URLSearchParams(location.search);
        if (
            searchParams.get("email") !== undefined &&
            searchParams.get("email") !== null
        ) {
            setEmail(searchParams.get("email"));
        }
        if (
            searchParams.get("filename") !== undefined &&
            searchParams.get("filename") !== null
        ) {
            console.log(searchParams.get("filename"));
            setProfileUrl(searchParams.get("filename"));
        } else {
            setIsDefaultPicture(true);
        }
    };

    // 링크이동
    const history = useNavigate();

    function goLogin() {
        history("/login");
    }

    function signupBtn() {
        // 빈칸 검사
        if (name.trim() === "") {
            alert("이름을 입력해주세요");
            inputName.current.focus();
            return;
        }
        if (id.trim() === "") {
            alert("아이디를 입력해주세요");
            inputId.current.focus();
            return;
        }

        if (phoneNumber.trim() === "") {
            alert("핸드폰번호를 입력해 주세요");
            inputPhone.current.focus();
            return;
        }

        // 파라미터 정보, 회원가입정보 파라미터로 보내주기
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);

        //이미지를 바꿨을 경우
        if (isPictureChanged) {
            console.log("picture Changed");
            formData.append("profileUrl", "");
            formData.append("multipartFile", multipartfile);
        } else {
            // 소셜인경우
            console.log("no Changed");
            formData.append("profileUrl", profileUrl);
            formData.append("multipartFile", null);
        }

        // 만약 기본 사진일 경우
        if (isDefaultPicture) {
            formData.delete("profileUrl");
            formData.delete("multipartFile");
            formData.append("profileUrl", "");
            formData.append("multipartFile", null);
        }

        axios({
            method: "post",
            url: `${BASE_USER_URL}/regi`,
            data: formData,
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (resp) {
                // 이메일 중복
                if (resp.status === 204) {
                    alert("이미 가입된 이메일입니다");
                    return;
                }

                // 중복된 이메일이 없을 경우 가입
                if (resp.status === 200) {
                    alert("환영합니다!");
                    window.location.href = "/";
                } else {
                    alert(
                        "회원가입에 실패했습니다. 관리자에 문의 주시기 바랍니다."
                    );
                    return;
                }
            })
            .catch(function (err) {
                alert(err);
            });
    }

    // Email중복 체크

    function checkingEmail(email) {
        if (!emailRegex.test(email)) {
            // 이메일 형식 체크
            setCheckedEmail("유효한 이메일 주소를 입력해주세요.");
            return;
        }
        axios
            .get(`${BASE_USER_URL}/checkingEmail?email=${email}`)
            .then((res) => {
                if (res.status === 204) {
                    setCheckedEmail("이미 가입된 이메일 주소입니다.");
                } else {
                    setCheckedEmail("가입 가능한 이메일 주소입니다.");
                }
            });
    }

    function checkingId(id) {
        axios.get(`${BASE_USER_URL}/checkingId?id=${id}`).then((res) => {
            if (res.status === 204) {
                setCheckedId("중복된 아이디입니다.");
            } else {
                setCheckedId("가입 가능한 아이디입니다.");
            }
        });
    }

    function checkingPhoneNumber(e) {
        setPhoneNumber(e.target.value);
        if (!regPhone.test(e.target.value)) {
            setCheckedPhoneNumber("올바른 전화번호를 입력해 주세요");
        } else {
            setCheckedPhoneNumber("");
        }
    }

    // 이미지 사진 바꾸기
    const pictureChange = async (e) => {
        // 프로필사진을 바꿨으므로 플래그 true
        setIsPictureChanged(true);

        // 사진을 지웠을때는 기본 사진으로 바꿔준다
        if (e.target.name === "deletePicture") {
            const base64Response = await fetch(account);
            const blob = await base64Response.blob();
            setMultipartfile(account);
            //기본 사진 이므로 true
            setIsDefaultPicture(true);
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise((resolve) => {
                reader.onload = () => {
                    setProfileUrl(account);
                    resolve();
                };
            });
        }

        // 사진을 지정했을때
        input.setAttribute("type", "file");
        input.click();
        input.onchange = async () => {
            // 기본사진은 아니므로 false
            setIsDefaultPicture(false);
            const fileBlob = input.files[0];
            setMultipartfile(fileBlob);
            const reader = new FileReader();
            reader.readAsDataURL(fileBlob);

            return new Promise((resolve) => {
                reader.onload = () => {
                    console.log(reader.result);
                    setProfileUrl(reader.result);
                    resolve();
                };
            });
        };
    };

    // 화면을 띄울때마다 체크
    useEffect(() => {
        checkEmail();
    }, []);

    return (
        <>
            <div className="signup-container">
                <h2>환영합니다!</h2>
                <p>회원 정보를 등록해주세요</p>

                <div className="signupMain">
                    <section className=" mainLeft">
                        <div>
                            <img
                                className="useSignImage"
                                src={profileUrl}
                                alt="logo"
                            />
                            <br></br>
                            <button
                                className="signImageUp"
                                onClick={(e) => {
                                    pictureChange(e);
                                }}
                            >
                                이미지 수정
                            </button>
                            <br></br>
                            <button
                                className="signImageDel"
                                name="deletePicture"
                                onClick={(e) => pictureChange(e)}
                            >
                                이미지 제거
                            </button>
                        </div>
                    </section>
                    <section className=" mainRight">
                        <label>이름</label>
                        <br />
                        <input
                            type="text"
                            ref={inputName}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름을 입력하세요"
                        />
                        <br /> <br />
                        <label>이메일</label>
                        <br />
                        <input
                            type="text"
                            ref={inputEmailRef}
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyUp={() => checkingEmail(email)}
                            placeholder="이메일을 입력하세요"
                        />
                        <span>{checkedEmail}</span>
                        <br></br>
                        <br></br>
                        <label>아이디</label>
                        <br />
                        <input
                            type="text"
                            ref={inputId}
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            onKeyUp={(e) => checkingId(id)}
                            placeholder="아이디를 입력하세요"
                        />
                        <br></br>
                        <span>{checkedId}</span>
                        <br />
                        <label>전화번호</label>
                        <br />
                        <input
                            type="text"
                            ref={inputPhone}
                            value={phoneNumber}
                            onChange={(e) => checkingPhoneNumber(e)}
                            placeholder="핸드폰번호를 입력하세요"
                        />
                        <div className="signup-buttons">
                            <span>{checkedPhoneNumber}</span>
                            <br />
                            <button
                                className="sign-cancelBtn"
                                onClick={goLogin}
                            >
                                취소
                            </button>
                            <button className="sign-sucBtn" onClick={signupBtn}>
                                가입
                            </button>
                        </div>
                    </section>
                    <br />
                    <br />
                </div>
            </div>
            <br />
            <br />
        </>
    );
}

export default SignUpInfo;
