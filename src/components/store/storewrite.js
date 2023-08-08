import React, {useState, useRef, useEffect} from "react";
import Editor2 from "./reactquill";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import thumbnail from '../../assets/store/thumbnail_image.png';

import { Button } from "bootstrap";
import Postcode from "./daumpost";

import SweetAlert from "sweetalert2";

import './css/storewrite.css'; // 파일 경로 수정


function StoreWrite(){

    // 로그인 아이디
    let id = window.localStorage.getItem("userId");
    console.log(id);

    const [title, setTitle] = useState("");
    
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [itemcondition, setItemcondition] = useState("old");  // 기본 중고로 세팅
    // const [id, setId] = useState("");
    const [content, setContent] = useState("");

    
    console.log(content);

    // 링크이동
    const history = useNavigate();   
    
    // console.log(title);
    // console.log(id); 

    // 이미지파일 썸네일
    // const [filename, setFileName] = useState("logo192.png");
    const [imgFile, setImgFile] = useState(thumbnail);
    const imgRef =useRef(); // img정보가 들어오는곳 imgRef.current 통해 접근
  
    function imageLoad(){
        const file = imgRef.current.files[0];  // input으로 넣은 파일의 0번지
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () =>{
            setImgFile(reader.result);  // 읽어들인 정보 넣기
        }
    }
    
    // content change
    // const handleContentChange = (newContent) => {
    //     setContent(newContent);
    // };

    // 중고, 새제품 라디오버튼

    function radioChange(e){
        setItemcondition(e.target.value); 
        //alert(radioVal);
    }
    
    function writeUpload(e){
        
        e.preventDefault();

        // 입력필드 모두 채워야 넘어가게 막아줘야 함

        // content 변수에서 HTML 태그 제거
        const cleanedContent = content.replace(/(<([^>]+)>)/gi, "");

        // 각 값에 대한 trim() 메소드를 사용한 빈 문자열 체크
        if (location.trim() === "" || price.trim() === "" || title.trim() === "" || cleanedContent.trim() === "") {
            SweetAlert.fire("모든 데이터를 입력해주세요.");
            return;
        }

        // 가격은 숫자만 가능
        if (isNaN(price)) {
            SweetAlert.fire("가격은 숫자만 입력 가능합니다.");
            setPrice('');
            return;
        }


        let formData = new FormData();
        
        formData.append("location", location);
        formData.append("price", price);
        formData.append("itemcondition", itemcondition);
        formData.append("title", title);

        // id 추후 로그인세션에서 가져오기
        formData.append("id", id);

        // 리액트퀼 에디터에서 작성한 내용
        formData.append("content", content);
        // formData.append("content", editorRef.current.getEditor().root.innerHTML);       

        // 이미지 첨부했는지 확인
        const fileInput = document.frm.uploadFile;
        if (fileInput.files.length === 0) {
            SweetAlert.fire("대표이미지를 첨부해주세요");
            return;
        }
        // 첨부파일 값 꼭넣어주기
        formData.append("uploadFile", document.frm.uploadFile.files[0]);     

        // formData 전송

        axios.post('http://localhost/storewrite', formData)
        .then(function(resp){
            // alert(resp.data);
            if(resp.data === "NO_IMAGE"){
                // alert("대표이미지는 jpg, jpeg, png파일만 가능합니다");
                SweetAlert.fire("대표이미지는 jpg, jpeg, png파일만 가능합니다");
                return;
            }
            else if(resp.data === "UPLOAD_FAIL"){
                // alert("파일업로드 실패");
                SweetAlert.fire("파일업로드 실패");
                return;
            }
            // alert("글이 등록되었습니다");
            SweetAlert.fire("글이 등록되었습니다");
            history('/storelist');
        })
        .catch(function(err){
            alert(err);
        })

    }

    function storelistBtn(){
        history("/storelist");
        
    }

    // 주소 검색이 완료되었을 때 처리할 콜백 함수
    const handleComplete = (data) => {
        setLocation(data); // 검색된 주소를 부모 컴포넌트의 state에 저장
    };   
    

    return(
        <div className="store-write-page">
            
            <div className="store-form">
            <h1>상품정보를 등록해주세요</h1>
                <form name="frm" onSubmit={writeUpload} encType="multipart/form-data">

                    {/* 글작성폼 시작 */}
                    <h2>기본정보<span>*필수항목</span></h2>

                    {/*상품이미지*/}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            상품이미지
                            <input type="file" name="uploadFile" accept="*" onChange={imageLoad} ref={imgRef}
                                className="form-control"/>
                        </div>

                        {/* 미리보기사진 */}
                        <div className="store-write-form-detail">
                            <div>
                                <img src={imgFile} alt="대표이미지" /> {/* 이미지 썸네일 사이즈 고정하기*/}
                            </div>                     
                            
                            <div>
                                {/* * 상품 이미지는 640x640에 최적화 되어 있습니다.<br/>                                 */}
                                * 상품이미지는 JPG, JPEG, PNG 파일만 가능합니다.<br/> 
                            </div>
                        </div>  
                    </div>
                    {/* 상품이미지 끝 */}

                    {/* 작성자 시작 */}
                    <div className="write-form-line">  
                        <div className="store-write-form-label">
                            작성자
                        </div>
                        <div className="store-write-form-detail">
                            <input type='text' value={id} name="id" readOnly/>  
                        </div>
                    </div>
                    {/* 작성자 끝 */}

                    {/* 거래지역 */}
                    <div className="write-form-line">  
                        <div className="store-write-form-label">
                            거래지역
                        </div>
                        <div className="store-write-form-detail">
                            <input type='text'  value={location} name="location" onChange={(e)=>setLocation(e.target.value)} placeholder="장소를 검색해주세요"
                            readOnly/>  <br/>
                            {/* 주소검색버튼 */}                          
                            <Postcode onComplete={handleComplete}  /> {/* <Postcode /> 컴포넌트를 사용하면서 handleComplete 함수를 onComplete props로 전달 */}                            
                            {/* <input type='button' value='지역설정안함' onClick={()=>setLocation("전국")} className="btn btn-secondary"/> */}
                            <button type='button' onClick={()=>setLocation("전국")} className="btn btn-secondary">설정안함</button>
                        </div>
                    </div>
                    {/* 거래지역끝 */}

                    {/* 가격시작 */}
                    <div className="write-form-line">  
                        <div className="store-write-form-label">
                            가격
                        </div>
                        <div className="store-write-form-detail">
                            <input type='text'  value={price} name="price" onChange={(e)=>setPrice(e.target.value)}  placeholder="숫자만 입력해주세요"/>  
                        </div>
                    </div>
                    {/* 가격끝 */}

                    {/* 상태체크 */}
                    <div className="write-form-line">  
                        <div className="store-write-form-label">
                            상태
                        </div>
                        <div className="store-write-form-detail">
                            <input type={"radio"} value="old" onChange={radioChange} 
                                checked={itemcondition === "old"}
                                className="form-check-input"  />중고
                            <input type={"radio"} value="new" onChange={radioChange} 
                                checked={itemcondition === "new"} 
                                className="form-check-input" />새상품
                        </div>
                    </div>
                    {/* 상태체크 끝 */}
                    
                    {/* 제목 */}
                    <div className="write-form-line">  
                        <div className="store-write-form-label">
                            제목
                        </div>
                        <div className="store-write-form-detail">
                            <input type="text" id="title" name="title" value={title} onChange={(e)=>setTitle(e.target.value)} 
                                placeholder="제목을 입력해주세요"/> 
                        </div>
                    </div>
                    {/* 제목 끝 */}

                    {/* 리액트퀼 */}
                    <div>
                        {/* 리액트퀼  content*/}                
                        <Editor2 value={content}  onChange={(value)=>setContent(value)}  />  {/*ref={editorRef} */}   
                    </div>
                    {/* 리액트퀼 끝*/}
                
                
                    {/* <input type="submit" value="글쓰기" /> */}
                    {/* <button onSubmit={writeUpload}>글쓰기</button> */}
                    <div className="store-writr-btn">
                        <button type="submit" className="btn btn-primary btn1">판매등록</button>
                        <button onClick={storelistBtn} className="btn btn-secondary btn2">등록취소</button>
                    </div>
                </form>
                
               
                
            </div>
        </div>
    )
}

export default StoreWrite;