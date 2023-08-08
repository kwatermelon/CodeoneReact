// import * as React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Button} from 'react-bootstrap';
import React, { useEffect, useState, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { RangeStatic } from 'quill';
import { useParams } from 'react-router-dom';
import { ArrowRight, Heart, HeartFill } from 'react-bootstrap-icons';
import BlogHeader from './BlogHeader';


const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

`;
const SearchButton = styled.button`
  padding: 5px 10px;
  background-color: #7885d6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 auto;
`;

const BlogReadForm = () => {
  const [blog, setBlog] = useState({});
  const [blogReplyList, setBlogReplyList] = useState({});
  const [user, setUser] = useState({});

  const [blogReply, setBlogReply] = useState("");
  const [like, setLike] = useState(false);
    // 글의 seq
    const seq = useParams()["seq"];
    // const params = {"seq" : 4}
    const getBlog = async (seq) => {
      await axios.get("http://localhost/blog/getBlog", {params: {seq: seq}}) // seq를 지정해줘서 그 글을 서버로부터 받아옴
        .then(res => {
          if(res.status === 200) {
            console.log("getBlog")
            setBlog(res.data.blog);
            setUser(res.data.user);
            
          }
        })
        .catch(error => {
          console.log(error)
        })
    }

    const getBlogReply = async(seq) => {
        await axios.get("http://localhost/blogReply/getAllBlogReply", {params: {blogseq: seq}}) // seq를 지정해줘서 글의 댓글을 서버로부터 받아옴
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

    const writeBlogReply = async () => {
        //formdata        
        const formData = new FormData();
        formData.append("writer", window.localStorage.getItem('userEmail'));
        formData.append("blogReply", blogReply);
        formData.append("blogseq", seq);
            
        await axios({
            method: 'post',
            url: "http://localhost/blogReply/write", 
            data: formData,
            withCredentials:true,
            headers: {
              'Content-Type': 'multipart/form-data',
              'jwt': '123456789'
            },
          }).then(res => {
            console.log(res.status);
            if(res.status === 200){
                alert("성공적으로 댓글을 등록했습니다.");
                setBlogReplyList(res.data)
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
            <img src={user.filename} style={{width: '8rem' , borderRadius: '2rem'}} ></img>
            <h2>{user.id}</h2>
          </div>        
        </>
      )
    }

    const blogReplyForm = () => {

     return (
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
     )
    }



    const blogReplyComp = () => {
        let components = [];
        console.log(blogReplyList.length + " blogReplyList length");
        blogReplyList.map((blogReply,idx) => {
          let component = (
            <div key={idx} className="container row" style={{display: "flex" , borderBottom: "1px solid black"}}>
              <div>
                <div>
                  <img src={blogReply.profileUrl}  style={{width:"5rem", float: "left"}}/>
                  <div>
                    {blogReply.writer}
                  </div>
                </div>
                <div>
                  {blogReply.content}

                </div>

              </div>
            </div>

          )
          

          components.push(component)

        })
      
        return components;

    }

  const dolike = async () => {

    if(window.localStorage.getItem('userEmail') === undefined || window.localStorage.getItem('userEmail') === null) {
      alert("로그인이 필요합니다.")
      window.location.href = "/login";
    }

    const formData = new FormData();

    formData.append('blogseq', seq);
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
      console.log(res.status);
      if(res.status === 200){
          alert(message);
          setLike(!like);
      }else{
          alert("등록되지 않았습니다");
      }
  })
  .catch(function(err){
      alert(err);
  })

    
  }

  useEffect(()=> {  
    alert("hello")
  }, [blogReplyList])

  useEffect( ()=>{
    getBlog(seq);
    getBlogReply(seq);

    if(window.localStorage.getItem("userEmail") !== undefined && window.localStorage.getItem("userEmail") !== null) {
      getBloglike(seq);
    }
  },[]);    

    // dangerouslySetInnerHTML 은 innerHTML의 역할을 대신한다.
    return (
      <>
       <BlogHeader writer={blog.writer} seq={seq}/>
{/* 
       <h1 value={item.title} readOnly />
       <br></br>
       <div dangerouslySetInnerHTML={{__html:item.content} }></div>  */}

    <div style={{border:"1px solid black" , width:"100rem"}}>
        <table className="table table-sm">
        <colgroup>
            <col style={{width:"100px"}} /><col />
        </colgroup>
        <tbody>
        <tr>
            <th>글쓴이</th>
            <td>
                {user.id}
            </td>
        </tr>
        <tr>
            <th className="align-middle">제목</th>
            <td>
                {blog.title}

            </td>
        </tr>
        <tr>
            <th>작성일</th>
            <td>
                {blog.regdate}
            </td>
        </tr>
        <tr>	
            <td colSpan="2" dangerouslySetInnerHTML={{__html:blog.content} }  style={{border:"1px solid black" , width:"100rem", height:"500px"}}>
            </td>
        </tr>
        <tr>

        </tr>
        </tbody>
      </table>

      <div>
       {blogReadProfile()}
      </div>

      <hr></hr>
      <div style={{marginBottom:"1rem"}}>       
       <div  onClick={dolike}>
        <label htmlFor='likeIcon'>좋아요</label>
        {like? <HeartFill style={{color:"crimson"}} id='likeIcon' /> :   <Heart id='likeIcon' />}
       </div>
      </div>

      <div>
        {window.localStorage.getItem("userEmail") !== null ? (blogReplyForm()) : (<></>) }
        {blogReplyList.length > 0 ? blogReplyComp() :  (<></>) }

      </div>


  </div>
    
      </>
    )
}


export default BlogReadForm;