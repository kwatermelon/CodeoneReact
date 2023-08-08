import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

// 알람
import SweetAlert from "sweetalert2";

import "./css/lectureregi.css";

function LectureRegi(){

    // 이동
    let history = useNavigate();

    // 아임포트 결제api키
    const IMP = window.IMP;
    IMP.init("imp82538408");    

    // 강의 seq
    let param = useParams();
    let seq = param.seq;
    console.log(seq);

    // 로그인정보 가져오기
    let id = window.localStorage.getItem("userId");
    console.log(id);
    let email = window.localStorage.getItem("userEmail");
    let phoneNumber = window.localStorage.getItem("phoneNumber");
    let name = window.localStorage.getItem("userName");

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));     
    console.log(login); 

    const [lecture, setLecture] = useState('');

    const [ordernum, setOrdernum] = useState('');
    const [orderdate, setOrderDate] = useState('');
    const [orderstatus, setOrderStatus] = useState('');

    const [isChecked, setIsChecked] = useState(false);
    console.log(isChecked);

    // 강의 seq 넣어주고 정보 불러오기     
    const lectureData = async (seq) =>{
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
    }, [seq]);

    // console.log(ordernum);
    // console.log(orderdate);
    // console.log(orderstatus);

    // 아임포트 결제창
    const requestPay = (e) => {
        // SweetAlert.fire("결제");

        e.preventDefault();
        if (!isChecked) {
        alert("이용약관에 동의해주세요");
        return;
        }

        IMP.request_pay({
            pg: "html5_inicis",      // kg이니시스
            pay_method: "card",
            merchant_uid: 'test' + new Date().getTime(),        // 주문번호 생성
            name: lecture.title,        // 결제상품 이름
            amount: lecture.price,      // 결제상품 가격
            buyer_email: email,         // 구매자 이메일
            buyer_name: name,           // 구매자 이름
            buyer_tel: phoneNumber,     // 구매자 전화번호
            // buyer_addr: null,           // 구매자 주소
            // buyer_postcode: null        // 구매자 우편번호
        }, rsp => {
            if (rsp.success) {          // 결제성공
                // SweetAlert.fire("성공");
                console.log(rsp);       // 결제 후 결제정보 응답받음
                //console.log(rsp.merchant_uid);
                
                // setOrdernum(rsp.merchant_uid);
                // setOrderDate(rsp.paid_at);
                // setOrderStatus(rsp.status);

                // 결제 검증
                axios.post('http://localhost/verifyIamport/'+ rsp.imp_uid)
                .then(function(resp){
                    console.log(resp.data);

                     // 결제금액과 응답받은 금액이 같을때
                    if(rsp.paid_amount === resp.data.response.amount){      
                        SweetAlert.fire("결제가 완료되었습니다.");

                        // 결제성공 후 값 전달받아서 서버에 넘겨주기
                        const params = {
                            id: id,
                            seq: seq,
                            ordernum: rsp.merchant_uid,
                            orderdate: rsp.paid_at,
                            orderstatus: rsp.status,
                        };
                        console.log(params);
                        axios.post('http://localhost/lecture/order', params)
                        .then(resp => {
                        console.log(resp.data);
                        // SweetAlert.fire("성공적으로 결제가 되었습니다")
                        history(`/lectureregiAf/${seq}`);
                        })
                        .catch(err => {
                        console.log(err);
                        });              

                    } else {
                        SweetAlert.fire("결제가 되지않았습니다");
                        console.log(rsp);
                                
                        }
            })

            .catch(function(err){
                SweetAlert.fire("결제에 실패했습니다."+"에러코드 : "+err.error_code+"에러 메시지 : "+err.error_message);
            })

            //     // 결제성공 후 값 전달받아서 서버에 넘겨주기
            //     const params = {
            //         id: id,
            //         seq: seq,
            //         ordernum: rsp.merchant_uid,
            //         orderdate: rsp.paid_at,
            //         orderstatus: rsp.status,
            //       };
            //       axios.post('http://localhost/lecture/order', params)
            //         .then(resp => {
            //           console.log(resp.data);
            //           SweetAlert.fire("성공적으로 결제가 되었습니다")
            //           history(`/lectureregiAf/${seq}`);
            //         })
            //         .catch(err => {
            //           SweetAlert.fire(err);
            //         });              

            // } else {
            //     SweetAlert.fire("결제가 되지않았습니다");
            //     console.log(rsp);
            }
        });
    }

    return(
        <div className="lectureregi-page">

            <h1>수강신청</h1>
            {/* 수강신청 form 시작 */}
            <div className="lectureregi-form">
                

                {/* 강의 대표이미지 */}
                <div>
                    <img src={`http://localhost/lecture/image/${lecture.newfilename}`} className='lecture-detail-img' />   
                </div>
                {/* 강의 대표이미지 끝 */}
                
                {/* 강의제목 */}
                <div>
                    <h2>{lecture.title}</h2>
                </div>
                {/* 강의제목 끝*/}

                {/* 강의기간 */}
                {lecture.startDate && lecture.endDate &&(
                    <div>
                        <h3>{lecture.startDate} ~ {lecture.endDate}</h3>
                    </div>
                )}
                
                {/* 강의기간 끝 */}
                {/* 회원정보 시작 */}
                <div>
                    <h3>회원정보</h3>
                    <div>
                        <div className="write-form-line">
                            <div className="store-write-form-label">
                                아이디
                            </div>
                            <div className="store-write-form-detail">
                                <p>{login.id}</p>
                            </div>
                        </div>

                        <div className="write-form-line">
                            <div className="store-write-form-label">
                                이름
                            </div>
                            <div className="store-write-form-detail">
                                <p>{login.name}</p>
                            </div>
                        </div>

                        <div className="write-form-line">
                            <div className="store-write-form-label">
                                이메일
                            </div>
                            <div className="store-write-form-detail">                        
                                <p>{login.email}</p>
                            </div>
                        </div>
                        <div className="write-form-line">
                            <div className="store-write-form-label">
                                전화번호
                            </div>
                            <div className="store-write-form-detail">
                                <p>{login.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 회원정보 끝*/}

                {/* 결제금액 */}
                <div className="regi-price">
                    {lecture.price &&
                        <p>총 결제금액: {lecture.price.toLocaleString()}원</p>
                    }                    
                </div>

                
                {/* 결제금액 끝*/}

                {/* 이용약관동의 */}
                <div className="regi-agree">
                    <input type='checkbox' checked={isChecked} onChange={(e)=> setIsChecked(e.target.checked)}
                        className="form-check-input"/>&nbsp;<span>이용약관동의</span>
                </div>
                {/* 이용약관동의 끝*/}

                {/* 신청버튼 */}
                <div className="store-writr-btn">
                    <button onClick={requestPay} className="btn btn-primary btn1">결제하기</button>
                    <button onClick={()=>history(`/lecturedetail/${seq}`)} className="btn btn-secondary btn2">신청취소</button>
                </div>
                {/* 신청버튼 끝*/}

            </div>
            {/* 수강신청 form 끝 */}

            
        </div>
    )
}

export default LectureRegi;