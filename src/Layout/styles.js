import styled from "styled-components";

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