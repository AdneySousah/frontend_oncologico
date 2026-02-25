import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.8rem;
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
    }
  }
`;

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${({ theme }) => theme.colors.primary};
    
    th {
      color: #ffffff;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      transition: background-color 0.1s;
      
      &:hover { 
        background-color: ${({ theme }) => theme.colors.inputBg};
      }

      td {
        padding: 1rem;
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }
`;