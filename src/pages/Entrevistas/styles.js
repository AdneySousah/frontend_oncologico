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

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex: ${props => props.flex || 'initial'};
  margin: ${props => props.margin || '0 0 1rem 0'};

  label {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }

  input, select, textarea {
    padding: 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textLight};
      opacity: 0.7;
    }

    &:read-only, &:disabled {
      background-color: ${({ theme }) => theme.colors.surface}; /* Ajuste para dark mode */
      color: ${({ theme }) => theme.colors.textLight};
      cursor: not-allowed;
      opacity: 0.8;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface || '#fff'};
  border-radius: 8px;
  width: 100%;
  max-width: ${props => props.style?.maxWidth || '800px'};
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border || '#ccc'};
    border-radius: 4px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#ccc'};
  padding-bottom: 15px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary || '#007bff'};
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.danger || '#dc3545'};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.border || '#eee'};
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;

  .div-container{
    display: flex;
    flex-direction: column ;
    gap: 20px;
    padding: 10px 0;

  p{
    color: ${({ theme }) => theme.colors.text};
  }
  }
`;