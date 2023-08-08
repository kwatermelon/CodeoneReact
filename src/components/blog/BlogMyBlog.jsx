import React from 'react';
import AppLayout from './AppLayout';
import BlogMyBlogHeader from './BlogMyBlogHeader';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SearchButton = styled.button`
  padding: 5px 10px;
  background-color: #7885d6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 1365px;
  margin-bottom: 525px;
`;

const Blog = (props) => {

  const useNavi = useNavigate();

  const MoveToWriteForm = () => {
    useNavi(`/blogWriteForm`);
  }


  return (
    <AppLayout>
      <BlogMyBlogHeader>
      
      </BlogMyBlogHeader>
      <SearchContainer>
        <SearchButton onClick={MoveToWriteForm}>글쓰기</SearchButton>
      </SearchContainer>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>내 블로그</h1>
        <p>안녕하세요! 블로그에 오신 것을 환영합니다.</p>
      </div>

    </AppLayout>
  );
};

export default Blog;