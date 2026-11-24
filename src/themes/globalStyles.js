import { createGlobalStyle } from "styled-components";
import 'react-toastify/dist/ReactToastify.css'
import 'animate.css';
import { mediaDown } from './theme';

// Estilos globais (mobile first). Regras de página ficam no styles.js de cada página;
// aqui só o que vale para o sistema inteiro.
export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
    }

    body {
        font-family: ${({ theme }) => theme.font?.family || "'Inter', sans-serif"};
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
        color: ${({ theme }) => theme.colors.text};
        background-color: ${({ theme }) => theme.colors.background};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    img, svg, video, canvas {
        max-width: 100%;
    }

    img { height: auto; }

    button, input, select, textarea {
        font-family: inherit;
    }

    button { touch-action: manipulation; }

    /* Foco visível só para teclado (não aparece ao clicar com o mouse).
       !important porque vários componentes antigos usam "outline: none". */
    :focus-visible {
        outline: 3px solid ${({ theme }) => theme.colors.focus} !important;
        outline-offset: 2px;
    }

    ::selection {
        background: ${({ theme }) => theme.colors.primaryLight};
    }

    /* Barra de rolagem discreta */
    * {
        scrollbar-width: thin;
        scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
    }

    /* ===================== CELULAR ===================== */
    ${mediaDown.md} {
        /* iOS dá zoom em campos com fonte < 16px */
        input, select, textarea {
            font-size: 16px !important;
        }
    }

    /* Toasts: no celular ocupam a largura e ficam abaixo do cabeçalho */
    .Toastify__toast-container {
        ${mediaDown.sm} {
            padding: 8px;
            top: calc(env(safe-area-inset-top) + 64px) !important;
        }
    }
    .Toastify__toast {
        font-family: inherit;
        font-size: 0.9rem;
        border-radius: ${({ theme }) => theme.radius?.md || '10px'};
    }

    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`
