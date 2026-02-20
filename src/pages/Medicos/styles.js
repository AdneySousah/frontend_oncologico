import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
`;

export const ListContainer = styled.div`
  margin-top: 32px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  h3 {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const MedicoCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  transition: background-color 0.2s;

  /* Efeito suave ao passar o mouse */
  &:hover {
    background-color: ${({ theme }) => theme.colors.inputBg};
  }

  .info {
    display: flex;
    flex-direction: column;
    
    strong {
      color: ${({ theme }) => theme.colors.primary}; /* Trocado de primaryDark para leitura no dark mode */
      font-size: 16px;
    }
    
    span {
      color: ${({ theme }) => theme.colors.textLight};
      font-size: 14px;
      margin-top: 4px;
    }
  }

  .locais {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    max-width: 50%;
    justify-content: flex-end;
  }
`;

export const Badge = styled.span`
  /* Transparência suave usando a cor primária */
  background-color: ${({ theme }) => theme.colors.primary}1A; 
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
`;