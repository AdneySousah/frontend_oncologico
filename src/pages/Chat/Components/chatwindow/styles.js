import styled from "styled-components";

export const WindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

export const ChatHeader = styled.div`
  height: 80px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  z-index: 10;

  .header-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors?.primary || '#007D99'};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 15px;
  }

  .header-info {
    h3 {
      margin: 0;
      font-size: 1.1rem;
      color: ${({ theme }) => theme.colors?.text || '#333'};
    }
    span {
      font-size: 0.8rem;
    }
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
`;

export const MessageBubble = styled.div`
  max-width: 65%;
  padding: 10px 15px;
  border-radius: 8px;
  position: relative;
  font-size: 0.95rem;
  line-height: 1.4;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  white-space: pre-wrap;
  
  /* LÓGICA DE CORES DOS BALÕES */
  background-color: ${({ $isMine, theme }) => {
    // Detecta se é tema escuro pela cor do texto
    const isDark = theme.colors?.text === '#fff' || theme.colors?.text?.toLowerCase() === '#ffffff';
    
    if ($isMine) {
      return isDark ? '#005c4b' : (theme.colors?.primaryLight || '#dcf8c6'); // Verde Escuro WhatsApp / Verde Claro
    }
    return isDark ? '#202c33' : (theme.colors?.surface || '#fff'); // Cinza Escuro WhatsApp / Branco
  }};
  
  color: ${({ theme }) => theme.colors?.text || '#333'};
  align-self: ${({ $isMine }) => $isMine ? 'flex-end' : 'flex-start'};

  .meta-data {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    font-size: 0.7rem;
    /* Hora mais clara no modo escuro para dar leitura */
    color: ${({ theme }) => (theme.colors?.text === '#fff' ? 'rgba(255,255,255,0.6)' : '#999')};
  }

  .user-name {
    font-size: 0.75rem;
    font-weight: bold;
    /* Nome do usuário (Robô/Atendente) clareado no modo escuro */
    color: ${({ theme }) => (theme.colors?.text === '#fff' ? '#53bdeb' : (theme.colors?.primary || '#007D99'))};
    margin-bottom: 3px;
    display: block;
  }
`;

export const InputArea = styled.div`
  min-height: 70px;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors?.surface || '#f0f0f0'};
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  /* Cor do input ajustada para modo escuro */
  background-color: ${({ theme }) => 
    theme.colors?.text === '#fff' ? '#2a3942' : (theme.colors?.inputBg || '#fff')};
  color: ${({ theme }) => theme.colors?.text || '#333'};
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors?.textLight || '#aaa'};
  }

  &:focus {
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  }
`;

export const SendButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme }) => theme.colors?.primary || '#007D99'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors?.primaryHover || '#005f73'};
    transform: scale(1.05);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors?.border || '#ccc'};
    cursor: not-allowed;
    transform: scale(1);
  }
`;

export const BlockedArea = styled.div`
  min-height: 90px;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  flex-shrink: 0;

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors?.textLight || '#888'};
  }

  button {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: ${({ theme }) => theme.colors?.success || '#25D366'};
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors?.successHover || '#1DA851'};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors?.border || '#ccc'};
      cursor: not-allowed;
    }
  }
`;