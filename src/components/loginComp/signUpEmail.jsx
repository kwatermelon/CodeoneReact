import React, { useState } from "react";
import axios from 'axios';

function SignupEmail(){

    const [email, setEmail] = useState('');
    console.log(email);

    // 이메일 정규식
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    function signUpBtn(){

        // 이메일 유효성검사하기
        if (!emailRegex.test(email)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }
        axios.post('http://localhost/checkEmail', null, {params:{"email":email}})
        .then(function(resp){
            // alert(resp.data);
            if (resp.data === "DUPLICATED_EMAIL" ){
                alert("이미 가입된 메일입니다");
            }            
            else if (resp.data === "SUCCESS"){      // 메일전송 완료
                alert("이메일이 발송되었습니다");
                
            // 이메일 확인하러가기 링크 보여주기
            if (email.includes("naver")) {
                document.getElementById("naver").style.display = "block";
                document.getElementById("google").style.display = "none";
            } else if (email.includes("gmail")) {
                document.getElementById("google").style.display = "block";
                document.getElementById("naver").style.display = "none";
            } else {
                document.getElementById("google").style.display = "none";
                document.getElementById("naver").style.display = "none";
            }
        }
        })
        .catch(function(err){
            alert(err);
        })
    }
    return(
        <div>
            <div>
                <h3>회원가입</h3>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="이메일을 입력하세요" />
                <button onClick={signUpBtn}>회원가입</button>
                <br/><br/>
                <a href="https://www.naver.com/" target={"_blank"} rel="noopener noreferrer"  id='naver' style={{display:"none"}}>이메일 확인하러가기</a>
                <a href="https://www.google.com/" target={"_blank"} rel="noopener noreferrer" id='google' style={{display:"none"}}>이메일 확인하러가기</a>
            </div>
        </div>
    )

}

export default SignupEmail;