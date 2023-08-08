import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// 댓글 페이징
import Pagenation from "react-js-pagination";

// 좋아요하트
import heart from "../../assets/store/heart.png";
import emptyheart from "../../assets/store/emptyheart.png";
import "./css/storepage.css";

// 위치사진
import Location from '../../assets/store/location.png';

// 시간구현
import moment from "moment";

// day.js
import dayjs from "dayjs"; // day.js
//import isLeapYear from 'dayjs/plugin/isLeapYear'; // 윤년 판단 플러그인
import "dayjs/locale/ko"; // 한국어 가져오기

import "./css/storedetail.css";
import Kakaomap from "./storekakaomap";
// import KakaoShare, { ShareKakao } from "./storekakaoShare";
// import KakaoTalkSharingButton from "./storekakaoShare";

// 알람
import SweetAlert from "sweetalert2";
import StoreNav from "./storenav";

function StoreDetail() {
    // day.js 설정
    // dayjs.extend(isLeapYear); // 플러그인 등록
    dayjs.locale("ko"); // 한국어
    var relativeTime = require("dayjs/plugin/relativeTime"); // 현재시간으로 부터 가져올때 해줘야함
    dayjs.extend(relativeTime);

    // format 플러그인에서 받아오기
    var localizedFormat = require("dayjs/plugin/localizedFormat");
    dayjs.extend(localizedFormat);

    // 로그인정보 가져오기
    let id = window.localStorage.getItem("userId");
    console.log(id);

     // localStorage에서 login 꺼내와서 parsing하기
     const login = JSON.parse(localStorage.getItem("login"));     
     console.log(login); 

    // let name = login.name;
    // console.log(name);

    const [item, setItem] = useState({}); // 객체로 초기화해주기
    const [like, setLike] = useState(false); // 좋아요 상태저장
    const [status, setStatus] = useState("");
    const [itemId, setItemId] = useState("");

    const [commentlist, setCommentlist] = useState("");
    // commentlist paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentSeq, setEditingCommentSeq] = useState(null);

    const [updateComment, setUpdateComment] = useState("");

    // 댓글작성
    const [isWriteComment, setIsWriteComment] = useState(false);

    // 링크이동
    const history = useNavigate();

    // 주소값
    const location = useLocation();
    console.log(location);
    // let url = "http://localhost:3000" + location.pathname;   

    const baseUrl = window.location.host;
    console.log(baseUrl);
    let url = baseUrl + location.pathname;

    //console.log(window.location.href);

    // 댓글
    const [comment, setComment] = useState([]);

    let params = useParams(); // seq값 받아오기
    let seq = params.seq;
    // SweetAlert.fire(seq);

   
    

    // 중고거래 상세 받아오기
    const itemData = async (seq) => {

        if(login === null){
            SweetAlert.fire("로그인 후 이용해주세요");
            history("/login");
        }

        await axios
            .get("http://localhost/storedetail", { params: { seq: seq } })
            .then(function (resp) {
                console.log(resp.data);
                setItem(resp.data); // item 넣어주기
                //checkLike(seq);
                setStatus(resp.data.status);
                setItemId(resp.data.id);
            })
            .catch(function (err) {
                console.log(err);
            });
    };
    useEffect(() => {
        // initialize 용도
        itemData(seq);
        checkLike(seq);
        getCommentList(seq);
    }, [seq, like]);

    function checkLike(seq) {
        // id랑 글넘버 넘겨주고 좋아요중인지 확인
        axios
            .get("http://localhost/checkLike", { params: { id: id, seq: seq } })
            .then(function (resp) {
                console.log(resp.data);
                if (resp.data === "LIKING") {
                    // 빨강하트 셋팅
                    setLike(true);
                } else {
                    // 빈하트로 세팅
                    setLike(false); // false
                }
            })
            .catch(function (err) {
                SweetAlert.fire(err);
            });
    }

    function likeStore(seq) {
        // 서버에 연결. 좋아요 구현
        // 하트가 한번에 적용되는 문제 해결하기

        if (id === null) {
            SweetAlert.fire("로그인해주십시오");
            return;
        }

        // 로그인에서 id 가져오기
        // item.seq 값 가져오기
        axios
            .get("http://localhost/likeItem", { params: { id: id, seq: seq } })
            .then(function (resp) {
                console.log(resp.data);
                if (resp.data === "LIKE_OK") {
                    SweetAlert.fire("관심상품으로 등록되었습니다");
                    // 하트 색넣어주기
                    setLike(!like);
                   // window.location.reload(); // 페이지 리로드
                } else if (resp.data === "CANCLE_LIKE") {
                    SweetAlert.fire("관심상품이 삭제되었습니다");
                    // 하트 색 빼주기
                    setLike(!like);
                    // 해당 아이템의 좋아요 상태를 변경
                    //window.location.reload(); // 페이지 리로드
                }
            })
            .catch(function (err) {
                SweetAlert.fire(err);
            });
    }

    function changeStatus(e) {
        //const newStatus = e.target.value;
        setStatus(e.target.value);
        console.log(seq);
        console.log(e.target.value);

        // 판매중여부 변경 axios
        axios
            .put("http://localhost/status", {
                seq: seq,
                status: e.target.value,
            })
            .then(function (resp) {
                console.log(resp.data);
            })
            .catch(function (err) {
                SweetAlert.fire(err);
            });
    }

    function deleteItem() {
        // 삭제할건지 확인창 띄워주기
        // if (window.confirm("정말 삭제하시겠습니까?")) {
        // } else {
        //     SweetAlert.fire("취소합니다.");
        //     return;
        // }

        SweetAlert.fire({
            title: '게시글을 삭제하시겠습니까?',
            text: "삭제하시면 다시 복구시킬 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
          }).then((result) => {
            if (result.value) {
                //"삭제" 버튼을 눌렀을 때 작업할 내용을 이곳에 넣어주면 된다.
                axios.delete("http://localhost/storeitem", { params: { seq: seq } })
                .then(function (resp) {
                    console.log(resp.data);
                    SweetAlert.fire("글이 성공적으로 삭제되었습니다");
                    history("/storelist");
                })
                .catch(function (err) {
                    console.log(err);
                }); 
            }
          })

        
    }

    function storeCommentBtn() {
        // 글 seq, 로그인id, content 값 서버에 보내주기

        // comment 빈문자 체크
        // comment의 값이 falsy한 값(null, undefined, 0, "", false 등)이거나 trim한 값이 빈 문자열
        if (!comment.trim()) {
            // trim() 메소드로 문자열 공백 제거 후 체크합니다.
            SweetAlert.fire("댓글 내용을 작성해주세요");
            return;
        }
        // comment 길이 체크
        if (comment.length > 100) {
            SweetAlert.fire("댓글은 100자 이내로 작성해주세요.");
            setComment("");
            return;
        }

        axios
            .post("http://localhost/storeComment", {
                itemseq: seq,
                id: id,
                content: comment,
            })
            .then(function (resp) {
                SweetAlert.fire("댓글이 작성되었습니다");
               // window.location.reload(); // 페이지 리로드               
                setIsWriteComment(true);
                
            })
            .catch(function (err) {
                SweetAlert.fire(err);
                setIsWriteComment(false);
            });

            setComment(''); // 댓글칸 비워주기
    }

    // 댓글 불러오기 pageNumber 같이 넘겨주기
    function getCommentList(seq, page) {
        // seq 값 주고 comment 불러오가

        axios
            .get("http://localhost/storeComment", {
                params: { itemseq: seq, pageNumber: page },
            })
            .then(function (resp) {
                // 댓글불러오기 성공

                console.log(resp.data);
                setCommentlist(resp.data.commentlist);
                setTotalCnt(resp.data.cnt);
                //setComment(resp.data.commentlist.content);
                //console.log(comment);
            })
            .catch(function (err) {
                SweetAlert.fire("댓글 문제");
                console.log(err);
            });
    }

    // 댓글 랜더링 테이블로 바꿔주기
    const renderComments = () => {
        // 댓글이 없는 경우
        if (!commentlist || commentlist.length === 0) {
            return <div className="lecture-review-form-text" style={{textAlign:"center"}}>
                작성된 댓글이 없습니다. <br/>
                댓글을 남겨주세요!
                </div>;
        }

        return (
            <div>
                {commentlist.map((comment, i) => (
                    <div key={i}>
                        {/* 화면에 뿌려줄 데이터 출력 */}

                        <div className="comment-profile">
                            {/* 프로필사진 */}
                            <div className="inline-block">
                                <img
                                    className="profile"
                                    src= {comment.filename}
                                    alt="profile"
                                />
                            </div>

                            {/* 작성자아이디 */}
                            <div className="inline-block comment-id"  >
                                {itemId !== comment.id ? (
                                    <div>{comment.id}</div>
                                ) : (
                                    <div>
                                        {comment.id}
                                        <button className="writter-check-btn">
                                            작성자
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {/* 작성일 */}
                            <div className="inline-block comment-date" >
                                <div>{dayjs(comment.wdate).fromNow()}</div>
                            </div>
                        </div>

                        {/* 댓글내용 */}
                        <div className="store-comment-content comment-content">
                            {comment.content}
                        </div>

                        
                        
                        <div>
                            {comment.id === id && (
                                <div className="store-comment-button">
                                    {" "}
                                    {/* 코멘트 seq넣어주고 수정,삭제 */}
                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            updateCommentInput(
                                                comment.seq,
                                                comment.content
                                            )
                                        }
                                    >
                                        수정
                                    </button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            deleteCommentBtn(comment.seq)
                                        }
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* 댓글수정 input창 */}
                        <div>
                            {isEditing && editingCommentSeq === comment.seq && (
                                    <div className="update-padding">
                                        <input
                                            className="form-control store-comment-update"
                                            value={updateComment}
                                            onChange={(e) =>
                                                setUpdateComment(e.target.value)
                                            }
                                        />
                                        &nbsp;
                                        
                                            <button
                                                className="btn btn-primary store-comment-update-btn"
                                                onClick={() =>
                                                    updateCommentBtn(comment.seq)
                                                }
                                            >
                                                등록
                                            </button>
                                        
                                    </div>
                            )}                           
                        </div>
                        {/* 댓글수정 input창 끝*/}
                        
                        <hr />
                    </div>
                ))} {/* commentlist.map 끝 */}
            </div>
        );
    };
    {/* 댓글랜더링 끝 */}

    // 수정 input창 띄우기
    function updateCommentInput(seq, content) {
        setIsEditing(true); // isEditing 값을 true로 변경
        setEditingCommentSeq(seq); // 수정 대상 댓글의 seq를 저장
        setUpdateComment(content); // 수정 대상 댓글의 content를 저장
    }

    // 수정내용 서버로 보내기
    function updateCommentBtn(seq) {
        console.log(updateComment);

        // updateComment 빈문자 체크
        if (!updateComment || updateComment.trim() === "") {
            SweetAlert.fire("댓글 내용을 작성해주세요");
            return;
        }
        // updateComment 길이 체크
        if (updateComment.length > 100) {
            SweetAlert.fire("댓글은 100자 이내로 작성해주세요.");
            return;
        }

        // 수정 내용 서버에 보내기
        axios
            .put("http://localhost/storeComment", {
                seq: seq,
                content: updateComment,
            })
            .then(function (resp) {
                SweetAlert.fire("댓글이 수정되었습니다");
                window.location.reload(); // 페이지 리로드
                //setIsWriteComment(true);
            })
            .catch(function (err) {
                SweetAlert.fire(err);
                //setIsWriteComment(false);
            });
    }

    function deleteCommentBtn(seq) {

        SweetAlert.fire({
            title: '댓글을 삭제하시겠습니까?',
            text: "삭제하시면 다시 복구시킬 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
          }).then((result) => {
            if (result.value) {
                //"삭제" 버튼을 눌렀을 때 작업할 내용을 이곳에 넣어주면 된다. 

                axios
                .delete("http://localhost/storeComment", { params: { seq: seq } })
                .then(function (resp) {
    
                    
                    SweetAlert.fire("댓글이 삭제되었습니다");
                    window.location.reload(); // 페이지 리로드
                })
                .catch(function (err) {
                    SweetAlert.fire(err);
                    SweetAlert.fire("댓글이 삭제되지않았습니다");
                });
            }
          })

        // axios
        //     .delete("http://localhost/storeComment", { params: { seq: seq } })
        //     .then(function (resp) {

                
        //         SweetAlert.fire("삭제성공");
        //         window.location.reload(); // 페이지 리로드
        //     })
        //     .catch(function (err) {
        //         SweetAlert.fire(err);
        //         SweetAlert.fire("삭제문제");
        //     });
    }

    function handlePageChange(page) {
        setPage(page);
        getCommentList(seq, page - 1);
    }

    useEffect(() => {             
        getCommentList(seq);          
    }, [seq, isWriteComment]);

    // 주소공유 클립보드 복사
    const handleCopyClipBoard = async (url) => {
        try {
            await navigator.clipboard.writeText(url);

            SweetAlert.fire("클립보드에 링크가 복사되었습니다");
        } catch (error) {
            SweetAlert.fire("다시시도해주십시오");
        }
    };
    

    return (
        <div className="store-detail-page">
            <StoreNav/>

            {/* 중고거래 상세페이지 form 시작 */}
            <div className="store-detail">

                {/* 첫번째줄 */}
                <div className="store-detail-first">                    
                    {/* 대표이미지 */}
                    <div className="thumnail">
                        {/* item.newfilename이 true일 경우에만 이미지 렌더링. item.newfilename이 false나 undefined일 경우에는 이미지를 렌더링하지 않음  */}
                        {item.newfilename && (
                            <img
                                src={`http://localhost/image/${item.newfilename}`}
                                width="100%"
                                height="100%"
                                
                                alt="상품이미지"
                            />
                        )}
                    </div>                    
                    {/* 대표이미지 끝*/}

                    {/* 옆으로 붙이기  */}
                    {/* 설명요약*/}
                    <div className="detail">

                        {/* 제목 시작 */}
                        <div>                            
                            <div>
                                <h2>{item.title}</h2>
                            </div>                              
                        </div>
                        {/* 제목 끝 */}

                        {/* 작성일 시작 */}
                        <div >                            
                            <div>
                                <h4 className="inline-block">{dayjs(item.wdate).format("lll")}</h4>
                                <h4 className="inline-block">조회수 {item.readcount}</h4>
                            </div>                            
                        </div>
                        {/* 작성일 끝 */}

                        {/* 조회수시작 */}
                        {/* <div className="inline-block">
                            <div>
                                <h4>조회수 {item.readcount}</h4>
                            </div>                                                        
                        </div>                         */}
                        {/* 조회수끝 */}

                        {/* 작성자 시작 */}
                        <div>                            
                            <div style={{marginBottom:"10px"}}>
                                <img className="inline-block profile"                                    
                                    src= {item.profile}
                                    alt="profile"                                    
                                />
                                {item.id}
                            </div>                            
                        </div>
                        {/* 작성자 끝 */}

                        {/* 금액 시작 */}
                        <div style={{marginBottom:"10px"}}>
                            <div style={{fontWeight:"500" , marginLeft:"5px"}}>
                                <p>{item.price &&(
                                        <>{item.price.toLocaleString()}원</>
                                    )}
                                </p>
                            </div>                            
                        </div>
                        {/* 금액 끝 */}

                        {/* 상품상태 시작 */}
                        <div style={{color:"#4f6df4", marginLeft:"5px", fontWeight:"600"}}>                            
                            <div>
                                <p>{item.itemcondition === "old" ? "중고" : "새상품"}</p>
                            </div>                            
                        </div>
                        {/* 상품상태 끝 */}

                      

                        

                        {/* 좋아요시작 */}
                        <div>
                            <div className="inline-block">
                                <img
                                    src={like ? heart : emptyheart}
                                    alt="emptyheart.png"
                                    width="18px"
                                    height="18px"
                                    onClick={() => likeStore(item.seq)}
                                />&nbsp;
                                <span style={{textDecorationLine:"underline"}}>{item.likecount} </span>
                            </div>                                                     
                        </div>
                        {/* 좋아요 끝 */}

                        
                       
                        {/* 작성자 id, 로그인id 같을때만 변경할 수있음 */}
                        {item.id === id ? (
                            <select value={status} onChange={changeStatus} className="form-select" style={{width:"150px"}}>
                                <option value="sale">판매중</option>
                                <option value="notsale">판매완료</option>
                            </select>
                        ) : (
                            <p>
                                {item.status === "notsale" ? "판매완료" : "판매중"}
                            </p>
                        )}

                    </div>
                    {/* 설명끝 */}
                    
                    

                    </div>

                    {/* 두번째줄. 설명과, 지도 */}
                    <div className="store-detail-sec">
                        {/*리액트퀼내용 */}
                        
                            <div className="store-detail-sec-content"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                                style={{ whiteSpace: "pre-wrap" }}
                            ></div>                            
                        
                            {/* 카카오맵 주소위치불러오기 */}
                            <div className="store-map">
                                <div>
                                    - 거래지역
                                </div>

                                {/* 카카오맵 */}
                                <Kakaomap address={item.location}  />

                                {/* 거래지역 시작 */}
                                <div>                                    
                                    <div>
                                        <img src={Location} alt="location.png" width='20px' height='20px' />{item.location}
                                        {/* {item.location} */}
                                    </div>                           
                                </div>
                                {/* 거래지역 끝 */}
                            </div>

                    </div> {/* 두번째줄 끝 */}
                    
                    {/* 버튼 */}
                    <div className="store-writr-btn">
                        
                        {/* 로그인아이디 받아와서 작성자랑 같을때만 보이게 하기 */}
                        {item.id === id && (
                            <div className="inline-block">
                                <button className="btn btn-primary btn2"
                                    onClick={() =>
                                        history(`/storeupdate/${item.seq}`)
                                    }
                                >
                                    수정
                                </button>                                   
                                <button onClick={deleteItem} className="btn btn-secondary btn2">삭제</button>
                            </div>
                        )}

                        <button onClick={() => history("/storelist")} className="btn btn-primary">
                            글목록
                        </button>
                        <button onClick={() => handleCopyClipBoard(url)} className="btn btn-secondary btn2" style={{width:"auto"}}>
                            <i className="bi bi-link-45deg">링크복사</i>
                        </button>
                        
                    </div>
                    {/* 버튼 끝 */}

            </div>
            {/* 중고거래 상세페이지 form 끝 */}

            {/* 댓글부분시작 */}
            <div className="store-comment">

                <h3>댓글{totalCnt}</h3>
                                    
                {/* 댓글 input창 */}
                {id !== null && ( // 댓글작성 칸 로그인 했을때만 보이기
                <div className="store-comment" >
                    <div className="store-comment-button">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="댓글내용을 입력해주세요"
                            className="form-control"
                            
                        />
                    </div>
                    <div className="store-comment-button">
                        <button
                            onClick={storeCommentBtn}
                            className="btn btn-primary"
                        >
                            작성
                        </button>
                    </div>
                    
                </div>
                )}
                {/* 댓글작성칸 끝 */}

                {/* 댓글 랜더링 */}
                <div className="store-comment">
                    {renderComments()}
                </div>
                {/* 댓글 랜더링 끝 */}

                {/* 페이징 */}
                <div>
                    <Pagenation
                        activePage={page}
                        itemsCountPerPage={10}
                        totalItemsCount={totalCnt}
                        pageRangeDisplayed={5}
                        prevPageText={"‹"}                        
                        nextPageText={"›"}
                        onChange={handlePageChange}
                        
                    />
                </div>
                {/* 페이징 끝*/}

            </div>
            {/* 댓글부분 끝 */}


            {/* /////////////////////////////////////////////// 이전코드 */}
            {/* <h1>중고거래 글상세</h1>
            <hr />    
            <div className="store-detail">
                <div className="inline-block store-info-box">
                    {" "}
                    {/* item.newfilename이 true일 경우에만 이미지 렌더링. item.newfilename이 false나 undefined일 경우에는 이미지를 렌더링하지 않음  
                    {item.newfilename && (
                        <img
                            src={`http://localhost/image/${item.newfilename}`}
                            width="100%"
                            height="100%"
                        />
                    )} */}
                    {/* <img src={`http://localhost/image/${item.newfilename}`} width="300px" height="300px" /> */}
                {/* </div>
                <div className="inline-block store-info-box">
                    <p>작성자: {item.id}</p>
                    <p>글제목: {item.title}</p> */}
                    {/* 랜더링이 잘안되는 경우가 있어서 null일땐 랜더링 안되게 막아줌 */}
                    {/* <p>
                        금액:{" "}
                        {item.price
                            ? item.price.toLocaleString() + "원"
                            : "0원"}
                    </p>
                    <p>
                        상품상태: {item.condition === "old" ? "중고" : "새상품"}
                    </p> */}
                    {/* <p>상품상태:{item.itemcondition}</p> */}
                    {/* <p>거래지역: {item.location}</p> */}
                    {/* <p>작성일:{moment(item.wdate).format('llll')}</p> */}
                    {/* moment.js -> day.js로 바꿈 */}
                    {/* <p>작성일: {dayjs(item.wdate).format("lll")}</p> */}
                    {/* <p>거래지역: {item.location}</p><br/> */}
                    {/* <span>
                        <img
                            src={like ? heart : emptyheart}
                            alt="emptyheart.png"
                            width="20px"
                            height="20px"
                            onClick={() => likeStore(item.seq)}
                        />
                    </span>
                    <span>좋아요수:{item.likecount}</span>
                    조회수:{item.readcount}
                    <br />
                    {/* 작성자 id, 로그인id 같을때만 변경할 수있음
                    {item.id === id ? (
                        <select value={status} onChange={changeStatus}>
                            <option value="sale">판매중</option>
                            <option value="notsale">판매완료</option>
                        </select>
                    ) : (
                        <p>
                            {item.status === "notsale" ? "판매완료" : "판매중"}
                        </p>
                    )}
                </div> */}
                {/*                     
                    <select value={status} onChange={changeStatus}>                        
                        <option value="sale">판매중</option>
                        <option value="notsale">판매완료</option>
                    </select>
                    내가쓴글일때 판매완료 선택하기 */}

                {/* 카카오맵 주소위치불러오기 */}
                {/* <div className="inline-block store-info-box">
                    <Kakaomap address={item.location} />
                </div>

                <br />
                <br />
                {/*리액트퀼내용 
                <div className="quill-container">
                    <div
                        dangerouslySetInnerHTML={{ __html: item.content }}
                        style={{ whiteSpace: "pre-wrap" }}
                    ></div>
                </div> */}

                {/* 
            <div style={{maxWidth:'800px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', overflow: 'auto' }}>
                <div> 사이즈 컨텐츠칸 안으로 안들어가는거 수정하기
                    <pre dangerouslySetInnerHTML={{ __html: item.content}} />  html 읽을 수 있게 해주기 
                </div>
            </div>
             */}
{/* 
                <br />
                <br />
                <div className="store-detail-udl ">
                    <div className="inline-block">
                        {/* 로그인아이디 받아와서 작성자랑 같을때만 보이게 하기
                        {item.id === id && (
                            <div>
                                <button
                                    
                                    onClick={() =>
                                        history(`/storeupdate/${item.seq}`)
                                    }
                                >
                                    수정
                                </button>
                                &nbsp;&nbsp;
                                <button onClick={deleteItem}>삭제</button>
                            </div>
                        )}
                    </div>
                    <div className="inline-block">
                        <button onClick={() => history("/storelist")}>
                            글목록
                        </button>
                        <button onClick={() => handleCopyClipBoard(url)}>
                            <i className="bi bi-link-45deg"></i>
                        </button>
                        클립보드
                    </div>
                </div>
            </div> */}
            {/* 디테일내용 끝 */}

            
            {/* 댓글 시작 */}
            {/* <h3>Comments</h3>
            <br />
            {id !== null && ( // 댓글작성 칸 로그인 했을때만 보이기
                <div className="form-outline mb-4">
                    <div className="inline-block comment-input">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="댓글내용을 입력해주세요"
                            className="form-control"
                            style={{ height: "50px" }}
                        />
                    </div>
                    <div className="inline-block">
                        <button
                            onClick={storeCommentBtn}
                            className="btn btn-primary"
                        >
                            작성
                        </button>
                    </div>
                    <br />
                    <br />
                </div>
            )} */}

            {/* <input type='text' onChange={(e)=>setComment(e.target.value)} placeholder="댓글내용을 입력해주세요"/>
            <button onClick={storeCommentBtn}>작성</button><br/><br/> */}

            {/* <div className="comment-container">
                <div>
                    <table> */}
                        {/* 
                        <colgroup>
                            <col width='500px'/><col width='200'/><col width='300px'/><col width='200px'/>
                        </colgroup>
                         */}

                        {/* <tbody>{renderComments()}</tbody>
                    </table>
                </div>

                <div>
                    <Pagenation
                        activePage={page}
                        itemsCountPerPage={10}
                        totalItemsCount={totalCnt}
                        pageRangeDisplayed={5}
                        prevPageText={"‹"}                        
                        nextPageText={"›"}
                        onChange={handlePageChange}
                        
                    />
                </div>
            </div> */}
        </div>
    );
}

export default StoreDetail;
