import styled from 'styled-components';

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
  grid-template-columns: 1fr 1fr; /* Duas colunas para não ficar gigante */
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Uma coluna no mobile */
  }

  .full-width {
    grid-column: 1 / -1; /* Ocupa a linha inteira */
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