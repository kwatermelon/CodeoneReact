import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button, Row, Col, Container, Nav, Tab, Tabs} from 'react-bootstrap';
import account from '../../../assets/headerIcon/defaultAccount.png';
import '../mypage.css';
import styled from 'styled-components';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyPageStudygroupListMain from "../studygroup/MyPageStudygroupListMain";
import MyPageBloggroupListMain from "../blogInfo/MyPageBloggroupListMain";
import { Gear } from 'react-bootstrap-icons';
const MyPageDetail = styled.div`
    margin: 0px auto;
    border-bottom: 1px solid black;
    height: 5rem;
`

const MyPageMainProfile = styled.div`
  background: transparent;
  width: 100%;
//   border: 1px solid black;
  overflow : auto;
  
//   text-align: center;
`
const MyPageMainProfileId = styled.div`
  font-size: x-large;
`

const SettingButton = styled.button`
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;

`


function MyPageMemberInfoMainNew(){
    const BASE_USER_URL  = "http://localhost/user";
    const input = document.createElement('input');
    const [profileUrl, setProfileUrl] = useState(window.localStorage.getItem('fileName'));
    const [multipartfile, setMultipartfile] = useState(null);
    const [isChangePicture, setIsChangePicture] = useState(false);
    const [isDefaultPicture, setDefaultPicture] = useState(false);
    

    // 이미지 사진 바꾸기
    const pictureChange = async (e) => {        
        
        if(e.target.name === "deletePicture") {
            setDefaultPicture(true);
            const base64Response =  await fetch(account);
            const blob = await base64Response.blob();
            setMultipartfile(account);
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise((resolve)=> {
                reader.onload = () => {
                    setProfileUrl(account);
                    resolve();
                }
            })
        }
        
        // 사진을 지우지 않고 바꿨을 경우
        setIsChangePicture(true);
        // 임의 생성        
        input.setAttribute('type', 'file');
        input.click();

        input.onchange = async () => {
            const fileBlob = input.files[0];
            setMultipartfile(fileBlob);
            const reader = new FileReader();
            reader.readAsDataURL(fileBlob);

          return new Promise((resolve) => {
                reader.onload = () => {
                    // console.log(reader.result)   
                setProfileUrl(reader.result);
                resolve();
                };
          });
        }
    }

    const profileChange = async () => {
        const formData = new FormData();
            
        const name = window.localStorage.getItem('userName');
        const id = window.localStorage.getItem('userId');
        const email = window.localStorage.getItem('userEmail');
        const file = multipartfile;
        // 프로필이미지 수정이 있는 경우
        if(isChangePicture) {
            // console.log("file true")
            formData.append("filename", "");
            formData.append("multipartFiles", file);
            
        }else if (isDefaultPicture) {
            // console.log("isDefault")
            formData.append("filename", "");
            formData.append("multipartFiles", null);            
        } else {
            // console.log("file false")
            formData.append("filename", profileUrl)
            formData.append("multipartFiles", null);
        }
        formData.append("name", name);
        formData.append("id", id);
        formData.append("email", email);
 
       const res =  await axios({
            method: 'post',
            url: `${BASE_USER_URL}/profileChange`, 
            data: formData,
            withCredentials:true,
            headers: {
              'Content-Type': 'multipart/form-data',
              'jwt': '123456789'
            },
          })

        if(res.status === 200) {
            // console.log(res.data.filename + " myPage profilechange")
            window.localStorage.setItem("userId", res.data.id);
            window.localStorage.setItem("userName", res.data.name);
            window.localStorage.setItem("userEmail", res.data.email);
            window.localStorage.setItem("fileName", res.data.filename);
            window.localStorage.setItem("phoneNumber", res.data.phoneNumber);
            alert("회원정보가 수정 되었습니다")
            window.location.href= "http://localhost:3000/";
        }
        setIsChangePicture(false);
        setDefaultPicture(false);
    }




    return(

            <MyPageMainProfile>
                    {/* <MyPageMainProfileId>{window.localStorage.getItem('userId')}</MyPageMainProfileId> */}

                    <div className="pictureAndUser">
                        <div className="picture">
                            <img className="userImage" src={profileUrl} alt="logo"/> 
                            <br></br>
                            <Button onClick={(e)=>{pictureChange(e)}} >이미지 수정</Button>
                            <br></br>
                            <Button onClick={profileChange} >수정 저장</Button>

                        </div>
                        <div className="userinfo">
                            <h1>{window.localStorage.getItem('userName')}</h1>
                            <h1>{window.localStorage.getItem('userId')}</h1>
                             <h1 id="emailaddress">{window.localStorage.getItem('userEmail')}</h1>
                        </div>

                    </div>

                    <div className="tabsdiv">

                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <button className="nav-link active" id="nav-blog-tab" data-bs-toggle="tab" data-bs-target="#nav-blog" type="button" role="tab" aria-controls="nav-blog" aria-selected="true">       
                                    블로그
                                </button>
                                <button className="nav-link" id="nav-study-tab" data-bs-toggle="tab" data-bs-target="#nav-study" type="button" role="tab" aria-controls="nav-study" aria-selected="false">스터디</button>

                            </div>
                        </nav>
                    </div>
                        <Container>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-blog" role="tabpanel" aria-labelledby="nav-blog-tab">
                                    <MyPageBloggroupListMain/>
                                </div>
                                <div className="tab-pane fade" id="nav-study" role="tabpanel" aria-labelledby="nav-study-tab">
                                    <MyPageStudygroupListMain />
                                </div>
                            </div>
                        </Container>
               
    




            </MyPageMainProfile>

    );

}

export default MyPageMemberInfoMainNew;