import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { fetchData } from './function';
import { Datas } from './StudygroupMain';
import StudygroupMainComment from './StudygroupMainComment';

const Wrapper = styled.div`
    margin-top: 50px;
    position: relative;
`

const CloseWrapper = styled.div`
    position: absolute;
    top: -45px;
    left: 0;
`

const Clickable = styled.span`
    cursor: pointer;
`

const OutputterTitle = styled.h1`
    font-size: 48px;
    font-weight: bold;
    min-height: 72px;
`

const OutputterPublic = styled.div`
    margin-top: 30px;
`

const OutputterProfileWrapper = styled(OutputterPublic)`
    display: flex;
    align-items: center;
`

const OutputterProfileImg = styled.img`
    width: 60px;
`

function StudygroupMainDetailComponent(props) {
    const studygroupDetailUser = props.studygroup.studygroupDetailUser;
    const recruitmentType = props.studygroup.recruitmentType;
    const wayOfProceeding = props.studygroup.wayOfProceeding;
    const numberOfRecruits = props.studygroup.numberOfRecruits;
    const deadlineForRecruitment = props.studygroup.deadlineForRecruitment;
    const recruitmentPart = props.studygroup.recruitmentPart;
    const technologyStack = props.studygroup.technologyStack;
    const startDate = props.studygroup.startDate;
    const endDate = props.studygroup.endDate;
    const title = props.studygroup.title;
    const contents = props.studygroup.contents;

    let essensialData = useContext(Datas);
    if(essensialData === undefined) {
        essensialData = props.essensialData;
    }

    const recruitmentTypeData = essensialData.recruitmentType;
    const positionData = essensialData.position;
    const technologyStackData = essensialData.technologyStack;
    const [wayOfProceedingData, setWayOfProceedingData] = useState();
    const [numberOfRecruitsData, setNumberOfRecruitsData] = useState();

    const setShowDetailComponent = props.setShowDetailComponent;

    useEffect(function() {
        let urls = [
            "http://localhost/studygroup/filter/way_of_proceeding",
            "http://localhost/studygroup/filter/number_of_recruits",
        ];

        let setDatas = [
            setWayOfProceedingData,
            setNumberOfRecruitsData,
        ];

        for(let i=0; i<urls.length; i++) {
            fetchData(urls[i], setDatas[i]);
        }
    }, []);

    function ConvertRecruitmentType() {
        let recruitmentTypeObj = recruitmentTypeData.find(rt => {
            return recruitmentType === rt.seq;
        });
        
        return recruitmentTypeObj.name;
    }

    function ConvertWayOfProceeding() {
        let wayOfProceedingObj = wayOfProceedingData.find(wop => {
            return wayOfProceeding === wop.seq;
        });

        return wayOfProceedingObj.name;
    }

    function ConvertNumberOfRecruits() {
        let numberOfRecruitsObj = numberOfRecruitsData.find(nor => {
            return numberOfRecruits === nor.seq;
        });

        return numberOfRecruitsObj.name;
    }

    function ConvertRecruitmentPart() {
        let recruitmentPartNames = recruitmentPart.map(recruitmentPartSeq => {
            let nth = positionData.find(p => {
                return p.seq === recruitmentPartSeq;
            });
            
            return nth.name;
        });

        return recruitmentPartNames.join(", ");
    }

    function ConvertTechnologyStack() {
        let technologyStackComponent = technologyStack.map(technologyStackSeq => {
            let nth = technologyStackData.find(ts => {
                return ts.seq === technologyStackSeq;
            });

            let src = "http://localhost/images/technologyStack/" + nth.img;

            return <img src={src} alt={nth.name} key={nth.seq} style={{"width": "45px", "marginRight": "5px"}} />;
        });

        return technologyStackComponent;
    }

    return(
        <Wrapper>
            {props.mode === "detail" && <CloseWrapper><Clickable className="material-symbols-outlined" onClick={() => {setShowDetailComponent(false)}}>close</Clickable></CloseWrapper>}

            <div id="titleProfileWrapper">
                <OutputterTitle>{title}</OutputterTitle>
                <OutputterProfileWrapper>
                    <OutputterProfileImg src={'http://localhost/user/getProfileImage/16843793580235319/png'} alt={studygroupDetailUser.id+" 프로필 이미지"} />
                    <span>nanchezal</span>
                </OutputterProfileWrapper>
            </div>

            <div className="info row">
                <div className="col">
                    <div className="row">
                        <div className="col-4">모집 구분</div>
                        <div className="col">{recruitmentType !== 0 && ConvertRecruitmentType()}</div>
                    </div>
                    <div className="row">
                        <div className="col-4">모집 인원</div>
                        <div className="col">{(numberOfRecruitsData !== undefined && numberOfRecruits !== 0) && ConvertNumberOfRecruits()}</div>
                    </div>
                </div>

                <div className="col">
                    <div className="row">
                        <div className="col-4">진행 방식</div>
                        <div className="col">{(wayOfProceedingData !== undefined && wayOfProceeding !== 0) && ConvertWayOfProceeding()}</div>
                    </div>
                    <div className="row">
                        <div className="col-4">모집 마감일</div>
                        <div className="col">{deadlineForRecruitment}</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-2">모집 분야</div>
                <div className="col">{ConvertRecruitmentPart()}</div>
            </div>

            <div className="row">
                <div className="col-2">기술 스택</div>
                <div className="col">{ConvertTechnologyStack()}</div>
            </div>

            <div className="row" id="lastInfo">
                <div className="col-2">진행 기간</div>
                <div className="col">{startDate} ~ {endDate}</div>
            </div>

            <div className="row" id="contents" dangerouslySetInnerHTML={{__html: contents}}></div>

            <div className="row">
                <StudygroupMainComment mode={props.mode} studygroupSeq={props.studygroup.seq} />
            </div>
        </Wrapper>
    );
}

export default StudygroupMainDetailComponent;