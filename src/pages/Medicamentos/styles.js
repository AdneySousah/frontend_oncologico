
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors?.background || '#f4f6f8'};
  min-height: 100vh;
  
  h1 {
    color: ${({ theme }) => theme.colors?.text || '#333'};
    margin-bottom: 1.5rem;
  }
`;

export const TabContainer = styled.div`
  display: flex; 
  gap: 1rem; 
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};  
  padding-bottom: 1rem;
`;

export const TabButton = styled.button`
  background-color: ${({ active, theme }) => active ? (theme.colors?.primary || '#007bff') : 'transparent'};
  color: ${({ active, theme }) => active ? '#ffffff' : (theme.colors?.text || '#333')};
  padding: 0.8rem 1.5rem;  
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
  border-radius: 4px;  
  cursor: pointer;  
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ active, theme }) => active ? (theme.colors?.primary || '#0056b3') : (theme.colors?.inputBg || '#eaeaea')};
  }
`;

export const FilterBar = styled.div`
  display: flex; 
  gap: 15px; 
  margin-bottom: 25px; 
  align-items: flex-end;
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};  
  padding: 1.5rem;  
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};

  label {
    color: ${({ theme }) => theme.colors?.text || '#333'};
    font-size: 0.9rem; font-weight: 600;
  }
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors?.inputBg || '#ffffff'};
  color: ${({ theme }) => theme.colors?.text || '#333'};
`;

export const FilterButton = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme, variant }) => variant === 'clear' ? (theme.colors?.inputBg || '#f1f1f1') : (theme.colors?.primary || '#007bff')};
  color: ${({ theme, variant }) => variant === 'clear' ? (theme.colors?.text || '#333') : '#ffffff'};
  border: 1px solid ${({ theme, variant }) => variant === 'clear' ? (theme.colors?.border || '#ccc') : 'transparent'};
  cursor: pointer;
  display: flex; 
  align-items: center; 
  justify-content: center;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
`;

export const Table = styled.table`
  width: 100%; 
  border-collapse: collapse;  
  white-space: nowrap;
  
  thead { 
    background-color: ${({ theme }) => theme.colors?.primary || '#007bff'};  
    th { 
      color: #ffffff; 
      padding: 1rem; 
      text-align: left; 
    }  
  }
  
  tbody tr { 
    border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};  
    
    &:hover { 
      background-color: ${({ theme }) => theme.colors?.inputBg || '#f9f9f9'}; 
    }
    
    td { 
      padding: 1rem; 
      color: ${({ theme }) => theme.colors?.text || '#333'}; 
    }  
  }
`;

export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  padding: 2rem; 
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
`;

export const Form = styled.form`
  display: grid; 
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: 1 / -1;
  }
`;

export const FormGroup = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 0.5rem;
  
  label { 
    font-size: 0.9rem; 
    color: ${({ theme }) => theme.colors?.text || '#333'}; 
    font-weight: 600; 
  }
  
  input, select, textarea {
    padding: 0.9rem 1rem; 
    border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
    border-radius: 6px; 
    background-color: ${({ theme }) => theme.colors?.inputBg || '#ffffff'};
    color: ${({ theme }) => theme.colors?.text || '#333'};
    font-family: inherit;
    font-size: 0.95rem;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex; 
  justify-content: flex-end; 
  gap: 1rem;
  margin-top: 1.5rem; 
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
  grid-column: 1 / -1;
`;

export const ActionButton = styled.button`
  padding: 0.8rem 1.5rem; 
  border-radius: 6px; 
  border: none;
  font-weight: 700; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 0.5rem;
  
  &.save { 
    background-color: ${({ theme }) => theme.colors?.primary || '#007bff'}; 
    color: #fff; 
  }
  
  &.cancel { 
    background-color: ${({ theme }) => theme.colors?.inputBg || '#f1f1f1'}; 
    color: ${({ theme }) => theme.colors?.text || '#333'}; 
    border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'}; 
  }
  
  &.edit { 
    background: transparent; 
    border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'}; 
    color: ${({ theme }) => theme.colors?.primary || '#007bff'}; 
    padding: 0.5rem; 
    transition: 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors?.primary || '#007bff'}; 
        color: #fff;
    }
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  
  span {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.text || '#333'};
  }
`;

