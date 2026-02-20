import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px;
  background-color: ${({ theme }) => theme.colors.background || '#000000'};
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 30px;
  h1 { color: ${({ theme }) => theme.colors.text}; font-size: 2rem; margin-bottom: 8px; }
  p { color: ${({ theme }) => theme.colors.textLight}; font-size: 1rem; opacity: 0.8; }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);

  th, td {
    padding: 18px 20px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.primary}; 
    color: #ffffff;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    &.sortable {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: filter 0.2s;
      
      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  td {
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    vertical-align: middle;
  }

  tr {
    transition: background-color 0.2s;
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.inputBg}CC; 
  }
`;

export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
  min-width: 90px;
  text-transform: capitalize;
  
  /* Prioriza cores enviadas via props, senão usa o padrão do 'done' */
  background-color: ${props => props.bg || (props.done ? 'rgba(0, 168, 84, 0.15)' : 'rgba(245, 34, 45, 0.15)')};
  color: ${props => props.color || (props.done ? '#52c41a' : '#f5222d')};
  border: 1px solid rgba(0,0,0,0.1);
`;

export const ActionButton = styled.button`
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s;

  background-color: ${({ mode, theme }) => mode === 'view' ? theme.colors.inputBg : theme.colors.primary};
  color: #ffffff;
  
  &:hover { 
    filter: brightness(1.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;