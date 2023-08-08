import React, { useContext } from 'react';
import styled from 'styled-components';
import "../../css/studygroup/stydygroupMainList.css";
import axios from 'axios';
import { Datas } from './StudygroupMain';
import { goLogin, isLogin } from './function';

const ListWrapper = styled.div`
    margin: 50px 0px;
`

const RecruitmentItem = styled.div`
    flex: none;
    width: 320px;
    border: 1px solid #afafaf;
    border-radius: 15px;
    padding: 10px;
    ${props => !props.isClosed && 'cursor: pointer;'}
    margin-right: 26px;
    position: relative;
    &:last-child {
        margin-right: 0px;
    }
`

const RecruitmentType = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
`

const RecruitmentTypeInfo = styled.div`
    display: flex;
    align-items: center;
`

const DeadlineForRecruitment = styled.div`
    font-size: 16px;
    padding-left: 2px;
    margin-top: 5px;
`

const VerticalLine = styled.span`
    border-left: 2px solid #afafaf;
    margin: 0 5px;
    height: 14px;
    display: inline-block;
`

const Title = styled.div`
    height: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-top: 5px;
`

const RecrutimentPartItem = styled.span`
    background-color: #afafaf;
    border-radius: 15px;
    font-size: 16px;
    padding: 3px 10px;
    margin-right: 5px;
    color: #002bff;
`

const TechnologyStack = styled.div`
    margin-top: 10px;
`

const TechnologyStackImg = styled.img`
    width: 45px;
    margin-right: 5px;
`

const Etc = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    align-items: center;
    font-size: 20px!important;
`

const UserProfile = styled.div`
    display: flex;
    align-items: center;
`

const ProfileImg = styled.img`
    width: 40px;
`

const ViewAmount = styled.div`
    display: flex;
    align-items: center;
`

const NoContents = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ClosedWrapper = styled.div`
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Closed = styled.div`
    color: white;
    background: #000;
    text-align: center;
    padding: 15px;
    border-radius: 15px;
`

const Blur = styled.div`
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background: gray;
    filter: blur(2px);
    opacity: 0.5;
    border-radius: 12px;
