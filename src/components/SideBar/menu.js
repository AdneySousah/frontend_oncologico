import {
  LuLayoutDashboard, 
  LuCompass, 
  LuActivity,
  LuHistory, 
  LuUsers, 
  LuShield, 
  LuFileSearch,
  LuLock, 
  LuLogs,
  // Ícones com nomes de exportação MAIS ESTÁVEIS (Padrão Lucide)
  LuClipboardList, 
  LuFileWarning, 
  LuDollarSign,
  LuPhone,
  LuCirclePause,
  LuCalculator,
  LuBookOpen
} from "react-icons/lu";

// 👇 Agrupado sob o cabeçalho colapsável "Atendimento" (mesmo padrão de
// "Tabelas Cadastrais"): dashboard, necessidade de navegação, telemonitoramento,
// linha do tempo, e a página de recálculo.
export const atendimentoOptions = [
  { id: "dashboard", label: "Dashboard", icon: LuLayoutDashboard, path: "/", modulo: "dashboard" },
  { id: "necessidade", label: "Necessidade de Navegação", icon: LuCompass, path: "/necessidade-navegacao", modulo: "avaliacoes" },
  { id: "tele", label: "Telemonitoramento", icon: LuActivity, path: "/telemonitoramento", modulo: "telemonitoramento" },
  { id: "linhadotempo", label: "Linha do Tempo", icon: LuHistory, path: "/linha-do-tempo", modulo: "linhadotempo" },
  { id: "recalculo", label: "Recálculo", icon: LuCalculator, path: "/recalculo", modulo: "recalculo" },
];

export const registerOptions = [
  { id: "operadoras", label: "Operadoras", icon: LuShield, path: "/operadoras", modulo: "operadoras" },
  { id: "usuarios", label: "Usuários", icon: LuUsers, path: "/users", modulo: "usuarios" },
  { id: "permissoes", label: "Permissões", icon: LuLock, path: "/permissoes", modulo: "usuarios" },
  
  // ITENS COM NOVOS ÍCONES SEGUROS:
  { 
    id: "questoes", 
    label: "Questionários", 
    icon: LuClipboardList, // Prancheta de lista (Diferente de FileSearch)
    path: "/questionarios", 
    modulo: "avaliacoes" 
  },
  { 
    id: "ficha_ram", 
    label: "Ficha RAM", 
    icon: LuFileWarning, // Arquivo com Alerta (Perfeito para Reação Adversa)
    path: "/ficha-ram", 
    modulo: "reacao_adversa" 
  },
  { id: "falhascontatos", label: "Falhas de Contato", icon: LuPhone, path: "/motivos-falha-contato", modulo: "falhascontatos" },
  { id: "pausatratamento", label: "Motivos de Pausa/Descontinuação", icon: LuCirclePause, path: "/motivos-pausa-tratamento", modulo: "pausa_tratamento" },
];

export const adminOptions = [
  { id: "auditoria", label: "Auditoria", icon: LuLogs, path: "/auditoria", modulo: "audit-logs" },
   { id: "faturamento", label: "Faturamento", icon: LuDollarSign, path: "/faturamento", modulo: "faturamento" },
   { id: "termo", label: "Termos Assinados", icon: LuFileSearch, path: "/termo", modulo: "termo" },
   { id: "base_conhecimento", label: "Base de Conhecimento", icon: LuBookOpen, path: "/base-conhecimento", modulo: "base_conhecimento" },
];