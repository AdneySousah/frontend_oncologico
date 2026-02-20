import styled from 'styled-components';

export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 2rem; /* Aumentei um pouco para respirar melhor o formulário */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative; /* Adicionado para caso você use ícones absolutos dentro (ex: MapPin) */

  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }

  input, select {
    padding: 0.9rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Fundo dinâmico escuro/claro */
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
  }
`;

export const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ActionButton = styled.button`
  padding: 0.9rem 2rem;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &.save {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }

  &.cancel {
    background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
  }
`;