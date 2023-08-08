import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// 좋아요하트
import heart from '../../assets/store/heart.png';
import emptyheart from '../../assets/store/emptyheart.png';
import './css/lecturelist.css'; 
import './css/lecturedetail.css';

// 알람
import SweetAlert from "sweetalert2";

// day.js
import dayjs from "dayjs"; // day.js
//import isLeapYear from 'dayjs/plugin/isLeapYear'; // 윤년 판단 플러그인
import "dayjs/locale/ko"; // 한국어 가져오기
import Star from "./star";
import CheckStar from "./starcheck";
import LectureDetailNavi from "./lecturedetailNavi";

// 댓글 페이징
import Pagenation from "react-js-pagination";
import "../store/css/storepage.css";


function LectureDetail(){

    // day.js 설정
    // dayjs.extend(isLeapYear); // 플러그인 등록
    dayjs.locale("ko"); // 한국어
    var relativeTime = require("dayjs/plugin/relativeTime"); // 현재시간으로 부터 가져올때 해줘야함
    dayjs.extend(relativeTime);

    // format 플러그인에서 받아오기
    var localizedFormat = require("dayjs/plugin/localizedFormat");
    dayjs.extend(localizedFormat);

    let params = useParams();
    let seq = params.seq;
    // console.log(seq);

    // 로그인 정보
    let id = window.localStorage.getItem("userId");
    console.log(id);

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));     
    console.log(login); 

    // 주소값
    const location = useLocation();
    console.log(location);
    // let url = "http://localhost:3000" + location.pathname;   

    const baseUrl = window.location.host;
    console.log(baseUrl);
    let url = baseUrl + location.pathname;



    let history = useNavigate();

    const [lecture, setLecture] = useState('');

    const [like, setLike] = useState(false);       // 좋아요 상태저장
    const [isPaid, setIspaid] = useState(false);       // 수강신청 상태저장

    const [isCountOrder, setIsCountOrder] = useState(false);    // 수강신청인원 상태저장
    const [orderCount, setOrderCount] = useState();         // 수강신청수

    const [comment, setComment] = useState("");
    console.log(comment);

    const [commentList, setCommentList] = useState([]);
    const [commentCnt, setCommentCnt] = useState(0);
    const [page, setPage] = useState(1);

    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentSeq, setEditingCommentSeq] = useState(null);
    const [updateComment, setUpdateComment] = useState("");

    // 별점
    const [selectedStar, setSelectedStar] = useState(0);
  


     // 강의 상세 받아오기
    const lectureData = async (seq) =>{

        if(login === null){
            SweetAlert.fire("로그인 후 이용해주세요");
            history("/login");
        }

        await axios.get('http://localhost/lecture/detail', { params:{ "seq":seq}})
            .then(function(resp){
                console.log(resp.data); 
                setLecture(resp.data);     // 데이터  넣어주기               
                
            })
            .catch(function(err){
                console.log(err);
            })
    }
    useEffect(()=>{         // initialize 용도
        lectureData(seq);  
        checkLike(seq);   
        checkLectureRegi();   
        checkOrderCount();   
        getCommentList(seq);
    }, [seq, like]);

    function deleteLectureBtn(){        

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
                 // 서버연결
            axios.delete('http://localhost/lecture',{params:{"seq":seq}})
            .then(function(resp){
                if(resp.status === 200){
                    SweetAlert.fire("강의글이 삭제되었습니다");
                    history('/lecturelist');
                }
                
            })
            .catch(function(err){
                SweetAlert.fire(err);
            })

            }
          })

       
    }

    // 결제한 상태면 수강신청하기버튼 안보이게
    function checkLectureRegi(){

        // 확인 paid중일때는 regi === true
        axios.get('http://localhost/lecture/order', {params:{id:id, seq:seq}})
        .then(function(resp){
            console.log(resp.data);
            if(resp.data === "PAID"){
                setIspaid(true);          // false 이면 수강신청하기 안보이게 
                return;
            }
            setIspaid(false);             // 결제 안한상품

        })
        .catch(function(err){       
            SweetAlert.fire(err);
        })
    }
    
    function checkOrderCount(){

        // seq넣어주고 paid인 수 체크
        axios.get('http://localhost/lecture/ordercount', {params:{seq:seq}})
        .then(function(resp){
            console.log(resp.data);
            setOrderCount(resp.data);
            //setIsCountOrder(true);   상태저장 필요없음
        })
        .catch(function(err){
           // setIsCountOrder(false); 상태저장 필요없음
        })
    }
    

    // 좋아요중인지 체크
    function checkLike(seq){

        // id랑 글넘버 넘겨주고 좋아요중인지 확인
        axios.get('http://localhost/lecture/checkLike', {params:{id:id, seq:seq}})      
        .then(function(resp){
            console.log(resp.data);
            if(resp.data === "LIKING"){
                // 빨강하트 셋팅
                setLike(true);
            }
            else{
                // 빈하트로 세팅
                setLike(false);  // false
            }
        })
        .catch(function(err){
            SweetAlert.fire(err);
        })
    }

   
    // 좋아요
    function likeLecture(seq){

        if(id === null){
            SweetAlert.fire("로그인해주십시오");
            return;
        }

        // 로그인에서 id 가져오기
        // item.seq 값 가져오기
        axios.post("http://localhost/lecture/like", {"id":id, "seq":seq})
        .then(function(resp){
            console.log(resp.data);
            if(resp.data === "LIKE_OK"){
                SweetAlert.fire("관심강의로 등록되었습니다");
                // 하트 색넣어주기
                setLike(!like);
                //window.location.reload(); // 페이지 리로드
                
            }
            else if(resp.data === "CANCLE_LIKE"){
                SweetAlert.fire("관심강의에서 삭제되었습니다");
                // 하트 색 빼주기
                setLike(!like);
                // 해당 아이템의 좋아요 상태를 변경
                //window.location.reload(); // 페이지 리로드
            }
        })
        .catch(function(err){
            SweetAlert.fire(err);
        })

    }
    
    function lectureRegiBtn(){
        if(id === null){
            SweetAlert.fire("로그인해주십시오");
            return;
        }

        history(`/lectureregi/${seq}`);
    }

    
    function writeCommentBtn(){
        // alert("댓글작성");
        console.log(id);
        
        if(id === null){
            alert("로그인해주세요")
            return;
        }

        if(selectedStar === 0){
            alert("별점을 선택해주세요");
            return;
        }

        if(comment.trim() === ""){
            alert("수강평 내용을 작성해주세요");
            return;
        }

        // id, lectureseq, content(comment) 서버에 보내기
        axios.post("http://localhost/lecture/comment", {id:id, lectureseq:seq, content:comment, starrate:selectedStar})
        .then(function(resp){
            console.log(resp);
            if(resp.status === 200){                
                SweetAlert.fire("수강평이 작성되었습니다");
                // 성공후 리로드
                window.location.reload(); // 페이지 리로드
                

            }
            
        })
        .catch(function(err){
            alert(err);
            SweetAlert.fire("수강평이 작성되지않았습니다");
        })
    }


     // 댓글 불러오기 pageNumber 같이 넘겨주기
     function getCommentList(seq, page) {
        // seq 값 주고 comment 불러오기

        console.log(seq);
        axios.get("http://localhost/lecture/comment", {params: {"lectureseq": seq, "pageNumber": page},
            })
            .then(function(resp){
                console.log(resp.data);
                if(resp.status === 200){
                // 댓글불러오기 성공     starrate가 안날아옴
                setCommentList(resp.data.commentlist);
                setCommentCnt(resp.data.cnt);                             
                console.log(resp.data);   
                }               
            })
            .catch(function (err) {
                alert("댓글" + err);
                console.log(err);
            });
    }


     // 댓글 랜더링 테이블로 바꿔주기
     const renderComments = () => {
        // 댓글이 없는 경우
        if (!commentList || commentList.length === 0) {
            return <div>
                        <p className="lecture-review-form-text">등록된 수강평이 없습니다 <br/>
                        수강평을 남겨주세요!</p>
                    </div>;
        }

        return (
            <div>
                {commentList.map((comment, i) => (
                    <div key={i} >
                        {/* 화면에 뿌려줄 데이터 출력 */}

                        <div >
                            <div className="comment-profile">
                                
                                    <img
                                        className="profile-review"
                                        src= {comment.filename}
                                        alt="logo"
                                    />
                                
                                <div>
                                    <span>{comment.id}</span>
                                
                                    {/* 몇점줫는지 별그림가져오기 */}
                                    <CheckStar rating={comment.starrate} />
                                </div>
                                
                            </div>
                            {/* 수정삭제버튼 댓글작성자 === 로그인 id */}
                            
                                             
                        </div>


                        {/* 댓글내용 */}
                        <div style={{textAlign:"left"}} className="comment-content">
                            {comment.content}
                        </div>

                        {/* 작성일 */}
                        <div className="commentDate">                            
                            {dayjs(comment.wdate).format("lll")}
                        </div>

                        <div>
                            {comment.id === id && (
                                <div>
                                {/* 코멘트 seq넣어주고 수정,삭제 */}
                                <button className="btn btn-primary"
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
                                {/* <button className="delbutton">*/}
                                    삭제 
                                </button>
                                </div>
                            )}
                        </div>

                        

                        {/* 댓글수정form 띄우기 */}
                        {isEditing && editingCommentSeq === comment.seq && (
                            <div>
                                    <textarea
                                        value={updateComment}
                                        onChange={(e) =>
                                            setUpdateComment(e.target.value)
                                        }
                                        className="form-control"
                                    />
                              
                                    <button className="btn btn-primary"
                                        onClick={() =>
                                            updateCommentBtn(comment.seq)
                                        }
                                    >
                                        등록
                                    </button>
                            </div>
                        )}
                        <hr />
                    </div>
                ))}
            </div>
        );
    };
