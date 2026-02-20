import styled from 'styled-components';

export const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 24px;

  h3 {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.primary}; /* Trocado de primaryDark */
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }

  input[type="text"] {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Ajuste para tema claro/escuro */
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33; /* Sombra de foco com transparência */
    }
  }

  .checkbox-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    padding: 12px;
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Trocado de backgroundAlt */
    border: 1px solid ${({ theme }) => theme.colors.border}; /* Borda sutil adicionada */
    border-radius: 6px;
    max-height: 200px;
    overflow-y: auto;
    
    /* Scrollbar padronizada */
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background-color: ${({ theme }) => theme.colors.border}; border-radius: 4px; }
    &::-webkit-scrollbar-thumb:hover { background-color: ${({ theme }) => theme.colors.textLight}; }
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;

  input[type="checkbox"] {
    margin-right: 8px;
    cursor: pointer;
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.primary};
  }

  label {
    margin-bottom: 0;
    font-weight: normal;
    cursor: pointer;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
    filter: brightness(0.9); /* Fallback seguro de escurecimento ao passar o mouse */
  }
`;