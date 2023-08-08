import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import './css/lectureregiAf.css'; 
// 알람
import SweetAlert from "sweetalert2";

function LectureRegiAf(){

    // 로그인 정보
    let id = window.localStorage.getItem("userId");
    console.log(id);

    // 강의 seq
    let param = useParams();
    let seq = param.seq;
    console.log(seq);

    let history = useNavigate();

    const [lecture, setLecture] = useState({});

    // id seq status == paid 일때만 정보가져오기

    // 강의 상세 받아오기
    const lectureData = async (id, seq) =>{
        await axios.get('http://localhost/lecture/paidLecture',  { params:{ "id": id, "seq":seq}})
            .then(function(resp){
                console.log(resp.data);    
                if(resp.status === 204){
                    SweetAlert.fire("데이터가 없습니다");
                    return;
                }
                setLecture(resp.data);     // 데이터  넣어주기                
                
            })
            .catch(function(err){
                console.log(err);
                SweetAlert.fire("잘못된 접근입니다");
            })
    }
    useEffect(()=>{         // initialize 용도
        lectureData(id,seq);        
    }, [id, seq]);

    return(
        <div className="lectureregi-page">

            {/* 강의정보 form 시작 */}    
            <div className="lectureregi-form">
                <h2>강의결제가 완료되었습니다!</h2>
                <h4>아래 정보를 확인해주세요.</h4>
                {/* 강의이미지 */}
                <div>
                    {/* item.newfilename이 true일 경우에만 이미지 렌더링. item.newfilename이 false나 undefined일 경우에는 이미지를 렌더링하지 않음  */}
                    {lecture.newfilename &&
                        <img src={`http://localhost/lecture/image/${lecture.newfilename}`} className='lecture-detail-img' />
                        }
                </div>
                {/* 강의이미지 끝*/}

                {/* 강의제목 */}
                 <div>
                    <h2>{lecture.title}</h2>
                </div>
                {/* 강의제목 끝*/}

                {/* 결제금액 */}    
                <div className="write-form-line">
                    <div className="store-write-form-label">
                        총 결제금액
                    </div>
                    <div className="store-write-form-detail">
                        {lecture.price &&
                            <p>{lecture.price.toLocaleString()}원</p>
                        }
                    </div>
                </div>
                {/* 결제금액 끝*/}  

                {/* 강의정보 */}
                <div className="write-form-line">
                    <div className="store-write-form-label">
                        강의기간
                    </div>
                    <div className="store-write-form-detail">
                        <p>{lecture.startDate} ~ {lecture.endDate}</p>
                    </div>
                </div>   

                <div className="write-form-line">
                    <div className="store-write-form-label">
                        ZOOM URL
                    </div>
                    <div className="store-write-form-detail">
                        <p>{lecture.zoomurl}</p>
                    </div>
                </div>
                
                
                <div className="write-form-line">
                    <div className="store-write-form-label">
                        ZOOM PASSWORD
                    </div>
                    <div className="store-write-form-detail">
                        <p>{lecture.zoompwd}</p>
                    </div>
                </div>      

                          
                {/* 강의정보 끝 */}

                {/* 버튼 */}
                <div className="store-writr-btn">
                    <button onClick={()=>history("/lecturelist")} className="btn btn-primary">강의목록</button>
                </div>
                {/*버튼끝 */}

            </div>

            
            
            
        </div>
    )
}

export default LectureRegiAf;