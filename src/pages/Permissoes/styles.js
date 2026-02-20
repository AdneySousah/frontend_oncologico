import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.8rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 1rem;
`;

export const TabButton = styled.button`
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? '#ffffff' : theme.colors.text};
  padding: 0.8rem 1.5rem;
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primaryHover || theme.colors.primary : theme.colors.inputBg};
  }
`;

export const ContentBox = styled.div`
  background-color: ${({ theme }) => theme.colors.surface || '#ffffff'};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// -- FORM STYLES --
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 0.5rem;
  
  label { 
    font-size: 0.9rem; 
    color: ${({ theme }) => theme.colors.text}; 
    font-weight: 600; 
  }
  
  input, select {
    padding: 0.9rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border}; 
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s;

    &:focus { 
      border-color: ${({ theme }) => theme.colors.primary}; 
      outline: none; 
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex; 
  justify-content: flex-end; 
  gap: 1rem; 
  margin-top: 1rem;
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem; 
  border-radius: 4px; 
  border: none; 
  cursor: pointer; 
  font-weight: bold;
  background-color: ${({ color, theme }) => color || theme.colors.primary}; 
  color: #ffffff;
  transition: all 0.2s;

  &:hover:not(:disabled) { 
    opacity: 0.9; 
    filter: brightness(0.9);
  }
  
  &:disabled { 
    background-color: ${({ theme }) => theme.colors.border}; 
    color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed; 
  }
`;

// -- TABLE STYLES --
export const Table = styled.table`
  width: 100%; 
  border-collapse: collapse;
  
  thead {
    background-color: ${({ theme }) => theme.colors.primary};
    th { color: #ffffff; padding: 1rem; text-align: left; }
  }
  
  tbody tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    transition: background-color 0.1s;

    &:hover { 
      background-color: ${({ theme }) => theme.colors.inputBg}; 
    }
    
    td { padding: 1rem; color: ${({ theme }) => theme.colors.text}; }
  }
`;

export const ActionButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;