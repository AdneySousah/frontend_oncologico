import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors?.background || '#f4f6f8'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h1 {
    color: ${({ theme }) => theme.colors?.text || '#333'};
    font-size: 1.8rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors?.border || '#eee'};
  padding-bottom: 0.5rem;
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ active, theme }) => active ? (theme.colors?.primary || '#1890ff') : (theme.colors?.textLight || '#888')};
  border-bottom: 3px solid ${({ active, theme }) => active ? (theme.colors?.primary || '#1890ff') : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -10px;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
  }
`;

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-top: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    
    th {
      color: #ffffff;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
      transition: background-color 0.1s;
      
      &:hover { 
        background-color: ${({ theme }) => theme.colors?.inputBg || '#f9f9f9'};
      }

      td {
        padding: 1rem;
        color: ${({ theme }) => theme.colors?.text || '#333'};
      }
    }
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0.4rem;
  margin-left: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &.edit {
    color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    border-color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    &:hover { background-color: ${({ theme }) => theme.colors?.primary || '#1890ff'}1A; }
  }

  &.delete {
    color: #ff4d4f;
    border-color: #ff4d4f;
    &:hover { background-color: #ff4d4f1A; }
  }
`;