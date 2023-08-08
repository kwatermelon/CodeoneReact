import React, { useState, useRef, useEffect } from 'react';

const BlogCardReplyComponent = (props) => {
     
      

      return (
        <div  className="container row" style={{display: "flex" , borderBottom: "1px solid black"}}>
          <div className='col-sm-1' style={{justifyContent:'center'}} >
            <img src={props.reply.profileUrl}   style={{width: '3rem' , marginTop:"1rem" , borderRadius: '2rem'}} />
          </div>
          <div className='col-8' style={{paddingTop:"10px"}}>
              <h2 style={{fontSize:'large'}}>{props.reply.writer}</h2>
              <h2 style={{fontSize:'x-large' , fontWeight:"bold"}}>{props.reply.content}</h2>
          </div>
      </div>
    )  
  }


export default BlogCardReplyComponent;