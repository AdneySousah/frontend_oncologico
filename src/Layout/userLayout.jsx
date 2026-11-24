import { useState, useEffect, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Container,
  MainContent,
  ContainerOutlet,
  MobileHeader,
  MenuButton,
  FloatingStack,
  FabWrapper,
  Fab,
  NotificationBadge,
  MailboxPanel,
  MailboxItem,
} from "./styles";
import Sidebar from "../components/SideBar";
import { LuMenu, LuMessageCircle, LuInbox, LuX } from "react-icons/lu";
import api from "../services/api";
import logo from "../assets/logo_branca.png";
import CarregandoPagina from "../components/CarregandoPagina";

export function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [userData, setUserData] = useState(null);
  // 👇 NOVO: perfil buscado fresco do servidor. O localStorage só é gravado
  // no login e nunca mais atualizado na sessão — se uma permissão for
  // concedida depois que o usuário já estava logado (ex: chat), o balão
  // continuava escondido até deslogar/logar de nou. Buscando fresco aqui
  // (mesmo padrão já usado no SideBar), basta recarregar a página.
  const [perfilFresco, setPerfilFresco] = useState(null);
  const navigate = useNavigate();

  // Estados da Caixa de Correio
  const [mailboxItems, setMailboxItems] = useState([]);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);

  const permissoesAtuais = perfilFresco?.perfil?.permissoes || userData?.user?.perfil?.permissoes;
  const hasChatPermission = permissoesAtuais?.chat?.acessar === true;

  // Busca o perfil fresco do servidor uma vez ao montar (reflete permissões
  // concedidas após o login, sem precisar deslogar).
  useEffect(() => {
    api.get('/users/me')
      .then(response => setPerfilFresco(response.data))
      .catch(() => {}); // silencioso — cai pro fallback do localStorage
  }, []);

  // Monitora as mensagens não lidas
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const userAuth = localStorage.getItem('oncologico:UserData');
        const parsedData = userAuth ? JSON.parse(userAuth) : null;
        setUserData(parsedData);

        const canAccessChat = (perfilFresco?.perfil?.permissoes || parsedData?.user?.perfil?.permissoes)?.chat?.acessar === true;
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
    // 👇 F34: não consulta com a aba oculta; ao voltar, atualiza uma vez
    const interval = setInterval(() => { if (!document.hidden) fetchUnread(); }, 10000);
    const aoVoltarParaAba = () => { if (!document.hidden) fetchUnread(); };
    document.addEventListener('visibilitychange', aoVoltarParaAba);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', aoVoltarParaAba);
    };
  }, [perfilFresco]);

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
    const lerLista = (chave) => {
      try {
        const lista = JSON.parse(localStorage.getItem(chave) || '[]');
        return Array.isArray(lista) ? lista : [];
      } catch {
        return [];
      }
    };
    const chaveNps = (item) => `${item.pacienteId}_${item.monitoramentoId}`;

    // Evita duas checagens ao mesmo tempo (uma rodada lenta + o próximo tick de 10s).
    let emAndamento = false;

    const pollWaitingNps = async () => {
      if (emAndamento) return;
      const waitingNps = lerLista('oncologico:nps_waiting');
      if (waitingNps.length === 0) return;

      emAndamento = true;
      try {
        const respondidos = new Set();
        let updatedMailbox = false;

        for (const item of waitingNps) {
          try {
            const res = await api.get(`/nps/paciente/${item.pacienteId}/atendimento/${item.monitoramentoId}/status`);
            if (res.data && res.data.respondido) {

              const mailbox = lerLista('oncologico:mailbox');

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

              respondidos.add(chaveNps(item));
            }
          } catch (error) {
            console.error("Erro ao checar NPS em background:", error);
          }
        }

        if (respondidos.size > 0) {
          // Relê o storage na hora de gravar: um NPS adicionado (ex.: pelo
          // Telemonitoramento) enquanto as requisições rodavam não pode se perder.
          const atual = lerLista('oncologico:nps_waiting');
          localStorage.setItem(
            'oncologico:nps_waiting',
            JSON.stringify(atual.filter(item => !respondidos.has(chaveNps(item))))
          );
          window.dispatchEvent(new Event('updateNpsWaiting')); // telas abertas relêem a fila
        }
        if (updatedMailbox) {
          window.dispatchEvent(new Event('updateMailbox'));
        }
      } finally {
        emAndamento = false;
      }
    };

    // Checa a cada 10s — só com a aba visível (F34); ao voltar, checa uma vez
    const intervalId = setInterval(() => { if (!document.hidden) pollWaitingNps(); }, 10000);
    const aoVoltarParaAba = () => { if (!document.hidden) pollWaitingNps(); };
    document.addEventListener('visibilitychange', aoVoltarParaAba);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', aoVoltarParaAba);
    };
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
          <MenuButton
            type="button"
            aria-label="Abrir menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <LuMenu size={26} />
          </MenuButton>
          <img src={logo} alt="CIC Farma" />
          <h1>Onco Navegação</h1>
        </MobileHeader>

        <ContainerOutlet className="app-main">
          <Suspense fallback={<CarregandoPagina />}>
            <Outlet />
          </Suspense>
        </ContainerOutlet>
      </MainContent>

      {(mailboxItems.length > 0 || hasChatPermission) && (
        <FloatingStack>
          {/* CAIXA DE NOTIFICAÇÕES: termos aceitos e NPS respondidos */}
          {mailboxItems.length > 0 && (
            <FabWrapper>
              <span className="tooltip">Notificações</span>
              <Fab
                type="button"
                $variant="mail"
                aria-label={`Notificações (${mailboxItems.length})`}
                aria-expanded={isMailboxOpen}
                onClick={() => setIsMailboxOpen(!isMailboxOpen)}
              >
                <LuInbox size={26} />
                <NotificationBadge>{mailboxItems.length}</NotificationBadge>
              </Fab>
            </FabWrapper>
          )}

          {hasChatPermission && (
            <FabWrapper>
              <span className="tooltip">Abrir chat de pacientes</span>
              <Fab type="button" aria-label="Abrir chat de pacientes" onClick={handleOpenChat}>
                <LuMessageCircle size={28} />
                {totalUnread > 0 && (
                  <NotificationBadge>{totalUnread > 99 ? '99+' : totalUnread}</NotificationBadge>
                )}
              </Fab>
            </FabWrapper>
          )}
        </FloatingStack>
      )}

      {isMailboxOpen && mailboxItems.length > 0 && (
        <MailboxPanel role="dialog" aria-label="Notificações">
          <header>
            <h2><LuInbox size={20} /> Notificações</h2>
            <button type="button" aria-label="Fechar notificações" onClick={() => setIsMailboxOpen(false)}>
              <LuX size={20} />
            </button>
          </header>

          <ul>
            {mailboxItems.map(item => {
              const isNps = item.type === 'nps';
              return (
                <MailboxItem key={item.id} $nps={isNps}>
                  <strong>{item.nome}</strong>
                  <p>
                    {isNps
                      ? `Respondeu a pesquisa de satisfação. Nota: ${item.nota}`
                      : 'Aceitou o termo e aguarda contato.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => isNps ? handleDismissNps(item.id) : handleStartQuestionnaire(item.id)}
                  >
                    {isNps ? 'Ciente, remover' : 'Fazer questionário agora'}
                  </button>
                </MailboxItem>
              );
            })}
          </ul>
        </MailboxPanel>
      )}
    </Container>
  );
}
