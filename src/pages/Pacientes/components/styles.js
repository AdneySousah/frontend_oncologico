import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const ImportContainer = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text};
`;

export const UploadBox = styled.div`
  padding: 40px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  p {
    color: ${({ theme }) => theme.colors.textLight || '#666'};
  }

  input {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const StatusBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.primary}44;
  border-radius: 8px;
  margin: 20px 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

export const Spinner = styled.div`
  display: flex;
  align-items: center;
  animation: ${spin} 1s linear infinite;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

export const SummaryCard = styled.div`
  padding: 15px;
  border-radius: 6px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  align-items: center;

  strong {
    font-size: 1.4rem;
    display: block;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  /* Variantes de cores adaptáveis */
  &.success {
    background: ${({ theme }) => theme.title === 'dark' ? '#1b331e' : '#f6ffed'};
    border-color: #389e0d;
    color: #52c41a;
  }
  &.warning {
    background: ${({ theme }) => theme.title === 'dark' ? '#332b1b' : '#fffbe6'};
    border-color: #d46b08;
    color: #faad14;
  }
  &.error {
    background: ${({ theme }) => theme.title === 'dark' ? '#331b1b' : '#fff1f0'};
    border-color: #cf1322;
    color: #ff4d4f;
  }
`;

export const LogContainer = styled.div`
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  text-align: left;
  background: ${({ theme }) => theme.colors.inputBg};
`;

export const LogItem = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  
  &.warning { 
    background: ${({ theme }) => theme.title === 'dark' ? '#2b2111' : '#fffbe6'}; 
    color: ${({ theme }) => theme.title === 'dark' ? '#ffd591' : '#d46b08'}; 
  }
  &.success { 
    background: ${({ theme }) => theme.title === 'dark' ? '#162312' : '#f6ffed'}; 
    color: ${({ theme }) => theme.title === 'dark' ? '#b7eb8f' : '#389e0d'}; 
  }
  &.error { 
    background: ${({ theme }) => theme.title === 'dark' ? '#2a1215' : '#fff1f0'}; 
    color: ${({ theme }) => theme.title === 'dark' ? '#ffa39e' : '#cf1322'}; 
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  button {
    flex: 1;
  }
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem; 
  border-radius: 4px; 
  border: none; 
  cursor: pointer; 
  font-weight: bold;
  background-color: ${({ variant, theme }) => variant === 'secondary' ? theme.colors.border : theme.colors.primary}; 
  color: ${({ variant, theme }) => variant === 'secondary' ? theme.colors.text : '#ffffff'};
  transition: all 0.2s;

  &:hover:not(:disabled) { 
    filter: brightness(0.9);
  }
  
  &:disabled { 
    background-color: ${({ theme }) => theme.colors.border}; 
    color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed; 
  }
`;