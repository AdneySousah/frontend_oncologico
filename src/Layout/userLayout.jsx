import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Container,
  MainContent,
  ContainerOutlet,
  MobileHeader,
  MenuButton,
  FloatingHelpContainer,
  HelpTooltip,
  HelpButton
} from "./styles";
import Sidebar from "../components/SideBar"; // Ajuste o caminho conforme sua estrutura
import { LuMenu, LuCircleAlert } from "react-icons/lu";

export function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hook para fazer o roteamento ao clicar no botão
  const navigate = useNavigate();

  const handleOpenManual = () => {
    // Altere '/manual' para a rota exata onde o seu manual foi configurado
    navigate('/manual');
  };

  return (
    <Container>
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <MainContent>
        {/* Header exclusivo para telas menores */}
        <MobileHeader>
          <MenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <LuMenu size={28} />
          </MenuButton>
          <h3>Onco Navegação</h3>
          <div style={{ width: 28 }}></div> {/* Spacer para centralizar o título */}
        </MobileHeader>

        <ContainerOutlet>
          <Outlet />
        </ContainerOutlet>
      </MainContent>

  
      {/* NOVO: Botão Flutuante de Ajuda */}
      <FloatingHelpContainer>
        <HelpTooltip className="tooltip">Quer ajuda com uso do sistema?</HelpTooltip>
        <HelpButton title="Acessar o Manual" onClick={handleOpenManual}>
          <LuCircleAlert size={32} />
        </HelpButton>
      </FloatingHelpContainer>

    </Container>
  )
}