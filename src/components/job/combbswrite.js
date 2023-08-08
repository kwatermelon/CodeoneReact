//미리보기 적용버전

import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
// import "./css/combbswrite.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import BootRadio from "./Radio";
import findmap from "../../assets/job/find.png";
import Select from "react-select";
import Buttons from "./Buttons";
import SweetAlert from "sweetalert2";
import "./css/combbswrite.css";
import upup from "../../assets/job/upup.png";
import thumbnail from "../../assets/job/thumbnail.png";
import Postcode from "./Postcode";

import ImageResize from "quill-image-resize";
Quill.register("modules/ImageResize", ImageResize);

const ComBbswrite = () => {
    let history = useNavigate();

    /*
    ---------------리액트퀼 안에 이미지 넣는 기능 start --------------------
      안에 이미지를 넣을 때마다 실행되는 Handler
   */
    const imageHandler = () => {
        // file input 임의 생성
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();

        console.log(1);

        input.onchange = async () => {
            console.log(2);
            const file = input.files;

            const formData = new FormData();

            if (file) {
                console.log(3);
                formData.append("multipartFiles", file[0]);
            }

            // file 데이터 담아서 서버에 전달하여 이미지 업로드
            // const res = await axios.post('http://localhost/job/uploadImage', {"multipartFiles": file});

            const res = await axios({
                method: "post",
                url: "http://localhost:/job/uploadImage", // => url 맞는거로 바꾸기
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(res.data);

            if (quillRef.current) {
                // 현재 Editor 커서 위치에 서버로부터 전달받은 이미지 불러오는 url을 이용하여 이미지 태그 추가
                const index = quillRef.current.getEditor().getSelection().index;

                const quillEditor = quillRef.current.getEditor();
                quillEditor.setSelection(index, 1);

                quillEditor.clipboard.dangerouslyPasteHTML(
                    index,
                    `<img src=${res.data} alt=${"alt text"} />`
                );
            }
        };
    };

    // useMemo를 사용하지 않고 handler를 등록할 경우 타이핑 할때마다 focus가 벗어남
    const modules = React.useMemo(
        () => ({
            toolbar: {
                // container에 등록되는 순서대로 tool 배치
                container: [
                    [{ font: [] }], // font 설정
                    [{ header: [1, 2, 3, 4, 5, 6, false] }], // header 설정
                    [
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "code-block",
                        "formula",
                    ], // 굵기, 기울기, 밑줄 등 부가 tool 설정
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                    ], // 리스트, 인덴트 설정
                    ["link", "image"], // 링크, 이미지, 비디오 업로드 설정
                    [{ align: [] }, { color: [] }, { background: [] }], // 정렬, 글씨 색깔, 글씨 배경색 설정
                    ["clean"], // toolbar 설정 초기화 설정
                ],

                // custom 핸들러 설정
                handlers: {
                    image: imageHandler, // 이미지 tool 사용에 대한 핸들러 설정
                },
                //resize 기능 안되고있음.
                ImageResize: {
                    parchment: Quill.import("parchment"),
                },
            },
        }),
        []
    );
    // --------------- 리액트퀼 안에 이미지 넣는 기능 end ------------------

    // 리액트퀼 toolbar에 사용되는 tool format
    const formats = [
        "font",
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "formula",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "align",
        "color",
        "background",
    ];

    const [htmlStr, setHtmlStr] = useState(""); //내용(contetent)
    // const quillRef = React.useRef<ReactQuill>(null);
    const quillRef = useRef(null);
    // 이미지 업로드 핸들러, modules 설정보다 위에 있어야 정상 적용
    const [id, setId] = useState(window.localStorage.getItem("userId") || ""); // 기본값으로 로그인 여부 확인
    //const [id, setId] = useState(''); // 로그인 기능 merge후 setComid 넣을 수 있음.
    const [title, setTitle] = useState("");
    const [comname, setComname] = useState(""); // 회사이름
    const [comcate, setComcate] = useState(""); //직군
    const [comjobname, setComjobname] = useState(""); //직무
    const [comcareer, setComcareer] = useState(""); //경력
    const [comlocation, setComlocation] = useState(""); //지역
    const [comskill, setComskill] = useState(""); //기술
    const [comtag, setComtag] = useState(""); //태그
    const [startline, setStartline] = useState(""); //시작일
    const [deadline, setDeadline] = useState(""); //마감일
    const [commapx, setCommapx] = useState(""); //위도
    const [commapy, setCommapy] = useState(""); //경도
    // const [content, setContent] = useState(""); //내용
    const [comEmail, setComEmail] = useState(""); //이메일
    const [comsalary, setComsalary] = useState(""); //연봉

    //    const [comcatelist, setComcatelist] = useState([]);   직군 삭제 예정
    const [comjobnamelist, setComjobnamelist] = useState([]);
    const [comcareerlist, setComcareerlist] = useState([]);
    const [comlocationlist, setComlocationlist] = useState([]);
    const [comsklist, setComSklist] = useState([]);
    const [comtaglist, setComtaglist] = useState(""); //태그
    const [profileImage, setProfileImage] = useState(
        window.localStorage.getItem("fileName")
    );

    //radio를 위한 배열
    const skillOptions = [
        { id: 1, label: "Java", value: "Java" },
        { id: 2, label: "Python", value: "Python" },
        { id: 3, label: "JavaScript", value: "JavaScript" },
        { id: 4, label: "React", value: "React" },
        { id: 5, label: "Vue", value: "Vue" },
    ];

    const tagOptions = [
        { id: 1, label: "재택 근무", value: "재택 근무" },
        { id: 2, label: "유연 근무제", value: "유연 근무제" },
        { id: 3, label: "점심 제공", value: "점심 제공" },
        { id: 4, label: "시차 출근제", value: "시차 출근제" },
        { id: 5, label: "인센티브", value: "인센티브" },
        { id: 6, label: "교육", value: "교육" },
        { id: 7, label: "노트북 지원", value: "노트북 지원" },
    ];

    //주소 접근 제한
    const login = JSON.parse(localStorage.getItem("login"));

    useEffect(() => {
        if (!login || login === "" || login.auth !== 2) {
            history("/joblist");
        } else {
            getComjobname(); //직무
            getComCareer(); //경력
            getComLocation(); //지역
            getComSkill(); //기술
            getComTag(); //태그
        }
    }, []);

    // useEffect(() => {
    //     getComjobname(); //직무
    //     getComCareer(); //경력
    //     getComLocation(); //지역
    //     getComSkill(); //기술
    //     getComTag(); //태그
    // }, []);

    //대표사진 첨부 start : onSubmit ---------------------------------------
    const [comimage, setComimage] = useState(""); //이미지
    const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기

    const onSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("multipartFiles", document.frm.uploadFile.files[0]);

        axios({
            method: "post",
            url: "http://localhost:80/uploadImageTest",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                setComimage(res.data);
                console.log("대표이미지 " + res.data);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewImage(e.target.result);
                };
                reader.readAsDataURL(document.frm.uploadFile.files[0]);
                alert("대표이미지가 등록되었습니다.");
            })
            .catch((error) => {
                alert("file upload fail");
            });
    };

    useEffect(() => {
        // 생략
    }, []);

    // 대표사진 첨부 end

    //이력서 파일 첨부 start
    const [comfile, setComfile] = useState(""); //이미지
    const onSubmit2 = (e) => {
        e.preventDefault();

        let formData = new FormData();

        formData.append("multipartFiles", document.frm2.uploadFile.files[0]);
        console.log(document.frm2.uploadFile.files[0]);
        axios({
            method: "post",
            url: "http://localhost:80/uploadFile",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                console.log(res.data);
                setComfile(res.data);
                alert("이력서가 등록되었습니다.");
            })
            .catch(function (error) {
                alert("file upload fail");
            });
    };

    //이력서 파일 첨부 end

    // 알람 start ----------------------------------------------------------------------
    const ComBbswrite = () => {
        if (comname === undefined || comname.trim() === "") {
            alert("회사이름을 입력해 주십시오");
            return;
        }

        // 알람 end
        SweetAlert.fire({
            title: "채용공고 등록",
            text: "채용공고를 등록하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "네",
            cancelButtonText: "아니오",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post("http://localhost:80/writeJob", null, {
                        params: {
                            id: id,
                            title: title,
                            comname: comname,
                            comcate: comcate,
                            comjobname: comjobname,
                            comcareer: comcareer,
                            comlocation: comlocation,
                            comskill: comskill,
                            comtag: comtag,
                            startline: startline,
                            deadline: deadline,
                            commapx: commapx,
                            commapy: commapy,
                            content: htmlStr,
                            comimage: comimage,
                            comfile: comfile,
                            whoLiked: "", //whoLiked는 공백으로 보내기 -> 좋아요에 사용하기 위해서
                            comEmail: comEmail,
                            comsalary: comsalary,
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                        //글 등록 성공하면 alert창 켜지고 jobcalendar로 이동
                        if (res.data === "YES") {
                            SweetAlert.fire(
                                "등록 완료",
                                "채용공고 등록이 완료되었습니다.",
                                "success"
                            ).then(() => {
                                history("/jobcalendar");
                            });
                        } else {
                            alert("등록되지 않았습니다.");
                        }
                    })
                    .catch(function (err) {
                        alert(err);
                    });
            } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                // 등록 취소 로직 실행
                SweetAlert.fire(
                    "취소 완료",
                    "채용공고 등록이 취소되었습니다.",
                    "info"
                );
            }
        });
    };

    // tn_code테이블에서 직무 정보 가져와서 jobnamelist에 넣기 -> select박스에 뿌려주기 위해
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
                console.log("직무:jobname");
                console.log(response);
                setComjobnamelist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //경력
    // tn_code테이블에서 경력 정보 가져와서 careerlist에 넣기 -> select박스에 뿌려주기 위해
    const getComCareer = () => {
        axios
            .get("http://localhost:/job/code/list", {
                params: {
                    group_seq: 2,
                },
            })
            .then((response) => {
                console.log("경력:comcarrer");
                console.log(response);
                setComcareerlist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //지역
    // tn_code테이블에서 지역 정보 가져와서 locationlist에 넣기 -> select박스에 뿌려주기 위해
    const getComLocation = () => {
        axios
            .get("http://localhost:80/job/code/list?group_seq=3")
            .then((response) => {
                console.log("지역:comlocation");
                console.log(response);
                setComlocationlist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // //기술
    // const skillButtonClick = (value) => {
    //     setComskill(value);
    // };

    //기술(skill)
    // tn_code테이블에서 skill정보 가져와서 sklist에 넣기 -> radio에 뿌려주기 위해(지금 안씀)
    const getComSkill = () => {
        axios
            .get("http://localhost:80/job/code/list?group_seq=4")
            .then((response) => {
                console.log(response);
                //   setComSklist(response.data?.list?.list);
                setComSklist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // //태그
    // const tagButtonClick = (value) => {
    //     setComskill(value);
    // };

    //태그
    // tn_code테이블에서 tag정보 가져와서 taglist에 넣기 -> radio에 뿌려주기 위해(지금 안씀)
    const getComTag = () => {
        axios
            .get("http://localhost:80/job/code/list?group_seq=5")
            .then((response) => {
                console.log("복지 태그 : comtag");
                console.log(response);
                setComtaglist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // 주소 검색이 완료되었을 때 처리할 콜백 함수
    const handleComplete = (data) => {
        setCommapy(data); // 검색된 주소를 부모 컴포넌트의 state에 저장
    };

    //시작일 검증
    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정(오늘날짜도 포함하기 위해)

        if (selectedDate.getTime() < today.getTime()) {
            alert("채용시작일은 오늘 날짜 이후만 선택할 수 있습니다.");
            // 선택된 날짜가 오늘 날짜보다 이전인 경우 알림을 띄우기
        } else {
            setStartline(e.target.value);
        }
    };

    //마감일 검증
    const handleDeadlineChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const startDate = new Date(startline);
        const today = new Date();

        if (selectedDate < today) {
            alert("채용마감일은 오늘 날짜 이후만 선택할 수 있습니다.");
            // 선택된 날짜가 오늘 날짜보다 이전인 경우 알림을 띄웁니다.
        } else if (selectedDate < startDate) {
            alert("채용마감일은 채용시작일 이전이 될 수 없습니다.");
            // 선택된 날짜가 채용시작일보다 이전인 경우 알림을 띄웁니다.
        } else {
            // 선택된 날짜를 사용하거나 필요한 로직을 수행합니다.
            setDeadline(e.target.value);
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
                <Buttons buttons={buttons2} />
            </div>
            <div id="all-form">
                <h3 align="center">✔구직 정보를 작성해주세요</h3>

                <br />

                <table id="job-info-table" align="center" border="1">
                    <colgroup>
                        <col width="100px" />
                        <col width="1000px" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input
                                    type="text"
                                    value={title}
                                    size="30"
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목"
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>회사</th>
                            <td>
                                <input
                                    type="text"
                                    value={comname}
                                    size="30"
                                    onChange={(e) => setComname(e.target.value)}
                                    placeholder="회사 이름"
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>이메일</th>
                            <td>
                                <input
                                    type="text"
                                    value={comEmail}
                                    size="30"
                                    onChange={(e) =>
                                        setComEmail(e.target.value)
                                    }
                                    placeholder="회사 이메일"
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>연봉</th>
                            <td>
                                <input
                                    type="text"
                                    value={comsalary}
                                    size="30"
                                    onChange={(e) =>
                                        setComsalary(e.target.value)
                                    }
                                    placeholder="연봉"
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>직무</th>
                            <td>
                                <Select
                                    options={comjobnamelist}
                                    placeholder="직무"
                                    onChange={(e) => setComjobname(e.label)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "100%",
                                        }),
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>경력</th>
                            <td>
                                <Select
                                    options={comcareerlist}
                                    placeholder="경력"
                                    onChange={(e) => setComcareer(e.label)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "100%",
                                        }),
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>지역</th>
                            <td>
                                <Select
                                    options={comlocationlist}
                                    placeholder="지역"
                                    onChange={(e) => setComlocation(e.label)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "100%",
                                        }),
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>기술</th>
                            <td>
                                <BootRadio
                                    options={skillOptions}
                                    type="radio"
                                    inline
                                    onChange={(e) =>
                                        setComskill(e.target.value)
                                    }
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>복지</th>
                            <td>
                                <BootRadio
                                    options={tagOptions}
                                    type="radio"
                                    inline
                                    onChange={(e) => setComtag(e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>기간</th>
                            <td>
                                <div className="date-range-inputs">
                                    <input
                                        type="date"
                                        value={startline}
                                        size="30"
                                        onChange={handleDateChange}
                                        placeholder="채용 시작 날짜"
                                    />
                                    <span className="date-range-separator">
                                        ~
                                    </span>
                                    <input
                                        type="date"
                                        value={deadline}
                                        size="30"
                                        onChange={handleDeadlineChange}
                                        placeholder="채용 마감 날짜"
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <th>위치</th>
                            <td className="job-loca">
                                <input
                                    type="text"
                                    value={commapy}
                                    name="commapy"
                                    onChange={(e) => setCommapy(e.target.value)}
                                    placeholder="회사 위치를 입력하세요"
                                    readOnly
                                />
                                <br />
                                <Postcode onComplete={handleComplete} />{" "}
                                {/* <Postcode /> 컴포넌트를 사용하면서 handleComplete 함수를 onComplete props로 전달 */}
                                {/* <input
                                    type="button"
                                    value="지역설정안함"
                                    onClick={() => setCommapy("전국")}
                                /> */}
                            </td>
                        </tr>

                        <tr>
                            <th>대표사진</th>
                            <td className="job-thumb">
                                <form
                                    name="frm"
                                    onSubmit={onSubmit}
                                    encType="multipart/form-data"
                                >
                                    <div className="upload-container">
                                        <input
                                            type="file"
                                            name="uploadFile"
                                            accept="*"
                                            className="upload-file-input"
                                        />
                                        <input type="submit" value="등록" />
                                    </div>
                                </form>
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="미리보기"
                                        width="200"
                                        height="140"
                                    />
                                ) : (
                                    <img
                                        src={thumbnail}
                                        alt="기본사진"
                                        width="200"
                                        height="140"
                                    />
                                )}
                            </td>
                        </tr>

                        <tr>
                            <th>이력서</th>
                            <td className="job-fileup">
                                <form
                                    name="frm2"
                                    onSubmit={onSubmit2}
                                    encType="multipart/form-data"
                                >
                                    <input
                                        type="file"
                                        name="uploadFile"
                                        accept="*"
                                        className="upload-file-input"
                                    />
                                    <input type="submit" value="등록" />
                                </form>
                            </td>
                        </tr>

                        <tr style={{ height: "700px" }}>
                            <th>내용</th>
                            <td>
                                <CustomReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    value={htmlStr}
                                    placeholder="내용을 입력하세요."
                                    onChange={(
                                        content,
                                        delta,
                                        source,
                                        editor
                                    ) => {
                                        setHtmlStr(editor.getHTML());
                                    }}
                                />
                            </td>
                        </tr>

                        {/*                 리액트퀼 컴포넌트 사용한 버전(value에 content가 들어감)
                    <tr>
                        <th>내용</th>
                        <td colSpan={3}>
                            <Editor2
                                value={content}
                                onChange={(value) => setContent(value)}
                            />{" "}
                        </td>
                    </tr> */}
                    </tbody>
                </table>

                <div>
                    <br />

                    <button
                        id="successBtn"
                        type="button"
                        onClick={() => ComBbswrite()}
                        className="btn btn-primary"
                    >
                        채용공고 등록
                    </button>
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
            </div>
            <br />
            <br />
        </>
    );
};

// style
const CustomReactQuill = styled(ReactQuill)`
    height: 300px;
`;

export default ComBbswrite;
