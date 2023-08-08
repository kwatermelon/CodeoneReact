import React, { useEffect } from 'react';

export default function ErrorNoUser() {
  function signUpbtn() {
    window.location.href="/signUpBefore"
}

 return (
   <div>
        회원가입되지 않은 로그인입니다. 
        <br></br>
        회원가입부터 진행해주세요.
        <br></br>
        <button onClick={signUpbtn}>회원가입</button>
   </div>
 );
}