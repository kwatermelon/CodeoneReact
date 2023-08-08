import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button, Row, Col, Container} from 'react-bootstrap';
import account from '../../../assets/headerIcon/defaultAccount.png';
import '../mypage.css';
import styled from 'styled-components';

const MyPageDetail = styled.div`
    margin: 0px auto;
    border-bottom: 1px solid black;
    height: 5rem;
`


function MyPage(props){
    const BASE_USER_URL  = "http://localhost/user";
    const input = document.createElement('input');
    const [profileUrl, setProfileUrl] = useState(window.localStorage.getItem('fileName'));
    const [multipartfile, setMultipartfile] = useState(null);
    const [isChangePicture, setIsChangePicture] = useState(false);
    const [isDefaultPicture, setDefaultPicture] = useState(false);
    
    const logout = () => {
        axios.get(`${BASE_USER_URL}/logout`, {
            withCredentials:true 
        })
            .then((result) => {
                if(result.status === 200) {
                    window.localStorage.clear();
                    alert('안전하게 로그아웃 되었습니다.')
                    window.location.href = "http://localhost:3000/";
                }
            })
    }


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
        <div>
            <div className=" mypageMain">

                <section className="flex-container">
                    <div className="pictureAndUser">
                        <div className="picture">
                            <img className="userImage" src={profileUrl} alt="logo"/> 
                            <br></br>
                            <Button onClick={(e)=>{pictureChange(e)}} >이미지 수정</Button>
                            <br></br>
                            <Button name="deletePicture" onClick={(e)=>pictureChange(e)}>이미지 제거</Button>
                        </div>
                        <div className="userinfo">
                            <h1>{window.localStorage.getItem('userName')}</h1>
                            <h1>{window.localStorage.getItem('userId')}</h1>
                             <h1 id="emailaddress">{window.localStorage.getItem('userEmail')}</h1>
                        </div>
                    </div>

                    <Container>

                            <Row>
                                <Col sm={2}>
                                    <span>프로필 수정</span>
                                </Col>
                                <Col sm={8}>
                                        <Button  className="btn btn-primary" onClick={profileChange}>프로필 수정</Button>
                                </Col>
                            </Row>


                        <Row>
                        <Col sm={2}>
                                    <span>로그아웃</span>
                                </Col>
                                <Col sm={8}>
                                 <Button className="btn btn-danger" onClick={logout}>로그아웃</Button>
                                </Col>
                        </Row>
                    </Container>
     

                </section>



            </div>
        </div>
    );

}

export default MyPage;