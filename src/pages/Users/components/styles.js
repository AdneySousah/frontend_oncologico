import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Mantido assim pois funciona perfeito em light/dark */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;

  h2 {
    color: ${({ theme }) => theme.colors.primary}; /* Trocado de primaryDark para melhor contraste no dark mode */
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: 0.5rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 500;
  }

  input {
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Ajustado para inputBg */
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33; /* Glow suave opcional */
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s, background-color 0.2s;

  &.cancel {
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Usando inputBg como alternativa ao backgroundAlt */
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border}; /* Adicionado borda sutil para não sumir no fundo */
  }

  &.save {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }

  &:hover {
    opacity: 0.9;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 0.5rem 0;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text};
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Ajustado para inputBg */
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

export const ProfessionalSection = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Ajustado para se mesclar melhor no dark mode */
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  h4 {
    color: ${({ theme }) => theme.colors.primary}; /* Trocado de primaryDark */
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
`;