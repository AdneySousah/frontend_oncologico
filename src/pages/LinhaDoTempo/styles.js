import styled, { keyframes } from 'styled-components';


const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 var(--pulse-color);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); /* Expande e fica transparente */
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`;


export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
  padding: 1rem;
`;

export const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h1 { color: ${({ theme }) => theme.colors.text}; }
`;

export const ContentBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  th {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }

  tbody tr.main-row:hover {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: pointer;
    transition: background-color 0.2s;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }

  svg {
    transition: transform 0.3s ease;
    transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

// ==========================================
// ESTILOS ADICIONADOS PARA A LINHA DO TEMPO
// ==========================================

export const TimelineRow = styled.tr`
  background-color: ${({ theme }) => theme.colors.inputBg};
`;

export const TimelineWrapper = styled.div`
  padding: 20px 40px;
  margin: 10px 0;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
`;

export const TimelineItem = styled.div`
  position: relative;
  padding-left: 30px;
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }

  /* Linha vertical conectando os pontos */
  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 20px;
    bottom: -25px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.border};
  }

  &:last-child::before {
    display: none; /* Remove a linha do último item */
  }
`;

export const TimelineDot = styled.div`
  position: absolute;
  left: 0;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ theme, $type }) => $type === 'entrevista' ? theme.colors.primary : '#28a745'};
  border: 3px solid ${({ theme }) => theme.colors.surface};
  box-shadow: 0 0 0 2px ${({ theme, $type }) => $type === 'entrevista' ? theme.colors.primary : '#28a745'}40;
  z-index: 1;
`;

export const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
    margin-bottom: 4px;
  }

  span {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.85rem;
  }
`;


export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SearchInput = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  max-width: 400px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.7;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.inputBg};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.text};
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) => $active ? theme.colors.primaryHover : theme.colors.border};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;