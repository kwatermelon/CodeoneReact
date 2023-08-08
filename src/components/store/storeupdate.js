import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Editor2 from "./reactquill";
import { useNavigate, useParams } from "react-router-dom";
import Postcode from "./daumpost";

// 알람
import SweetAlert from "sweetalert2";

function StoreUpdate(){

    let params = useParams();   // seq값 받아오기
    let seq = params.seq;
    // console.log(seq);

    // 링크이동
    const history = useNavigate();   

    const [item, setItem] = useState({});   // 객체로 초기화해주기

    const [title, setTitle] = useState("");
    
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [itemcondition, setItemcondition] = useState("");  // 기본 중고로 세팅
    const [id, setId] = useState("");
    const [content, setContent] = useState("");

    console.log(content);

    //const [img, setImg] = useState("");

    // axios 글 값 가져오기
     // 중고거래 상세 받아오기
     const itemData = async (seq) =>{
        await axios.get('http://localhost/storedetail', { params:{ "seq":seq}})
            .then(function(resp){
                console.log(resp.data); 
                setItem(resp.data);     // item 넣어주기
                //checkLike(seq);
                setId(resp.data.id);
                setLocation(resp.data.location);
                setPrice(resp.data.price);
                setItemcondition(resp.data.itemcondition);
                setTitle(resp.data.title);
                setContent(resp.data.content);
            })
            .catch(function(err){
                console.log(err);
            })
    }
    useEffect(()=>{         // initialize 용도
        itemData(seq);        
    }, [seq]);

     // 이미지파일 썸네일
    // const [filename, setFileName] = useState("logo192.png");
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

    // 중고, 새제품 라디오버튼
    function radioChange(e){
        setItemcondition(e.target.value); 
        //SweetAlert.fire(radioVal);
    }

    console.log(content);

    function updateStore(e){

        // 글 수정해서 서버로 보내는 부분
        e.preventDefault();

        // 입력필드 모두 채워야 넘어가게 막아줘야 함
        // content 변수에서 HTML 태그 제거
        const cleanedContent = content.replace(/(<([^>]+)>)/gi, "");

        
        // 각 값에 대한 trim() 메소드를 사용한 빈 문자열 체크
        if (location.trim() === "" || price.toString().trim() === "" || title.trim() === "" || cleanedContent.trim() === "") {
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
        formData.append("seq", seq);
        // 리액트퀼 에디터에서 작성한 내용
        formData.append("content", content);

        // 이미지 첨부했는지 확인 필요없음
        // const fileInput = document.frm.uploadFile;
        // if (fileInput.files.length === 0) {
        //     SweetAlert.fire("대표이미지를 첨부해주세요");
        //     return;
        // }
        formData.append("filename", item.filename);
        formData.append("newfilename", item.newfilename);
        // 첨부파일 값 꼭넣어주기
        formData.append("uploadFile", document.frm.uploadFile.files[0]); 

         // formData 전송        

        axios.put('http://localhost/writeStore', formData)
        .then(function(resp){
            // SweetAlert.fire(resp.data);             
            SweetAlert.fire("글이 수정되었습니다");
            history(`/storedetail/${item.seq}`);            
        })
        .catch(function(err){
            // SweetAlert.fire(err);
            // 400 Bad Request 응답 처리
            if(err.response.data === "NO_IMAGE"){
                SweetAlert.fire("대표이미지는 jpg, jpeg, png파일만 가능합니다");
                return;
            }    
            SweetAlert.fire("글이 수정되지 않았습니다"); 
            console.log(err.response.data); 
        })
        
    }

    // 주소 검색이 완료되었을 때 처리할 콜백 함수
    const handleComplete = (data) => {
        setLocation(data); // 검색된 주소를 부모 컴포넌트의 state에 저장
    };

    return(
        <div className="store-write-page">
            <div className="store-form">
                <h1>상품정보를 수정해주세요</h1>
                    <form name="frm" onSubmit={updateStore} encType="multipart/form-data">

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
                                    {/* <img src={imgFile} alt="대표이미지" />  */}
                                    {imgFile ? (                    // 만약 새로올린 imgFile이 존재하면 썸네일에 imgFile이 로드되고
                                        <img src={imgFile} />
                                        ) : (
                                            item.newfilename && (       // 없다면 기존이미지가 그대로 보임
                                                <img src={`http://localhost/image/${item.newfilename}`} />
                                            )
                                        )}
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
                                <input type="text" id="title" name="title" value={title} onChange={(e)=>setTitle(e.target.value)}  /> 
                            </div>
                        </div>
                        {/* 제목 끝 */}

                        {/* 리액트퀼 */}
                        <div>
                            {/* 리액트퀼  content*/}                
                            <Editor2 value={content}  onChange={(value)=>setContent(value)}  />  {/*ref={editorRef} */}   
                        </div>
                        {/* 리액트퀼 끝*/}
                        
                        {/* 글수정버튼 */}
                        <div className="store-writr-btn">
                            {/* <input type="submit" value="글수정" /> */}
                            <button type="submit" className="btn btn-primary btn1">판매수정</button>
                            {/* <button onSubmit={writeUpload}>글쓰기</button> */}
                            <button onClick={()=>history(`/storedetail/${seq}`)} className="btn btn-secondary btn2">수정취소</button>
                        </div>
                    </form>
                {/* 보낼 form 끝 */}
            </div>
            {/*store-form 끝 */}
                
                





            {/*//////////////////////////////이전거 */}
            {/* <h2>글수정</h2> */}
            {/* <Editor2 value={content}  onChange={(value)=>setContent(value)}  />  */}

{/* 
            <div>
                <form name="frm" onSubmit={updateStore} encType="multipart/form-data">
                <table>
                    <colgroup>
                        <col width={150}/><col width={350}/><col width={300}/>
                    </colgroup>
                    
                    <tbody>
                    <tr>
                        <td>작성자</td>
                        <td>
                            <input value={id} name="id" onChange={(e)=>setId(e.target.value)}  readOnly/>    추후 로그인에서 아이디 받아오기
                        </td>
                        <td rowSpan={6}>
                        이미지 썸네일
                        <div style={{ width: "300px", height: "200px" }}>                     
                        {imgFile ? (                     만약 새로올린 imgFile이 존재하면 썸네일에 imgFile이 로드되고
                            <img src={imgFile} width="300px" height="300px" />
                        ) : (
                            item.newfilename && (       없다면 기존이미지가 그대로 보임
                                <img src={`http://localhost/image/${item.newfilename}`} width="300px" height="300px" />
                            )
                        )}
                        </div>  

                        </td>
                    </tr>
                    <tr>
                        <td>거래지역</td>
                        <td>
                            <input value={location} name="location" onChange={(e)=>setLocation(e.target.value)} placeholder="장소를 입력하세요"/>
                            주소검색버튼                          
                            <Postcode onComplete={handleComplete}  />
                            <input type='button' value='지역설정안함' onClick={()=>setLocation("전국")}/>
                        </td>     
                    </tr>
                    <tr>
                        <td>가격</td>
                        <td>
                            <input value={price} name="price" onChange={(e)=>setPrice(e.target.value)}  placeholder="가격을 입력하세요 숫자만"/>
                        </td>
                    </tr>
                    <tr>
                        <td>상태</td>
                        <td>
                            <input type={"radio"} value="old" onChange={radioChange} checked={itemcondition === "old"} />중고
                            <input type={"radio"} value="new" onChange={radioChange} checked={itemcondition === "new"} />새상품
                        </td>
                    </tr>
                        
                    <tr>
                        <td>제목</td>
                        <td>                        
                        <input type="text" id="title" name="title" value={title} onChange={(e)=>setTitle(e.target.value)}  />
                        </td>
                    </tr>
                    <tr>
                        <td>대표이미지</td>
                        <td>
                        사진 
                        <input type="file" name="uploadFile" accept="*" onChange={imageLoad} ref={imgRef}/><br/>  
                        썸네일 이미지 위에 있음
                        </td> 
                    </tr>
                    <tr>
                        <td colSpan={3}>
                             리액트퀼  content                
                        <Editor2 value={content} onChange={(value)=>setContent(value)} required   />  ref={editorRef}                        
                        </td>
                    </tr>
                    </tbody>

                </table>
                <br/><br/><br/>

                <input type="submit" value="글수정" />
                <button onSubmit={writeUpload}>글쓰기</button>
                <button onClick={()=>history(`/storedetail/${seq}`)}>글수정취소</button>

                
                </form>
                
            </div> */}
        </div>
    )
}

export default StoreUpdate;