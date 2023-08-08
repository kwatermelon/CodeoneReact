import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Editor2 from "../../components/store/reactquill";
// 알람
import SweetAlert from "sweetalert2";

function LectureUpdate(){

    let params = useParams();
    let seq = params.seq;
    // console.log(seq);

    // localStorage에서 login 꺼내와서 parsing하기
    const login = JSON.parse(localStorage.getItem("login"));     
    console.log(login); 

    const [lecture, setLecture] = useState({});
    const [content, setContent] = useState("");
    
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [zoomurl, setZoomUrl] = useState("");
    const [zoompwd, setZoomPwd] = useState("");
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");
    const [newfilename, setNewfilename] = useState("");

    const [startDate, setStartDate] =useState("");
    const [endDate, setEndDate] =useState("");

    //console.log(content);
    //console.log(category);
    //console.log(newfilename);
    let history = useNavigate();

    // 이미지파일 썸네일   
    const [imgFile, setImgFile] = useState("");
    const imgRef =useRef(); // img정보가 들어오는곳 imgRef.current 통해 접근

    
  
    function imageLoad(){
        const file = imgRef.current.files[0];  // input으로 넣은 파일의 0번지
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () =>{
            setImgFile(reader.result);  // 읽어들인 정보 넣기
        }
    }

    // 강의 정보 가져오기
     // 강의 상세 받아오기
     const lectureData = async (seq) =>{
        await axios.get('http://localhost/lecture/detail', { params:{ "seq":seq}})
            .then(function(resp){
                console.log(resp.data); 
                setLecture(resp.data);     // 데이터  넣어주기
                setCategory(resp.data.category);
                setPrice(resp.data.price);
                setZoomUrl(resp.data.zoomurl);
                setZoomPwd(resp.data.zoompwd);
                setTitle(resp.data.title);
                setContent(resp.data.content);               
                setNewfilename(resp.data.newfilename);
                setStartDate(resp.data.startDate);
                setEndDate(resp.data.endDate);                
            })
            .catch(function(err){
                console.log(err);
            })
    }
    useEffect(()=>{         // initialize 용도

        if(login === null || login.auth !== 0){
            SweetAlert.fire("관리자아이디로 로그인 해주십시오");
            return;
        }
        lectureData(seq);        
    }, [seq]);


    function lectureUpdatebtn(e){
        // SweetAlert.fire("수정");
        // 수정된글 서버로 보내기        
        
        // 글 수정해서 서버로 보내는 부분
        e.preventDefault();

        if(login === null || login.auth !== 0){
            SweetAlert.fire("관리자아이디로 로그인 해주십시오");
            return;
        }

        // content 변수에서 HTML 태그 제거
        const cleanedContent = content.replace(/(<([^>]+)>)/gi, "");

        // 각 값에 대한 trim() 메소드를 사용한 빈 문자열 체크
        if (category.trim() === "" || price.toString().trim() === "" || zoomurl.trim() === "" || zoompwd.trim() === "" || title.trim() === "" 
            || !startDate || !endDate || cleanedContent.trim() === "") {
            SweetAlert.fire("모든 데이터를 입력해주세요.");
            return;
        }

        if (isNaN(price)) {
            SweetAlert.fire("가격은 숫자만 입력 가능합니다.");
            setPrice('');
            return;
        }

        let formData = new FormData();
        formData.append("seq", seq);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("zoomurl", zoomurl);
        formData.append("zoompwd", zoompwd);
        formData.append("title", title);
        

        // id 추후 로그인세션에서 가져오기
        formData.append("id", id);

        // 리액트퀼 에디터에서 작성한 내용
        formData.append("content", content);
        // formData.append("content", editorRef.current.getEditor().root.innerHTML);     

        formData.append("filename", lecture.filename);
        formData.append("newfilename", lecture.newfilename);

        // 강의기간 보내주기 추가
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);

        // 첨부파일 값 꼭넣어주기
        formData.append("uploadFile", document.frm.uploadFile.files[0]);     

        // formData 전송

        axios.put('http://localhost/lecture', formData)
        .then(function(resp){
            console.log(resp.data);            
            SweetAlert.fire("강의가 수정되었습니다");
            history(`/lecturedetail/${lecture.seq}`); 
        })
        .catch(function(err){
            // SweetAlert.fire(err);
            // 400 Bad Request 응답 처리
            if(err.response.data === "NO_IMAGE"){
                console.log(err.response.data);
                SweetAlert.fire("대표이미지는 jpg, jpeg, png파일만 가능합니다");
                return;
            }    
            SweetAlert.fire("강의글 수정에 실패했습니다"); 
            console.log(err.response.data); 
            return;
        })

    }


    return(
        <div className="wrtie-page">            

            <div className="store-form">
                <h1>강의정보를 수정해주세요</h1>
                <h2>기본정보</h2>
            
                <form name="frm" onSubmit={lectureUpdatebtn} encType="multipart/form-data">   

                    {/* 대표이미지 부분 */}
                    <div className="write-form-line">
                        <div className="store-write-form-label">
                            대표이미지
                            <input type="file" name="uploadFile" accept="*" onChange={imageLoad} ref={imgRef}
                                className="form-control"  />
                        </div>
                        
                        <div className="store-write-form-detail">
                            <div>         
                                {imgFile ? (                    // 만약 새로올린 imgFile이 존재하면 썸네일에 imgFile이 로드되고
                                    <img src={imgFile}/>
                                ) : (
                                    newfilename && (       // 없다면 기존이미지가 그대로 보임
                                        <img src={`http://localhost/lecture/image/${newfilename}`}  />
                                    )
                                )}
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
                        <button type="submit" className="btn btn-primary btn1">강의수정</button>
                        <button onClick={()=>history('/lecturelist')} className="btn btn-secondary btn2" >수정취소</button>
                        {/* <input type="submit" value="강의추가" /> */}
                        {/* <input type='button' value='강의추가' onClick={lectureWritebtn}/> */}                            
                        {/* <input type='button' onClick={()=>history('/lecturelist')} value='글쓰기취소'/> */}
                    </div>
                    
                    {/* 글쓰기 버튼끝 */}
                    </form>
        </div>  {/* form 끝 */}

            
            
        </div>
    )
}

export default LectureUpdate;