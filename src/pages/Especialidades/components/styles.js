import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// ==========================================
// ESTILOS DO FORMULÁRIO (EspecialidadesForm)
// ==========================================

export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#1e1e1e'};
  color: ${({ theme }) => theme.colors?.text || '#fff'};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    width: 100%;
  }
  
  label { 
    font-size: 0.95rem; 
    color: ${({ theme }) => theme.colors?.text || '#ddd'}; 
    font-weight: 600; 
  }
  
  input {
    padding: 0.8rem; 
    border: 1px solid ${({ theme }) => theme.colors?.border || '#444'}; 
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors?.inputBg || '#2c2c2c'};
    color: ${({ theme }) => theme.colors?.text || '#fff'};
    font-size: 1rem;
    transition: all 0.2s;

    &:focus { 
      border-color: ${({ theme }) => theme.colors?.primary || '#1890ff'}; 
      outline: none; 
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors?.primary || '#1890ff'}33;
    }
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem; 
  border-radius: 4px; 
  border: none; 
  cursor: pointer; 
  font-weight: bold;
  transition: opacity 0.2s, background-color 0.2s;

  &.cancel { 
    background-color: transparent;
    color: ${({ theme }) => theme.colors?.text || '#fff'}; 
    border: 1px solid ${({ theme }) => theme.colors?.border || '#444'};
  }
  
  &.save { 
    background-color: ${({ theme }) => theme.colors?.primary || '#1890ff'}; 
    color: #ffffff; 
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

// ==========================================
// ESTILOS DE IMPORTAÇÃO (ImportarEspecialidades)
// ==========================================

export const ImportContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#1e1e1e'};
  color: ${({ theme }) => theme.colors?.text || '#fff'};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  text-align: center;
`;

export const InstructionsBox = styled.div`
  background-color: ${({ theme }) => theme.colors?.surfaceSecondary || 'rgba(24, 144, 255, 0.1)'};
  border-left: 4px solid ${({ theme }) => theme.colors?.primary || '#1890ff'};
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;
  border-radius: 0 4px 4px 0;

  h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    margin-bottom: 0.5rem;
  }

  p, ul {
    color: ${({ theme }) => theme.colors?.text || '#ddd'};
  }

  ul {
    margin-top: 0.5rem;
    padding-left: 1.5rem;
  }
`;

export const UploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${({ theme }) => theme.colors?.border || '#444'};
  border-radius: 8px;
  padding: 3rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    background-color: ${({ theme }) => theme.colors?.surfaceSecondary || 'rgba(24, 144, 255, 0.05)'};
  }

  p { 
    margin-top: 1rem; 
    color: ${({ theme }) => theme.colors?.textSecondary || '#aaa'}; 
    font-weight: 500; 
  }
  input { display: none; }
`;

export const StatusBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors?.textSecondary || '#aaa'};
  font-weight: 500;
  gap: 1rem;
`;

export const Spinner = styled.div`
  color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
  animation: ${spin} 1s linear infinite;
  display: flex;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors?.surfaceSecondary || '#2c2c2c'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#444'};
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  strong { 
    font-size: 2rem; 
    color: ${({ theme }) => theme.colors?.text || '#fff'}; 
  }
  span { 
    color: ${({ theme }) => theme.colors?.textSecondary || '#aaa'}; 
    font-size: 0.9rem; 
  }
  &.success strong { 
    color: ${({ theme }) => theme.colors?.success || '#52c41a'}; 
  }
  &.warning strong { 
    color: ${({ theme }) => theme.colors?.warning || '#faad14'}; 
  }
`;

export const LogContainer = styled.div`
  max-height: 250px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors?.surfaceSecondary || '#252525'};
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#444'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LogItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors?.surface || '#1e1e1e'};
  border-left: 3px solid ${({ theme }) => theme.colors?.border || '#444'};
  color: ${({ theme }) => theme.colors?.text || '#ddd'};
  border-radius: 4px;
  font-size: 0.9rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);

  &.success { 
    border-color: ${({ theme }) => theme.colors?.success || '#52c41a'}; 
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Button = styled.button`
  background-color: ${({ variant, theme }) => 
    variant === 'secondary' 
      ? theme.colors?.surfaceSecondary || '#444' 
      : theme.colors?.primary || '#1890ff'};
      
  color: ${({ variant, theme }) => 
    variant === 'secondary' 
      ? theme.colors?.text || '#fff' 
      : '#ffffff'};
      
  border: ${({ variant, theme }) => 
    variant === 'secondary' 
      ? `1px solid ${theme.colors?.border || '#555'}` 
      : 'none'};
      
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { 
    filter: brightness(1.1);
  }
`;

// ==========================================
// ESTILOS DO MODAL (Caso queira usar depois)
// ==========================================

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); z-index: 1000;
  display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#1e1e1e'}; 
  width: 100%; 
  max-width: 400px; 
  padding: 2rem;
  border-radius: 8px; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  h2 { 
    color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    margin-bottom: 1.5rem; 
    border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#444'}; 
    padding-bottom: 0.5rem;
  }
`;