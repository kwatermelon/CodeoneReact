import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StudygroupMainDetailComponent from './StudygroupMainDetailComponent';

const DetailWrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    display: flex;
`

const BlackScreen = styled.div`
    width: 50%;
    background: black;
    opacity: 0.4;
`

const Closed = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-size: 36px;
    font-weight: bold;
`

const DetailContents = styled.div`
    width: 50%;
    background: white;
    padding: 0 50px 50px;
    overflow-y: auto;
    ${props => props.isClosed && 'filter: blur(3px)'}
`

function StudygroupMainDetail(props) {
    const seq = props.seq;
    const [studygroup, setStudygroup] = useState();

    const setShowDetailComponent = props.setShowDetailComponent;

    useEffect(function() {
        if(seq !== undefined) {
            axios.post("http://localhost/studygroup/"+seq+"/view");

            axios.get("http://localhost/studygroup/detail/"+seq).then(response => {
                response.data.seq = seq;
                setStudygroup(response.data);
            });
        }
    }, [seq]);

    return(
        <DetailWrapper>
            <BlackScreen onClick={() => {setShowDetailComponent(false)}} />
            { (studygroup !== undefined && studygroup.isClosed) && <Closed>모집이 마감된 글입니다</Closed> }
            {
                studygroup !== undefined &&
                <DetailContents isClosed={studygroup.isClosed}>
                    {studygroup !== undefined && <StudygroupMainDetailComponent mode="detail" setShowDetailComponent={setShowDetailComponent} studygroup={studygroup} /> }
                </DetailContents>
            }
        </DetailWrapper>
    );
}

export default StudygroupMainDetail;