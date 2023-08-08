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


const BlogOffCanvas = (props) => {
    const [user, setUser] = useState({})
    // const [show, setShow] = useState(props.show);
    const [like, setLike] = useState(false);

    
    const [blogReplyList, setBlogReplyList] = useState([]);
    const [blogReply, setBlogReply] = useState("");

    const dolike = ()=> {
        alert("dolike")
    }

    const UpdateBlog  = ()=> {
        alert("UpdateBlog")
    }

    const DeleteBlog = () => {
        alert("DeleteBlog")
    }





    // 댓글 받아오는 함수
    const getBlogReply = async () => {
      console.log("getBlogReply")
      axios.get("http://localhost/blogReply/getAllBlogReply", {params: {blogseq: props.blog.seq}}) // seq를 지정해줘서 글의 댓글을 서버로부터 받아옴
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


    useEffect( () => {
      getBlogReply()
    },[])


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

    return (
        <Offcanvas show={props.show} onHide={props.handleClose} placement={'end'} style={{width:"60%"}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{fontSize:'xx-large'}}>{props.blog.title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
              <div dangerouslySetInnerHTML={{__html:props.blog.content} }  style={{ padding:"1rem" , minHeight:"500px", marginBottom:"5rem"}}/>
              <div>
                {blogReadProfile()}
              </div>
              <div className='row' style={{ display:"flex"}}>    
                <div className='col' style={{ display:"flex" , padding:"1rem"}}>
                  <div onClick={dolike}>
                    <label htmlFor='likeIcon' style={{fontSize:"x-large"}}>좋아요</label>
                    <HeartFill style={{color:"crimson"}} id='likeIcon' />
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
                {blogReplyList.map((reply, idx) => {
                  return(
                    <BlogCardReplyList seq={props.blog.seq} reply={reply}/>
                  )
                })}
            
              </div>

          </Container>

        </Offcanvas.Body>
      </Offcanvas>



    )


}

export default BlogOffCanvas;