import styled from "styled-components";

export const ChatLayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors?.background || '#f0f2f5'};
`;

export const ChatWindowArea = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 767px) {
    display: ${({ $hasActive }) => ($hasActive ? 'flex' : 'none')};
  }
  display: flex;
  flex-direction: column;
  position: relative;
  
  /* Lógica para o fundo do WhatsApp funcionar no Claro e no Escuro */
  background-color: ${({ theme }) => 
    // Se a cor do texto for branca, assumimos que é Dark Mode e usamos a cor oficial do WPP
    theme.colors?.text === '#fff' || theme.colors?.text?.toLowerCase() === '#ffffff' 
      ? '#0b141a' 
      : '#efeae2'
  };
  
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  
  /* No modo escuro invertemos a imagem para ela aparecer */
  background-blend-mode: ${({ theme }) => 
    theme.colors?.text === '#fff' || theme.colors?.text?.toLowerCase() === '#ffffff' 
      ? 'color-dodge' 
      : 'multiply'
  };
  opacity: ${({ theme }) => 
    theme.colors?.text === '#fff' || theme.colors?.text?.toLowerCase() === '#ffffff' 
      ? 0.8 
      : 1
  };
`;

export const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${({ theme }) => theme.colors?.textLight || '#888'};
  
  h2 {
    margin-top: 20px;
    font-weight: 300;
    color: ${({ theme }) => theme.colors?.textLight || '#555'};
  }
`;

// Só no celular: volta da conversa para a lista
export const BackToList = styled.button`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 12px;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    flex-shrink: 0;
  }
`;
