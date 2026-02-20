import styled from "styled-components";

export const Container = styled.div`
  padding: 40px;
  /* Usando uma cor de fundo do tema. Se não houver 'background', usa o 'inputBg' como fallback */
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
  width: 100%;
  overflow-y: auto;
`;

export const Header = styled.header`
  margin-bottom: 30px;
  
  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.8rem;
    margin-bottom: 5px;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1); /* Aumentei um pouco o alpha da sombra para destacar no hover */
  }

  h3 {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 500;
    margin-bottom: 10px;
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  .indicator {
    font-size: 0.8rem;
    margin-top: 10px;
    
    /* Fallback para success/error caso não adicione ao theme.js */
    &.positive { color: ${({ theme }) => theme.colors.success || '#059669'}; }
    &.negative { color: ${({ theme }) => theme.colors.error || '#dc2626'}; }
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media(max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  padding: 25px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}; /* Melhor usar a cor de borda para divisórias */
    padding-bottom: 10px;
  }
`;

// Tabela simples estilizada
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
  }

  th {
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 600;
  }

  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    
    /* Cores estáticas mantidas pois são classes muito específicas, 
       mas no modo dark tons muito claros de background podem precisar de ajuste depois */
    &.critico { background: #fee2e2; color: #dc2626; }
    &.atencao { background: #fef3c7; color: #d97706; }
    &.estavel { background: #d1fae5; color: #059669; }
  }
`;

// Barra de progresso fictícia
export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Usando inputBg para o fundo do trilho */
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;

  .fill {
    height: 100%;
    /* Se a prop color for passada, usa ela, senão pega a primary do tema */
    background-color: ${(props) => props.color || props.theme.colors.primary};
    width: ${(props) => props.percent}%;
  }
`;