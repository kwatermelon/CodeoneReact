import React, { useRef, useState } from "react";
import Editor2 from "../../components/store/reactquill";

import thumbnail from '../../assets/store/thumbnail_image.png';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './css/lecturewrite.css'; 

// 알람
import SweetAlert from "sweetalert2";


function LectureWrite(){

    const [content, setContent] = useState("");
    
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [zoomurl, setZoomUrl] = useState("");
    const [zoompwd, setZoomPwd] = useState("");
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");
    const [startDate, setStartDate] =useState("");
    const [endDate, setEndDate] =useState("");

    console.log(content);
    console.log(category);

    console.log(startDate);

     // localStorage에서 login 꺼내와서 parsing하기
     const login = JSON.parse(localStorage.getItem("login"));     
     console.log(login); 
    
    let history = useNavigate();

    // 이미지파일 썸네일   
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

    function lectureWritebtn(e){
        // SweetAlert.fire("추가");
        e.preventDefault();

        if(login === null || login.auth !== 0){
            SweetAlert.fire("관리자아이디로 로그인 해주십시오");
            return;
        }

        // content 변수에서 HTML 태그 제거
        const cleanedContent = content.replace(/(<([^>]+)>)/gi, "");

        // 각 값에 대한 trim() 메소드를 사용한 빈 문자열 체크
        if (category.trim() === "" || price.trim() === "" || zoomurl.trim() === "" || zoompwd.trim() === "" || title.trim() === "" 
            || !startDate || !endDate || cleanedContent.trim() === "" || startDate.trim() === "" || endDate.trim() === "" ) {
            SweetAlert.fire("모든 데이터를 입력해주세요.");
            return;
        }

        if (isNaN(price)) {
            SweetAlert.fire("가격은 숫자만 입력 가능합니다.");
            setPrice('');
            return;
        }

        let formData = new FormData();
        
        formData.append("category", category);
        formData.append("price", price);
        formData.append("zoomurl", zoomurl);
        formData.append("zoompwd", zoompwd);
        formData.append("title", title);

        // id 추후 로그인세션에서 가져오기
        formData.append("id", login.id);

        // 리액트퀼 에디터에서 작성한 내용
        formData.append("content", content);
        // formData.append("content", editorRef.current.getEditor().root.innerHTML);       

        // 강의기간        
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);

        // 날짜변환 필요없음
        // const startDateObj = new Date(startDate);
        // const endDateObj = new Date(endDate);
        // const formattedStartDate = startDateObj.toISOString().substring(0, 10);
        // const formattedEndDate = endDateObj.toISOString().substring(0, 10);

        // formData.append("startDate", formattedStartDate);
        // formData.append("endDate", formattedEndDate);

        // 이미지 첨부했는지 확인
        const fileInput = document.frm.uploadFile;
        if (fileInput.files.length === 0) {
            SweetAlert.fire("대표이미지를 첨부해주세요");
            return;
        }
        // 첨부파일 값 꼭넣어주기
        formData.append("uploadFile", document.frm.uploadFile.files[0]);     

        // formData 전송

        axios.post('http://localhost/lecture', formData)
        .then(function(resp){
            console.log(resp.data);
            SweetAlert.fire("강의가 추가되었습니다");
            history('/lecturelist');
        })
        .catch(function(err){
            // SweetAlert.fire(err);
            // 400 Bad Request 응답 처리
            if(err.response.data === "NO_IMAGE"){
                console.log(err.response.data);
                SweetAlert.fire("대표이미지는 jpg, jpeg, png파일만 가능합니다");
                return;
            }    
            SweetAlert.fire("강의 추가에 실패했습니다"); 
            console.log(err.response.data); 
        })

    }
    return(
        <div className="wrtie-page">           

            <div className="store-form">
                <h1>강의정보를 등록해주세요</h1>
                <h2>기본정보</h2>
            
                <form name="frm" onSubmit={lectureWritebtn} encType="multipart/form-data">   

                    {/* 대표이미지 부분 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            대표이미지
                            <input type="file" name="uploadFile" accept="*" onChange={imageLoad} ref={imgRef}
                                className="form-control"  />
                        </div>
                        
                        <div className="store-write-form-detail">
                            <div>
                                <img src={imgFile} alt="대표이미지" /> {/* 이미지 썸네일 사이즈 고정하기*/}
                            </div>
                            <div>                                
                                * 상품이미지는 JPG, JPEG, PNG 파일만 가능합니다.
                            </div>
                        </div>
                    </div>
                    {/* 대표이미지 끝 */}

                    {/* 카테고리 시작 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            카테고리
                        </div>
                        <div className="store-write-form-detail"> 
                            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="form-select" >
                                <option value=''>기술선택</option>
                                <option value='java'>java</option>                
                                <option value='spring'>spring</option>
                                <option value='springboot'>spring boot</option>
                                <option value='python'>python</option>
                                <option value='javascript'>java script</option>
                                <option value='react'>react</option>
                                <option value='mysql'>mysql</option>
                                <option value='html'>html</option>
                                <option value='css'>css</option>
                            </select>
                        </div>
                    </div>
                    {/* 카테고리 끝*/}

                    {/* 가격 시작 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            가격                            
                        </div>                        
                        <div className="store-write-form-detail">
                            <input type='text' value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="숫자만 입력해주세요"/>
                        </div>
                    </div>
                    {/* 가격 끝 */}

                    {/* 강의기간 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            강의시작일                          
                        </div>                        
                        <div className="store-write-form-detail">
                            <input type='date' class="form-control" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/> 
                            
                        </div>
                    </div>
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            강의종료일                          
                        </div>                        
                        <div className="store-write-form-detail">                            
                            <input type='date' class="form-control" value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                        </div>
                    </div>
                    {/* 강의기간 끝 */}

                    {/* 강의주소 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            강의주소                           
                        </div>                        
                        <div className="store-write-form-detail">
                            <input type='text' value={zoomurl} onChange={(e)=>setZoomUrl(e.target.value)} placeholder="zoom주소를 입력해주세요"/>
                        </div>
                    </div>
                    {/* 강의주소 끝 */}

                    {/* 강의 비밀번호 시작 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            강의비밀번호
                        </div>                        
                        <div className="store-write-form-detail">
                            <input type='text' value={zoompwd} onChange={(e)=>setZoomPwd(e.target.value)} placeholder="zoom비밀번호를 입력해주세요"/>
                        </div>
                    </div>
                    {/* 강의 비밀번호 끝 */}

                    {/* 제목 시작 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            제목
                        </div>                        
                        <div className="store-write-form-detail">
                            <input type='text' value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="제목을 입력해주세요"/>
                        </div>
                    </div>
                    {/* 제목끝 */}

                    {/* 리액트퀼 */}
                    <div>                      
                        <div>
                            <Editor2 value={content}  onChange={(value)=>setContent(value)}  />  
                        </div> 
                    </div> 
                    {/* 리액트퀼 끝*/}

                    {/* 글쓰기버튼 */}
                    
                    <div className="store-writr-btn">
                        <button type="submit" className="btn btn-primary btn1">강의등록</button>
                        <button onClick={()=>history('/lecturelist')} className="btn btn-secondary btn2" >등록취소</button>
                        {/* <input type="submit" value="강의추가" /> */}
                        {/* <input type='button' value='강의추가' onClick={lectureWritebtn}/> */}                            
                        {/* <input type='button' onClick={()=>history('/lecturelist')} value='글쓰기취소'/> */}
                    </div>
                    
                    {/* 글쓰기 버튼끝 */}


                    {/* --------------------------------------------------------------이전 글쓰기form */}

                    {/* 이미지 썸네일 */}  
                    {/* <div className="table-form">
                        <div>
                            <p className="inline-block">대표이미지</p>
                            <input type="file" name="uploadFile" accept="*" onChange={imageLoad} ref={imgRef}  />
                        </div>

                        <div>                     
                            <img src={imgFile} alt="물건 이미지" /> 
                        </div>  
                    </div>

                    <div className="table-form" style={{height:'100px'}}>
                        <div>
                            <p>카테고리</p>
                        </div>
                        <div>
                            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                                <option value=''>기술선택</option>
                                <option value='java'>java</option>                
                                <option value='spring'>spring</option>
                                <option value='springboot'>spring boot</option>
                                <option value='python'>python</option>
                                <option value='javascript'>java script</option>
                                <option value='react'>react</option>
                                <option value='mysql'>mysql</option>
                                <option value='html'>html</option>
                                <option value='css'>css</option>
                            </select>
                        </div>
                    </div>

                <div className="table-form" style={{height:'50px'}}>
                    <div>
                        <p>가격</p>                    
                    </div>
                    <div>
                        <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="숫자만 입력하세요"/>
                    </div>
                </div>

                <div className="table-form" style={{height:'50px'}}>
                    <div>
                        <p>강의주소</p>                    
                    </div>
                    <div>
                        <input value={zoomurl} onChange={(e)=>setZoomUrl(e.target.value)} placeholder="zoom주소"/>
                    </div>
                </div>

                <div className="table-form" style={{height:'50px'}}>
                    <div>
                        <p>강의비밀번호</p>                    
                    </div>
                    <div>
                        <input value={zoompwd} onChange={(e)=>setZoomPwd(e.target.value)} placeholder="zoom비밀번호"/>
                    </div>
                </div>

                <div className="table-form" style={{height:'50px'}}>
                    <div>
                        <p>제목</p>                    
                    </div>
                    <div>
                        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="제목을 입력하세요"/>
                    </div>
                </div>        */}


                {/* <div> */}
                {/* 리액트퀼  content*/}                
                    {/* <Editor2 value={content}  onChange={(value)=>setContent(value)}  />  
                </div>   */}
                
                {/* <input type="submit" value="강의추가" /> */}
                {/* <input type='button' value='강의추가' onClick={lectureWritebtn}/> */}
                {/* <input type='button' onClick={()=>history('/lecturelist')} value='글쓰기취소'/>*/}
                
                </form>
        </div>  {/* form 끝 */}
    </div>
        
    )

}
export default LectureWrite;