import { css } from 'styled-components';

// Use dentro de todo overlay de modal (fundo escuro em position: fixed com flex).
// Centraliza o modal quando ele cabe na tela e, quando não cabe (celular, modal alto),
// deixa rolar desde o topo — sem cortar o cabeçalho do modal.
export const overlaySeguro = css`
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 12px;

  & > * {
    margin: auto;
    max-width: 100%;
    flex-shrink: 0;
  }
`;
