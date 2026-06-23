import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px; /* Reduzido de 30px para ganhar tela no desktop */
  background-color: ${({ theme }) => theme.colors.background || '#000000'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap; /* Evita quebra forçada na horizontal */
  gap: 15px;
  margin-bottom: 25px;

  .title-section {
    flex: 1;
    min-width: 300px;
  }

  h1 { color: ${({ theme }) => theme.colors.text}; font-size: 1.8rem; margin-bottom: 4px; }
  p { color: ${({ theme }) => theme.colors.textLight}; font-size: 0.95rem; opacity: 0.8; margin: 0; }
`;

/* Novo wrapper para garantir que, caso estoure 1px, não afete a página toda */
export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  min-width: 900px; /* Garante estrutura básica, mas sem forçar 1200px */

  th, td {
    /* MÁGICA DA RESPONSIVIDADE DESKTOP AQUI: Diminuindo os paddings gigantes */
    padding: 12px 10px; 
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 13px; /* Fonte levemente menor para dados */
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
      gap: 6px;
      transition: filter 0.2s;
      
      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  td {
    color: ${({ theme }) => theme.colors.text};
    vertical-align: middle;
    
    .action-buttons {
      display: flex; 
      gap: 6px; 
      justify-content: center;
      flex-wrap: wrap; /* Se a tela for muito pequena, os botões empilham */
    }
  }

  tr {
    transition: background-color 0.2s;
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.inputBg}CC; 
  }
`;

export const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px; /* Menos arredondado para economizar espaço height */
  font-size: 11px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
  /* Retirado o min-width excessivo para se adaptar ao conteúdo */
  text-transform: capitalize;
  
  background-color: ${props => props.bg || (props.done ? 'rgba(0, 168, 84, 0.15)' : 'rgba(245, 34, 45, 0.15)')};
  color: ${props => props.color || (props.done ? '#52c41a' : '#f5222d')};
  border: 1px solid rgba(0,0,0,0.1);
`;

export const ActionButton = styled.button`
  padding: 6px 12px; /* Mais enxuto */
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  background-color: ${({ mode, theme }) => mode === 'view' ? theme.colors.inputBg : theme.colors.primary};
  color: #ffffff;
  
  &.view-btn {
    background-color: #17a2b8;
    padding: 6px 8px; /* Botão de olho mais quadradinho */
  }

  &:hover { 
    filter: brightness(1.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SyncPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap; /* Se ficar espremido, empilha o botão */

  span.status-text {
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  span.status-text.checking { color: ${({ theme }) => theme.colors.textLight}; }
  span.status-text.pending { color: #faad14; }
  span.status-text.synced { color: #52c41a; }
  span.status-text.error { color: #f5222d; }

  .sync-btn {
    background-color: #1890ff;
    padding: 6px 12px;
    opacity: ${props => props.disabled ? 0.7 : 1};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 180px; /* Reduzido de 200px para permitir mais itens na linha */

  label {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 4px;
    font-weight: 600;
    text-transform: uppercase;
  }

  input, select {
    background-color: ${({ theme }) => theme.colors.inputBg || '#1e1e1e'};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13px;
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
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  height: 36px;
  align-self: flex-end;

  &:hover {
    background: rgba(245, 34, 45, 0.1);
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 10px;

  .controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 13px;
  }

  select {
    background-color: ${({ theme }) => theme.colors.inputBg || '#1e1e1e'};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 6px;
    border-radius: 4px;
    outline: none;
  }
`;

export const PageButton = styled.button`
  background-color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.inputBg || '#1e1e1e'};
  color: ${({ theme, active }) => active ? '#fff' : theme.colors.text};
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
  padding: 6px 10px;
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

export const CountersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px; /* Reduzido o gap de 20px para 15px */
  margin-bottom: 25px;
`;

export const CounterCircle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 85px; /* Reduzido de 100px */
  height: 85px; /* Reduzido de 100px */
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface || '#1e1e1e'};
  border: 3px solid ${({ color }) => color};
  cursor: pointer;
  transition: all 0.3s ease;
  
  box-shadow: ${({ active, color }) => active ? `0 0 12px ${color}80` : '0 2px 4px rgba(0,0,0,0.1)'};
  transform: ${({ active }) => active ? 'scale(1.08)' : 'scale(1)'};
  opacity: ${({ active }) => active ? '1' : '0.6'};

  &:hover {
    transform: scale(1.05);
    opacity: 1;
  }

  .count {
    font-size: 20px;
    font-weight: 800;
    color: ${({ color }) => color};
    line-height: 1;
    margin-bottom: 2px;
  }

  .label {
    font-size: 10px;
    color: ${({ theme }) => theme.colors.text || '#fff'};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
    line-height: 1.1;
  }
`;