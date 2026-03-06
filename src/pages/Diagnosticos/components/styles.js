import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); 
  z-index: 1000;
  display: flex; justify-content: center; align-items: center; 
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  /* Agora usamos a prop de tema para pegar a cor correta dinamicamente */
  background-color: ${({ theme }) => theme.colors.surface}; 
  width: 100%; max-width: 450px; padding: 2rem;
  border-radius: 8px; 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  
  h2 { 
    color: ${({ theme }) => theme.colors.text}; 
    margin-bottom: 1.5rem; 
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}; 
    padding-bottom: 0.5rem;
  }
`;

export const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;
  
  label { 
    font-size: 0.9rem; 
    color: ${({ theme }) => theme.colors.text}; 
    font-weight: 500; 
  }
  
  input {
    padding: 0.8rem; 
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Usando inputBg do seu theme.js */
    color: ${({ theme }) => theme.colors.text}; 
    border: 1px solid ${({ theme }) => theme.colors.border}; 
    border-radius: 4px; 
    font-size: 1rem;
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textLight}; 
    }

    &:focus { 
      border-color: ${({ theme }) => theme.colors.primary}; 
      outline: none; 
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40; 
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem;
  
  button {
    padding: 0.8rem 1.5rem; border-radius: 4px; border: none; cursor: pointer; font-weight: bold;
    transition: all 0.2s ease-in-out;

    &:hover {
      filter: brightness(0.9);
    }
    
    &.cancel { 
      background: transparent; 
      color: ${({ theme }) => theme.colors.text}; 
      border: 1px solid ${({ theme }) => theme.colors.border}; 
    }
    
    &.save { 
      background: ${({ theme }) => theme.colors.primary}; 
      color: #ffffff; 
    }
  }
`;