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

export const ActionButton = styled.button`
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s;
  color: #ffffff;

  &:hover:not(:disabled) { 
    filter: brightness(1.2);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  min-width: 150px;

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

export const CountersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 25px;
`;

export const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 4px solid ${({ cor }) => cor || '#1890ff'};
  padding: 15px 25px;
  border-radius: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  min-width: 220px;

  p {
    margin: 0;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textLight};
    text-transform: uppercase;
    font-weight: 700;
  }

  h2 {
    margin: 5px 0 0 0;
    color: ${({ cor }) => cor || '#1890ff'};
    font-size: ${({ isNumero }) => (isNumero ? '28px' : '22px')};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);

  th, td {
    padding: 15px 20px;
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
    background-color: ${({ theme }) => theme.colors.inputBg || '#1e1e1e'}CC; 
  }
`;