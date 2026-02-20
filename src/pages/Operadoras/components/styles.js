import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); z-index: 1000;
  display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface}; 
  width: 100%; max-width: 500px; padding: 2rem;
  border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  h2 { 
    color: ${({ theme }) => theme.colors.primary}; /* Alterado de primaryDark para primary */
    margin-bottom: 1.5rem; 
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}; 
    padding-bottom: 0.5rem;
  }
`;

export const Form = styled.form`
  display: flex; flex-direction: column; gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  
  label { 
    font-size: 0.9rem; 
    color: ${({ theme }) => theme.colors.textLight}; 
    font-weight: 500; 
  }
  
  input {
    padding: 0.75rem; 
    border: 1px solid ${({ theme }) => theme.colors.border}; 
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Adaptado para o dark mode */
    color: ${({ theme }) => theme.colors.text}; /* Cor do texto digitado */
    transition: all 0.2s;

    &:focus { 
      border-color: ${({ theme }) => theme.colors.primary}; 
      outline: none; 
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33; /* Glow suave padronizado */
    }
  }

  small { 
    color: ${({ theme }) => theme.colors.textLight}; 
    font-size: 0.75rem; 
  }
`;

export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
  
  button {
    padding: 0.75rem 1.5rem; border-radius: 4px; border: none; cursor: pointer; font-weight: bold;
    transition: opacity 0.2s, background-color 0.2s;

    &.cancel { 
      background-color: ${({ theme }) => theme.colors.inputBg}; /* Trocado de backgroundAlt */
      color: ${({ theme }) => theme.colors.text}; 
      border: 1px solid ${({ theme }) => theme.colors.border}; /* Borda para destaque */
    }
    
    &.save { 
      background-color: ${({ theme }) => theme.colors.primary}; 
      color: #ffffff; 
    }

    &:hover {
      opacity: 0.9;
    }
  }
`;