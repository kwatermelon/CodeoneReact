import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import favorite from '../../assets/blog/favorite.png'
import comment from '../../assets/blog/comment.png'
import axios from 'axios';
import { Card, Button, Offcanvas, Container} from 'react-bootstrap';
import { ArrowRight, Heart, HeartFill } from 'react-bootstrap-icons';
import BlogCardReplyList from './BlogCardReplyList';
import styled from 'styled-components';

const BlogUpdateButton = styled.button`
  padding: 5px 10px;
  background-color: #7885d6;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 25px;
  margin-right: 1rem;
  float: right;
`;

const BlogDeleteButton = styled.button`
  padding: 5px 10px;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 25px;
  margin-right: 1rem;
  float: right;
`;


const BlogCard = (props) => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [like, setLike] = useState(false);
  const handleClose = () => setShow(false);
  const useNavi = useNavigate();
  const handleShow = async () => {
    await axios.get("http://localhost/blog/getBlogWriter", {params: {writer: props.writer }}) // writer 정보를 받아옴
        .then(res => {
          if(res.status === 200) {
            setUser(res.data);
            setShow(true);            
          }
        })
        .catch(error => {
          console.log(error)
        })
  } 
      
  const getBloglike = async(seq) => {
    const params = {params: {blogseq: seq , useremail: window.localStorage.getItem("userEmail")}}

    await axios.get("http://localhost/bloglike/getWhoLikeThisBlog", params) // seq를 지정해줘서 좋아요정보 서버로부터 받아옴
    .then(res => {
      if(res.status === 200) {
        console.log("지금 로그인한 사람이 이 블로그를 좋아요 했는지 알 수 있음")
        setLike(true)       
      }
    })
    .catch(error => {
      console.log(error)
    })
}
  
  
  const dolike = async () => {

    if(window.localStorage.getItem('userEmail') === undefined || window.localStorage.getItem('userEmail') === null) {
      alert("로그인이 필요합니다.")
      window.location.href = "/login";
    }

    const formData = new FormData();

    formData.append('blogseq', props.seq);
    formData.append('useremail', window.localStorage.getItem('userEmail'));
    let url = "http://localhost/bloglike/dolike"
    let message = "좋아요";
    if(like) {
      url = "http://localhost/bloglike/donotlike"
      message = "좋아요 취소"
    }

    await axios({
      method: 'post',
      url: url, 
      data: formData,
      withCredentials:true,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }).then(res => {
      if(res.status === 200){
          setLike(!like);
      }else{
          alert("등록되지 않았습니다");
      }
  })
  .catch(function(err){
      alert(err);
  })
   
  }

      const blogReadProfile = () => {
        return (
          <>
            <div className='container' style={{display: "flex" , borderBottom: "1px solid black"}}>
              <div className='col-1' >
                <img src={user.filename} style={{width: '5rem' , borderRadius: '2rem'}} ></img>

              </div>
              <div className='col-8' style={{paddingTop:"10px"}}>
                <h2 style={{fontSize:'x-large' , fontWeight:"bold" , marginLeft:"1rem"}}>{user.id}</h2>
                <h2 style={{fontSize:'x-large' , marginLeft:"1rem"}}>{user.email}</h2>
              </div>
            </div>        
          </>
        )
      }
      


    const UpdateBlog = () => {
      useNavi(`/blogUpdateForm/${props.seq}`)
    }
  
    const DeleteBlog = () => {
      if(window.confirm("정말 삭제하시겠습니까?")) {
        axios.get(`http://localhost/blog/deleteBlog?seq=${props.seq}`)
            .then((res)=>{
              // console.log(res.status)
              if(res.status === 200) {
                alert("삭제 되었습니다.")
                window.location.href = "/blog"
              }
            })
      }
    }



    useEffect( ()=>{
      // getBlogReply(props.seq);
  
      if(window.localStorage.getItem("userEmail") !== undefined && window.localStorage.getItem("userEmail") !== null) {
        getBloglike(props.seq);
      }
    },[]);





    const [blogReplyList, setBlogReplyList] = useState([]);
    const [blogReply, setBlogReply] = useState("");



    // 댓글 받아오는 함수
    const getBlogReply = async () => {
      console.log("getBlogReply")
      axios.get("http://localhost/blogReply/getAllBlogReply", {params: {blogseq: props.seq}}) // seq를 지정해줘서 글의 댓글을 서버로부터 받아옴
      .then(res => {
        if(res.status === 200) {
          console.log(res.data + " this is from getBlogReply")
          setBlogReplyList(res.data)            
        }
      })
      .catch(error => {
        console.log(error)
      })
    }


    
