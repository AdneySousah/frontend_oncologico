import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, MainContent, ContainerOutlet, MobileHeader, MenuButton } from "./styles";
import Sidebar from "../components/Sidebar"; // Ajuste o caminho conforme sua estrutura
import { LuMenu } from "react-icons/lu";

export function UserLayout(){
  // Estado para controlar a abertura da sidebar no mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return(
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
    </Container>
  )
}