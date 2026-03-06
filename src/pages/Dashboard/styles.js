import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || '#f4f6f8'};
  min-height: 100vh;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  font-size: 2rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

export const ControlsPanel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border || '#eee'};
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  label {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text || '#333'};
  }

  input[type="date"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    background: ${({ theme }) => theme.colors.background || '#fff'};
    color: ${({ theme }) => theme.colors.text || '#333'};
  }

  button {
    padding: 0.5rem 1rem;
    background-color: ${({ theme }) => theme.colors.primary || '#007bff'};
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const SelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  label {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text || '#333'};
  }

  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    min-width: 200px;
    background: ${({ theme }) => theme.colors.background || '#fff'};
    color: ${({ theme }) => theme.colors.text || '#333'};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  border-radius: 12px; /* Aumentado para um visual mais suave */
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* Sombra mais difusa e moderna */
  border: 1px solid ${({ theme }) => theme.colors.border || 'transparent'};
  display: flex;
  flex-direction: column;
  
  ${({ $isFullWidth }) => $isFullWidth && `
    grid-column: 1 / -1;
  `}
`;

/* NOVOS COMPONENTES PARA OS GRÁFICOS */
export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || 'rgba(128,128,128,0.1)'};

  h3 {
    color: ${({ theme }) => theme.colors.text || '#333'};
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.primary || '#00C49F'};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;