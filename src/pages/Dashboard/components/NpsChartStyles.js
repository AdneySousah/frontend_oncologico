import styled from 'styled-components';

export const NpsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const GaugeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border || 'rgba(128,128,128,0.1)'};
  position: relative;
`;

export const StatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  border: 1px solid ${({ color }) => color};
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  color: ${({ theme }) => theme.colors.text || '#333'};
  font-weight: bold;

  .badge {
    background: ${({ color }) => color};
    color: #fff;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.1rem;
  }

  .label {
    flex: 1;
    text-align: center;
    color: ${({ color }) => color};
  }

  .perc {
    font-size: 1.1rem;
  }
`;

export const BigScoreCard = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border || 'rgba(128,128,128,0.1)'};
  margin-top: auto;

  .circle {
    width: 130px;
    height: 130px;
    background: ${({ color }) => color};
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 4px 15px ${({ color }) => color}40;

    span:first-child { font-size: 2.5rem; font-weight: bold; line-height: 1; }
    span:last-child { font-size: 1.2rem; font-weight: 500; }
  }
`;

export const BottomSection = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 10px;

  /* Estilizando a barra de rolagem para telas menores */
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
`;

export const NoteCard = styled.div`
  flex: 1;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  border-radius: 8px;
  color: #fff;
  background: ${({ color }) => color};
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover { transform: translateY(-3px); }

  .title { font-size: 0.85rem; margin-bottom: 5px; opacity: 0.9; }
  .count { font-size: 1.4rem; font-weight: bold; }
  .perc { font-size: 0.8rem; margin-top: 5px; opacity: 0.9; }
`;