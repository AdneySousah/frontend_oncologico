import styled from "styled-components";

export const ExportButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #107c41; /* Cor verde padrão do Excel */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Aumentei o padding de 6px para 10px */
  padding: 10px; 
  /* Aumentei um pouco o border-radius para acompanhar o novo tamanho */
  border-radius: 6px; 
  transition: all 0.2s;
  
  /* Garante que o ícone acompanhe o crescimento do botão */
  svg {
    width: 24px;  /* Antes estava 18px no componente */
    height: 24px;
  }

  &:hover {
    background-color: #e6f4ea;
    color: #0b5a2e;
    box-shadow: 0 0 15px rgba(16, 124, 65, 0.3);
  }
`;