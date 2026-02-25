import { 
  LuLayoutDashboard, 
  LuClipboardList, 
  LuCompass, 
  LuActivity, 
  LuHistory, 
  LuUsers, 
  LuShield, 
  LuUser, 
  LuAward, 
  LuFileSearch, 
  LuBuilding2, 
  LuStethoscope, 
  LuHeartPulse, 
  LuPill, 
  LuFileQuestion, 
  LuLock
} from "react-icons/lu";


export const navOptions = [
  // Dashboard não tem 'modulo' específico, vamos deixar livre para todos logados
  { id: "dashboard", label: "Dashboard", icon: LuLayoutDashboard, path: "/", modulo: "dashboard" },
  { id: "entrevista", label: "Entrevista Médica", icon: LuClipboardList, path: "/entrevista-medica", modulo: "entrevistas_medicas" },
  { id: "necessidade", label: "Necessidade de Navegação", icon: LuCompass, path: "/necessidade-navegacao", modulo: "avaliacoes" },
  { id: "tele", label: "Telemonitoramento", icon: LuActivity, path: "/telemonitoramento", modulo: "avaliacoes" },
  { id: "linhadotempo", label: "Linha do Tempo", icon: LuHistory, path: "/linha-do-tempo", modulo: "avaliacoes" },
];

export const registerOptions = [
  { id: "especialidades", label: "Especialidades", icon: LuAward, path: "/especialidades", modulo: "especialidades" },
  { id: "operadoras", label: "Operadoras", icon: LuShield , path: "/operadoras", modulo: "operadoras" },
  { id: "usuarios", label: "Usuários", icon: LuUsers, path: "/users", modulo: "usuarios" },
  // Permissões usa a regra de "usuarios", pois gerencia os acessos
  { id: "permissoes", label: "Permissões", icon: LuLock, path: "/permissoes", modulo: "usuarios" }, 
  { id: "pacientes", label: "Pacientes", icon: LuUser, path: "/pacientes", modulo: "pacientes" },
  { id: "diagnosticos", label: "Diagnósticos", icon: LuFileSearch, path: "/diagnosticos", modulo: "diagnosticos" },
  { id: "prestadores", label: "Prestadores", icon: LuBuilding2, path: "/prestadores", modulo: "prestadores_medicos" },
  { id: "medicos", label: "Médicos", icon: LuStethoscope, path: "/medicos", modulo: "medicos" },
  { id: "comorbidades", label: "Comorbidades", icon: LuHeartPulse, path: "/comorbidades", modulo: "comorbidades" },
  { id: "medicamentos", label: "Medicamentos", icon: LuPill, path: "/medicamentos", modulo: "medicamentos" },
  { id: "questoes", label: "Questionários", icon: LuFileQuestion, path: "/questionarios", modulo: "avaliacoes" },
   { id: "ficha_ram", label: "Ficha RAM", icon: LuFileQuestion, path: "/ficha-ram", modulo: "reacao_adversa" },
];