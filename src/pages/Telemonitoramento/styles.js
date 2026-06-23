import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 20px; /* Reduzido de 40px 20px */
  transition: background-color 0.3s ease;
`;

export const SectionWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
`;

export const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Evita quebra forçada na horizontal */
  gap: 15px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  margin: 0; 
  font-size: 1.6rem;
`;

/* Novo Wrapper para conter qualquer vazamento da tabela */
export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-bottom: none; 
  border-radius: 8px 8px 0 0;
  margin-top: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px; /* Garante estrutura básica */

  th, td {
    padding: 12px 14px; /* Reduzido consideravelmente para ganhar espaço */
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
    vertical-align: middle;
    font-size: 13px;
  }

  th {
    background-color: ${props => props.theme.colors.inputBg};
    font-weight: 600;
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  .summary-row {
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
      background-color: ${props => props.theme.colors.inputBg};
    }
  }

  .details-row > td {
    padding: 0;
    border-bottom: none;
  }
`;

export const SubTableWrapper = styled.div`
  padding: 20px 30px; /* Reduzido de 30px 40px */
  background-color: rgba(0, 0, 0, 0.015);
  border-left: 4px solid ${props => props.theme.colors.primary};
  box-shadow: inset 0 3px 6px rgba(0,0,0,0.02);
`;

export const SubTable = styled.table`
  width: 100%;
  border-collapse: separate; 
  border-spacing: 0;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  
  th, td {
    padding: 10px 14px; /* Reduzido de 16px 24px */
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 13px;
    vertical-align: middle; 
  }

  th {
    background-color: ${props => props.theme.colors.inputBg}; 
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
    font-weight: bold;
    white-space: nowrap;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px; /* Mais enxuto */
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  
  background-color: ${props => {
    if (props.status === 'none') return props.style?.backgroundColor;
    if (props.status === 'atrasado') return 'rgba(217, 83, 79, 0.1)';
    if (props.status === 'concluido') return 'rgba(46, 204, 113, 0.1)';
    return 'rgba(243, 156, 18, 0.1)';
  }};
  color: ${props => {
    if (props.status === 'none') return props.style?.color;
    if (props.status === 'atrasado') return props.theme.colors.danger;
    if (props.status === 'concluido') return '#2ecc71';
    return '#f39c12';
  }};
  border: 1px solid ${props => {
    if (props.status === 'none') return 'transparent';
    if (props.status === 'atrasado') return props.theme.colors.danger;
    if (props.status === 'concluido') return '#2ecc71';
    return '#f39c12';
  }};
`;

export const AdherenceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px; /* Reduzido */
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  margin-top: 6px;
  background-color: ${props => {
    if (props.level === 'alta') return 'rgba(46, 204, 113, 0.15)';
    if (props.level === 'media') return 'rgba(243, 156, 18, 0.15)';
    if (props.level === 'baixa') return 'rgba(231, 76, 60, 0.15)';
    return 'rgba(0,0,0,0.05)';
  }};
  color: ${props => {
    if (props.level === 'alta') return '#27ae60';
    if (props.level === 'media') return '#d35400';
    if (props.level === 'baixa') return '#c0392b';
    return props.theme.colors.text;
  }};
`;

export const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 8px 14px; /* Mais fino */
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
  transition: filter 0.2s;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.2);
  }
`;

export const InfoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 999;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface}; 
  color: ${props => props.theme.colors.text};
  padding: 30px; border-radius: 12px; max-width: 550px; width: 90%;
  border: 1px solid ${props => props.theme.colors.border};
  h3 { margin-bottom: 15px; border-bottom: 1px solid ${props => props.theme.colors.border}; padding-bottom: 10px; }
`;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#555' : props.theme.colors.primary};
  color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: bold;
  &:hover { filter: brightness(1.2); }
`;

export const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0;
  text-align: left;
  
  li {
    margin-bottom: 15px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
`;

export const SearchInputContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 350px; /* Mantém controle no desktop */
  min-width: 250px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 38px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background-color: ${props => props.theme.colors.inputBg};
  color: ${props => props.theme.colors.text};
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  flex-wrap: wrap;
  gap: 10px;
`;

export const PaginationInfo = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 13px;
`;

export const PageButton = styled.button`
  padding: 6px 14px;
  margin-left: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.inputBg};
  color: ${props => props.theme.colors.text};
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* --- TOOLTIP PARA OBSERVAÇÕES LIMPO --- */
export const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  cursor: help;

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    padding: 8px 12px;
    background-color: #333;
    color: #fff;
    font-size: 12px;
    border-radius: 6px;
    white-space: pre-wrap; 
    word-wrap: break-word;
    width: max-content;
    max-width: 250px; /* Reduzido um pouco para não estourar telas pequenas */
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    pointer-events: none;
    line-height: 1.4;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 2px;
    border-width: 6px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    pointer-events: none;
  }

  &:hover::after,
  &:hover::before {
    opacity: 1;
    visibility: visible;
  }
`;

export const TruncatedText = styled.span`
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;


