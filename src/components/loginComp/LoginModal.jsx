import React, { useState, useEffect } from "react";
import { Modal, Button, Container, Row, Col , Form, InputGroup } from 'react-bootstrap';
import axios from "axios";
import google from '../../assets/headerIcon/google.png';
import naver from '../../assets/headerIcon/naver.png';
import kakao from '../../assets/headerIcon/kakao.png';
import Loading from '../../components/loading/loading';
import SocialLoading from "../loading/socialloading";
import logo from '../../assets/logo.png'
import './loginPage.css';
import { Border } from "react-bootstrap-icons";
import styled from 'styled-components';

const LoginWrapper = styled.button`
  bottom: 4%;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 96px;
  height: 48px;
  border-radius: 30px;
`;



function LoginModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const BASE_USER_URL  = "http://localhost/user";
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    // 이메일 정규식
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const googleUrl = "http://localhost/auth/GOOGLE";
    const naverUrl = "http://localhost/auth/NAVER";
    const kakaoUrl = "http://localhost/auth/KAKAO";

    function loginBtn(){        
         // 이메일 유효성검사하기
         if (!emailRegex.test(email)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        } else {
            setLoading(true);
        }
        // api 호출 전에 true로 변경하여 로딩화면 띄우기
        axios.post(`${BASE_USER_URL}/login`, null, {params:{"email":email}})
        .then(function(resp){
            if(resp.status === 204){                
                alert("가입된 이메일이 아닙니다");
                setLoading(false)
                return;
            }
            else if (resp.status === 200){      // 메일전송 완료
             
                window.location.href = "/loginAf";
                setLoading(false);
            }
            

        })
        .catch(function(err){
            setLoading(false);
            alert(err);
        })
    }


    function signUpbtn() {
        window.location.href="/signUpBefore"
    }

    const lodingpage = ()=> {
        setSocialLoading(true);
    }


    const propscheck = () => {
        console.log(props)
        if(props.show === true) {
            setShow(true);
        }
    }



    useEffect(()=> {
        propscheck()
        },[]
      )


    return(
        <>
        { show !== true ?  
           <LoginWrapper  onClick={handleShow}>
                로그인
            </LoginWrapper>
            : <></>
        } 
                   {/* <LoginWrapper  onClick={handleShow}>
                로그인
            </LoginWrapper> */}
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
                로그인
        </Modal.Header>
        <Modal.Body>
        <div>
            {loading ? <Loading mailFlag={sendEmail} /> : 
                socialLoading ? <SocialLoading/> :
                    <Container>
                        <Row>
                            <Col  md={3} style={{borderRight: "1px solid" }}>
                             <img src={logo} alt="logo" className="loginLogo" />
                            </Col>
                            <Col  md={9}>
                                    <Form.Label htmlFor="inputEmail">이메일로 로그인</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                        placeholder="이메일을 입력해주세요"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        id="inputEmail" type='text' value={email} onChange={(e)=>setEmail(e.target.value)} 
                                        />
                                        <Button id="button-addon2"  onClick={loginBtn}>
                                                로그인
                                        </Button>
                                    </InputGroup>


                                        {/* <Form.Control className="mb-3" id="inputEmail" type='text' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="이메일을 입력해주세요"/> */}
                                     
                                        <br></br>

                                        <span>소셜계정으로 로그인</span>
                                        <br></br>
                                        <a href={googleUrl} onClick={lodingpage}>          
                                            <img src={google} alt="logo"  className="socialLoginImage"/>
                                        </a>                                    
                                        <a href={naverUrl}>          
                                            <img src={naver} alt="logo"  className="socialLoginImage"/>
                                        </a>
                                        <a href={kakaoUrl}>          
                                            <img src={kakao} alt="logo"  className="socialLoginImage"/>
                                        </a>

                                        <br></br>
                                        <br></br>
                                       <div >
                                            <span>아직 회원이 아니세요?</span>
                                            <Button onClick={signUpbtn} style={{marginLeft: '12px'}}>회원가입</Button>
                                        </div>
                           
                            </Col>
                        </Row>
                    </Container>            
            }
        </div>

        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer> */}
      </Modal>     
        
        </>

    )
}

export default LoginModal;