import React, { useState} from "react";
import axios from "axios";
import google from '../../assets/headerIcon/google.png';
import naver from '../../assets/headerIcon/naver.png';
import kakao from '../../assets/headerIcon/kakao.png';
import gihub from '../../assets/headerIcon/github.png';
import Loading from '../../components/loading/loading';
import SocialLoading from "../loading/socialloading";
import { Button } from 'react-bootstrap';
import logo from '../../assets/logo.png'
import LoginModal from "./LoginModal";

import './loginPage.css';
function Login(){
    const BASE_USER_URL  = "http://localhost/user";
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    // 이메일 정규식
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const googleUrl = "http://localhost/auth/GOOGLE";
    const naverUrl = "http://localhost/auth/NAVER";
    const kakaoUrl = "http://localhost/auth/KAKAO";
    const githubUrl = "http://localhost/auth/GITHUB";

    function loginBtn(){        
         // 이메일 유효성검사하기
         if (!emailRegex.test(email)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        } else {
            setLoading(true);
        }
        // api 호출 전에 true로 변경하여 로딩화면 띄우기
        axios.post(`${BASE_USER_URL}/login`, null, {params:{"email":email}})
        .then(function(resp){
            if(resp.status === 204){                
                alert("가입된 이메일이 아닙니다");
                setLoading(false)
                return;
            }
            else if (resp.status === 200){      // 메일전송 완료
                // 이메일 확인하러가기 링크 보여주기
                // if (email.includes("naver")) {
                //     document.getElementById("naver").style.display = "block";
                //     document.getElementById("google").style.display = "none";
                // } else if (email.includes("gmail")) {
                //     document.getElementById("google").style.display = "block";
                //     document.getElementById("naver").style.display = "none";
                // } else {
                //     document.getElementById("google").style.display = "none";
                //     document.getElementById("naver").style.display = "none";
                // }                
                window.location.href = "/loginAf";
                setLoading(false);
            }
            

        })
        .catch(function(err){
            setLoading(false);
            alert(err);
        })
    }


    function signUpbtn() {
        window.location.href="/signUpBefore"
    }

    const lodingpage = ()=> {
        setSocialLoading(true);
    }


    return(
        <LoginModal show={true}/>
    )
}

export default Login;