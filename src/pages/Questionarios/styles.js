import styled, { keyframes } from 'styled-components';

// Animação suave de entrada
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.8rem;
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background-color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary}; }
  }
`;

export const TemplateCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  margin-bottom: 1rem;
  /* Se não tiver a cor 'secondary' no tema, usa a 'primary' */
  border-left: 5px solid ${({ isActive, theme }) => isActive ? (theme.colors.secondary || theme.colors.primary) : theme.colors.border};
  transition: all 0.3s ease;
  
  // Se estiver expandido, pode ter uma sombra maior
  ${props => props.isExpanded && `
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    border-left-width: 8px;
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  div.info {
    h3 { 
      color: ${({ theme }) => theme.colors.text}; 
      margin-bottom: 0.5rem; 
      display: flex; 
      align-items: center; 
      gap: 10px;
    }
    p { 
      color: ${({ theme }) => theme.colors.textLight}; 
      font-size: 0.9rem; 
    }
  }
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
  
  /* Usando transparência para funcionar bem no Claro/Escuro */
  background-color: ${({ isActive }) => isActive ? 'rgba(0, 122, 94, 0.1)' : 'rgba(207, 19, 34, 0.1)'};
  color: ${({ isActive, theme }) => isActive ? (theme.colors.success || '#007a5e') : (theme.colors.error || '#cf1322')};
  border: 1px solid ${({ isActive }) => isActive ? 'rgba(0, 122, 94, 0.3)' : 'rgba(207, 19, 34, 0.3)'};
`;

export const Actions = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

export const ActionButton = styled.button`
    background: transparent;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ color, theme }) => color || theme.colors.primary};
    border: 1px solid ${({ color, theme }) => color || theme.colors.primary};
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;

    &:hover {
        background-color: ${({ color, theme }) => color || theme.colors.primary};
        color: #ffffff;
    }
`;

// --- Novos Estilos para a Área Expandida ---

export const DetailsContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${fadeIn} 0.3s ease-out;
`;

export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const QuestionItem = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Usando inputBg para destacar do card */
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .q-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    strong { color: ${({ theme }) => theme.colors.primary}; } /* Trocado de sidebarMiddle */
    
    span.type { 
        font-size: 0.8rem; 
        /* Transparência azul para tag */
        background-color: rgba(24, 144, 255, 0.1); 
        color: #1890ff; 
        padding: 4px 10px; 
        border-radius: 4px; 
        border: 1px solid rgba(24, 144, 255, 0.3);
    }
  }

  .q-options {
    margin-top: 0.8rem;
    padding-left: 1rem;
    border-left: 2px solid ${({ theme }) => theme.colors.border}; /* Linha divisória com cor do tema */
    
    ul { list-style: none; }
    li { 
        font-size: 0.9rem; 
        color: ${({ theme }) => theme.colors.textLight}; 
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        max-width: 300px;
        
        span.score { 
          font-weight: bold; 
          color: ${({ theme }) => theme.colors.text}; 
        }
    }
  }
`;

export const WarningMessage = styled.div`
  /* Transparência amarela/laranja para alerta */
  background-color: rgba(250, 173, 20, 0.1);
  border: 1px solid rgba(250, 173, 20, 0.3);
  color: #faad14; /* Dourado escuro/Laranja */
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  
  svg { flex-shrink: 0; }
`;