`

const recruitmentTypeTextArray = ["", "menu_book", "folder_open"];

function StudygroupMainList(props) {
    const essentialData = useContext(Datas);

    const recruitmentTypeData = essentialData.recruitmentType;
    const positionData = essentialData.position;
    const technologyStackData = essentialData.technologyStack;

    const setSeq = props.setSeq;
    const setShowDetailComponent = props.setShowDetailComponent;

    const PositionComponents = props => {
        let amount = props.recruitmentPart.length <= 3 ? props.recruitmentPart.length : 3;
    
        const components = [];
    
        for(let count=0; count<amount; count++) {
            let nthRecruitmentPart = props.recruitmentPart[count];
            let position = positionData[nthRecruitmentPart-1];
    
            components.push(<RecrutimentPartItem key={count}>{position.name}</RecrutimentPartItem>);
        }
    
        if(props.recruitmentPart.length >= 4) {
            components.push(<RecrutimentPartItem key={3}>...</RecrutimentPartItem>);
        }
    
        return components;
    }
    
    const TechnologyStackComponents = props => {
        let amount = props.technologyStack.length <= 5 ? props.technologyStack.length : 5;
    
        const components = [];
    
        for(let count=0; count<amount; count++) {
            let nthTechnologyStack = props.technologyStack[count];
            let technologyStack = technologyStackData[nthTechnologyStack-1];
    
            let src = "http://localhost/images/technologyStack/" + technologyStack["img"]
    
            components.push(<TechnologyStackImg key={count} src={src} alt={technologyStack.name} />);
        }
    
        if(props.technologyStack.length >= 6) {
            components.push(<span key={6}>...</span>);
        }
        
        return components;
    }
    
    const Row = props => {
        let studygroupList = props.studygroupList;
        let start = props.start;
        let end = start + 5;
        if(studygroupList.length < end) {
            end = studygroupList.length;
        }
    
        let components = [];
    
        while(start < end) {
            let studygroup = studygroupList[start++];
            let seq = studygroup.seq;
            let recruitmentType = recruitmentTypeData.find(rt => {
                return rt.seq === studygroup.recruitmentType
            });
            let deadlineForRecruitment = studygroup.deadlineForRecruitment;
            let title = studygroup.title;
            let recruitmentPart = studygroup.recruitmentPart;
            let technologyStack = studygroup.technologyStack;
            let userProfile = studygroup.user;
            let viewAmount = studygroup.viewAmount;
            let isClosed = studygroup.isClosed;
            let isLike = studygroup.isLike;
    
            let recruitmentTypeText = recruitmentTypeTextArray[recruitmentType.seq];
    
            let starClassName = "bi bi-star";
            if(isLike) {
                starClassName += "-fill";
            }
    
            let component = 
                (<RecruitmentItem key={start} className="col" isClosed={isClosed} onClick={() => (clickRecruitment(seq))}>
                    {isClosed && <Blur />}
                    {isClosed && <ClosedWrapper><Closed>모집 마감</Closed></ClosedWrapper>}
    
                    <RecruitmentType>
                        <RecruitmentTypeInfo>
                            <span className="material-symbols-outlined">{recruitmentTypeText}</span>
                            <span>{recruitmentType.name}</span>
                        </RecruitmentTypeInfo>
                        <i className={starClassName} onClick={ e => { e.stopPropagation(); clickStarBtn(e, seq); } }></i>
                    </RecruitmentType>
    
                    <DeadlineForRecruitment>
                        <span>마감일</span>
                        <VerticalLine />
                        <span>{deadlineForRecruitment}</span>
                    </DeadlineForRecruitment>
    
                    <Title>{title}</Title>
    
                    <div className="recruitmentPart">
                        <PositionComponents recruitmentPart={recruitmentPart} />
                    </div>
    
                    <TechnologyStack>
                        <TechnologyStackComponents technologyStack={technologyStack} />
                    </TechnologyStack>
    
                    <Etc>
                        <UserProfile>
                            <ProfileImg src="http://localhost/images/profile/profile1.png" alt="프로필 이미지" />
                            <span>{userProfile.id}</span>
                        </UserProfile>
                        <ViewAmount>
                            <span className="material-symbols-outlined">visibility</span>
                            <span>{viewAmount >= 100 ? "99+" : viewAmount}</span>
                        </ViewAmount>
                    </Etc>
                </RecruitmentItem>);
    
            components.push(component);
        }
    
        return components;
    }
    
    const clickStarBtn = (e, seq) => {
        // 로그인 여부 확인 후 로그인을 하지 않았다면 로그인 창으로 이동해야함
        if(!isLogin()) {
            goLogin();
            return false;
        }

        let starTag = e.target;
        let isLike = starTag.classList.contains("bi-star-fill");
        
        axios.post("http://localhost/studygroup/toggleLike/"+seq).then(() => {
            if(isLike) {
                starTag.classList.replace("bi-star-fill", "bi-star");
            } else {
                starTag.classList.replace("bi-star", "bi-star-fill");
            }
        });
    }
    
    const clickRecruitment = (seq) => {
        setSeq(seq);
        setShowDetailComponent(true);
    }
    
    const printRows = studygroupList => {
        let roofAmount = parseInt(studygroupList.length / 5) + 1;
    
        let components = [];
    
        for(let i=0; i<roofAmount; i++) {
            let component = <div key={i} className="row">
                <Row studygroupList={studygroupList} start={i*5} />
            </div>;
    
            components.push(component);
        }
    
        return components;
    }
    
    const printNoContents = () => {
        return (<NoContents>
            <div>조건에 맞는 스터디 그룹이 없습니다</div>
            <div>해당 조건의 스터디 그룹을 개설해 보시는건 어떨까요?</div>
            <div>(스터디 그룹 만들기로 이동)</div>
        </NoContents>);
    }

    return(
        <ListWrapper>
            {props.studygroupList.length == 0 ? printNoContents() : printRows(props.studygroupList)}
        </ListWrapper>
    );
}

export default StudygroupMainList;