import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || '#f4f6f8'};
  min-height: 100vh;
  
  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1.5rem;
  }
`;

export const TabContainer = styled.div`
  display: flex; gap: 1rem; margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};  
  padding-bottom: 1rem;
`;

export const TabButton = styled.button`
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? '#ffffff' : theme.colors.text};
  padding: 0.8rem 1.5rem;  
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;  
  cursor: pointer;  
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.inputBg};
  }
`;

export const FilterBar = styled.div`
  display: flex; gap: 15px; margin-bottom: 25px; align-items: flex-end;
  background-color: ${({ theme }) => theme.colors.surface};  
  padding: 1.5rem;  
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
`;

export const FilterButton = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme, variant }) => variant === 'clear' ? theme.colors.inputBg : theme.colors.primary};
  color: ${({ theme, variant }) => variant === 'clear' ? theme.colors.text : '#ffffff'};
  border: 1px solid ${({ theme, variant }) => variant === 'clear' ? theme.colors.border : 'transparent'};
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
`;

export const Table = styled.table`
  width: 100%; border-collapse: collapse;  
  thead { 
    background-color: ${({ theme }) => theme.colors.primary};  
    th { color: #ffffff; padding: 1rem; text-align: left; }  
  }
  tbody tr { 
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};  
    &:hover { background-color: ${({ theme }) => theme.colors.inputBg}; }
    td { padding: 1rem; color: ${({ theme }) => theme.colors.text}; }  
  }
`;

export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 2rem; border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Form = styled.form`
  display: grid; grid-template-columns: 1fr; gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  label { font-size: 0.9rem; color: ${({ theme }) => theme.colors.text}; font-weight: 600; }
  input {
    padding: 0.9rem 1rem; border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px; background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem;
  margin-top: 1.5rem; padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ActionButton = styled.button`
  padding: 0.8rem 1.5rem; border-radius: 6px; border: none;
  font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
  
  &.save { background-color: ${({ theme }) => theme.colors.primary}; color: #fff; }
  &.cancel { background-color: ${({ theme }) => theme.colors.inputBg}; color: ${({ theme }) => theme.colors.text}; border: 1px solid ${({ theme }) => theme.colors.border}; }
  &.edit { background: transparent; border: 1px solid ${({ theme }) => theme.colors.border}; color: ${({ theme }) => theme.colors.primary}; padding: 0.5rem; }
`;