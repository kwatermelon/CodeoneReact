import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import StudygroupMainFileter from './StudygroupMainFileter';
import StudygroupMainList from './StudygroupMainList';
import styled from 'styled-components';
import StudygroupMainDetail from './StudygroupMainDetail';

export const Datas = React.createContext();

function StudygroupMain() {
    const [filter, setFilter] = useState({'position': [], 'technologyStack': [], 'recruitmentType': null});
    const [isOpened, setIsOpened] = useState(false);
    const [term, setTerm] = useState("");

    const [studygroupList, setStudygroupList] = useState();

    const [recruitmentType, setRecruitmentType] = useState();
    const [position, setPosition] = useState();
    const [technologyStack, setTechnologyStack] = useState();

    // 상세보기 할 스터디 그룹 관리 번호
    const [seq, setSeq] = useState();
    // 상세보기 창 열기/닫기 제어 변수
    const [showDetailComponent, setShowDetailComponent] = useState(false);

    const loadList = useCallback(() => {
        let urlParam = "";

        if(filter["position"].length !== 0) {
            for(let i=0; i<filter["position"].length; i++) {
                urlParam += "recruitmentPart="+(filter["position"][i]+1) + "&";
            }

            urlParam = urlParam.substring(0, urlParam.length-1);
        }

        if(filter["technologyStack"].length !== 0) {
            if(urlParam.length !== 0) {
                urlParam += "&";
            }

            for(let i=0; i<filter["technologyStack"].length; i++) {
                urlParam += "technologyStack="+(filter["technologyStack"][i]+1) + "&";
            }

            urlParam = urlParam.substring(0, urlParam.length-1);
        }

        if(filter["recruitmentType"] !== null) {
            if(urlParam.length !== 0) {
                urlParam += "&";
            }

            urlParam += "recruitmentType="+(filter["recruitmentType"]+1);
        }

        if(isOpened) {
            if(urlParam.length !== 0) {
                urlParam += "&";
            }

            urlParam += "isOpened="+isOpened;
        }

        if(term != null && (term.trim().length > 0 && term.length <= 100)) {
            if(urlParam.length !== 0) {
                urlParam += "&";
            }

            urlParam += "term="+term;
        } else if(term != null && term.length > 100) {
            alert("검색어는 100자 이하만 입력 가능합니다");
            return false;
        }

        let url = "http://localhost/studygroup/list";
        if(urlParam.length !== 0) {
            url = url + ("?" + urlParam);
        }

        fetchStudygroupList(url);
    }, [filter, isOpened, term]);

    const fetchStudygroupList = async (url) => {
        await axios.get(url).then((response) => {
            if(response.status === 200) {
                setStudygroupList(response.data);
            } else {
                setStudygroupList([]);
            }
        });
    }

    const fetchRecruitmentType = () => {
        axios.get("http://localhost/studygroup/filter/recruitment_type").then(response => {
            setRecruitmentType(response.data);
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
        fetchRecruitmentType();
        fetchPosition();
        fetchTechnologyStack();
        loadList();
    }, []);

    return(
        <>
        {
            (recruitmentType !== undefined && position !== undefined && technologyStack !== undefined) &&
            <StudygroupMainWrapper className="wide container">
                <Datas.Provider value={{recruitmentType: recruitmentType, position: position, technologyStack: technologyStack}}>
                    <StudygroupMainFileter filter={[filter, setFilter]} setIsOpened={setIsOpened} term={[term, setTerm]} loadList={loadList} />
                    {studygroupList !== undefined && <StudygroupMainList studygroupList={studygroupList} setSeq={setSeq} setShowDetailComponent={setShowDetailComponent} />}
                    {showDetailComponent && <StudygroupMainDetail seq={seq} setShowDetailComponent={setShowDetailComponent} />}
                </Datas.Provider>
            </StudygroupMainWrapper>
        }
            <StudygroupMainAddBtnWrapper>
                <StudygroupMainAddBtn onClick={() => {window.location.href="/studygroup/form"}}><StudygroupMainAddBtnIcon className="bi-solid bi-plus" /></StudygroupMainAddBtn>
            </StudygroupMainAddBtnWrapper>
        </>
    );
}

export default StudygroupMain;

const StudygroupMainWrapper = styled.div`
    font-family: 'Noto Sans KR', sans-serif;
`

const StudygroupMainAddBtnWrapper = styled.div`
    position: fixed;
    right: 20px;
    bottom: 35px;
    border-radius: 60px;
    border: 2px solid rgb(0, 43, 255);
`

const StudygroupMainAddBtn = styled.button`
    width: 60px;
    height: 60px;
    vertical-align: middle;
    padding: 0;
    display: flex;
    align-items: center;
`

const StudygroupMainAddBtnIcon = styled.i`
    font-size: 60px;
    color: rgb(0, 43, 255);
`