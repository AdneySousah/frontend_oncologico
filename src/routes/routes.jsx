import { Routes as Switch, Route, Navigate, Outlet } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import { UserLayout } from '../Layout/userLayout';
import UsersPage from '../pages/Users';
import SpecialtiesPage from '../pages/Especialidades';
import OperadorasPage from '../pages/Operadoras';
import QuestionariosPage from '../pages/Questionarios';
import PacientesPage from '../pages/Pacientes';
import DiagnosticosPage from '../pages/Diagnosticos';
import PrestadoresPage from '../pages/Prestadores';
import DetalhesEntrevista from '../pages/DetalhesEntrevista';
import NovaAvaliacao from '../pages/NovaAvaliacao';
import Medicos from '../pages/Medicos';
import ComorbidadesPage from '../pages/Comorbidades';
import MedicamentosPage from '../pages/Medicamentos';
import TimelinePacientes from '../pages/LinhaDoTempo';
import TelaAceiteTermo from '../pages/AceiteTermo';
import PerfisPage from '../pages/Permissoes';
import FirstAccess from '../pages/FirstAccess';
import Telemonitoramento from '../pages/Telemonitoramento';
import ReacoesAdversasPage from '../pages/ReacaoAdversa';
import Dashboard from '../pages/Dashboard';
import ForgotPasswordPage from '../pages/LoginPage/ForgotPasswordPage';
import AuditoriaPage from '../pages/Auditoria';
import ManualPage from '../pages/GuiaUso';
import ChatModule from '../pages/Chat';
import TelaNpsPaciente from '../pages/TelaNpsPaciente';
import ListaFaturamento from '../pages/Faturamento';
import TermosListagemAdmin from '../pages/ListaTermos';

// ==========================================
// NOVO: COMPONENTE DE PROTEÇÃO DE ROTA
// ==========================================
// Ele checa se existe usuário no localStorage. Se não tiver, manda pro /login.
const PrivateRoute = () => {
    const userAuth = localStorage.getItem('oncologico:UserData');
    return userAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function Routes() {
    return (
        <Switch>
            {/* ============================== */}
            {/* ROTAS PÚBLICAS                 */}
            {/* ============================== */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/reset' element={<ForgotPasswordPage />} />
            <Route path="/paciente/termo/:id" element={<TelaAceiteTermo />} />
            <Route path="/paciente/nps/:paciente_id/:monitoramento_id" element={<TelaNpsPaciente />} />

            <Route path='/primeiro-acesso' element={<FirstAccess />} />
            
            {/* ============================== */}
            {/* BLOCO DE ROTAS PRIVADAS        */}
            {/* ============================== */}
            <Route element={<PrivateRoute />}>
                
                {/* 1. ROTA DO CHAT - Fica protegida, mas FORA do UserLayout (Sem Sidebar) */}
                <Route path='/chat' element={<ChatModule />} />

                {/* 2. ROTAS DO SISTEMA - Ficam protegidas e DENTRO do UserLayout (Com Sidebar) */}
                <Route path='/' element={<UserLayout />}>
                    <Route index element={<Dashboard />} />
                    
                    <Route path='/necessidade-navegacao' element={<DetalhesEntrevista />} />
                    <Route path="/avaliacao/new" element={<NovaAvaliacao />} />

                    <Route path='/users' element={<UsersPage />} />
                    <Route path='/pacientes' element={<PacientesPage />} />
                    <Route path='/questionarios' element={<QuestionariosPage />} />
                    <Route path='/especialidades' element={<SpecialtiesPage />} />
                    <Route path='/operadoras' element={<OperadorasPage />} />
                    <Route path='/diagnosticos' element={<DiagnosticosPage />} />
                    <Route path='/prestadores' element={<PrestadoresPage />} />
                    <Route path='/medicos' element={<Medicos />} />
                    <Route path='/comorbidades' element={<ComorbidadesPage />} />
                    <Route path='/medicamentos' element={<MedicamentosPage />} />
                    <Route path='/linha-do-tempo' element={<TimelinePacientes />} />
                    <Route path='/permissoes' element={<PerfisPage />} />
                    <Route path='/telemonitoramento' element={<Telemonitoramento />} /> 
                    <Route path='/ficha-ram' element={<ReacoesAdversasPage />} />
                    <Route path='/auditoria' element={<AuditoriaPage />} />
                    <Route path='/manual' element={<ManualPage />} />
                    <Route path='/faturamento' element={<ListaFaturamento />} />
                    <Route path='/termo' element={<TermosListagemAdmin />} />
                </Route>

            </Route>
        </Switch>
    )
}