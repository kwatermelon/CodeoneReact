import React, { useState, useRef } from 'react';
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect } from 'react';
import imageDefault from '../../assets/blog/imageDefault.png';
import { Card, Button} from 'react-bootstrap';
import { BlogFormDivider } from './css/BlogFormStyled';
import BlogCategorySelectComponent from './BlogCategorySelectComponent';
import ImageResize from "quill-image-resize";
Quill.register("modules/ImageResize", ImageResize);



const Container = styled.div`
  display: flex;
  // text-align: center;
  width: 100%;
  overflow: hidden;
  // background-color: #def0c2;

`;

//  왼쪽 컬럼 전체
const WriteColumn = styled.div`
  display: inline-block;
  // border: 1px solid black;
  width: 50%;

`;


// 오른쪽 전체
const ShowColumn = styled.div`
  display: inline-block;
  // border: 1px solid black;
  width: 50%;

`;


// 오른쪽 포스트 미리보기 컬럼
const CardShowColumn = styled.div`

  text-align: center;
  justify-content: center;
  width: 100%;
`



// 컬럼 푸터
const ColumnFooter = styled.button`
  padding: 5px 10px;
  background-color: #7885d6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 25px;
  margin: 1rem;
  float: right;
`;



// 제목, 카테고리 입력창
const InputControl = styled.input`
  background: transparent;
  width: 100%;
  border: none;
  margin-top: 1rem;
  &::placeholder{
		font-size: 1.2em;
	}
`




//  오른쪽 미리보기 창 전체 컬럼
const MirrorShowColumn = styled.div`
  width: 100%;
`

//  오른쪽 타이틀 미리보기
const MirrorTitleShowControl = styled.div`
  background: transparent;
  font-weight: bold;
  font-size: 40px;
  width: 100%;
  height: 50px;
  border: none;
  overFlow : auto;
`
//  오른쪽 카테고리 미리보기
const MirrorCategoryShowControl = styled.div`
  background: transparent;
  font-weight: bold;
  font-size: 20px;
  width: 100%;
  height: 30px;
  border: none;
  overFlow : auto;
`


//  오른쪽 미리보기
const MirrorShowControl = styled.div`
background: transparent;
  width: 100%;
  height: 900px;
  border: none;
  overflow : auto;
`




