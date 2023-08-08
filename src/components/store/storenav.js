import React from "react";
// 알람
import SweetAlert from "sweetalert2";

function StoreNav(){

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));     
    console.log(login); 

    // const id = login.id;
    
    // 판매하기 로그인여부 확인
    function storeWriteBtn(e){   
       
        
        if(login === null){
            SweetAlert.fire("로그인이 필요한 기능입니다");
            e.preventDefault();     
            return;
        }
    }

    return(
        <>        
            <nav>
                <a href="/storewrite" onClick={storeWriteBtn} >                       
                    <button className="write-btn"><i class="bi bi-pencil"></i>판매하기</button>
                </a>                
            </nav>
        </>
    )
}

export default StoreNav;