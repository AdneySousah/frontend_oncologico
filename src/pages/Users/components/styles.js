// src/.../styles.js (ou o caminho correto do seu arquivo)
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
      font-size: 0.95rem;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      transition: background 0.1s;

      /* A prop 'isActive' é passada pelo componente React */
      opacity: ${({ isActive }) => (isActive === false ? 0.55 : 1)};

      &:hover {
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

  /* Variação para botão de Reativar (quando inativo) */
  &.reactivate {
    color: #52c41a;
    border-color: #52c41a;

    &:hover {
      background-color: #52c41a;
      color: #ffffff;
    }
  }
`;

// --- NOVOS COMPONENTES ESTILIZADOS EXTRAÍDOS DO INLINE ---

export const UserEmail = styled.small`
  color: ${({ theme }) => theme.colors.textLight};
`;

export const AdminBadge = styled.span`
  margin-left: 5px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.7rem;
  font-weight: bold;
`;

export const ProfissionalYes = styled.b`
  color: #13c2c2;
`;

export const RegistryInfo = styled.div`
  small {
    display: block;
    line-height: 1.2;
  }
  .speciality {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const AdminMatrixBadge = styled.span`
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #0050b3;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: inline-block;
`;

export const OperadorasList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 200px;
`;

export const OperadoraBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Adapta ao tema escuro/claro */
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  display: inline-block;
`;

export const NoOperadoraText = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.8rem;
  font-style: italic;
`;

export const StatusBadge = styled.span`
  color: ${({ isActive }) => (isActive ? '#52c41a' : '#f5222d')};
  font-weight: bold;
  font-size: 0.85rem;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  button {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: all 0.2s;
    
    &:not(:disabled):hover {
      background-color: ${({ theme }) => theme.colors.inputBg};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
  }
`;