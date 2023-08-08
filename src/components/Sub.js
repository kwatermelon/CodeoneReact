import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeProvider';

const Sub = () => {
  const ThemeMode = useTheme();
  return (
    <div>
      <h2> ...SubPage </h2>
      <Link to='/'>
        <StyledButton theme={ThemeMode[0]}>
          Go back to Home
        </StyledButton>
      </Link>
    </div>
  )
}

export default Sub;

const StyledButton = styled.button`
  width: 240px;
  height: 56px;
  border-radius: 4px;
  border: ${props => props.theme === 'light' ? '1px solid #31302E' : '1px solid #bbb'};
  color:  ${props => props.theme === 'light' ? '#31302E' : '#bbb'};
`