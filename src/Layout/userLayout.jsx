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
import Sidebar from "../components/SideBar"; // Confirme se o B maiúsculo está correto no seu arquivo
import { LuMenu, LuCircleAlert, LuMessageCircle } from "react-icons/lu";
import api from "../services/api";

export function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // 1. Em vez de is_admin, verificamos se existe a permissão real de chat no Perfil
  const hasChatPermission = userData?.user?.perfil?.permissoes?.chat?.acessar === true;

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const userAuth = localStorage.getItem('oncologico:UserData');
        const parsedData = userAuth ? JSON.parse(userAuth) : null;
        
        setUserData(parsedData);

        // Verifica a permissão dentro do useEffect para evitar dependência de estado atrasado
        const canAccessChat = parsedData?.user?.perfil?.permissoes?.chat?.acessar === true;

        // Só faz a requisição se o usuário TIVER permissão configurada para o chat
        if (canAccessChat) {
          const response = await api.get('/chat/unread');
          setTotalUnread(response.data.total);
        }
      } catch (error) {
        // 2. Falha silenciosa: Se ainda assim o servidor retornar 403, ignoramos sem sujar o console
        if (error.response && error.response.status === 403) {
          return; 
        }
        console.error("Erro ao buscar mensagens do chat:", error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenManual = () => {
    navigate('/manual');
  };

  const handleOpenChat = () => {
    window.open('/chat', '_blank', 'noopener,noreferrer');
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

      {/* Botão do CHAT: Agora só aparece se 'hasChatPermission' for true */}
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

      {/* Botão de Ajuda: Aparece para todos */}
  {/*     <FloatingHelpContainer>
        <HelpTooltip className="tooltip">Quer ajuda com uso do sistema?</HelpTooltip>
        <HelpButton title="Acessar o Manual" onClick={handleOpenManual}>
          <LuCircleAlert size={32} />
        </HelpButton>
      </FloatingHelpContainer> */}
    </Container>
  );
}