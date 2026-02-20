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
    transition: background 0.2s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  }
`;

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden; // Para os cantos arredondados
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    /* Usando a cor primária no cabeçalho garante contraste e beleza nos dois temas */
    background-color: ${({ theme }) => theme.colors.primary};
    
    th {
      color: #ffffff;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.95rem;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      transition: background 0.1s;

      &:hover {
        /* Fundo de destaque suave ao passar o mouse */
        background-color: ${({ theme }) => theme.colors.inputBg};
      }

      td {
        padding: 1rem;
        color: ${({ theme }) => theme.colors.text};
        font-size: 0.95rem;
      }
    }
  }
`;

export const ActionButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 0.85rem;
  transition: all 0.2s;

  &.edit {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: #ffffff;
    }
  }

  &.delete {
    color: ${({ theme }) => theme.colors.danger || '#ff4d4f'};
    border-color: ${({ theme }) => theme.colors.danger || '#ff4d4f'};

    &:hover {
      background-color: ${({ theme }) => theme.colors.danger || '#ff4d4f'};
      color: #ffffff;
    }
  }
`;