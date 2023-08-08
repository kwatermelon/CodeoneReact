import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button} from 'react-bootstrap';
import comment from '../../assets/blog/comment.png'
import BlogCardReplyComponent from './BlogCardReplyComponent';

const BlogCardReplyList = (props) => {



      

      return (
        <>

        <div  className="container row" style={{display: "flex" , borderBottom: "1px solid black"}}>
                  <div className='col-sm-1' style={{justifyContent:'center'}} >
                    <img src={props.reply.profileUrl}   style={{width: '3rem' , marginTop:"1rem" , borderRadius: '2rem'}} />
                  </div>
                  <div className='col-8' style={{paddingTop:"10px"}}>
                      <h2 style={{fontSize:'large'}}>{props.reply.writer} &nbsp;&nbsp;  {props.reply.regdate.substr(0,10)}</h2>
                      <h2 style={{fontSize:'x-large' , fontWeight:"bold"}}>{props.reply.content}</h2>
                  </div>
              </div>
        </>
    )  
  }


export default BlogCardReplyList;