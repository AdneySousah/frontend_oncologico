// src/styles/theme.js

const common = {
  primary: "#337ab7", 
  primaryHover: "#286090",
  danger: "#d9534f",   
};

export const lightTheme = {
  colors: {
    ...common,
    background: "#f4f7f6",
    surface: "#ffffff",
    text: "#333333",
    textLight: "#666666",
    border: "#dddddd",
    inputBg: "#ffffff",
    headerText: "#ffffff",
    danger: "#d9534f",
    
    // NOVAS CORES PARA O MENU MODERNO (TEMA CLARO)
    modernBg: "linear-gradient(135deg, #dbeafe 0%, #bae6fd 100%)", // Fundo remetendo ao céu do print
    modernCardBg: "rgba(255, 255, 255, 0.65)", // Efeito vidro (Glassmorphism)
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
    modernIconColor: "#4b5563"
  }
};

export const darkTheme = {
  colors: {
    ...common,
    background: "#000000", 
    surface: "#121212",    
    text: "#ffffff",       
    textLight: "#b0b0b0",
    border: "#333333",
    inputBg: "#1e1e1e",
    headerText: "#e0e0e0",
    danger: "#d9534f",
    
    // NOVAS CORES PARA O MENU MODERNO (TEMA ESCURO)
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
    modernIconColor: "#d1d5db"
  }
};

export const colors ={
  primary: "#333333",
  danger: "#d9534f",
}