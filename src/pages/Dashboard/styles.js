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
  }
`;

/* Atualize o seu Card existente para aceitar uma prop transiente e crescer quando estiver sozinho */
export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border || '#eee'};
  
  /* Se estiver visualizando só um gráfico, ele ocupa a largura toda */
  ${({ $isFullWidth }) => $isFullWidth && `
    grid-column: 1 / -1;
  `}

  h3 {
    color: ${({ theme }) => theme.colors.textLight || '#555'};
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    text-align: center;
  }
`;

