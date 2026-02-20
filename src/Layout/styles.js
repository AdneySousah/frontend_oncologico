import styled from "styled-components";

// Container principal que segura a Sidebar (esquerda) e o Outlet (direita)
export const Container = styled.div`
    display: flex;
    height: 100vh; /* Ocupa a altura total da tela */
    width: 100vw;
    overflow: hidden; /* Evita scroll duplo na página inteira */
`;

// Container onde o conteúdo das páginas (Home, About, etc) será renderizado
export const ContainerOutlet = styled.div`
    flex: 1; /* MÁGICA AQUI: Isso faz ele ocupar todo o espaço que sobra ao lado da Sidebar */
    height: 100%;
    overflow-y: auto; /* Permite scroll apenas no conteúdo, mantendo a sidebar fixa */
    background-color: #f4f6f8; /* Cor de fundo para destacar do branco da sidebar */
   
`;