import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;


export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  padding: 30px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.border};

  /* CONTROLE GLOBAL DE TEXTOS DENTRO DO MODAL */
  h2 { 
    color: ${({ theme }) => theme.colors.text}; 
    margin: 0 0 8px 0;
    font-size: 22px;
  }
  
  h3 {
    color: ${({ theme }) => theme.colors.text}; 
    margin: 0 0 15px 0;
    font-size: 18px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: 10px;
  }

  h4 {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 15px 0;
  }

  .subtitle { 
    color: ${({ theme }) => theme.colors.textLight}; 
    margin: 0 0 24px 0; 
    font-size: 14px; 
  }

  .empty-message {
    color: ${({ theme }) => theme.colors.text};
  }

  .evaluation-block {
    margin-bottom: 40px;
  }

  /* CUSTOM SCROLLBAR */
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { 
    background-color: ${({ theme }) => theme.colors.border}; 
    border-radius: 4px; 
  }
  &::-webkit-scrollbar-thumb:hover { 
    background-color: ${({ theme }) => theme.colors.textLight}; 
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 26px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};
  transition: color 0.2s;
  
  &:hover { 
    color: ${({ theme }) => theme.colors.danger || '#ff4d4f'}; 
  }
`;

export const ScoreHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  div {
    display: flex;
    flex-direction: column;
  }

  div span { 
    font-size: 12px; 
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors.textLight}; 
    margin-bottom: 6px;
  }
  
  div strong { 
    font-size: 24px; 
    color: ${({ theme }) => theme.colors.text}; 
  }
`;

export const QuestionItem = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dotted ${({ theme }) => theme.colors.border};
  
  h5 { 
    color: ${({ theme }) => theme.colors.text}; 
    margin: 0 0 10px 0;
    font-size: 15px;
    font-weight: 500;
  }
  
  .answer-box { 
    background-color: ${({ theme }) => theme.colors.inputBg}; 
    border: 1px solid ${({ theme }) => theme.colors.border}; 
    padding: 12px 16px; 
    border-radius: 6px; 
    display: flex; 
    justify-content: space-between;
    align-items: center;

    span {
      color: ${({ theme }) => theme.colors.text}; 
      font-size: 14px; 
    }
  }
  
  .score-tag { 
    font-weight: bold; 
    color: #2ecc71 !important; /* Forçando verde independente do tema */
    background-color: rgba(46, 204, 113, 0.1);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 13px;
    white-space: nowrap;
  }
`;






export const Container = styled.div`
  /* Usa as cores do seu tema se existirem, senão tem fallback */
  background: ${({ theme }) => theme.colors?.background || theme.background || '#1e1e2d'};
  color: ${({ theme }) => theme.colors?.text || theme.text || '#ffffff'};
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 22px;
    margin: 0;
    color: ${({ theme }) => theme.colors?.primary || '#3699ff'};
  }

  p {
    font-size: 15px;
    line-height: 1.5;
    margin: 0;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: ${({ status }) => 
    status === 'Aceito' ? '#d4edda' : 
    status === 'Recusado' ? '#f8d7da' : '#fff3cd'};
  color: ${({ status }) => 
    status === 'Aceito' ? '#155724' : 
    status === 'Recusado' ? '#721c24' : '#856404'};
`;

export const ActionArea = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  
  background: ${({ variant, theme }) => 
    variant === 'cancel' ? (theme.colors?.danger || '#dc3545') : 
    variant === 'resend' ? (theme.colors?.warning || '#ffc107') :
    (theme.colors?.success || '#28a745')};
    
  color: ${({ variant }) => variant === 'resend' ? '#000' : '#fff'};

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const WaitingBox = styled.div`
  padding: 20px;
  border: 2px dashed ${({ theme }) => theme.colors?.primary || '#3699ff'};
  border-radius: 8px;
  animation: ${pulse} 2s infinite;
  
  h3 { color: ${({ theme }) => theme.colors?.primary || '#3699ff'}; margin-bottom: 10px; }
`;

export const ErrorBox = styled.div`
  padding: 20px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 8px;
  color: #dc3545;

  .icon {
    font-size: 40px;
    margin-bottom: 10px;
  }
`;

export const SuccessBox = styled.div`
  padding: 20px;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid #28a745;
  border-radius: 8px;
  color: #28a745;

  .icon {
    font-size: 40px;
    margin-bottom: 10px;
  }
  
  h2 { color: #28a745; }
  h1 { font-size: 48px; margin: 15px 0; color: #28a745; }
`;