import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
  border-radius: 8px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.8rem;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface || '#ffffff'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};

  thead {
    background-color: ${({ theme }) => theme.colors.primary};
    th {
      color: #ffffff;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }
  }

  tbody tr {
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
`;

export const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  background-color: ${props => props.ativo ? '#d4edda' : '#f8d7da'};
  color: ${props => props.ativo ? '#155724' : '#721c24'};
`;

export const ActionButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.danger ? '#dc3545' : props.theme.colors.primary};
  border-color: ${props => props.danger ? '#dc3545' : 'inherit'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.danger ? '#dc3545' : props.theme.colors.primary};
    color: #ffffff;
    border-color: ${props => props.danger ? '#dc3545' : props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#ffffff'};
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: ${({ variant, theme }) => variant === 'secondary' ? (theme.colors.border || '#6c757d') : theme.colors.primary};
  color: ${({ variant, theme }) => variant === 'secondary' ? theme.colors.text : '#ffffff'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;