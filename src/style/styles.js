import styled from 'styled-components';
import { media } from './media_query';

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto 0px;
  padding: 0px 28px;
  transition: all 0.2s linear;
  width: calc(100%-2rem);
  font-size: 24px;
  /* & h2 {
    font-size: 48px;
    font-weight: 500;
    padding-bottom: 40px;
    color: ${({ theme }) => theme.textColor};
    text-align: center;
  } */
`;