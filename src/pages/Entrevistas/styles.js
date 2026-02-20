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
    color: ${({ theme }) => theme.colors.text}; /* Trocado de sidebarMiddle para text */
    font-size: 1.8rem;
    font-weight: 700;
  }
`;

export const ContentBox = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border}; /* Borda adicionada para o dark mode */

  p {
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 1.5rem;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead {
    background-color: ${({ theme }) => theme.colors.primary}; /* Padronizado para a cor primária */
    th {
      color: #ffffff;
      padding: 1.2rem;
      text-align: left;
      font-weight: 600;
    }
  }

  tbody tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    transition: background-color 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.inputBg}; /* Trocado de backgroundAlt para inputBg */
    }

    td {
      padding: 1.2rem;
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  transition: opacity 0.2s, background-color 0.2s;
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.border}; /* Trocado do #ccc fixo */
    color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;