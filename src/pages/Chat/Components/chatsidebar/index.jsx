import React, { useState, useEffect, useContext } from 'react';
import { 
  LuSmartphone, 
  LuClock, 
  LuMessageSquare, 
  LuSearch, 
  LuSun, 
  LuMoon, 
  LuInfo,
  LuTrash2
} from 'react-icons/lu';
import { toast } from 'react-toastify';
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
  // 👇 NOVO: aba ativa — permite filtrar por não lidas / lidas / todas
  const [filtroAba, setFiltroAba] = useState('todas');
  
  // Estado para controlar a abertura do modal de regras
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  
  const userStorage = JSON.parse(localStorage.getItem('oncologico:UserData'));
  const userName = userStorage?.user?.name || "Usuário";
  const userRole = userStorage?.user?.is_admin ? "Administrador" : "Atendente";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  // 👇 NOVO: mesmo dia mostra a hora, ontem mostra "Ontem", antes disso
  // mostra a data.
  const formatarDataRelativa = (dateStr) => {
    if (!dateStr) return '';
    const data = new Date(dateStr);
    const hoje = new Date();
    const dataSemHora = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const diffDias = Math.round((hojeSemHora - dataSemHora) / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDias === 1) return 'Ontem';
    return data.toLocaleDateString('pt-BR');
  };

  // 👇 NOVO: apaga a conversa (com confirmação) e remove da lista na hora.
  const handleDeleteConversation = async (e, conv) => {
    e.stopPropagation(); // não abre a conversa ao clicar na lixeira
    const nome = conv.paciente ? `${conv.paciente.nome} ${conv.paciente.sobrenome}` : conv.phone_number;
    const confirmar = window.confirm(`Apagar a conversa com ${nome}? Todo o histórico de mensagens será perdido permanentemente.`);
    if (!confirmar) return;

    try {
      await api.delete(`/chat/conversations/${conv.id}`);
      setConversations(prev => prev.filter(c => c.id !== conv.id));
      if (activeChatId === conv.id) setActiveChatId(null);
      toast.success('Conversa apagada.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao apagar a conversa.');
    }
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

  // Lógica da barra de pesquisa + aba (não lidas / lidas / todas)
  const filteredConversations = conversations.filter(conv => {
    const nameStr = conv.paciente ? `${conv.paciente.nome} ${conv.paciente.sobrenome}`.toLowerCase() : '';
    const phoneStr = conv.phone_number.toLowerCase();
    const searchStr = searchTerm.toLowerCase();
    const bateBusca = nameStr.includes(searchStr) || phoneStr.includes(searchStr);
    if (!bateBusca) return false;

    const temNaoLida = unreadMap[conv.id] > 0;
    if (filtroAba === 'nao-lidas') return temNaoLida;
    if (filtroAba === 'lidas') return !temNaoLida;
    return true; // 'todas'
  });

  const totalNaoLidas = conversations.filter(c => unreadMap[c.id] > 0).length;

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

      {/* 👇 NOVO: abas de filtro por status de leitura */}
      <div style={{ display: 'flex', gap: '6px', padding: '0 15px 10px 15px' }}>
        {[
          { key: 'todas', label: 'Todas' },
          { key: 'nao-lidas', label: `Não lidas${totalNaoLidas > 0 ? ` (${totalNaoLidas})` : ''}` },
          { key: 'lidas', label: 'Lidas' }
        ].map(aba => (
          <button
            key={aba.key}
            onClick={() => setFiltroAba(aba.key)}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: filtroAba === aba.key ? 700 : 500,
              backgroundColor: filtroAba === aba.key ? '#25D366' : (theme === 'dark' ? '#333' : '#f0f0f0'),
              color: filtroAba === aba.key ? '#fff' : (theme === 'dark' ? '#ccc' : '#666'),
              transition: 'all 0.2s'
            }}
          >
            {aba.label}
          </button>
        ))}
      </div>

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
                        fontWeight: isUnread ? 'bold' : 'normal',
                        whiteSpace: 'nowrap'
                      }}>
                        {lastMsg ? formatarDataRelativa(lastMsg.createdAt) : ''}
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

                  <button
                    onClick={(e) => handleDeleteConversation(e, conv)}
                    title="Apagar conversa"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: theme === 'dark' ? '#888' : '#bbb',
                      marginLeft: '8px',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      alignSelf: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme === 'dark' ? '#888' : '#bbb'}
                  >
                    <LuTrash2 size={16} />
                  </button>

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