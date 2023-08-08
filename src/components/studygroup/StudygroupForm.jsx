import React, {useEffect, useRef, useState} from 'react';
import "../../css/studygroup/studygroupForm.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import StudygroupMainDetailComponent from './StudygroupMainDetailComponent';
import RowComponent from './RowComponent';
import SelectComponent from './SelectComponent';
import MultiSelectComponent from './MultiSelectComponent';
import DateComponent from './DateComponent';
import { toDate, changeData, changeDatas, fetchData, isLogin, goLogin } from './function';
import { Inputter, Wrapper, BtnWrapper, TitleWrapper, InfoTitleText, InfoSelector, Divider, Outputter } from './StudygroupMainFormStyled';

export const Datas = React.createContext();

const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}],
      [{size: []}],
      ['underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'},
       {'indent': '-1'}, {'indent': '+1'}],
      ['link']
    ],
};

const formats = [
'header', 'font', 'size',
'bold', 'italic', 'underline', 'strike', 'blockquote',
'list', 'bullet', 'indent',
'link', 'image', 'video'
];

function StudygroupForm(props) {
    // 글 수정 시 수정할 글의 번호
    let seq = useParams()["seq"];

    const loadCount = useRef(0);
    // 글 수정 시 보여줄 스터디 그룹 정보
    const [studygroupData, setStudygroupData] = useState();

    // 사용자가 선택할 수 있는 데이터
    const [recruitmentTypeData, setRecruitmentTypeData] = useState();
    const [wayOfProceedingData, setWayOfProceedingData] = useState();
    const [numberOfRecruitsData, setNumberOfRecruitsData] = useState();
    const [positionData, setPositionData] = useState();
    const [technologyStackData, setTechnologyStackData] = useState();

    // 사용자가 입력한 데이터
    const [recruitmentType, setRecruitmentType] = useState(0);
    const [wayOfProceeding, setWayOfProceeding] = useState(0);
    const [numberOfRecruits, setNumberOfRecruits] = useState(0);
    const [deadlineForRecruitment, setDeadlineForRecruitment] = useState("");
    const [recruitmentPartNames, setRecruitmentPartNames] = useState([]);
    const [recruitmentPartNumbers, setRecruitmentPartNumbers] = useState([]);
    const [technologyStackNames, setTechnologyStackNames] = useState([]);
    const [technologyStackNumbers, setTechnologyStackNumbers] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isVisible, setIsvisible] = useState(true);
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    
    // 로그인한 사용자 프로필 정보
    console.log(window.localStorage.getItem('login'));
    const userId = window.localStorage.getItem("login").id;
    const fileName = window.localStorage.getItem("fileName").filename;
    console.log(fileName)
    // 경고 문구
    const noEmpty = useRef();
    const overFlow = useRef();
    let noEmptyTimer;
    let overFlowTimer;

    const fetchStudygroupData = () => {
        axios.get("http://localhost/studygroup/detail/"+seq).then(response => {
            if(response.status === 200) {
                setStudygroupData(response.data);
                loadCount.current++;
            }
        });
    }

    useEffect(function() {
        if(!isLogin()) {
            goLogin();
            return false;
        }

        let urls = [
            "http://localhost/studygroup/filter/recruitment_type",
            "http://localhost/studygroup/filter/way_of_proceeding",
            "http://localhost/studygroup/filter/number_of_recruits",
            "http://localhost/studygroup/filter/position",
            "http://localhost/studygroup/filter/technology_stack",
        ];

        let setDatas = [
            setRecruitmentTypeData,
            setWayOfProceedingData,
            setNumberOfRecruitsData,
            setPositionData,
            setTechnologyStackData
        ];

        for(let i=0; i<urls.length; i++) {
            fetchData(urls[i], setDatas[i], loadCount);
        }

        if(seq !== undefined) {
            fetchStudygroupData();
        }
    }, []);

    // 스터디 그룹 모집 글 수정 시에만 동작하는 useEffect
    useEffect(function() {
        if(loadCount.current >= 6 && studygroupData !== undefined) {
            setView();
        }
    }, [loadCount.current]);

    const IsVisibleComponent = () => {
        return (
            <div className="col">
                <label className="form-check-label" id="isVisibleLabel">모집글 공개 여부</label>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="isVisible" id="isVisible1" checked={isVisible} value="true" onChange={changeIsVisible} />
                    <label className="form-check-label" htmlFor="isVisible1">공개</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="isVisible" id="isVisible2" checked={!isVisible} value="false" onChange={changeIsVisible} />
                    <label className="form-check-label" htmlFor="isVisible2">비공개</label>
                </div>
            </div>
        );
    }

    function changeRecruitmentType(e) {
        changeData(e, "모집 구분", setRecruitmentType);
    }

    function changeWayOfProceeding(e) {
        changeData(e, "진행 방식", setWayOfProceeding);
    }

    function changeNumberOfRecruits(e) {
        changeData(e, "모집 인원", setNumberOfRecruits);
    }

    function changeDeadlineForRecruitment(e) {
        let now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        let selectedDate = e.target.value;
        let selectedDateInfo = toDate(selectedDate);

        let diff = selectedDateInfo.getTime() - now.getTime();
        if(diff < 0) {
            alert("모집 마감일은 오늘이거나 오늘 이후 날짜만 선택 할 수 있습니다.");

            e.target.value = "";
            setDeadlineForRecruitment(undefined);
        } else {
            setDeadlineForRecruitment(selectedDate);
        }
    }

    function changePosition(e) {
        changeDatas(e, "모집 분야 선택", recruitmentPartNames, recruitmentPartNumbers, setRecruitmentPartNames, setRecruitmentPartNumbers);
    }

    function changeTechnologyStack(e) {
        changeDatas(e, "기술 스택 선택", technologyStackNames, technologyStackNumbers, setTechnologyStackNames, setTechnologyStackNumbers);
    }

    function changeStartDate(e) {
        if(deadlineForRecruitment === undefined) {
            alert("모집 마감일을 먼저 선택해주세요");
            e.target.value = "";
            return false;
        }

        let deadlineForRecruitmentDateInfo = toDate(deadlineForRecruitment);

        let selectedDate = e.target.value;
        let selectedDateInfo = toDate(selectedDate);
        
        let diff = selectedDateInfo.getTime() - deadlineForRecruitmentDateInfo.getTime();
        if(diff <= 0) {
            alert("진행 시작 날짜는 모집 마감일 이후여야합니다");

            e.target.value = "";
            setStartDate(undefined);
        } else {
            setStartDate(selectedDate);
        }
    }

    function changeEndDate(e) {
        if(startDate === undefined) {
            alert("진행 기간의 시작 날짜를 먼저 선택해주세요");
            e.target.value = "";
            return false;
        }

        let startDateInfo = toDate(startDate);

        let selectedDate = e.target.value;
        let selectedDateInfo = toDate(selectedDate);
        
        let diff = selectedDateInfo.getTime() - startDateInfo.getTime();
        if(diff < 0) {
            alert("진행 종료 날짜는 진행 시작 날짜와 같거나 진행 시작 날짜 이후여야합니다");

            e.target.value = "";
            setEndDate(undefined);
        } else {
            setEndDate(selectedDate);
        }
    }

    function changeIsVisible(e) {
        let isVisible = e.target.value;

        setIsvisible(isVisible === "true");
    }

    function changeTitle(e) {
        let title = e.target.value;

        if(title.startsWith(" ")) {
            noEmpty.current.style.display = "block";

            if(noEmptyTimer !== null) {
                clearInterval(noEmptyTimer);
            }

            noEmptyTimer = setTimeout(() => {
                noEmpty.current.style.display = "none";
                noEmptyTimer = null;
            }, 3000);

            title = title.trim();
            e.target.value = title;
        } else if(title.length > 50) {
            overFlow.current.style.display = "block";

            if(overFlowTimer !== null) {
                clearInterval(overFlowTimer);
            }

            overFlowTimer = setTimeout(() => {
                overFlow.current.style.display = "none";
                overFlowTimer = null;
            }, 3000);

            title = title.substring(0, 50);
            e.target.value = title;
        }

        setTitle(title);
    }

    function changeContents(content) {
        setContents(content);
    }

    function clickWriteBtn() {
        if(recruitmentType === 0) {
            alert("모집 구분을 선택하세요");
            return false;
        } else if(wayOfProceeding === 0) {
            alert("진행 방식을 선택하세요");
            return false;
        } else if(numberOfRecruits === 0) {
            alert("모집 인원을 선택하세요");
            return false;
        } else if(deadlineForRecruitment === undefined) {
            alert("모집 마감 날짜를 선택하세요");
            return false;
        } else if(recruitmentPartNames.length === 0) {
            alert("모집 분야를 선택하세요");
            return false;
        } else if(technologyStackNames.length === 0) {
            alert("기술 스택을 선택하세요");
            return false;
        } else if(startDate === undefined) {
            alert("진행 시작 날짜를 선택하세요");
            return false;
        } else if(endDate === undefined) {
            alert("진행 종료 날짜를 선택하세요");
            return false;
        } else if(title.length === 0) {
            alert("제목을 입력하세요");
            return false;
        } else if(contents.length === 0) {
            alert("내용을 입력하세요");
            return false;
        }

        let data = new FormData(document.frm);

        let redirect = window.localStorage.getItem("redirect");
        if(redirect === null) {
            redirect = "/studygroup";
        }
        redirect = "/mypagenew";


        if(seq === undefined) {
            axios.post("http://localhost/studygroup", data).then((xhr) => {
                console.log(redirect + " redirect 1")
                window.location.href = redirect;
            }).catch(() => {
                alert("서버에 문제가 생겼습니다\n잠시 후 다시 시도해주세요");
            });
        } else {
            axios.put("http://localhost/studygroup", data).then((xhr) => {
                console.log(redirect + " redirect 2")
                window.location.href = redirect;
            }).catch(() => {
                alert("서버에 문제가 생겼습니다\n잠시 후 다시 시도해주세요");
            });
        }
    }

    function clickResetBtn() {
        if(seq === undefined) {
            resetView();
        } else {
            setView();
        }
    }

    function resetView() {
        setRecruitmentType(0);
        setWayOfProceeding(0);
        setNumberOfRecruits(0);
        setDeadlineForRecruitment(undefined);
        setRecruitmentPartNames([]);
        setRecruitmentPartNumbers([]);
        setTechnologyStackNames([]);
        setTechnologyStackNumbers([]);
        setStartDate(undefined);
        setEndDate(undefined);
        setIsvisible(true);
        setTitle("");
        setContents("");
    }

    function setView() {
        let recruitmentType = recruitmentTypeData.find(rt => {
            return studygroupData.recruitmentType === rt.seq;
        });

        let recruitmentPartNames = [];
        let technologyStackNames = [];

        studygroupData.recruitmentPart.forEach(recruitmentPartSeq => {
            let nth = positionData.find(p => {
                return p.seq === recruitmentPartSeq;
            });

            recruitmentPartNames.push(nth.name);
        });

        studygroupData.technologyStack.forEach(technologyStackSeq => {
            let nth = technologyStackData.find(ts => {
                return ts.seq === technologyStackSeq;
            });

            technologyStackNames.push(nth.name);
        });

        let wayOfProceeding = wayOfProceedingData.find(wop => {
            return studygroupData.wayOfProceeding === wop.seq;
        });

        let NumberOfRecruits = numberOfRecruitsData.find(nor => {
            return studygroupData.numberOfRecruits === nor.seq;
        });

        setRecruitmentType(recruitmentType.seq);
        setWayOfProceeding(wayOfProceeding.seq);
        setNumberOfRecruits(NumberOfRecruits.seq);
        setDeadlineForRecruitment(studygroupData.deadlineForRecruitment);
        setRecruitmentPartNames(recruitmentPartNames);
        setRecruitmentPartNumbers(studygroupData.recruitmentPart);
        setTechnologyStackNames(technologyStackNames);
        setTechnologyStackNumbers(studygroupData.technologyStack);
        setStartDate(studygroupData.startDate);
        setEndDate(studygroupData.endDate);
        setIsvisible(studygroupData.visible);
        setTitle(studygroupData.title);
        setContents(studygroupData.contents);
    }

    return(
        <div className="wide container" id={props.id}>
            {
                (recruitmentTypeData !== undefined && positionData !== undefined && technologyStackData !== undefined) &&
                <>
                    <Inputter>
                        <form id="frm" name="frm" action="http://localhost/studygroup" method="POST">
                            {seq !== undefined && <input type="hidden" name="seq" value={seq} />}

                            <Wrapper>
                                <TitleWrapper>
                                    <i className="bi bi-1-circle"></i>
                                    <InfoTitleText>프로젝트 기본 정보를 입력해주세요.</InfoTitleText>
                                </TitleWrapper>
                                <InfoSelector>
                                    <RowComponent
                                        left={<SelectComponent id="recruitmentType" title="모집 구분" onChange={changeRecruitmentType} value={recruitmentType} data={recruitmentTypeData} />}
                                        right={<SelectComponent id="wayOfProceeding" title="진행 방식" onChange={changeWayOfProceeding} value={wayOfProceeding} data={wayOfProceedingData} />}
                                    />
                                    <RowComponent
                                        left={<SelectComponent id="numberOfRecruits" title="모집 인원" onChange={changeNumberOfRecruits} value={numberOfRecruits} data={numberOfRecruitsData} />}
                                        right={<DateComponent id="deadlineForRecruitment" title="모집 마감일" onChange={changeDeadlineForRecruitment} value={deadlineForRecruitment} />}
                                    />
                                    <RowComponent
                                        left={<MultiSelectComponent id="position" title="모집 분야" names={recruitmentPartNames} values={recruitmentPartNumbers} name="recruitmentPart" onChange={changePosition} data={positionData} />}
                                        right={<MultiSelectComponent id="technologyStack" title="기술 스택" names={technologyStackNames} values={technologyStackNumbers} name="technologyStack" onChange={changeTechnologyStack} data={technologyStackData} />}
                                    />
                                    <RowComponent
                                        left={<DateComponent id="startDate" title="진행 기간" onChange={changeStartDate} value={startDate} extra={{id: "endDate", onChange: changeEndDate, value: endDate}} />}
                                        right={<IsVisibleComponent />} />
                                </InfoSelector>
                            </Wrapper>
                            <Wrapper>
                                <TitleWrapper>
                                    <i className="bi bi-2-circle"></i>
                                    <InfoTitleText>프로젝트에 대해 소개해주세요.</InfoTitleText>
                                </TitleWrapper>
                                <div className="infoInputter">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="title" className="form-label">제목</label>
                                            <input type="text" className="form-control" id="title" name="title" placeholder="글 제목을 입력해주세요!" onChange={changeTitle} value={title} />
                                            <div className="alert alert-danger dislayNone" role="alert" ref={noEmpty}>맨 앞, 뒤 공백은 지워집니다</div>
                                            <div className="alert alert-danger dislayNone" role="alert" ref={overFlow}>제목은 50자까지만 가능합니다</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col" id="contentsWrapper">
                                            <ReactQuill
                                                modules={modules}
                                                formats={formats}
                                                placeholder="프로젝트에 대해 소개해주세요!"
                                                value={contents}
                                                onChange={changeContents}
                                            />
                                        </div>
                                        <textarea name="contents" value={contents} style={{"display": "none"}} readOnly ></textarea>
                                    </div>
                                </div>
                            </Wrapper>
                            <BtnWrapper id="btnWrapper">
                                <button type="reset" className="btn btn-secondary" onClick={clickResetBtn}>초기화</button>
                                <button type="button" className="btn btn-primary" onClick={clickWriteBtn}>
                                    {seq === undefined ? "글 등록" : "글 수정"}
                                </button>
                            </BtnWrapper>
                        </form>
                    </Inputter>
                    
                    <Divider />

                    <Outputter>
                        <div className="alert alert-primary" role="alert">미리 보기 화면입니다</div>

                        <StudygroupMainDetailComponent
                            mode="preview"
                            studygroup={{
                                studygroupDetailUser: {
                                    id: userId,
                                    fileName: fileName
                                },
                                recruitmentType: recruitmentType,
                                wayOfProceeding: wayOfProceeding,
                                numberOfRecruits: numberOfRecruits,
                                deadlineForRecruitment: deadlineForRecruitment,
                                recruitmentPart: recruitmentPartNumbers,
                                technologyStack: technologyStackNumbers,
                                startDate: startDate,
                                endDate: endDate,
                                title: title,
                                contents: contents
                            }}
                           
                            essensialData={{recruitmentType: recruitmentTypeData, position: positionData, technologyStack: technologyStackData}}
                        />
                    </Outputter>
                </>
            }
        </div>
    );
}

export default StudygroupForm;