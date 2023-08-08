import React, { useEffect, useState } from 'react';
import { Card, Button} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
// import AppLayout from './AppLayout';
import BlogHeader from './BlogHeader';
import { useNavigate } from 'react-router-dom';
import imageDefault from '../../assets/blog/imageDefault.png'
import { useInView } from 'react-intersection-observer';
import '../../css/blog/blog.css';
import comment from '../../assets/blog/comment.png'
import favorite from '../../assets/blog/favorite.png'
import BlogCard from './BlogCard';
import './css/blog.css'; 
const ColoredText = styled.span`
  color: #E6B74A;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  height: 37px;
  width: 200px;
`;

const SearchButton = styled.button`
  padding: 5px 10px;
  background-color: #7885d6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
`;



const BlogAddBtnWrapper = styled.div`
    position: fixed;
    right: 20px;
    bottom: 35px;
    border-radius: 60px;
    border: 2px solid rgb(0, 43, 255);
`

const BlogMainAddBtn = styled.button`
    width: 60px;
    height: 60px;
    vertical-align: middle;
    padding: 0;
    display: flex;
    align-items: center;
`

const BlogAddBtnIcon = styled.i`
    font-size: 60px;
    color: rgb(0, 43, 255);
`


const Blog = () => {
  let useNavi = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [blogList, setBlogList] = useState([]);

  //현재 페이지(무한스크롤)
  const [page, setPage] = useState(0);
    // const [ref, inView] = useInView();    
    const [isLoading, setIsLoading] = useState(false);

    // option 안쓰면 그냥 0기 default값
    const [ref, inView] = useInView({
        /* Optional options */
    threshold: 0,
    });   


  // 검색기능
  const handleSearch = async () => {    
    const res = await axios({
      method: 'get',
      url: `http://localhost:/blog/searchBlog/${searchTerm}`, // => url 맞는거로 바꾸기
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setBlogList(res.data);
    setIsLoading(true)
    setSearchTerm('')

  };




  // 블로그 가져오기 처음
  const getAllBlogs = async () => {
    console.log(page + " page")
    const res = await axios({
      method: 'get',
      url: `http://localhost:/blog/getAllBlogs`,
      params:{ "pageNumber":page}

    });
    if(res.status === 200) {
      if(page === 0){             // page 0 이면 데이터만 가져오기. 검색할때
        setBlogList(res.data); 
      }
      else if(page > 0 ){         // page가 스크롤되었으면 뒤로 데이터 붙여주기
          // 리스트 뒤로 붙여주기
          setBlogList([...blogList, ...(res.data)])  
          // setLikeSeqlist([...likeSeqlist, ...(resp.data.likelist)]);                 
      }
    }


  };

  // 블로그 가져오기 처음
  const getAllBlogsreset = async () => {
    setPage(0)
    setIsLoading(false)
    const res = await axios({
      method: 'get',
      url: `http://localhost:/blog/getAllBlogs`,
      params:{ "pageNumber":0}

    });
    if(res.status === 200) {
      console.log(res.data)
        setBlogList(res.data); 
    }

  };

  // 블로그 글쓰기 폼
  const MoveToWriteForm = () => {
    
    useNavi(`/blogWriteForm`);
  }


  // 무한 스크롤
  
  const scrollTrigger = () => {
    if(inView) {
      
      console.log(inView, "무한스크롤 요청")
      productFetch()
    }
  }


// 무한 스크롤
  // 지정한 타겟 div가 화면에 보일 때 마다 서버에 요청을 보냄
  const productFetch = () => {
    // axios
    // .get('')
    // .then((res) => {
    //   // 리스트 뒤로 붙여주기
    //   setBlogList([...blogList, ...(blogList)])
    //   // 요청 성공 시에 페이지에 1 카운트 해주기
    //   setPage((page) => page + 1)
    // })
    // .catch((err) => {console.log(err)});


    setBlogList([...blogList, ...(blogList)])
  };

  const readBlog = (seq) => {
    window.location.href = `/blogReadForm/${seq}`;
  }


const Row = props => {
  let blogList = props.blogList;
  let start = props.start;
  let end = start + 5;
  if(blogList.length < end) {
      end = blogList.length;
  }

  let components = [];

  while(start < end) {
      let blog = blogList[start++];
      let seq = blog.seq;
      let title = blog.title;
      let thumbnail = imageDefault;
      if(blog.thumbnail) {
        thumbnail = blog.thumbnail;
      }
      // let starClassName = "bi bi-star";
      // if(isLike) {
      //     starClassName += "-fill";
      // }
      let likes = blog.likes;
      let replies = blog.replies;
      let writer = blog.writer;
      let content = blog.content;

      let component = 
          (
            <BlogCard key={seq} seq={seq} title={title} thumbnail={thumbnail} likes={likes} replies={replies} writer={writer} content={content}></BlogCard>
          );

      components.push(component);
  }

  return components;
}



const printRows = blogList => {
  let roofAmount = parseInt(blogList.length / 5) + 1;

  let components = [];

  for(let i=0; i<roofAmount; i++) {
      let component = <div key={i} className="row">
          <Row blogList={blogList} start={i*5} />
      </div>;

      components.push(component);
  }

  return components;
}


// 무한 스크롤
useEffect(() => {
  if (inView) {
    if(isLoading) return;
      console.log(inView, "무한 스크롤 요청 🎃");
      // setPage(page++);
      setPage((page) => page + 1);
      getAllBlogs();

      // 정렬 수정하기
      // if (orderBy === "orderByLatest") {
      //     lectureListData(category, page, search);
          
      // } else if (orderBy === "orderByLike") {
      //     orderByList(page, id);
          
      // } 
      // else {
      //     // orderByLatest와 orderBylike가 false인 경우에는 최신순으로 정렬
      //     lectureListData(category, page, search);
      // }
  }
}, [inView]);



  useEffect(function() {
    getAllBlogs();
    // if(inView) {
    //   console.log(inView, " 무한 스크롤 요청");
    //   productFetch();
    // }
  }, []);


  return (
      <>
        {/* <BlogHeader seq={null}/> */}

        {/* <SearchContainer>
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="검색어를 입력하세요."
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
          <SearchButton onClick={getAllBlogsreset}>전체글보기</SearchButton>
        </SearchContainer> */}


    <div className="search-blog">

    {/* 강의 제목으로 검색 */}
    <div className="lecture-title-search">

      <input type='text' value={searchTerm} 
      className="form-control search-input"
      onChange={(e)=>setSearchTerm(e.target.value)} 
      placeholder="블로그 검색" 
      />   

    </div>
    <button onClick={handleSearch}>검색</button>    
    <button onClick={getAllBlogsreset}>전체글보기</button> 
    </div>


        <br></br>
        <div>
          {isLoading? (
            <>
              <div>{blogList.length}건의 검색결과</div>
            </>
          ):(
            <></>
          )}
          {blogList.length > 0 ? (
            printRows(blogList)
          ) : (
              // searchResult의 결과가 0개일때
              <>
                 <div> 게시물이 없습니다. </div>                                                                      
              </>  
          )}
        </div>
        <div ref={ref}>
        </div>
        <BlogAddBtnWrapper>
                <BlogMainAddBtn onClick={MoveToWriteForm}><BlogAddBtnIcon className="bi-solid bi-plus" /></BlogMainAddBtn>
        </BlogAddBtnWrapper>
      </>
  );
};


export default Blog;
