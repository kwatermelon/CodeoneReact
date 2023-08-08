import React, { useState } from 'react';

import BeatLoader from "react-spinners/BeatLoader";
import './loadingStyles.css';


function SocialLoading() {  
    return (
      <div className="contentWrap">
        <div>
          <h2>선택하신 소셜로그인 화면으로 리다이렉팅중입니다.</h2>       
            <BeatLoader
              className='beatLoader'
              color="#0C97ED"
              height={15}
              width={5}
              radius={2}
            />
        </div>
      </div>
    );
  }
  
  export default SocialLoading;