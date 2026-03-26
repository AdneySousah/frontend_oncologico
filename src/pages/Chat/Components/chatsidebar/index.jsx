import React, { useState, useEffect, useContext } from 'react';
import { 
  LuSmartphone, 
  LuClock, 
  LuMessageSquare, 
  LuSearch, 
  LuSun, 
  LuMoon, 
  LuInfo
} from 'react-icons/lu';
import api from '../../../../services/api'; 
import { AuthContext } from '../../../../hooks/AuthConfig'; 
import { ThemeContext } from '../../../../hooks/ThemeConfig'; 
import logoBranca from '../../../../assets/logo_branca.png'; 

import * as S from './styles';
import RulesModal from './RulesModal'; // Certifique-se de ter criado este arquivo na mesma pasta

export default function ChatSidebar({ activeChatId, setActiveChatId }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [conversations, setConversations] = useState([]);
  const [limitData, setLimitData] = useState({ used: 0, total: 1000 });
  const [npsHealth, setNpsHealth] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para controlar a abertura do modal de regras
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  
  const userStorage = JSON.parse(localStorage.getItem('oncologico:UserData'));
  const userName = userStorage?.user?.name || "Usuário";
  const userRole = userStorage?.user?.is_admin ? "Administrador" : "Atendente";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  // Relógio em tempo real
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Polling para atualizar a lista, as não lidas e os status a cada 5 segundos
  useEffect(() => {
    async function loadData() {
      try {
        const [chatRes, healthRes, unreadRes] = await Promise.all([
          api.get('/chat/conversations').catch(() => ({ data: { data: [], limit_data: { used: 0, total: 1000 } } })),
          api.get('/nps/health').catch(() => ({ data: null })),
          api.get('/chat/unread').catch(() => ({ data: { by_conversation: {} } }))
        ]);

        setConversations(chatRes.data.data);
        setLimitData(chatRes.data.limit_data);
        if (healthRes.data) setNpsHealth(healthRes.data);
        setUnreadMap(unreadRes.data.by_conversation);

      } catch (error) {
        console.error("Erro ao carregar dados da sidebar:", error);
      }
    }
    
    loadData();
    const interval = setInterval(loadData, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Lógica da barra de pesquisa
  const filteredConversations = conversations.filter(conv => {
    const nameStr = conv.paciente ? `${conv.paciente.nome} ${conv.paciente.sobrenome}`.toLowerCase() : '';
    const phoneStr = conv.phone_number.toLowerCase();
    const searchStr = searchTerm.toLowerCase();
    
    return nameStr.includes(searchStr) || phoneStr.includes(searchStr);
  });

  return (
    <S.SidebarContainer>
      <S.LogoArea>
        <img src={logoBranca} alt="Logo Onco" />
      </S.LogoArea>

      <S.UserHeader>
        <S.AvatarContainer theme={{ name: theme }}>
          {getInitials(userName)}
        </S.AvatarContainer>
        <div className="user-info">
          <S.UserName title={userName}>{userName}</S.UserName>
          <S.UserRole>{userRole}</S.UserRole>
        </div>
      </S.UserHeader>

      <S.SearchArea>
        <S.SearchInput>
          <LuSearch size={18} />
          <input 
            type="text" 
            placeholder="Buscar paciente ou número..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </S.SearchInput>
      </S.SearchArea>

      <S.ConversationList>
        {filteredConversations.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
            Nenhuma conversa encontrada.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
            const displayName = conv.paciente 
              ? `${conv.paciente.nome} ${conv.paciente.sobrenome}`
              : conv.phone_number;

            const isUnread = unreadMap[conv.id] > 0;

            return (
              <S.ConversationItem 
                key={conv.id} 
                isActive={activeChatId === conv.id}
                onClick={() => {
                  setActiveChatId(conv.id);
                  // Remove a bolinha verde imediatamente ao clicar (otimista)
                  setUnreadMap(prev => ({ ...prev, [conv.id]: 0 }));
                }}
              >
                <div className="chat-avatar">
                  {conv.paciente ? getInitials(conv.paciente.nome) : <LuMessageSquare size={18} />}
                </div>
                
                <div className="chat-info" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ 
                        fontWeight: isUnread ? 800 : 500, 
                        fontSize: '0.95rem',
                        color: theme === 'dark' ? '#fff' : '#333', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {displayName}
                      </strong>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: isUnread ? '#25D366' : (theme === 'dark' ? '#aaa' : '#999'),
                        fontWeight: isUnread ? 'bold' : 'normal'
                      }}>
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.8rem', 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: isUnread ? 600 : 400, 
                      color: isUnread ? (theme === 'dark' ? '#fff' : '#333') : (theme === 'dark' ? '#bbb' : '#666') 
                    }}>
                      {lastMsg ? lastMsg.body : 'Iniciou uma conversa...'}
                    </p>
                  </div>
                  
                  {isUnread && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginLeft: '10px' }}>
                      <S.UnreadBadge>{unreadMap[conv.id]}</S.UnreadBadge>
                    </div>
                  )}

                </div>
              </S.ConversationItem>
            );
          })
        )}
      </S.ConversationList>

      <S.Footer>
        <S.TimeDisplay>
          <span><LuClock size={16} style={{ marginRight: 5, verticalAlign: 'middle' }}/> Horário Atual</span>
          <span className="time">{currentTime.toLocaleTimeString()}</span>
        </S.TimeDisplay>

        <S.LimitDisplay>
          <span>Cota Mensal Meta (24h)</span>
          <strong>{limitData.used} / {limitData.total}</strong>
        </S.LimitDisplay>

        {npsHealth && (
          <S.HealthStatus quality={npsHealth.qualidade}>
            <div className="status-dot" />
            <div className="health-info">
              <span>Status API Oficial</span>
              <strong>
                {npsHealth.qualidade === 'Green' ? 'Qualidade Alta' :
                 npsHealth.qualidade === 'Yellow' ? 'Qualidade Média' : 'Qualidade Baixa'}
              </strong>
              <div className="balance-label">
                <LuSmartphone size={12} />
                Saldo: {npsHealth.saldo || 'R$ 0,00'}
              </div>
            </div>
          </S.HealthStatus>
        )}

        {/* Botão de Modo Claro / Escuro */}
        <S.ThemeToggleBtn onClick={toggleTheme}>
          {theme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
          <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </S.ThemeToggleBtn>

        {/* Botão Animado de Regras Operacionais */}
        <S.RulesButton onClick={() => setIsRulesModalOpen(true)}>
          <LuInfo size={20} />
          <span>Regras e Custos do Chat</span>
        </S.RulesButton>

      </S.Footer>

      {/* Renderização do Modal de Regras */}
      <RulesModal 
        isOpen={isRulesModalOpen} 
        onClose={() => setIsRulesModalOpen(false)} 
      />

    </S.SidebarContainer>
  );
}