import React from "react";
import { useNavigate } from "react-router-dom";

// 알람
import SweetAlert from "sweetalert2";

function LectureDetailNavi(props){

    // isPaid props 받아오기   

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));     
    console.log(login); 

    let history = useNavigate();

    console.log(props.commentCnt);

    function lectureRegiBtn(){
        if(login === null){
            SweetAlert.fire("로그인해주십시오");
            return;
        }

        history(`/lectureregi/${props.seq}`);
    }


    return(
        <div>
            <div className="lectureRegiBtn">
                <div>
                    {props.price &&
                        <h3>{props.price.toLocaleString()}원</h3>
                    }
                </div>

                <div>
                    {props.isPaid ? <input type="button" value="수강정보확인하기" className="btn btn-primary" 
                                        onClick={()=>history(`/lectureregiAf/${props.seq}`)}/> : (
                        <input type="button" value="수강신청하기" onClick={lectureRegiBtn} className="btn btn-primary" />
                    )}
                </div> 
                
                <div>
                    <p>{props.orderCount}명의 수강생</p>
                </div>
                <div>                    
                    {props.commentCnt > 0 ?(
                        <p>{props.commentCnt}개의 수강평</p>
                    ):(
                        <p>0개의 수강평</p>
                    )}

                    {/* <p>{props.commentCnt}개의 수강평</p> */}
                </div>
                
            </div>
        </div>
    )
}

export default LectureDetailNavi;