function BlogWriteForm({history}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnailUrl , setThumbnailUrl] = useState(imageDefault);
  const [multipartfile, setMultipartfile] = useState(null);
  const [category1 , setCategory1] = useState([]);
  const [category2 , setCategory2] = useState([]);
  const [cate1Selected, setCate1Selected] = useState('');
  const [cate2Selected, setCate2Selected] = useState('');


  const quillRef = useRef(null);
  const inputTitle = useRef(null);


  const imageStyle = {
    'justify-content': 'center'
  }
  
  // 로그인한 유저인지 확인하기
  const userCheck = () => {
    if(window.localStorage.getItem("userEmail") === null) {
      alert("로그인부터 부탁드립니다!")
       window.location.href = "/login";
    }
  }


     /*
     이미지를 넣을 때마다 실행되는 Handler
   */
  const imageHandler = () => {
      // file input 임의 생성
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();
      input.onchange = async() => {
       const file = input.files;          
          const formData = new FormData();
          if(file) { 
              formData.append("multipartFiles", file[0]);
          }

          // file 데이터 담아서 서버에 전달하여 이미지 업로드
          // const res = await axios.post('http://localhost/job/uploadImage', {"multipartFiles": file});

          const res = await axios({
            method: 'post',
            url: 'http://localhost:/blog/uploadImage', // => url 맞는거로 바꾸기
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if(quillRef.current) {
              // 현재 Editor 커서 위치에 서버로부터 전달받은 이미지 불러오는 url을 이용하여 이미지 태그 추가
              const index = (quillRef.current.getEditor().getSelection()).index;

              const quillEditor = quillRef.current.getEditor();
              quillEditor.setSelection(index, 1);

              quillEditor.clipboard.dangerouslyPasteHTML(
                  index,
                  `<br/>
                  <div style=${imageStyle}>
                    <img  src=${res.data} alt=${'alt text'} />                  
                  </div>
                  `
              );
          }
      }
  }

  // 블로그 카테고리 생성
  const getBlogCategory = async (catetype = 1, cate1seq = 0 ) => {
    axios.get('http://localhost/blog/getBlogCategory',
    {params: {catetype: catetype, cate1seq: cate1seq}})
    .then(res => {
      if(res.status === 200) {
        if(cate1seq === 0) {
          setCategory1(res.data);
        } else {
          setCategory2(res.data);
        }
      }
    })

  }


  // 카테고리 1 설정 및 category2 가져오기
  const cate1Setting = (e) => {    
    setCate1Selected(e.target.value)
    axios.get('http://localhost/blog/getBlogCategory',
    {params: {catetype: 2, cate1seq: e.target.value}})
    .then(res => {
      if(res.status === 200) {
        setCategory2(res.data);
      }
    })    
  }


  // 카테고리 2 설정 및 category2 가져오기
  const cate2Setting = (e) => {    
    setCate2Selected(e.target.value)  
  }

  const BlogWrite = async () => {

    if(!validationCheck()) {
      return false;
    }
    

    const formData = new FormData();

    formData.append("writer", window.localStorage.getItem('userEmail'));
    formData.append("title", title);
    formData.append("content", content);
    formData.append("multipartFiles", multipartfile);
    console.log(cate1Selected)
    console.log(cate2Selected)
    formData.append("category1", cate1Selected)
    formData.append("category2", cate2Selected)


      await axios({
        method: 'post',
        url: "http://localhost/blog/write", 
        data: formData,
        withCredentials:true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'jwt': '123456789'
        },
      }).then(res => {
        console.log(res.status);
        if(res.status === 200){
            alert("성공적으로 등록되었습니다");
            window.location.href= "/blog"
            // history('/combbslist'); 
        }else{
            alert("등록되지 않았습니다");
        }
    })
    .catch(function(err){
        alert(err);
    })


  }



    // 섬네일 이미지 사진 바꾸기
    const thumbPictureChange = async (e) => {        
 
          const fileBlob = e.target.files[0];
          setMultipartfile(fileBlob);
          const reader = new FileReader();
          reader.readAsDataURL(fileBlob);

        return new Promise((resolve) => {
              reader.onload = () => {
                  // console.log(reader.result)   
                setThumbnailUrl(reader.result);
              resolve();
              };
        });

  }


  const validationCheck = () => {
    
        // 빈칸 검사
      if (title.trim() === '') {
          alert('제목을 입력해주세요');
          inputTitle.current.focus();
          return false;
      }   
      if (content.trim() === '') {
          alert('내용을 입력해주세요');
          return false;
      }

      if(cate1Selected.trim() === "") {
        alert('큰카테고리을 입력해주세요');
          return false;
      }
      if(cate2Selected.trim() === "") {
        alert('세부카테고리를 입력해주세요');
 
          return false;
      }

      return true;

      
  }


  



  const modules = React.useMemo(() => ({
    toolbar: {
        // container에 등록되는 순서대로 tool 배치
        container: [
            [{ 'font': [] }], // font 설정
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // header 설정
            ['bold', 'italic', 'underline','strike', 'blockquote', 'code-block', 'formula'], // 굵기, 기울기, 밑줄 등 부가 tool 설정
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+4'}], // 리스트, 인덴트 설정
            ['link', 'image'], // 링크, 이미지, 비디오 업로드 설정
            [{ 'align': [] }, { 'color': [] }, { 'background': [] }], // 정렬, 글씨 색깔, 글씨 배경색 설정
            ['clean'], // toolbar 설정 초기화 설정
        ],
   

        

        // custom 핸들러 설정
        handlers: {
            image: imageHandler, 
        }
     },
       	    /* 추가된 코드 */
             ImageResize: {
              parchment: Quill.import('parchment')
            }
   }), [])

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];






  useEffect(()=> {
    userCheck()
    getBlogCategory()
    // checkEmail()
    },[]
  )







  return (
 

    <>
      <Container>
        <WriteColumn>
          <div className='container'>          
            <div className="row">
                  {/* <label htmlFor='title' className="form-label">제목</label> */}
                  <InputControl className="form-floating" id='title'  ref={inputTitle} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='제목을 입력하세요' style={{fontSize:'xx-large'}} ></InputControl>
                  <hr></hr>
            </div>

            <div className="row">
              <div className="col">
                  <label htmlFor='category1selection' className="form-label">큰카테고리 설정</label>
                  <select  className="form-select form-select-lg" id='category1selection' onChange={cate1Setting} value={cate1Selected} >
                    <option>선택</option>
                    {
                        category1 !== [] && category1.map(element => {
                            return <option value={element.seq} key={element.seq}>{element.name}</option>;
                        })
                    }
                  </select>
              </div>
              <div className="col">
                  <label htmlFor='category1selection' className="form-label">세부카테고리 설정</label>
                  <select  className="form-select form-select-lg" id='category1selection' onChange={cate2Setting} value={cate2Selected}>
                    <option>선택</option>
                    {
                        category2 !== [] && category2.map(element => {
                            return <option value={element.seq} key={element.seq}>{element.name}</option>;
                        })
                    }

                  </select>
              </div>
            </div>
          </div>
          <br></br>
            <ReactQuill 
              theme="snow" 
              ref={quillRef}
              modules={modules}
              formats={formats}
              value={content} 
              onChange={(content, delta, source, editor) => {
                setContent(editor.getHTML())}} />

            {/* <ShowColumn dangerouslySetInnerHTML={{ __html : content}}>
            </ShowColumn> */}
            {/* <textarea value={content} /> */}
            {/* <ReactQuill theme="snow" value={value} onChange={setValue} /> */}
          <br></br>
          <div className="row">
              <div className="col" style={{    paddingTop: '2rem'}}>             
                    {/* <ThumbnailInputControl type='file' onChange={(e)=>thumbPictureChange(e)} ></ThumbnailInputControl> */}
                    <label htmlFor='thumbnail' >썸네일 이미지 설정</label>
                    <input id='thumbnail' type="file" name="uploadFile" accept="image/*" onChange={(e)=>thumbPictureChange(e)} 
                                className="form-control"/>
              </div>
              <div className="col">   
              <img src={thumbnailUrl} alt="대표이미지" style={{width: '10rem', height: '10rem' ,marginLeft: '8rem'}} />           
                {/* <CardShowColumn>
                  <Card id='showCard' border="primary" style={{ width: '13rem', margin: '1rem' }} >
                  <Card.Img variant="top" src={thumbnailUrl} style={{ width: '205px', height: '142px', borderBottom: '1px' }} />      
                  
                      <Card.Body   >
                        <Card.Title style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</Card.Title>              
                      </Card.Body>
                      <Card.Footer className="text-muted">now</Card.Footer>
                  </Card>
              </CardShowColumn>        */}
              </div>
            </div>
          <hr></hr>
          <ColumnFooter onClick={e=> {
            window.location.href = "/blog"
          }}> 취소 </ColumnFooter>
          <ColumnFooter onClick={e=>BlogWrite()}> 글쓰기 </ColumnFooter>
        </WriteColumn>

        <BlogFormDivider/>

        <ShowColumn>
            <div className="alert alert-primary" role="alert">블로그 미리 보기 화면입니다</div>

          
          <MirrorShowColumn>
            <MirrorTitleShowControl >{title}</MirrorTitleShowControl>
            <MirrorCategoryShowControl>{category}</MirrorCategoryShowControl>
            <MirrorShowControl dangerouslySetInnerHTML={{__html:content} }></MirrorShowControl>

          </MirrorShowColumn>
          

        </ShowColumn>

      </Container>
    </>

      
  );
}


export default BlogWriteForm;