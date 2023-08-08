import React, { useState } from 'react';

import BeatLoader from "react-spinners/BeatLoader";
import './loadingStyles.css';


function Loading(props) {
  console.log("lodingPage")
  console.log(props.mailFlag)
  const [mailFlag , setMailFlag] = useState(props.mailFlag)
    return (
      <div className="contentWrap">
        <div>
          {mailFlag? <span>인증메일을 보냈습니다. 확인해주세요</span>  : 
          <>
                <h2>등록하신 이메일로 인증메일을 보내는 중입니다..</h2>  
          
                <BeatLoader
                  className='beatLoader'
                  color="#0C97ED"
                  height={15}
                  width={5}
                  radius={2}
                />
          </>

          }
         
        </div>
      </div>
    );
  }
  
  export default Loading;