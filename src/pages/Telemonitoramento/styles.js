// src/pages/Telemonitoramento/styles.js
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 40px 20px;
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
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding-bottom: 10px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  margin: 0; /* Removido o margin-bottom pois o HeaderFlex agora cuida disso */
`;

export const TableContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-top: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 18px 20px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
    vertical-align: middle;
  }

  th {
    background-color: ${props => props.theme.colors.inputBg};
    font-weight: bold;
    color: ${props => props.theme.colors.textLight};
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
  padding: 30px 40px; 
  background-color: rgba(0, 0, 0, 0.015);
  border-left: 5px solid ${props => props.theme.colors.primary};
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
    padding: 16px 24px; 
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 0.95rem;
    vertical-align: middle; 
  }

  th {
    background-color: rgba(0,0,0,0.03);
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    font-weight: bold;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

/* Badge para o Tempo/Atraso */
export const StatusBadge = styled.span`
  display: inline-block;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  
  background-color: ${props => {
    if (props.status === 'atrasado') return 'rgba(217, 83, 79, 0.1)';
    if (props.status === 'concluido') return 'rgba(46, 204, 113, 0.1)';
    return 'rgba(243, 156, 18, 0.1)';
  }};
  color: ${props => {
    if (props.status === 'atrasado') return props.theme.colors.danger;
    if (props.status === 'concluido') return '#2ecc71';
    return '#f39c12';
  }};
  border: 1px solid ${props => {
    if (props.status === 'atrasado') return props.theme.colors.danger;
    if (props.status === 'concluido') return '#2ecc71';
    return '#f39c12';
  }};
`;

/* Badge para a Classificação de Adesão */
export const AdherenceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
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
    return '#555';
  }};
`;

export const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
  
  li {
    margin-bottom: 15px;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: filter 0.2s;

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
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
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
  background: ${props => props.theme.colors.surface}; color: ${props => props.theme.colors.text};
  padding: 40px; border-radius: 12px; max-width: 1200px; width: 90%;
  border: 1px solid ${props => props.theme.colors.border};
  h3 { margin-bottom: 20px; border-bottom: 1px solid ${props => props.theme.colors.border}; padding-bottom: 10px; }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px; text-align: left;
  label { display: block; margin-bottom: 8px; font-weight: bold; color: ${props => props.theme.colors.text}; }
`;

export const Input = styled.input`
  width: 100%; padding: 12px; border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.inputBg}; color: ${props => props.theme.colors.text};
  border-radius: 6px; font-size: 1rem;
`;

export const ButtonGroup = styled.div` display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px; `;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#555' : props.theme.colors.primary};
  color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-size: 1rem; cursor: pointer; font-weight: bold;
  &:hover { filter: brightness(1.2); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;