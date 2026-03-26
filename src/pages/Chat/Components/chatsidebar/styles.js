import styled, { keyframes } from "styled-components";


const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 ${({ theme }) => theme.colors?.info || 'rgba(24, 144, 255, 0.6)'}; }
  70% { box-shadow: 0 0 0 8px rgba(24, 144, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0); }
`;

export const SidebarContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  width: 350px; /* Largura fixa ideal para leitura de nomes e preview de mensagens */
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  z-index: 100;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%; /* No mobile ocupa a tela toda (depois podemos fazer a lógica de esconder ao abrir um chat) */
  }
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  flex-shrink: 0;
  

  img {
    width: 100%;
    height: 100%;
    max-width: 140px;
    object-fit: contain; 
  }
`;

export const UserHeader = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors?.background || '#f9f9f9'};

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
`;

export const AvatarContainer = styled.div`
  min-width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${({ theme }) => theme.name === 'light' ? '#007D99' : '#203a43'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  border: 2px solid ${({ theme }) => theme.colors?.success || '#52c41a'}; 
  flex-shrink: 0;
`;

export const UserName = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#333'};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserRole = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.primary || '#007D99'};
  margin: 0;
`;

// --- ÁREA DA LISTA DE CONVERSAS ---
export const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors?.border || '#ccc'};
    border-radius: 4px;
  }
`;

export const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  cursor: pointer;
  transition: background 0.2s;
  background-color: ${({ isActive, theme }) => isActive ? (theme.colors?.inputBg || '#e6f7ff') : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors?.inputBg || '#f5f5f5'};
  }

  .chat-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors?.border || '#ddd'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors?.textLight || '#666'};
    font-weight: bold;
    flex-shrink: 0;
  }

  .chat-info {
    flex: 1;
    overflow: hidden;

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      strong {
        font-size: 0.95rem;
        color: ${({ theme }) => theme.colors?.text || '#333'};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      span {
        font-size: 0.7rem;
        color: ${({ theme }) => theme.colors?.textLight || '#999'};
      }
    }

    p {
      margin: 0;
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors?.textLight || '#666'};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

// --- FOOTER COM HORAS E STATUS ---
export const Footer = styled.div`
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
`;

export const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  font-weight: bold;
  
  .time {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors?.primary || '#007D99'};
  }
`;

export const LimitDisplay = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.inputBg || '#f4f4f4'};
  padding: 8px 10px;
  border-radius: 6px;

  strong {
    color: ${({ theme }) => theme.colors?.text || '#333'};
  }
`;

// Reutilizando o seu HealthStatus
export const HealthStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors?.inputBg || '#f9f9f9'};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: ${(props) => {
      if (props.quality === 'Green') return '#52c41a';
      if (props.quality === 'Yellow') return '#faad14';
      if (props.quality === 'Red') return '#ff4d4f';
      return '#888';
    }};
  }

  .health-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
      color: ${({ theme }) => theme.colors?.textLight || '#666'};
      font-size: 0.7rem;
      text-transform: uppercase;
    }

    strong {
      color: ${({ theme }) => theme.colors?.text || '#333'};
      font-size: 0.85rem;
    }

    .balance-label {
      margin-top: 2px;
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors?.primary || '#007D99'};
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;


export const SearchArea = styled.div`
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  flex-shrink: 0;
`;

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.inputBg || '#f0f2f5'};
  border-radius: 8px;
  padding: 8px 15px;

  svg {
    color: ${({ theme }) => theme.colors?.textLight || '#888'};
    margin-right: 10px;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors?.text || '#333'};
    outline: none;

    &::placeholder {
      color: ${({ theme }) => theme.colors?.textLight || '#aaa'};
    }
  }
`;

export const UnreadBadge = styled.div`
  background-color: ${({ theme }) => theme.colors?.success || '#25D366'};
  color: #fff;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  margin-top: 5px;
  align-self: flex-end;
`;

export const ThemeToggleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.colors?.inputBg || '#f5f5f5'};
    color: ${({ theme }) => theme.colors?.text || '#333'};
  }
`;



export const RulesButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors?.infoLight || '#e6f7ff'};
  border: 1px solid ${({ theme }) => theme.colors?.info || '#1890ff'};
  color: ${({ theme }) => theme.colors?.info || '#1890ff'};
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
  font-weight: bold;
  
  /* Aplica a animação infinita */
  animation: ${pulseGlow} 2s infinite;

  &:hover {
    background-color: ${({ theme }) => theme.colors?.info || '#1890ff'};
    color: #fff;
    animation: none; /* Para a animação quando passa o mouse */
  }
`;

// Estilos do Modal de Regras
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

export const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);

  h2 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors?.text || '#333'};
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
    padding-bottom: 15px;
    margin-bottom: 20px;
  }
`;

export const RuleItem = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed ${({ theme }) => theme.colors?.border || '#eee'};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  h4 {
    margin: 0 0 5px 0;
    color: ${({ theme }) => theme.colors?.primary || '#007D99'};
    font-size: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors?.textLight || '#666'};
    line-height: 1.4;
  }
`;

export const CloseButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors?.primary || '#007D99'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.1);
  }
`;