// 수정 input창 띄우기
function updateCommentInput(seq, content) {
    setIsEditing(true); // isEditing 값을 true로 변경
    setEditingCommentSeq(seq); // 수정 대상 댓글의 seq를 저장
    setUpdateComment(content); // 수정 대상 댓글의 content를 저장
}

console.log(updateComment);

// 수정내용 서버로 보내기
function updateCommentBtn(seq) {
    
    // 유효성검증


    // 서버연결
    axios.put("http://localhost/lecture/comment",{seq:seq, content:updateComment})
    .then(function(resp){
        
        if(resp.status === 200){
            SweetAlert.fire("수강평이 수정되었습니다");
            window.location.reload(); // 페이지 리로드
        }
    })
    .catch(function(err){
        alert(err);
    })

}

function deleteCommentBtn(seq){    
    
    // 삭제할건지 확인창 띄워주기
    // if (window.confirm("정말 삭제하시겠습니까?")) {
    // } else {
    //     SweetAlert.fire("취소합니다.");
    //     return;
    // }

    SweetAlert.fire({
        title: '수강평을 삭제하시겠습니까?',
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
            // 서버연결
            axios.delete("http://localhost/lecture/comment", { params: { seq: seq } })
            .then(function(resp){
                
                if(resp.status === 200){
                    SweetAlert.fire("수강평이 삭제되었습니다");
                    window.location.reload(); // 페이지 리로드
                }else{
                    SweetAlert.fire("수강평 삭제에 실패했습니다");                    
                }

            })
            .catch(function(err){
                console.log(err);
            })
        }
      })


    

}

    // 별점 몇점인지 넣어주기 별점몇인지도 같이 서버에 보내주기 db수정
    const handleStarSelect = (star) => {
        setSelectedStar(star);
    };
    
    console.log(selectedStar);

    // page번호 바꿔주기
    function handlePageChange(page) {
        setPage(page);
        getCommentList(seq, page - 1);
    }

    // 주소공유 클립보드 복사
    const handleCopyClipBoard = async (url) => {
        try {
            await navigator.clipboard.writeText(url);

            SweetAlert.fire("클립보드에 링크가 복사되었습니다");
        } catch (error) {
            SweetAlert.fire("다시시도해주십시오");
        }
    };

    return(
        <div className="lecture-detail-page">
            {/* <h2>강의상세</h2> */}

            {/* 강의설명페이지 시작 */}
            <div className="lecture-detail">

            {/* 대표이미지, 제목부분 */}
            <div className="lecture-title">
                <div className="lecture-title-img">
                    {lecture.newfilename &&
                        <img src={`http://localhost/lecture/image/${lecture.newfilename}`} className='lecture-detail-img' />
                    }
                </div>
                <div className="lecture-title-detail">
                    <h2>{lecture.title}</h2>
                    {lecture.price &&
                        <h4>{lecture.price.toLocaleString()}원</h4>
                    }
                    <p>#{lecture.category}</p>
                    
                    <div className="inline-block">
                        <img src={like? heart : emptyheart}  alt='emptyheart.png' width='20px' height='20px' onClick={() => likeLecture(seq)}/>&nbsp;
                        <span style={{textDecorationLine:"underline"}}>{lecture.likecount} </span>
                        {/* <span>{orderCount}명의 수강생</span> */}
                    </div>
                    <div>강의기간 {lecture.startDate}~{lecture.endDate}</div> 

                    {/* <div>
                        좋아요수:{lecture.likecount}  
                    </div>  */}
                    {/* 
                    <div className="inline-block">
                        {isCountOrder ? <span>{orderCount}명의 수강생</span>  : null} 
                        <p>{orderCount}명의 수강생</p>
                    </div>
                    <div>
                        {isPaid ? <input type="button" value="수강정보확인하기" onClick={()=>history(`/lectureregiAf/${seq}`)}/> : (
                        <input type="button" value="수강신청하기" onClick={lectureRegiBtn} />
                    )}
                    </div> 
                     */}
                </div>
            </div>
            {/* 대표이미지, 제목부분 끝 */} 

            {/* 글내용부분 사이즈 짤리는거 수정완료*/}
            <div className="lecture-content-2line">
                <div dangerouslySetInnerHTML={{ __html: lecture.content}} className='lecture-content' />
                <div className='lecture-nav' >
                    <LectureDetailNavi isPaid = {isPaid} seq={seq} price={lecture.price}
                                         orderCount={orderCount} commentCnt={commentCnt}/>
                </div>
            </div>
            {/* 글내용부분 끝*/}
            
            {/* 버튼 */}
            <div className="store-writr-btn">
                {/* login정보가 있고 login.auth 가 관리자일때(auth === 0) 보이기 */}               
                
                {login && login.auth === 0 &&(
                    <div className="inline-block">
                        <button onClick={()=>history(`/lectureupdate/${seq}`)} className="btn btn-primary btn2">수정</button>   {/* 글 seq 가지고 이동 */}
                        <button onClick={deleteLectureBtn} className="btn btn-secondary btn2">삭제</button>
                    </div>
                )}

                <button onClick={()=>history('/lecturelist')} className="btn btn-primary">글목록</button>
                <button onClick={() => handleCopyClipBoard(url)} className="btn btn-secondary btn2" style={{width:"auto"}}>
                    <i className="bi bi-link-45deg">링크복사</i>
                </button>
            </div>
        </div> {/* 강의상세설명끝 */}

        {/* 댓글 시작 */}
        <div className="lecture-comment">
            {/* <h3>수강평 총{commentCnt}개</h3> */}
            {commentCnt > 0 ?(
                        <h3>수강평 총{commentCnt}개</h3>
                    ):(
                        <h3>수강평 총0개</h3>
                    )}
            <hr/>
                
            {/* 댓글 부분시작 */}
            <div className="lecture-review-form">
                <h5>수강생분들이 직접 작성하신 수강평입니다.</h5>
                <h6>*수강신청하신 회원분만 수강평을 남길 수 있습니다.</h6>
                <br/><br/>

                {/* 수강신청한 사람만 수강평쓸수있게 바꾸기 */}
                {isPaid &&(
                    <div className="review-form-textarea">
                        <Star onStarSelect={handleStarSelect}  />
                        <textarea className="form-control" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="수강평을 남겨주세요" />
                        <button onClick={writeCommentBtn} className="btn btn-primary">작성</button>
                    </div> 
                )}

                {/* 이건 누구나 볼수있는거. 추후 삭제 */}    
{/*                               
                <div>
                    <Star onStarSelect={handleStarSelect}  />
                    <textarea className="form-control" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="수강평을 남겨주세요" />
                    <button onClick={writeCommentBtn}>작성</button>
                </div>  */}

                {/* 댓글 랜더링 */}
                <div>
                    {renderComments()}                        
                </div>

                <div>
                    <Pagenation
                        activePage={page}
                        itemsCountPerPage={10}
                        totalItemsCount={commentCnt}
                        pageRangeDisplayed={5}
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        onChange={handlePageChange}
                    />
                </div>

            </div>
        </div>

            {/* 댓글끝 */}



            {/* ///////////////////////////////////////////////////이전코트 */}
                
            {/* <table>
                <colgroup>
                    <col width='400px'/><col width='400px'/>
                </colgroup>
                <tbody>
                    <tr>
                        <td> */}
                            {/* item.newfilename이 true일 경우에만 이미지 렌더링. item.newfilename이 false나 undefined일 경우에는 이미지를 렌더링하지 않음  */}
                            {/* {lecture.newfilename &&
                                <img src={`http://localhost/lecture/image/${lecture.newfilename}`} className='lecture-detail-img' />
                            }
                        </td>         */}

                        {/* <td className="lecture-textbox">
                            <h2>{lecture.title}</h2>

                            {lecture.price &&
                                <p>￦{lecture.price.toLocaleString()}</p>
                            }
                            
                            <p>#{lecture.category}</p>
                            <div>
                                <span>
                                    <img src={like? heart : emptyheart}  alt='emptyheart.png' width='20px' height='20px' onClick={() => likeLecture(seq)}/>
                                </span>
                                <span>좋아요수:{lecture.likecount}</span><br/>                                 */}
                                {/* {isCountOrder ? <span>{orderCount}명의 수강생</span>  : null} */}
                                {/* {orderCount}명의 수강생
                            </div>
                            {isPaid ? <input type="button" value="수강정보확인하기" onClick={()=>history(`/lectureregiAf/${seq}`)}/> : (
                                <input type="button" value="수강신청하기" onClick={lectureRegiBtn} />
                            )} */}
                            {/* <input type='button' value='수강신청하기' onClick={lectureRegiBtn}/> */}
                        {/* </td>
                        
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <pre dangerouslySetInnerHTML={{ __html: lecture.content}}  className='lecture-content' />
                        </td>
                    </tr>
                </tbody>
            </table> */}

            {/* 로그인id와 작성자 id가 맞을때(관리자만) 보이기 */}
            {/* <button onClick={()=>history(`/lectureupdate/${seq}`)}>수정</button>    글 seq 가지고 이동 *
            <button onClick={deleteLectureBtn}>삭제</button>
            <button onClick={()=>history('/lecturelist')}>글목록</button> */}
            

            

        </div>
    )
}

export default LectureDetail;