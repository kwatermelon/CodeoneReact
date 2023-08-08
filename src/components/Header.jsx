import React from "react";
import { Card, Button, Dropdown} from 'react-bootstrap';
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import home from "../assets/headerIcon/home.png";
import calendar from "../assets/headerIcon/cal.png";
import blog from "../assets/headerIcon/blog.png";
import employment from "../assets/headerIcon/employment.png";
import lecture from "../assets/headerIcon/lecture.png";
import shop from "../assets/headerIcon/shop.png";
import study from "../assets/headerIcon/study.png";
import ThemeToggle from "../theme/ThemeToggle";
import { useTheme } from "../context/themeProvider";
import axios from "axios";
import "./header.css";
import LoginModal from "./loginComp/LoginModal";



const Header = () => {
    // const ThemeMode = useTheme();
    const [ThemeMode, toggleTheme] = useTheme();
    const BASE_USER_URL  = "http://localhost/user";
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



    return (
        <>
            <nav>
            <StyledHeader>
                <li>
                    <Link to="/">
                        <LogoImage src={logo} alt="logo" />
                    </Link>
                </li>
                <LeftMenu>
                    <Link to="/">
                        <img src={home} alt="logo" />
                    </Link>
                    <Link to="/blog">
                        <img src={blog} alt="logo" />
                    </Link>
                    <Link to="/studygroup">
                        <img src={study} alt="logo" />
                    </Link>

                    <Link to="/storelist">
                        <img src={shop} alt="logo" />
                    </Link>
                    <Link to="/lecturelist">
                        <img src={lecture} alt="logo" />
                    </Link>
                    <Link to="/calendar">
                        <img src={calendar} alt="logo" />
                    </Link>
                    <Link to="/joblist">
                        <img src={employment} alt="logo" />
                    </Link>
                </LeftMenu>

                <RigthMenu>
                    {window.localStorage.getItem("userId") !== null ? (
                        <>
                        <span className='profileNameHeader'>{window.localStorage.getItem("userId")} 님 환영합니다.</span>     

                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{background: 'transparent', border: 'none', paddingTop: '13px'}}>
                                <img  className='profilePictureHeader' src={window.localStorage.getItem("fileName")} alt="logo"/>  
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/mypagenew">마이페이지</Dropdown.Item>
                                <Dropdown.Item onClick={logout}> 로그아웃 </Dropdown.Item>
                            </Dropdown.Menu>
                        
                        </Dropdown>                                 
                        {/* <Link to="/mypagenew">
                            <img  className='profilePictureHeader' src={window.localStorage.getItem("fileName")} alt="logo"/>   
                        </Link> */}
                        </>
                    ) : (
                        <LoginModal/>
                    )}
                    <ThemeToggle toggle={toggleTheme} mode={ThemeMode}>
                        Code:One
                    </ThemeToggle>
                </RigthMenu>
            </StyledHeader>
        </nav>
        </>

    );
};

export default Header;

const LogoImage = styled.img`
    width: 150px;
`;

const StyledHeader = styled.ul`
    display: flex;
    align-items: center;
    height: 102px;
    padding-top: 0px;
    border-bottom: ${({ theme }) => theme.borderColor};
    justify-content: space-between;
`;

const LeftMenu = styled.li`
    display: flex;
    padding-left: 2rem;
    & a {
        margin-right: 2rem;
    }
`;

const RigthMenu = styled.li`
    display: flex;
    font-size: 16px;
    font-weight: 500;
    & a {
        margin: auto;
        margin-right: 1rem;
    }
`;
