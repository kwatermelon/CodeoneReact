import axios from 'axios';
import React from 'react';
import styled from 'styled-components';
import BlogOffCanvas from '../../blog/BlogOffCanvas';
import { useState } from 'react';

const RecrutimentPartItem = styled.span`
    background-color: #afafaf;
    border-radius: 15px;
    font-size: 16px;
    padding: 3px 10px;
    margin-right: 5px;
    color: #002bff;
`

const TechnologyStackImg = styled.img`
`

function MyPageLikeBloggroupListItemComponent(props) {
    const[show, setShow] = useState(false);
    const number = props.number;
    const blog = props.blog;


   

    function clickReadBtn() {

        setShow(true)
    }


    const handleClose = () => {setShow(false)};

    return(
        <>
            <tr>
                <td>{number}</td>
                <td style={{overFlow:"hidden" , textOverflow:'ellipsis',  whiteSpace:'nowrap'}}>{blog.title}</td>
                <td>{blog.regdate.substr(0, 10)}</td>
                <td>{blog.likes}</td>
                <td>{blog.replies}</td>
                <td>
                    <button type="button" className="btn btn-primary" onClick={clickReadBtn}>보러가기</button>
                </td>
            </tr>
            <BlogOffCanvas key={blog.seq} blog={blog} show={show} handleClose={handleClose}/>
        </>

    );
}

export default MyPageLikeBloggroupListItemComponent;