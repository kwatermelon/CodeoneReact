import React, {useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ThinMargintop = styled.div`
    margin-top: 10px!important;
`

const CommentList = styled(ThinMargintop)`
    border-bottom: 2px solid #cfcfcf;
    padding-bottom: 10px;
`

const CommentWriterProfile = styled.div`
    display: flex;
    align-items: center;
`

const CommentWriterProfileImg = styled.img`
    width: 48px;
    height: 48px;
    margin-right: 10px;
`

const CommentModifyBtnWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
`
const MarginRightBtn = styled.button`
    margin-right: 10px;
`

function StudygroupMainCommentDetailComponent(props) {
    const comment = props.comment;
    const clickDeleteBtn = props.clickDeleteBtn;

    const [isUpdate, setIsUpdate] = useState(false);
    const [newComment, setNewComment] = useState("");

    function clickUpdateBtn() {
        if(!isUpdate) {
            setIsUpdate(true);
            setNewComment(comment.comment);
        } else {
            setIsUpdate(false);
            comment.comment = newComment;
            props.updateComment(comment);
        }
    }

    return(
        <CommentList className="row">
            <div className="col">
                <ThinMargintop className="row">
                    <CommentWriterProfile className="col-9">
                        <CommentWriterProfileImg src={comment.user.filename} alt={comment.user.id+" 프로필 이미지"} />
                        <div>
                            <span>{comment.user.id}</span>
                            <div>{comment.regdate.replace("T", " ")}</div>
                        </div>
                    </CommentWriterProfile>
                    {comment.isMine &&
                        <CommentModifyBtnWrapper className="col-3">
                            <MarginRightBtn type="button" className="btn btn-primary" onClick={clickUpdateBtn}>수정</MarginRightBtn>
                            {/* <MarginRightBtn type="button" className="btn btn-secondary" onClick={() => clickDeleteBtn(comment.seq)}>삭제</MarginRightBtn> */}
                        </CommentModifyBtnWrapper>}
                </ThinMargintop>
                <ThinMargintop className="row">
                    <div className="commentContents">
                        {!isUpdate ? comment.comment : <textarea className="form-control" id="comment" rows="3" aria-label="댓글 수정" maxLength={300} value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>}
                    </div>
                </ThinMargintop>
                {comment.haveReply && <div className="commentReply"></div>}
            </div>
        </CommentList>
    );
}

export default StudygroupMainCommentDetailComponent;