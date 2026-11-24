// src/themes/theme.js
//
// Tokens visuais do sistema. Use SEMPRE estes valores (theme.colors.*, theme.radius,
// theme.shadow, media.*) em vez de cores/medidas soltas no código.
// As cores são as que o sistema já usava; aqui elas só ganharam nome.

const common = {
  primary: "#337ab7",
  primaryHover: "#286090",
  danger: "#d9534f",
  dangerHover: "#c9302c",

  // Semânticas (antes espalhadas como fallback nos componentes)
  success: "#52c41a",
  successHover: "#389e0d",
  warning: "#faad14",
  info: "#1890ff",
  accent: "#8a2be2", // notificações (caixa de correio)
  whatsapp: "#25D366",
  whatsappHover: "#1DA851",
};

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Mobile first: escreva o estilo base para celular e use media.md / media.lg para telas maiores.
// Use mediaDown.md para ajustes pontuais só no celular.
export const media = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
};

export const mediaDown = {
  sm: `@media (max-width: ${breakpoints.sm - 1}px)`,
  md: `@media (max-width: ${breakpoints.md - 1}px)`,
  lg: `@media (max-width: ${breakpoints.lg - 1}px)`,
};

const shared = {
  radius: { sm: "6px", md: "10px", lg: "14px", pill: "999px" },
  space: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" },
  font: {
    family: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  breakpoints,
};

export const lightTheme = {
  ...shared,
  name: "light",
  shadow: {
    sm: "0 1px 2px rgba(16, 24, 40, 0.06)",
    md: "0 4px 12px rgba(16, 24, 40, 0.08)",
    lg: "0 12px 32px rgba(16, 24, 40, 0.16)",
  },
  colors: {
    ...common,
    background: "#f4f7f6",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    text: "#333333",
    textLight: "#666666",
    border: "#dddddd",
    inputBg: "#ffffff",
    headerText: "#ffffff",
    overlay: "rgba(15, 23, 42, 0.55)",
    focus: "rgba(51, 122, 183, 0.45)",

    primaryLight: "rgba(51, 122, 183, 0.10)",
    successLight: "rgba(82, 196, 26, 0.15)",
    warningLight: "rgba(250, 173, 20, 0.15)",
    dangerLight: "rgba(217, 83, 79, 0.12)",
    infoLight: "rgba(24, 144, 255, 0.12)",
    accentLight: "rgba(138, 43, 226, 0.10)",

    // Cores do menu "moderno" (login / primeiro acesso)
    modernBg: "linear-gradient(135deg, #dbeafe 0%, #bae6fd 100%)",
    modernCardBg: "rgba(255, 255, 255, 0.65)",
    modernCardBorder: "rgba(255, 255, 255, 0.5)",
    modernCardShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    modernText: "#111827",
    modernTextLight: "#6b7280",
    modernInputBg: "#f3f4f6",
    modernInputBorder: "transparent",
    modernInputText: "#111827",
    modernButtonBg: "#1f2937",
    modernButtonHover: "#111827",
    modernButtonText: "#ffffff",
    modernIconBg: "#ffffff",
    modernIconColor: "#4b5563",
  },
};

export const darkTheme = {
  ...shared,
  name: "dark",
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
    md: "0 4px 12px rgba(0, 0, 0, 0.5)",
    lg: "0 12px 32px rgba(0, 0, 0, 0.7)",
  },
  colors: {
    ...common,
    background: "#000000",
    surface: "#121212",
    surfaceAlt: "#1a1a1a",
    text: "#ffffff",
    textLight: "#b0b0b0",
    border: "#333333",
    inputBg: "#1e1e1e",
    headerText: "#e0e0e0",
    overlay: "rgba(0, 0, 0, 0.7)",
    focus: "rgba(91, 160, 220, 0.6)",

    primaryLight: "rgba(51, 122, 183, 0.22)",
    successLight: "rgba(82, 196, 26, 0.18)",
    warningLight: "rgba(250, 173, 20, 0.18)",
    dangerLight: "rgba(217, 83, 79, 0.2)",
    infoLight: "rgba(24, 144, 255, 0.2)",
    accentLight: "rgba(138, 43, 226, 0.22)",

    modernBg: "linear-gradient(135deg, #111827 0%, #000000 100%)",
    modernCardBg: "rgba(31, 41, 55, 0.7)",
    modernCardBorder: "rgba(75, 85, 99, 0.4)",
    modernCardShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    modernText: "#ffffff",
    modernTextLight: "#9ca3af",
    modernInputBg: "#374151",
    modernInputBorder: "transparent",
    modernInputText: "#ffffff",
    modernButtonBg: "#f9fafb",
    modernButtonHover: "#e5e7eb",
    modernButtonText: "#111827",
    modernIconBg: "#1f2937",
    modernIconColor: "#d1d5db",
  },
};

export const colors = {
  primary: "#333333",
  danger: "#d9534f",
};
