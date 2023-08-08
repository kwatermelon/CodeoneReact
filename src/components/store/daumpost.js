import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

const Postcode = ({ onComplete }) => {      // onComplete props를 받아옴
    const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; // 스크립트 URL
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = (data) => {

    let fullAddress = data.address;
    let extraAddress = ''; 

    if (data.addressType === 'R') {         // 도로명주소인경우
        if (data.bname !== '') {            // 법정동이름 
        extraAddress += data.bname;         // 
        }
        if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    //onComplete(fullAddress); // 결과값을 onComplete props를 통해 부모 컴포넌트로 전달
    //onComplete(city + gu + dong); // 결과값을 onComplete props를 통해 부모 컴포넌트로 전달
    // 시or도 + 군, 구 + 동이름 까지만 출력
    onComplete(data.sido + " " + data.sigungu +  " " + data.bname);
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <button type='button' onClick={handleClick} className="btn btn-primary">
            장소검색
        </button>
    );
};

export default Postcode;