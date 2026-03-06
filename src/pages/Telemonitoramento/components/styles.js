import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 999;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface}; 
  color: ${props => props.theme.colors.text};
  padding: 40px; 
  border-radius: 12px; 
  max-width: 1200px; /* Reduzi um pouco a largura máxima para o form não ficar tão esticado */
  width: 90%;
  max-height: 90vh; /* Para garantir que não passe da tela */
  overflow-y: auto; /* Scroll caso a tela seja pequena */
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 { 
    margin-bottom: 20px; 
    border-bottom: 1px solid ${props => props.theme.colors.border}; 
    padding-bottom: 10px; 
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px; 
  text-align: left;
  label { 
    display: block; 
    margin-bottom: 8px; 
    font-weight: bold; 
    color: ${props => props.theme.colors.text}; 
  }
`;

export const Input = styled.input`
  width: 100%; 
  padding: 12px; 
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.inputBg}; 
  color: ${props => props.theme.colors.text};
  border-radius: 6px; 
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Aplica o estilo caso o Input seja renderizado como "select" */
  option {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }
`;

export const ButtonGroup = styled.div` 
  display: flex; 
  gap: 10px; 
  justify-content: flex-end; 
  margin-top: 30px; 
`;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#555' : props.theme.colors.primary};
  color: #fff; 
  border: none; 
  padding: 12px 24px; 
  border-radius: 6px; 
  font-size: 1rem; 
  cursor: pointer; 
  font-weight: bold;
  transition: filter 0.2s;
  
  &:hover { filter: brightness(1.2); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

/* NOVOS COMPONENTES PARA SUBSTITUIR OS INLINE STYLES */

export const InfoBox = styled.div`
  margin-bottom: 25px; 
  padding: 15px; 
  background-color: ${props => props.theme.colors.inputBg}; /* Respeita o dark mode */
  border-radius: 8px; 
  border: 1px solid ${props => props.theme.colors.border};
  
  p {
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  .sub-text {
    font-size: 0.9em;
    opacity: 0.7; /* Melhor que cinza fixo para dark mode */
  }
`;

export const ProjectedStockBox = styled.div`
  padding: 12px; 
  background-color: ${props => props.theme.colors.surface}; /* Fundo sutil */
  border-left: 4px solid ${props => props.theme.colors.primary}; /* Destaque com a cor principal */
  border-radius: 4px; 
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  p {
    margin: 0;
    color: ${props => props.theme.colors.text};
  }

  .destaque {
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 15px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.inputBg};

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: normal;
    cursor: pointer;
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-size: 0.95rem;
  }
`;