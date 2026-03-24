import styled, { keyframes } from "styled-components";



const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-7px); }
`;


export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

// Container principal que vai segurar o Header Mobile e o Outlet em formato de coluna
export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Header que só aparece no mobile
export const MobileHeader = styled.header`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
    border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
    z-index: 90;

    h3 {
      margin: 0;
      color: ${({ theme }) => theme.colors?.text || '#333'};
      font-size: 1.2rem;
    }
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.primary || '#007D99'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerOutlet = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors?.background || '#f4f6f8'};
  
  /* Adiciona um padding padrão para o conteúdo não colar nas bordas no mobile */
  @media (max-width: 768px) {
    padding: 15px;
  }
`;


export const FloatingHelpContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  align-items: center;
  
  /* Permite que o clique "atravesse" a div e a tooltip invisível */
  pointer-events: none; 

  animation: ${bounce} 2.5s infinite;

  &:hover {
    animation: none;
    
    .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }
    
    button {
      transform: rotate(360deg) scale(1.1);
    }
  }
`;

export const HelpTooltip = styled.span`
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  color: ${({ theme }) => theme.colors?.text || '#333333'};
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  margin-right: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.colors?.border || '#eeeeee'};
  
  /* Escondido por padrão, movido levemente para a direita para o efeito de entrada */
  opacity: 0;
  visibility: hidden;
  transform: translateX(15px);
  transition: all 0.3s ease-out;
`;

export const HelpButton = styled.button`
  /* Reativa o clique apenas no botão */
  pointer-events: auto; 
  cursor: pointer;

  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors?.primary || '#337ab7'};
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: transform 0.5s ease, background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors?.primaryHover || '#286090'};
  }
`;