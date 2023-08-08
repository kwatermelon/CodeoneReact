import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const HeaderArea = styled.div`
  position: relative;
  width: 70%%;
  height: 80px;
`;

const HeaderWrap = styled.div`
  position: fixed;
  top: 116px;
  left: 25rem;
  z-index: 1;
  width: 69%;
  height: 50px;
  transition: 0.4s ease;
  background-color: #7885d6;
  font-size: 30px;
  color: ivory;
  &.hide {
    transform: translateY(-80px);
  }
  margin:0 auto;
`;

const SearchButton = styled.button`
  padding: 5px 10px;
  background-color: #7885d6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 25px;
  margin: 0 auto;
  float: right;
`;


const throttle = function (callback, waitTime) {
  let timerId = null;

  return (e) => {
    // console.log('함수 실행', timerId);
    if (timerId) return;
    timerId = setTimeout(() => {
      //console.log('this', this, ' e', e);
      callback.call(this, e);
      timerId = null;
    }, waitTime);
  };
};



const BlogHeader = (props) => {
  const [hide, setHide] = useState(false);
  const [pageY, setPageY] = useState(0);
  const documentRef = useRef(document);

  const handleScroll = () => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const hide = pageYOffset !== 0 && deltaY >= 0;

    // console.log('pageYOFFset', pageYOffset); //현재 스크롤 위치
    // console.log('daltaY', deltaY, 'pageY', pageY); //
    // console.log('hide', hide);

    setHide(hide); //false
    setPageY(pageYOffset); //pageY는 현재 스크롤 위치를 계속 저장한다.
  };

  const throttleScroll = throttle(handleScroll, 50);

  useEffect(() => {
    documentRef.current.addEventListener('scroll', throttleScroll); //스크롤 이벤트 등록
    return () => documentRef.current.removeEventListener('scroll', throttleScroll);
  }, [pageY]);
  const useNavi = useNavigate();
  const MoveToWriteForm = () => {
    useNavi(`/blogWriteForm`);
  }
  
  const MoveToBlogMyBlog = () => {
    useNavi(`/blogmyBlog`);
  }
  
  const UpdateBlog = () => {
    useNavi(`/blogUpdateForm/${props.seq}`)
  }

  const DeleteBlog = () => {
    if(window.confirm("정말 삭제하시겠습니까?")) {
      axios.get(`http://localhost/blog/deleteBlog?seq=${props.seq}`)
          .then((res)=>{
            // console.log(res.status)
            if(res.status === 200) {
              alert("삭제 되었습니다.")
              window.location.href = "/blog"
            }
          })
    }
  }


  return (
    <>
      <HeaderArea>
        <HeaderWrap className={hide && 'hide'}>Developers' Blog
          { props.writer === window.localStorage.getItem("userEmail") ?
          <>
            <SearchButton onClick={UpdateBlog}>수정</SearchButton>
            <SearchButton onClick={DeleteBlog}>삭제</SearchButton> 
          </>
          
          :
          <>        
            <SearchButton onClick={MoveToBlogMyBlog}>MyBlog</SearchButton>
            <SearchButton onClick={MoveToWriteForm}>글쓰기</SearchButton>
          </>
          }

  
        </HeaderWrap>  
           
      </HeaderArea>
      {/* <div style={{ height: '1000px' }} /> */}
    </>
  );
};

export default BlogHeader;