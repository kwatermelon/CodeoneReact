import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isLogin, goLogin } from './function';
import axios from 'axios';
import Pagination from "react-js-pagination";
import StudygroupMainCommentDetailComponent from './StudygroupMainCommentDetailComponent';

const CommentCounter = styled.div`
    font-weight: 800;
    margin-bottom: 15px;
    font-size: 18px;
`

const CommentBtnWrapper = styled.div`
    display: flex;
    justify-content: end;
    margin-top: 15px;
`

function StudygroupMainComment(props) {
    const mode = props.mode;
    const studygroupSeq = props.studygroupSeq;

    const [commentInfo, setCommentInfo] = useState({amount: 0, list: []});

    const [nowPageNumber, setNowPageNumber] = useState(1);

    const [comment, setComment] = useState("");

    function fetchCommentInfo() {
        axios.get("http://localhost/studygroup/comment/list", {params: {studygroupSeq: studygroupSeq, pageNumber: nowPageNumber}}).then(response => {
            if(response.status === 200) {
                setCommentInfo(response.data);
            }
        });
    }

    useEffect(function() {
        if(mode === "preview") return ;

        fetchCommentInfo();
    }, [nowPageNumber]);

    function clickCommentWriteBtn() {
        if(mode === "preivew") return false;

        if(!isLogin()) {
            goLogin();
            return false;
        }

        if(comment.trim().length === 0) {
            alert("댓글을 작성해주세요");
            return false;
        }

        let data = new FormData();
        data.append("studygroupSeq", studygroupSeq);
        data.append("comment", comment);

        axios.post("http://localhost/studygroup/comment", data)
            .then(() => {
                setComment("");
                fetchCommentInfo();
            })
            .catch(response => {
                if(response.status === 403) {
                    goLogin();
                } else if(response.status === 409) {
                    alert("삭제된 모집글입니다\n페이지 새로고침 후 다시 이용해주세요");
                }
        });
    }

    function clickDeleteBtn(seq) {
        let opt = {
            data: {
                seq: seq
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        axios.delete("http://localhost/studygroup/comment", opt).then(() => {
            fetchCommentInfo();
        });
    }

    function updateComment(comment) {
        let data = {seq: comment.seq, comment: comment.comment};
        let opt = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        axios.put("http://localhost/studygroup/comment", data, opt).then(() => {
            fetchCommentInfo();
        });
    }

    function clickPageNumber(nowPageNumber) {
        setNowPageNumber(nowPageNumber);
    }

    return (
        <>
            <div className="commentWriteWrapper">
                <CommentCounter>{commentInfo.amount}개의 댓글이 있습니다.</CommentCounter>
                <div>
                    <textarea className="form-control" id="comment" rows="3" placeholder="댓글을 입력하세요" aria-label="댓글" maxLength={300} value={comment} onChange={e => setComment(e.target.value)} ></textarea>
                </div>
                <CommentBtnWrapper><button type="button" className="btn btn-primary" onClick={clickCommentWriteBtn}>댓글 등록</button></CommentBtnWrapper>
            </div>

            <CommentListWrapper>
                {
                    commentInfo.list.map((nthComment, index) => {
                        return (
                            <StudygroupMainCommentDetailComponent key={nthComment.seq} comment={nthComment} clickDeleteBtn={clickDeleteBtn} updateComment={updateComment} />
                        );
                    })
                }

                <Pagination
                    activePage={nowPageNumber}              // 현재 선택된 페이지 번호
                    itemsCountPerPage={10}                  // 한 페이지당 보여줄 아이템의 개수
                    totalItemsCount={commentInfo.amount}    // 전체 아이템의 개수(전체 글 개수)
                    pageRangeDisplayed={5}                  // 한번에 표시할 페이지 개수 1/2/3/4/5
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={clickPageNumber}
                />
                </CommentListWrapper>
        </>
    );
}

export default StudygroupMainComment;

const CommentListWrapper = styled.div`
    font-size: 16px;
`