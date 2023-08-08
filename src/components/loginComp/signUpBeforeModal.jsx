import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../loading/loading";

function SignUpBefore(){
    const config = {"Content-Type": 'application/json'};
    const BASE_USER_URL  = "http://localhost/user";
    const [email, setEmail] = useState('');
    const [checkedEmail, setCheckedEmail] = useState('');
    const [emailAvailable, setEmailAvailable] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [isIdDuplicated, setIsIdDuplicated] = useState(false); // 아이디 중복검사 여부
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const inputEmailRef = useRef(null);

    // 주소 파라미터에서 메일키, 메일정보 받아오기  
    const location = useLocation();

    const checkEmail = () => {
        const searchParams = new URLSearchParams(location.search);
        // if(searchParams.get("email") !== undefined && searchParams.get("emailKey") !== undefined) {
        //     setEmail(searchParams.get("email"));
        //     emailKey =  searchParams.get("emailKey");
        //     console.log(email);
        //     console.log(emailKey);
        // }
        if(searchParams.get("email") !== undefined) {
            setEmail(searchParams.get("email"));
        }
    }

 
   
    // 링크이동
    const history = useNavigate();    

    function goLogin(){
        history("/login");
    }
   



    function sendEmailBtn(){
        if(!emailAvailable) {
            alert("이미 가입된 이메일입니다. 다른 메일주소를 입력해 주세요.")
            inputEmailRef.current.focus();
            return;
        }
        // 파라미터 정보, 회원가입정보 파라미터로 보내주기
        let params = {email:email}
        setLoading(true);
        axios.post(`${BASE_USER_URL}/sendSignUpEmail`,{
            withCredentials: true
        },{params})
        .then(function(resp){
            // 이메일 중복
            if(resp.status === 204){
                alert("이미 가입된 이메일입니다");
                setLoading(false);
                return;
            }
            
            // 중복된 이메일이 없을 경우 가입
            if(resp.status === 200){
                window.location.href = "/signUpAf";
                setLoading(false);
            }else{
                alert("이메일 전송에 실패했습니다. 관리자에 문의 주시기 바랍니다.");
                setLoading(false);
                return;
            }
        })
        .catch(function(err){
            alert(err);
            setLoading(false);
        })
    }
    


    // Email중복 체크

    function checkingEmail(email) {
        if (!emailRegex.test(email)) { // 이메일 형식 체크
            setCheckedEmail("유효한 이메일 주소를 입력해주세요.");
            return;
		}

        axios.get(`${BASE_USER_URL}/checkingEmail?email=${email}`  )
            .then((res)=> {
                if(res.status === 204) {
                    setCheckedEmail("이미 가입된 이메일 주소입니다.");
                    setEmailAvailable(false);
                    inputEmailRef.current.focus();
                }else {
                    setCheckedEmail("가입 가능한 이메일 주소입니다.");
                    setEmailAvailable(true)
                }
            })
    }


    return(
        <div>
            {loading ? <Loading mailFlag={sendEmail} /> : 
            <>
                <h2>회원가입용 이메일 등록</h2>
                <p>회원가입을 위한 이메일을 입력 해주세요</p>
                <p>등록한 이메일로 확인 메일을 전송합니다!</p>
                <div>
                    <label>이메일</label>
                    <br/>
                    <input type='text' ref={inputEmailRef} id="email" value={email} onChange={(e)=>setEmail(e.target.value)} onKeyUp={()=>checkingEmail(email)} placeholder="이메일을 입력하세요" />
                        <br></br>
                        <span>{checkedEmail}</span>
                    <br></br>
                    <button onClick={goLogin}>취소</button>
                    <button onClick={sendEmailBtn}>메일전송</button>         
                </div>
            </>

            }
        </div>
    )
}

export default SignUpBefore;