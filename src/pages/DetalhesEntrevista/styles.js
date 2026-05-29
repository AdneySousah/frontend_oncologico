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

// Adicione isso no final do seu arquivo styles.js
export const SyncPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  span.status-text {
    font-size: 14px;
    font-weight: 700;
  }

  span.status-text.checking { color: ${({ theme }) => theme.colors.textLight}; }
  span.status-text.pending { color: #faad14; }
  span.status-text.synced { color: #52c41a; }
  span.status-text.error { color: #f5222d; }
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;

  label {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 6px;
    font-weight: 600;
    text-transform: uppercase;
  }

  input, select {
    background-color: ${({ theme }) => theme.colors.inputBg || '#1e1e1e'};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const ClearButton = styled.button`
  background: transparent;
  color: #f5222d;
  border: 1px solid #f5222d;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  height: 40px;
  align-self: flex-end;

  &:hover {
    background: rgba(245, 34, 45, 0.1);
  }
`;

// --- ESTILOS DA PAGINAÇÃO ---
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .info {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 14px;
  }

  select {
    background-color: ${({ theme }) => theme.colors.inputBg || '#1e1e1e'};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 6px 10px;
    border-radius: 4px;
    outline: none;
  }
`;

export const PageButton = styled.button`
  background-color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.inputBg || '#1e1e1e'};
  color: ${({ theme, active }) => active ? '#fff' : theme.colors.text};
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    filter: brightness(1.2);
  }
`;

// --- NOVOS ESTILOS: CONTADORES DE STATUS (CÍRCULOS) ---
export const CountersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
`;

export const CounterCircle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface || '#1e1e1e'};
  border: 4px solid ${({ color }) => color};
  cursor: pointer;
  transition: all 0.3s ease;
  
  /* Efeito luminoso e aumento quando o filtro está ativo */
  box-shadow: ${({ active, color }) => active ? `0 0 15px ${color}80` : '0 4px 6px rgba(0,0,0,0.1)'};
  transform: ${({ active }) => active ? 'scale(1.1)' : 'scale(1)'};
  opacity: ${({ active }) => active ? '1' : '0.6'};

  &:hover {
    transform: scale(1.05);
    opacity: 1;
  }

  .count {
    font-size: 24px;
    font-weight: 800;
    color: ${({ color }) => color};
    line-height: 1;
    margin-bottom: 4px;
  }

  .label {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.text || '#fff'};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;