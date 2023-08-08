import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
// import "./css/combbswrite.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { htmlToText } from "html-to-text";
// import "bootstrap/dist/css/bootstrap.min.css";
// import BootRadio from "./Radio";
import findmap from "../../assets/job/find.png";
import Select from "react-select";
import Buttons from "./Buttons";
import Editor2 from "./reactquill";
import Postcode from "./Postcode";
import SweetAlert from "sweetalert2";
import download from "../../assets/job/download.png";

const Combbsupdate = () => {
    let history = useNavigate();
    let params = useParams(); // seq값 받아오기
    let seq = params.seq;
    // console.log(seq);

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

    const [htmlStr, setHtmlStr] = useState("");
    // const quillRef = React.useRef<ReactQuill>(null);
    const quillRef = useRef(null);
    // 이미지 업로드 핸들러, modules 설정보다 위에 있어야 정상 적용
    const [id, setId] = useState(window.localStorage.getItem("userId") || ""); // 기본값으로 로그인 여부 확인
    const [title, setTitle] = useState("");
    const [comname, setComname] = useState(""); // 회사이름
    const [comcate, setComcate] = useState(""); //직군
    const [comjobname, setComjobname] = useState(""); //직무
    const [comcareer, setComcareer] = useState(""); //경력
    const [comlocation, setComlocation] = useState(""); //지역

    const [startline, setStartline] = useState(""); //시작일
    const [deadline, setDeadline] = useState(""); //마감일
    const [commapx, setCommapx] = useState(""); //위도
    const [commapy, setCommapy] = useState(""); //경도
    const [content, setContent] = useState(""); //내용
    const [comEmail, setComEmail] = useState(""); //이메일
    const [comsalary, setComsalary] = useState(""); //연봉

    //    const [comcatelist, setComcatelist] = useState([]);   직군 삭제 예정
    const [comjobnamelist, setComjobnamelist] = useState([]);
    const [comcareerlist, setComcareerlist] = useState([]);
    const [comlocationlist, setComlocationlist] = useState([]);
    const [jobInfo, setJobInfo] = useState([]);

    const postJobInfo = async (id) => {
        const result = await axios.get(`http://localhost/job/${id}`);

        setJobInfo(result.data);
        settingData(result.data);
        console.log("가져온 데이터");
        console.log(result.data);
        console.log(result.data.comimage); //이미지 주소 넣기
    };

    // 가져온 데이터 세팅
    const settingData = (data) => {
        setTitle(data.title);
        setComEmail(data.comEmail);
        setComcareer(data.comcareer);
        setComcate(data.comcate);
        setComjobname(data.comjobname);
        setComsalary(data.comsalary);
        setCommapx(data.commapx);
        setCommapy(data.commapy);
        setComname(data.comname);
        setContent(data.content);
        setStartline(data.startline);
        setDeadline(data.deadline);
        setComimage(data.comimage);
        setComfile(data.setcomfile);
    };

    //value값 수정되게 하기
    const updateJobInfo = (key, value) => {
        const preJobInfo = { ...jobInfo };

        switch (key) {
            case "title": {
                preJobInfo.title = value;
                setTitle(value);
                break;
            }
            case "comname": {
                preJobInfo.comname = value;
                setComname(value);
                break;
            }
            case "comEmail": {
                preJobInfo.comEmail = value;
                setComEmail(value);
                break;
            }

            case "comsalary": {
                preJobInfo.comsalary = value;
                setComsalary(value);
                break;
            }
            case "jobName": {
                preJobInfo.comjobname = value;
                console.log(value.label + " jobname");
                // console.log(value.value + " jobname")
                setComjobname(value.label);
                break;
            }
            case "career": {
                preJobInfo.comcareer = value;
                console.log(value + " career");
                setComcareer(value.label);
                break;
            }
            case "comLocation": {
                preJobInfo.comlocation = value;
                console.log(preJobInfo.comlocation);
                setComlocation(value.label);
                break;
            }

            case "startline": {
                preJobInfo.startline = value;
                console.log(preJobInfo.startline);
                setStartline(value);
                break;
            }

            case "deadline": {
                preJobInfo.deadline = value;
                console.log(preJobInfo.deadline);
                setDeadline(value);
                break;
            }
            case "commapx": {
                preJobInfo.commapx = value;
                console.log(preJobInfo.commapx);
                setCommapx(value);
                break;
            }
            case "commapy": {
                preJobInfo.commapy = value;
                console.log(preJobInfo.commapy);
                setCommapy(value);
                break;
            }

            case "content": {
                preJobInfo.content = value;
                console.log(preJobInfo.content);
                setContent(value);
                break;
            }

            case "comimage": {
                preJobInfo.comimage = value;
                console.log(preJobInfo.comimage);
                setComimage(value);
                break;
            }

            case "comfile": {
                preJobInfo.comfile = value;
                console.log(preJobInfo.comfile);
                setComfile(value);
                break;
            }
            // 다른 케이스들...
        }
        // console.log(preJobInfo);
        setJobInfo(preJobInfo);
    };

    //radio를 위한 배열
    const skillOptions = [
        { id: 20, label: "Java", value: "Java" },
        { id: 21, label: "Python", value: "Python" },
        { id: 22, label: "JavaScript", value: "JavaScript" },
        { id: 23, label: "React", value: "React" },
        { id: 24, label: "Vue", value: "Vue" },
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
                setComimage(res.data); // 업로드된 이미지 URL 설정
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewImage(
                        URL.createObjectURL(document.frm.uploadFile.files[0])
                    ); // 새로운 사진으로 미리보기 이미지 업데이트
                };
                reader.readAsDataURL(document.frm.uploadFile.files[0]);
                alert("대표이미지가 등록되었습니다.");
            })
            .catch((error) => {
                //alert("file upload fail");
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
                // alert("file upload fail");
            });
    };

    //이력서 파일 첨부 end

    // 알람 start ----------------------------------------------------------------------
    const ComBbswrite = () => {
        // 알람 end
        SweetAlert.fire({
            title: "채용공고 수정",
            text: "채용공고를 수정하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "네",
            cancelButtonText: "아니오",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post("http://localhost:80/updateJob", null, {
                        params: {
                            seq: seq,
                            title: title,
                            comname: comname,
                            comEmail: comEmail,
                            comsalary: comsalary,
                            comjobname: comjobname,
                            comcareer: comcareer,
                            comlocation: comlocation,
                            // comskill: comskill,
                            // comtag: comtag,
                            startline: startline,
                            deadline: deadline,
                            commapx: commapx,
                            commapy: commapy,
                            content: content,
                            comimage: comimage,
                            comfile: comfile,
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                        //글 등록 성공하면 alert창 켜지고 jobcalendar로 이동
                        if (res.data === "YES") {
                            SweetAlert.fire(
                                "수정 완료",
                                "채용공고가 수정되었습니다.",
                                "success"
                            ).then(() => {
                                history("/combbslist");
                            });
                        } else {
                            alert("수정되지 않았습니다.");
                        }
                    })
                    .catch(function (err) {
                        alert(err);
                    });
            } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                // 등록 취소 로직 실행
                SweetAlert.fire(
                    "취소 완료",
                    "채용공고 수정이 취소되었습니다.",
                    "info"
                );
            }
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
                console.log("직무:jobname");
                console.log(response);
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
                console.log("경력:comcarrer");
                console.log(response);
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
                console.log("지역:comlocation");
                console.log(response);
                setComlocationlist(response.data.list.list);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // 주소 검색이 완료되었을 때 처리할 콜백 함수
    const handleComplete = (data) => {
        setCommapy(data); // 검색된 주소를 부모 컴포넌트의 state에 저장
    };

    //다운로드
    const handleDownload = () => {
        // GET 요청 보내기
        axios
            .get(
                `http://localhost:80/downloadFile?fileName=${jobInfo.comfile}`,
                {
                    responseType: "blob",
                }
            )
            .then((res) => {
                // 다운로드 수행
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", jobInfo.comfile);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getComjobname(); //직무
        getComCareer(); //경력
        getComLocation(); //지역
        postJobInfo(seq);
    }, []);

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
                <h3 align="center">✔구직 정보를 수정해주세요</h3>
                <br />

                <table id="job-info-table" align="center" border="1">
                    <colgroup>
                        <col width="150px" />
                        <col width="1000px" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input
                                    type="text"
                                    placeholder="제목"
                                    value={jobInfo.title}
                                    size="30"
                                    onChange={(e) =>
                                        updateJobInfo("title", e.target.value)
                                    }
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
                                    placeholder="회사 이름"
                                    onChange={(e) =>
                                        updateJobInfo("comname", e.target.value)
                                    }
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
                                        updateJobInfo(
                                            "comEmail",
                                            e.target.value
                                        )
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
                                        updateJobInfo(
                                            "comsalary",
                                            e.target.value
                                        )
                                    }
                                    placeholder="연봉"
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>직무</th>
                            <td>
                                <Select
                                    value={jobInfo.comjobname}
                                    options={comjobnamelist}
                                    placeholder="직무"
                                    onChange={(e) =>
                                        updateJobInfo("jobName", e)
                                    }
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "260px",
                                        }),
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>경력</th>
                            <td>
                                <Select
                                    value={
                                        jobInfo.comcareer
                                            ? jobInfo.comcareer
                                            : null
                                    }
                                    options={comcareerlist}
                                    placeholder="경력"
                                    onChange={(e) => updateJobInfo("career", e)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "260px",
                                        }),
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>지역</th>
                            <td>
                                <Select
                                    value={
                                        jobInfo.comlocation
                                            ? jobInfo.comlocation
                                            : null
                                    }
                                    options={comlocationlist}
                                    placeholder="지역"
                                    onChange={(e) =>
                                        updateJobInfo("comLocation", e)
                                    }
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            width: "260px",
                                        }),
                                    }}
                                />
                            </td>
                        </tr>

                        {/* <tr>
                        <th>기술</th>
                        <td>
                            <BootRadio
                                options={skillOptions}
                                type="radio"
                                inline
                                onChange={(e) => setComskill(e.target.value)}
                                defaultChecked={jobInfo.comskill}
                            />
                        </td>
                    </tr> */}
                        {/* 
                    <tr>
                        <th>태그</th>
                        <td>
                            <BootRadio
                                options={tagOptions}
                                type="radio"
                                inline
                                onChange={(e) => setComtag(e.target.value)}
                            />
                        </td>
                    </tr> */}

                        <tr>
                            <th>기간</th>
                            <td>
                                <div className="date-range-inputs">
                                    <input
                                        type="date"
                                        value={jobInfo.startline}
                                        size="30"
                                        onChange={(e) =>
                                            updateJobInfo(
                                                "startline",
                                                e.target.value
                                            )
                                        }
                                        placeholder="채용 시작 날짜"
                                    />
                                    <span className="date-range-separator">
                                        ~
                                    </span>
                                    <input
                                        type="date"
                                        value={jobInfo.deadline}
                                        size="30"
                                        onChange={(e) =>
                                            updateJobInfo(
                                                "deadline",
                                                e.target.value
                                            )
                                        }
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
                                    <input
                                        type="file"
                                        name="uploadFile"
                                        accept="*"
                                        // defaultValue 작동안됨
                                    />
                                    <input type="submit" value="등록" />
                                </form>
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="이미지"
                                        width="200"
                                        height="140"
                                    />
                                ) : (
                                    comimage && (
                                        <img
                                            src={comimage}
                                            alt="이미지"
                                            width="200"
                                            height="140"
                                        />
                                    )
                                )}
                            </td>
                        </tr>

                        <tr>
                            {/* <th>대표사진 수정</th>
                            <td>
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="미리보기"
                                        width="200"
                                    />
                                ) : (
                                    "대표사진을 수정해주세요."
                                )}
                            </td> */}
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
                                    />
                                    <input type="submit" value="등록" />
                                    <br />
                                    {/* 다운로드 */}
                                    <div className="download-container">
                                        <div className="download-line"></div>
                                        <span></span>

                                        <button
                                            id="down"
                                            onClick={handleDownload}
                                        >
                                            등록된 이력서{" "}
                                            <img
                                                src={download}
                                                alt="findjob"
                                                className="job-down"
                                            />
                                            <img></img>
                                        </button>
                                    </div>
                                </form>
                            </td>
                        </tr>

                        {/* <tr>
                        <th>내용</th>
                        <td>
                            <CustomReactQuill
                                
                                ref={quillRef}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={htmlStr}
                              
                                placeholder="내용을 입력하세요."
                                onChange={(content, delta, source, editor) => {
                                    setHtmlStr(editor.getHTML());
                                }}
                            />
                        </td>
                    </tr> */}

                        <tr style={{ height: "700px" }}>
                            <th>내용</th>
                            <td>
                                <CustomReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    value={jobInfo.content}
                                    placeholder="내용을 입력하세요."
                                    onChange={(
                                        content,
                                        delta,
                                        source,
                                        editor
                                    ) => {
                                        updateJobInfo(
                                            "content",
                                            editor.getHTML()
                                        );
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            {/* 리액트퀼 컴포넌트 사용한 버전(value에 content가 들어감)
                    <tr>
                        <th>내용</th>
                        <td colSpan={3}>
                            <Editor2
                                value={content}
                                onChange={(value) => setContent(value)}
                            />{" "}
                        </td>
                    </tr> */}
                        </tr>
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
                        글수정 완료
                    </button>
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

export default Combbsupdate;