// 댓글 쓰기 함수    
const writeBlogReply =  async () => {

  if(window.localStorage.getItem("userEmail") === undefined ||window.localStorage.getItem("userEmail") === null) {
    alert("로그인해주세요")
    return false
  }

  if(blogReply.trim().length === 0) {
    alert("댓글을 작성해주세요");
    return false;
}
  //formdata        
  const formData = new FormData();
  formData.append("writer", window.localStorage.getItem('userEmail'));
  formData.append("blogReply", blogReply);
  formData.append("blogseq",  props.seq);
      
 await axios({
      method: 'post',
      url: "http://localhost/blogReply/write", 
      data: formData,
      withCredentials:true,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }).then(res => {

      if(res.status === 200){
          alert("성공적으로 댓글을 등록했습니다.");
          // getBlogReply()
          setBlogReplyList(res.data)
      }else{
          alert("등록되지 않았습니다");
      }
  })
  .catch(function(err){
      alert(err);
  })

}


    useEffect(()=>{
      getBlogReply()        
    }, [])




    return (
      <>
              <Card style={{ width: '18rem', margin: '1rem' , padding: '0', borderRadius: '0'}} >
                <Card.Img variant="top" src={props.thumbnail}  style={{ cursor:'pointer',height: '11rem'}} onClick={handleShow} />
                <Card.Body  style={{ cursor:'pointer'}} onClick={handleShow} >
                  <Card.Title>{props.title}</Card.Title>              
                </Card.Body>
                <Card.Footer  style={{borderTop: '1px solid var(--border4)'}} >
                  <div style={{float: 'left'}}>
                    <span style={{fontSize: "small"}}>by.{props.writer}</span>
                  </div>
                  <div style={{float: 'right'}}>

                      <img src={favorite} style={{width: '28px', margin: '1px'}}></img>
                      <span>{props.likes}</span>

                    <img src={comment} style={{width: '26px' , margin: '1px'}}></img>
                    <span>{props.replies}</span>
                  </div>                
                </Card.Footer>
            </Card>
            <Offcanvas show={show} onHide={handleClose} placement={'end'} style={{width:"60%"}}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title style={{fontSize:'xx-large'}}>{props.title}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Container>
                    <div dangerouslySetInnerHTML={{__html:props.content} }  style={{ padding:"1rem" , minHeight:"500px", marginBottom:"5rem"}}/>
                    <div>
                      {blogReadProfile()}
                    </div>
                    <div className='row' style={{ display:"flex"}}>    
                      <div className='col' style={{ display:"flex" , padding:"1rem"}}>
                        <div onClick={dolike}>
                          <label htmlFor='likeIcon' style={{fontSize:"x-large"}}>좋아요</label>
                          {like? <HeartFill style={{color:"crimson"}} id='likeIcon' /> :   <Heart id='likeIcon' />}
                        </div>
                      </div>
                      <div className='col' style={{float:"right",  padding:"1rem"}}>
                      { user.email === window.localStorage.getItem("userEmail") ?
                            <div style={{ display:"flex" , float:"right"}}>
                              <BlogUpdateButton onClick={UpdateBlog}>수정</BlogUpdateButton>
                              <BlogDeleteButton onClick={DeleteBlog}>삭제</BlogDeleteButton> 
                            </div>
                            :
                            <>        
                            </>
                          }
                      </div>
                    </div>
                    <div>      
                        <form className="row g-3">
                          <div className="mb-3">
                              <label htmlFor="exampleFormControlTextarea1" className="form-label">댓글을 작성해 주세요</label>
                              <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder='댓글은 여러분의 얼굴입니다.' value={blogReply} onChange={(e) => setBlogReply(e.target.value)}></textarea>
                              <div className="col-auto">
                              <button className="btn btn-primary" style={{float:"right", marginTop: "1rem" }} onClick={writeBlogReply} >댓글달기</button>
                              </div>
                          </div>
                        </form>
                        <hr></hr>
                    </div> 
                    {
                        blogReplyList.map((reply,idx) => {
                          return(
                            <BlogCardReplyList key={idx} seq={props.seq} reply={reply} />
                          );
                        })
                    }
   

                </Container>

              </Offcanvas.Body>
            </Offcanvas>
      </>
    )
}



export default BlogCard;