export const PageButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
  background-color: ${({ disabled, theme }) => disabled ? (theme.colors?.inputBg || '#f1f1f1') : (theme.colors?.surface || '#ffffff')};
  color: ${({ disabled, theme }) => disabled ? '#999' : (theme.colors?.text || '#333')};
  border-radius: 6px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors?.primary || '#007bff'};
    color: #ffffff;
    border-color: ${({ theme }) => theme.colors?.primary || '#007bff'};
  }
`;

/* --- ESTILOS DE IMPORTAÇÃO CORRIGIDOS COM THEME --- */



export const ImportContainer = styled.div`
  background: ${({ theme }) => theme.colors?.surface || 'transparent'};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#333'};
  color: ${({ theme }) => theme.colors?.text || '#fff'};
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const InstructionsBox = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors?.inputBg || 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ theme }) => theme.colors?.primary || '#007bff'};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;

  h4 {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${({ theme }) => theme.colors?.primary || '#4dabf7'};
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors?.text || '#ccc'};
    opacity: 0.8;
    line-height: 1.5;
  }
`;

export const UploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  border: 2px dashed ${({ theme }) => theme.colors?.border || '#444'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors?.inputBg || 'rgba(255, 255, 255, 0.01)'};

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || '#007bff'};
    background-color: ${({ theme }) => theme.colors?.inputBg || 'rgba(255, 255, 255, 0.04)'};
    transform: translateY(-2px);
  }

  input { display: none; }
  
  p { 
    margin-top: 1.5rem; 
    color: ${({ theme }) => theme.colors?.text || '#fff'};
    font-weight: 500;
  }

  svg {
    opacity: 0.6;
    color: ${({ theme }) => theme.colors?.text || '#fff'};
  }
`;

export const StatusBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
  color: ${({ theme }) => theme.colors?.text || '#fff'};
  text-align: center;

  span {
    font-size: 1.1rem;
    font-weight: 500;
    opacity: 0.9;
  }
`;

export const Spinner = styled.div`
  color: ${({ theme }) => theme.colors?.primary || '#007bff'};
  animation: ${spin} 1s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

export const SummaryCard = styled.div`
  padding: 1.2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors?.inputBg || 'rgba(255,255,255,0.03)'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#333'};
  border-left: 4px solid ${({ theme }) => theme.colors?.border || '#444'};

  strong { 
    font-size: 1.6rem; 
    color: ${({ theme }) => theme.colors?.text || '#fff'};
  }
  
  span { 
    font-size: 0.8rem; 
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors?.text || '#fff'}; 
    opacity: 0.5;
    margin-top: 4px;
  }

  &.success { border-left-color: #52c41a; }
  &.warning { border-left-color: #faad14; }
`;

export const LogContainer = styled.div`
  max-height: 220px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors?.inputBg || 'rgba(0,0,0,0.2)'};
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#333'};
  text-align: left;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { 
    background: ${({ theme }) => theme.colors?.border || '#444'}; 
    border-radius: 10px;
  }
`;

export const LogItem = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || 'rgba(255,255,255,0.05)'};
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors?.text || '#eee'};

  &:last-child { border-bottom: none; }
  small { opacity: 0.6; }

  &.success { color: #73d13d; }
  &.warning { color: #ffc53d; }
`;


export const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors?.primary || '#007bff'};
  color: #fff;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  
  &:disabled { 
    background-color: ${({ theme }) => theme.colors?.border || '#444'}; 
    cursor: not-allowed; 
    opacity: 0.5;
  }

  &.secondary {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors?.border || '#444'};
    color: ${({ theme }) => theme.colors?.text || '#fff'};
    &:hover { background: rgba(255,255,255,0.05); }
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors?.surface || '#1e1e1e'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#333'};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors?.text || '#fff'};
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  strong {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors?.primary || '#4dabf7'};
  }
`;