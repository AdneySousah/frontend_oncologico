import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Container,
  MainContent,
  ContainerOutlet,
  MobileHeader,
  MenuButton,
  FloatingHelpContainer,
  HelpTooltip,
  HelpButton,
  FloatingChatContainer,
  ChatTooltip,
  ChatButton,
  NotificationBadge 
} from "./styles";
import Sidebar from "../components/SideBar"; 
import { LuMenu, LuMessageCircle, LuInbox, LuX } from "react-icons/lu";
import api from "../services/api";

export function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Estados da Caixa de Correio
  const [mailboxItems, setMailboxItems] = useState([]);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);

  const hasChatPermission = userData?.user?.perfil?.permissoes?.chat?.acessar === true;

  // Monitora as mensagens não lidas
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const userAuth = localStorage.getItem('oncologico:UserData');
        const parsedData = userAuth ? JSON.parse(userAuth) : null;
        setUserData(parsedData);

        const canAccessChat = parsedData?.user?.perfil?.permissoes?.chat?.acessar === true;
        if (canAccessChat) {
          const response = await api.get('/chat/unread');
          setTotalUnread(response.data.total);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) return; 
        console.error("Erro ao buscar mensagens do chat:", error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  // Monitora a Caixa de Correio globalmente
  useEffect(() => {
    const loadMailbox = () => {
      const saved = JSON.parse(localStorage.getItem('oncologico:mailbox') || '[]');
      setMailboxItems(saved);
    };

    loadMailbox(); // Carrega na montagem
    window.addEventListener('updateMailbox', loadMailbox); // Escuta atualizações

    return () => window.removeEventListener('updateMailbox', loadMailbox);
  }, []);

  // =========================================================
  // NOVO EFEITO: Monitora os NPS em 2º plano globalmente
  // =========================================================
  useEffect(() => {
    const pollWaitingNps = async () => {
      const waitingNps = JSON.parse(localStorage.getItem('oncologico:nps_waiting') || '[]');
      if (waitingNps.length === 0) return;

      let updatedWaiting = false;
      let updatedMailbox = false;
      const newWaitingNps = [...waitingNps];

      for (let i = newWaitingNps.length - 1; i >= 0; i--) {
        const item = newWaitingNps[i];
        try {
          const res = await api.get(`/nps/paciente/${item.pacienteId}/atendimento/${item.monitoramentoId}/status`);
          if (res.data && res.data.respondido) {
            
            const mailbox = JSON.parse(localStorage.getItem('oncologico:mailbox') || '[]');
            
            // Adiciona na mailbox se já não estiver lá (id único para não conflitar com termos)
            if (!mailbox.find(m => m.id === `nps_${item.monitoramentoId}`)) {
              mailbox.push({
                id: `nps_${item.monitoramentoId}`,
                type: 'nps', // Adicionado tipo para controle no front
                pacienteId: item.pacienteId,
                nome: item.nome,
                nota: res.data.nota
              });
              localStorage.setItem('oncologico:mailbox', JSON.stringify(mailbox));
              updatedMailbox = true;
            }

            // Remove da lista de espera de verificação
            newWaitingNps.splice(i, 1);
            updatedWaiting = true;
          }
        } catch (error) {
          console.error("Erro ao checar NPS em background:", error);
        }
      }

      if (updatedWaiting) {
        localStorage.setItem('oncologico:nps_waiting', JSON.stringify(newWaitingNps));
      }
      if (updatedMailbox) {
        window.dispatchEvent(new Event('updateMailbox'));
      }
    };

    const intervalId = setInterval(pollWaitingNps, 10000); // Checa a cada 10s
    return () => clearInterval(intervalId);
  }, []);

  const handleOpenChat = () => {
    window.open('/chat', '_blank', 'noopener,noreferrer');
  };

  const handleStartQuestionnaire = (pacienteId) => {
    const updatedMailbox = mailboxItems.filter(m => m.id !== pacienteId);
    setMailboxItems(updatedMailbox);
    localStorage.setItem('oncologico:mailbox', JSON.stringify(updatedMailbox));
    window.dispatchEvent(new Event('updateMailbox'));

    setIsMailboxOpen(false);
    navigate(`/avaliacao/new?paciente_id=${pacienteId}`);
  };

  // =========================================================
  // NOVA FUNÇÃO: Dispensar notificação de NPS
  // =========================================================
  const handleDismissNps = (itemId) => {
    const updatedMailbox = mailboxItems.filter(m => m.id !== itemId);
    setMailboxItems(updatedMailbox);
    localStorage.setItem('oncologico:mailbox', JSON.stringify(updatedMailbox));
    window.dispatchEvent(new Event('updateMailbox'));
  };

  return (
    <Container>
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <MainContent>
        <MobileHeader>
          <MenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <LuMenu size={28} />
          </MenuButton>
          <h3>Onco Navegação</h3>
          <div style={{ width: 28 }}></div>
        </MobileHeader>

        <ContainerOutlet>
          <Outlet />
        </ContainerOutlet>
      </MainContent>

      {/* ================================================== */}
      {/* CAIXA DE CORREIO: TERMOS E NPS (2º PLANO)          */}
      {/* ================================================== */}
      {mailboxItems.length > 0 && (
        <div style={{ position: 'fixed', bottom: hasChatPermission ? '100px' : '30px', right: '30px', zIndex: 9999 }}>
          
          <div 
            style={{
              backgroundColor: '#8a2be2',
              color: 'white',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 0.2s',
              transform: isMailboxOpen ? 'scale(0.95)' : 'scale(1)'
            }}
            title="Caixa de Notificações"
            onClick={() => setIsMailboxOpen(!isMailboxOpen)}
          >
            <LuInbox size={28} />
            <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4f', color: '#fff', fontSize: '12px', fontWeight: 'bold', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
              {mailboxItems.length}
            </div>
          </div>

          {/* Painel Dropdown da Caixa de Correio */}
          {isMailboxOpen && (
            <div style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              width: '320px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #eee'
            }}>
              <div style={{ padding: '15px', backgroundColor: '#8a2be2', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LuInbox size={20}/> Notificações
                </h4>
                <LuX size={20} style={{ cursor: 'pointer' }} onClick={() => setIsMailboxOpen(false)} />
              </div>
              
              <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '10px' }}>
                {mailboxItems.map(item => {
                  const isNps = item.type === 'nps';

                  return (
                    <div key={item.id} style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', borderRadius: '8px', marginBottom: '8px' }}>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#333' }}>{item.nome}</strong>
                      
                      {/* LÓGICA DE TEXTO COM BASE NO TIPO */}
                      {isNps ? (
                        <p style={{ margin: '4px 0 10px 0', fontSize: '13px', color: '#0056b3', fontWeight: '500' }}>
                          Paciente respondeu o nps a nota foi {item.nota}
                        </p>
                      ) : (
                        <p style={{ margin: '4px 0 10px 0', fontSize: '12px', color: '#666' }}>
                          Aceitou o termo e aguarda contato.
                        </p>
                      )}

                      <button 
                        onClick={() => isNps ? handleDismissNps(item.id) : handleStartQuestionnaire(item.id)}
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          backgroundColor: isNps ? '#1890ff' : '#52c41a', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontWeight: 'bold', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          gap: '5px', 
                          alignItems: 'center' 
                        }}
                      >
                        {isNps ? 'Ciente (Remover Notificação)' : 'Fazer Questionário Agora'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botão do CHAT */}
      {hasChatPermission && (
        <FloatingChatContainer>
          <ChatTooltip className="tooltip">Abrir Chat de Pacientes</ChatTooltip>
          <ChatButton title="Abrir Chat" onClick={handleOpenChat} style={{ position: 'relative' }}>
            <LuMessageCircle size={32} />
            {totalUnread > 0 && (
              <NotificationBadge>{totalUnread > 99 ? '99+' : totalUnread}</NotificationBadge>
            )}
          </ChatButton>
        </FloatingChatContainer>
      )}
    </Container>
  );
}