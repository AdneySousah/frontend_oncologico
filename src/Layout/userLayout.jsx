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
import { LuMenu, LuCircleAlert, LuMessageCircle } from "react-icons/lu";
import api from "../services/api";

export function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // 1. Extraímos o isAdmin do estado de forma segura
  const isAdmin = userData?.user?.is_admin === true;

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const userAuth = localStorage.getItem('oncologico:UserData');
        const parsedData = userAuth ? JSON.parse(userAuth) : null;
        
        setUserData(parsedData);

        // Só busca se o usuário estiver logado E for admin
        if (parsedData?.user?.is_admin) {
          const response = await api.get('/chat/unread');
          setTotalUnread(response.data.total);
        }
      } catch (error) {
        // Falha silenciosa
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  // FUNÇÕES QUE ESTAVAM FALTANDO:
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

      {/* Botão do CHAT: Só aparece para ADMIN */}
      {isAdmin && (
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
      <FloatingHelpContainer>
        <HelpTooltip className="tooltip">Quer ajuda com uso do sistema?</HelpTooltip>
        <HelpButton title="Acessar o Manual" onClick={handleOpenManual}>
          <LuCircleAlert size={32} />
        </HelpButton>
      </FloatingHelpContainer>
    </Container>
  );
}