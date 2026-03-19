import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors?.background || '#f4f6f8'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h1 {
    color: ${({ theme }) => theme.colors?.text || '#333'};
    font-size: 1.8rem;
  }
`;

export const TabContainer = styled.div`
  display: flex; gap: 1rem; margin-bottom: 1.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border}; 
  padding-bottom: 0.5rem;
`;

export const TabButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ active, theme }) => active ? (theme.colors?.primary || '#1890ff') : (theme.colors?.textLight || '#888')};
  border-bottom: 3px solid ${({ active, theme }) => active ? (theme.colors?.primary || '#1890ff') : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  margin-bottom: -10px;
  
  &:hover {
    color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
  }
`;

export const FilterBar = styled.div`
  display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-end;
  background-color: ${({ theme }) => theme.colors.surface}; 
  padding: 1.5rem; 
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FilterButton = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme, variant }) => variant === 'clear' ? theme.colors.inputBg : theme.colors.primary};
  color: ${({ theme, variant }) => variant === 'clear' ? theme.colors.text : '#ffffff'};
  border: 1px solid ${({ theme, variant }) => variant === 'clear' ? theme.colors.border : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover { opacity: 0.8; }
`;

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-top: 1rem;
`;

export const Table = styled.table`
  width: 100%; 
  border-collapse: collapse; 
  
  thead { 
    background-color: ${({ theme }) => theme.colors.primary}; 
    th { color: #ffffff; padding: 1rem; text-align: left; font-weight: 600; } 
  }
  
  tbody tr { 
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}; 
    transition: background-color 0.1s;
    &:hover { background-color: ${({ theme }) => theme.colors.inputBg}; }
    td { padding: 1rem; color: ${({ theme }) => theme.colors.text}; } 
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0.4rem;
  margin-left: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &.edit {
    color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    border-color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
    &:hover { background-color: ${({ theme }) => theme.colors?.primary || '#1890ff'}1A; }
  }

  &.delete {
    color: #ff4d4f;
    border-color: #ff4d4f;
    &:hover { background-color: #ff4d4f1A; }
  }
`;

export const TypeBadge = styled.span`
  font-size: 0.85rem;
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: bold;
  border: 1px solid rgba(24, 144, 255, 0.3);
`;

/* ESTILOS DO FORMULÁRIO */
export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 850px) { grid-template-columns: 1fr; }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  &.full-width { grid-column: 1 / -1; }

  label {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }

  input, select {
    width: 100%; box-sizing: border-box;
    padding: 0.9rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px; font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.inputBg};
    transition: all 0.2s;

    &:focus {
      outline: none; border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
    }
    &::placeholder { color: ${({ theme }) => theme.colors.textLight}; opacity: 0.7; }
    
    &:disabled, &[readOnly] {
      background-color: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.textLight};
      cursor: not-allowed; opacity: 0.7;
    }
  }
`;

export const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex; justify-content: flex-end; gap: 1rem;
  margin-top: 1.5rem; padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FormButton = styled.button`
  padding: 0.9rem 2rem; border-radius: 6px; border: none;
  font-weight: 700; font-size: 1rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;

  &.save { background-color: ${({ theme }) => theme.colors.primary}; color: #fff; }
  &.cancel { background-color: transparent; color: ${({ theme }) => theme.colors.text}; border: 1px solid ${({ theme }) => theme.colors.border}; }
  &:hover:not(:disabled) { opacity: 0.9; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

/* ESTILOS DE IMPORTAÇÃO */
export const ImportContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#1e1e1e'};
  color: ${({ theme }) => theme.colors?.text || '#fff'};
  padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  text-align: center;
`;

export const InstructionsBox = styled.div`
  background-color: ${({ theme }) => theme.colors?.surfaceSecondary || 'rgba(24, 144, 255, 0.1)'};
  border-left: 4px solid ${({ theme }) => theme.colors?.primary || '#1890ff'};
  padding: 1rem; margin-bottom: 2rem; text-align: left; border-radius: 0 4px 4px 0;

  h4 { display: flex; align-items: center; gap: 0.5rem; color: ${({ theme }) => theme.colors?.primary || '#1890ff'}; margin-bottom: 0.5rem; }
  p, ul { color: ${({ theme }) => theme.colors?.text || '#ddd'}; }
  ul { margin-top: 0.5rem; padding-left: 1.5rem; }
`;

export const UploadBox = styled.label`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 2px dashed ${({ theme }) => theme.colors?.border || '#444'}; border-radius: 8px;
  padding: 3rem; cursor: pointer; transition: border-color 0.2s, background-color 0.2s;

  &:hover { border-color: ${({ theme }) => theme.colors?.primary || '#1890ff'}; background-color: ${({ theme }) => theme.colors?.surfaceSecondary || 'rgba(24, 144, 255, 0.05)'}; }
  p { margin-top: 1rem; color: ${({ theme }) => theme.colors?.textSecondary || '#aaa'}; font-weight: 500; }
  input { display: none; }
`;

export const StatusBox = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3rem; color: ${({ theme }) => theme.colors?.textSecondary || '#aaa'}; font-weight: 500; gap: 1rem;
`;

export const Spinner = styled.div`
  color: ${({ theme }) => theme.colors?.primary || '#1890ff'};
  animation: ${spin} 1s linear infinite; display: flex;
`;

export const SummaryGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;
`;

export const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors?.surfaceSecondary || '#2c2c2c'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#444'};
  padding: 1.5rem; border-radius: 8px; text-align: center; display: flex; flex-direction: column; gap: 0.5rem;

  strong { font-size: 2rem; color: ${({ theme }) => theme.colors?.text || '#fff'}; }
  span { color: ${({ theme }) => theme.colors?.textSecondary || '#aaa'}; font-size: 0.9rem; }
  &.success strong { color: ${({ theme }) => theme.colors?.success || '#52c41a'}; }
`;

export const LogContainer = styled.div`
  max-height: 250px; overflow-y: auto; background-color: ${({ theme }) => theme.colors?.surfaceSecondary || '#252525'};
  border-radius: 4px; padding: 1rem; margin-bottom: 1.5rem; border: 1px solid ${({ theme }) => theme.colors?.border || '#444'};
  display: flex; flex-direction: column; gap: 0.5rem;
`;

export const LogItem = styled.div`
  display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors?.surface || '#1e1e1e'}; border-left: 3px solid ${({ theme }) => theme.colors?.border || '#444'};
  color: ${({ theme }) => theme.colors?.text || '#ddd'}; border-radius: 4px; font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1);

  &.success { border-color: ${({ theme }) => theme.colors?.success || '#52c41a'}; }
`;

export const Button = styled.button`
  background-color: ${({ variant, theme }) => variant === 'secondary' ? theme.colors?.surfaceSecondary || '#444' : theme.colors?.primary || '#1890ff'};
  color: ${({ variant, theme }) => variant === 'secondary' ? theme.colors?.text || '#fff' : '#ffffff'};
  border: ${({ variant, theme }) => variant === 'secondary' ? `1px solid ${theme.colors?.border || '#555'}` : 'none'};
  padding: 0.8rem 1.5rem; border-radius: 4px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:hover { filter: brightness(1.1); }
`;