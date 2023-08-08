import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

const RecrutimentPartItem = styled.span`
    background-color: #afafaf;
    border-radius: 15px;
    font-size: 16px;
    padding: 3px 10px;
    margin-right: 5px;
    color: #002bff;
`

const TechnologyStackImg = styled.img`
`

function MyPageBloggroupListItemComponent(props) {
    const number = props.number;
    const blog = props.blog;

    // const positionData = props.essentialData.positionData;
    // const technologyStackData = props.essentialData.technologyStackData;

    // const PositionComponents = () => {
    //     let amount = blog.recruitmentPart.length <= 3 ? blog.recruitmentPart.length : 3;
    
    //     const components = [];
    
    //     for(let count=0; count<amount; count++) {
    //         let nthRecruitmentPart = studygroupInfo.recruitmentPart[count];
    //         let position = positionData[nthRecruitmentPart-1];
    
    //         components.push(<RecrutimentPartItem key={count}>{position.name}</RecrutimentPartItem>);
    //     }
    
    //     if(studygroupInfo.recruitmentPart.length >= 4) {
    //         components.push(<RecrutimentPartItem key={3}>...</RecrutimentPartItem>);
    //     }
    
    //     return components;
    // }

    // const TechnologyStackComponents = () => {
    //     let amount = studygroupInfo.technologyStack.length <= 3 ? studygroupInfo.technologyStack.length : 3;
    
    //     const components = [];
    
    //     for(let count=0; count<amount; count++) {
    //         let nthTechnologyStack = studygroupInfo.technologyStack[count];
    //         let technologyStack = technologyStackData[nthTechnologyStack-1];
            
    //         let src = "http://localhost/images/technologyStack/" + technologyStack["img"]
            
    //         components.push(<TechnologyStackImg key={count} src={src} alt={technologyStack.name} />);
    //     }
    
    //     if(studygroupInfo.technologyStack.length >= 4) {
    //         components.push(<span key={3}>...</span>);
    //     }
        
    //     return components;
    // }

    function clickUpdateBtn() {
        // window.localStorage.setItem("redirect", "http://localhost:3000/mypage/studygroup");
        window.location.href = "/blogUpdateForm/"+blog.seq;
    }

    function clickDeleteBtn() {
        // if(window.confirm("블로그 글을 삭제하시겠습니까?\n(삭제된 글은 복구할 수 없습니다)")) {
        //     let opt = {
        //         data: {
        //             seq: studygroupInfo.seq
        //         },
        //         headers: {
        //             "Content-Type": "application/x-www-form-urlencoded"
        //         }
        //     }
    
        //     axios.delete("http://localhost/studygroup", opt).then(() =>{
        //         props.fetchStudygroupAmount();
        //     });
        // }
    }

    return(
        <tr>
            <td>{number}</td>
            <td style={{overFlow:"hidden" , textOverflow:'ellipsis',  whiteSpace:'nowrap'}}>{blog.title}</td>
            <td>{blog.regdate.substr(0, 10)}</td>
            <td>{blog.likes}</td>
            <td>{blog.replies}</td>
            <td>
                <button type="button" className="btn btn-primary" onClick={clickUpdateBtn}>수정</button>
                <button type="button" className="btn btn-secondary" onClick={clickDeleteBtn}>삭제</button>
            </td>
        </tr>
    );
}

export default MyPageBloggroupListItemComponent;