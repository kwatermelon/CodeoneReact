import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const HeaderArea = styled.div`
  position: relative;
  width: 70%%;
  height: 80px;
`;

const HeaderWrap = styled.div`
  position: fixed;
  top: 78px;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 60px;
  transition: 0.4s ease;
  background-color: #7885d6;
  font-size: 30px;
  color: ivory;
  &.hide {
    transform: translateY(-80px);
  }
`;




const throttle = function (callback, waitTime) {
  let timerId = null;

  return (e) => {
    console.log('함수 실행', timerId);
    if (timerId) return;
    timerId = setTimeout(() => {
      //console.log('this', this, ' e', e);
      callback.call(this, e);
      timerId = null;
    }, waitTime);
  };
};

const BlogMyBlogHeader = () => {
  const [hide, setHide] = useState(false);
  const [pageY, setPageY] = useState(0);
  const documentRef = useRef(document);

  const handleScroll = () => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const hide = pageYOffset !== 0 && deltaY >= 0;

    console.log('pageYOFFset', pageYOffset); //현재 스크롤 위치
    console.log('daltaY', deltaY, 'pageY', pageY); //
    console.log('hide', hide);

    setHide(hide); //false
    setPageY(pageYOffset); //pageY는 현재 스크롤 위치를 계속 저장한다.
  };

  const throttleScroll = throttle(handleScroll, 50);

  useEffect(() => {
    documentRef.current.addEventListener('scroll', throttleScroll); //스크롤 이벤트 등록
    return () => documentRef.current.removeEventListener('scroll', throttleScroll);
  }, [pageY]);



  return (
    <>
      <HeaderArea>
        <HeaderWrap className={hide && 'hide'}>Users' Blog</HeaderWrap>
      
      </HeaderArea>
      {/* <div style={{ height: '1000px' }} /> */}
    </>
  );
};

export default BlogMyBlogHeader;


// import React, { memo } from 'react';
// import { useEffect } from 'react';

// const Header = memo(() => {
//   useEffect(() => {
//     window.onbeforeunload = function pushRefresh() {
//       window.scrollTo(0, 0);
//     };

//     let st = document.documentElement.scrollTop;
//     console.log('st', st);
//     function onScroll(e) {
//       // console.log('scroll');

//       console.log(e.target.documentElement.scrollTop, st);

//       if (st < e.target.documentElement.scrollTop) {
//         console.log('scroll 아래');
//         st = e.target.documentElement.scrollTop;
//       } else {
//         console.log('scroll 위');
//         st = e.target.documentElement.scrollTop;
//       }
//     }
//     window.addEventListener('scroll', onScroll);
//     return () => {
//       window.removeEventListener('scroll', onScroll);
//     };
//   }, []);

//   return (
//     <>
//       <header className="header">
//         {/* <div className={`top-bar ${this.state.activeClass}`}> */}
//         <div>
//           <span>
//             <a href="tel:6788272782">678-827-2782 </a>
//           </span>
//           <span>
//             <a href="mailto:hellohello@knotel.com"> hellohello@knotel.com</a>
//           </span>
//           <button>Login</button>
//         </div>
//       </header>

//       <div style={{ height: '2000px' }}></div>
//     </>
//   );
// });

// export default Header;
