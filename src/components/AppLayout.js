import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useTheme } from "../context/themeProvider";
import { FlexContainer } from "../style/styles";
import Header from "./Header";
import { json } from "react-router-dom";

const BASE_USER_URL = "http://localhost/user";
const AppLayout = ({ children }) => {
    const [user, setUser] = useState(null);

    // session Check
    const getSessionUser = () => {
        axios
            .get(`${BASE_USER_URL}/getSessionUser`, {
                withCredentials: true,
            })
            .then((result) => {
                if (result.data.email !== undefined) {
                    console.log("session User exist");
                    saveUserToLocalStorage(result.data);
                    setUser(result.data);
                    localStorage.setItem("login", JSON.stringify(result.data));         // 로그인으로 저장                    
                } else {
                    console.log("no session USer");
                    window.localStorage.clear();
                    setUser(null);
                }
            });
    };

    const saveUserToLocalStorage = ({
        id,
        name,
        email,
        filename,
        phoneNumber,

        seq,//캘린더에서 필요해서
        auth, ////채용에서 추가
    }) => {
        window.localStorage.setItem("userId", id);
        window.localStorage.setItem("userName", name);
        window.localStorage.setItem("userEmail", email);
        // console.log(filename);
        window.localStorage.setItem("fileName", filename);
        window.localStorage.setItem("phoneNumber", phoneNumber);
        window.localStorage.setItem("userSeq", seq); //캘린더에서 추가
        window.localStorage.setItem("auth", auth); //채용에서 추가

    };

    useEffect(() => {
        getSessionUser();
        // checkEmail()
    }, []);

    return (
        <WrapContainer>
            <Header user={user} />
            <FlexContainer>{children}</FlexContainer>
        </WrapContainer>
    );
};

export default AppLayout;

const WrapContainer = styled.main`
    min-height: 100%;
    position: relative;
    max-width: 1760px;
    align-items: center;
    margin: 0 auto;
    padding-top: 1rem;
`;
