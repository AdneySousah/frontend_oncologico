import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
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
    background-color: ${({ active, theme }) => active ? theme.colors.primaryHover || theme.colors.primary : theme.colors.inputBg};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const FilterBar = styled.div`
  display: flex; gap: 15px; margin-bottom: 25px; align-items: flex-end;
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
  width: 100%; padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px; background-color: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const FilterButton = styled.button`
  padding: 0.75rem 1rem; border: none; border-radius: 4px;
  background-color: ${({ theme, variant }) => variant === 'clear' ? theme.colors.inputBg : theme.colors.primary};
  color: ${({ theme, variant }) => variant === 'clear' ? theme.colors.text : '#ffffff'};
  border: 1px solid ${({ theme, variant }) => variant === 'clear' ? theme.colors.border : 'transparent'};
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  &:hover { opacity: 0.8; }
`;

export const Table = styled.table`
  width: 100%; border-collapse: collapse; 
  background-color: ${({ theme }) => theme.colors.surface};
  
  thead { 
    background-color: ${({ theme }) => theme.colors.primary}; 
    th { color: #ffffff; padding: 1rem; text-align: left; } 
  }
  
  tbody tr { 
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}; 
    transition: background-color 0.1s;
    &:hover { background-color: ${({ theme }) => theme.colors.inputBg}; }
    td { padding: 1rem; color: ${({ theme }) => theme.colors.text}; } 
  }
`;

export const ActionButton = styled.button`
  background: transparent; border: 1px solid ${({ theme }) => theme.colors.border}; 
  padding: 0.5rem; border-radius: 4px; cursor: pointer; 
  color: ${({ theme }) => theme.colors.primary}; transition: all 0.2s;
  display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem;

  &:hover { background-color: ${({ theme }) => theme.colors.primary}; color: white; }
`;

export const TypeBadge = styled.span`
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ type }) => {
    switch(type) {
      case 'Criação': return 'rgba(40, 167, 69, 0.1)';
      case 'Edição': return 'rgba(24, 144, 255, 0.1)';
      case 'Exclusão': return 'rgba(220, 53, 69, 0.1)';
      case 'Acesso': return 'rgba(255, 193, 7, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  }};
  color: ${({ type }) => {
    switch(type) {
      case 'Criação': return '#28a745';
      case 'Edição': return '#1890ff';
      case 'Exclusão': return '#dc3545';
      case 'Acesso': return '#ffc107';
      default: return '#6c757d';
    }
  }};
  border: 1px solid currentColor;
`;