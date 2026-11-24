import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes as Switch, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import CarregandoPagina from '../components/CarregandoPagina';
import SemAcesso from '../components/SemAcesso';
import { atendimentoOptions, registerOptions, adminOptions } from '../components/SideBar/menu';
import api, { lerUsuarioSalvo } from '../services/api';

import LoginPage from '../pages/LoginPage';
import { UserLayout } from '../Layout/userLayout';

// Páginas carregadas sob demanda: o login não baixa o código do sistema inteiro.
const UsersPage = lazy(() => import('../pages/Users'));
const OperadorasPage = lazy(() => import('../pages/Operadoras'));
const QuestionariosPage = lazy(() => import('../pages/Questionarios'));
const DetalhesEntrevista = lazy(() => import('../pages/DetalhesEntrevista'));
const NovaAvaliacao = lazy(() => import('../pages/NovaAvaliacao'));
const TimelinePacientes = lazy(() => import('../pages/LinhaDoTempo'));
const TelaAceiteTermo = lazy(() => import('../pages/AceiteTermo'));
const PerfisPage = lazy(() => import('../pages/Permissoes'));
const FirstAccess = lazy(() => import('../pages/FirstAccess'));
const Telemonitoramento = lazy(() => import('../pages/Telemonitoramento'));
const ReacoesAdversasPage = lazy(() => import('../pages/ReacaoAdversa'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ForgotPasswordPage = lazy(() => import('../pages/LoginPage/ForgotPasswordPage'));
const AuditoriaPage = lazy(() => import('../pages/Auditoria'));
const ManualPage = lazy(() => import('../pages/Manual'));
const ChatModule = lazy(() => import('../pages/Chat'));
const TelaNpsPaciente = lazy(() => import('../pages/TelaNpsPaciente'));
const ListaFaturamento = lazy(() => import('../pages/Faturamento'));
const TermosListagemAdmin = lazy(() => import('../pages/ListaTermos'));
const MotivosFalhaContato = lazy(() => import('../pages/MotivosFalhaContato'));
const MotivosPausaTratamento = lazy(() => import('../pages/MotivosPausaTratamento'));
const Recalculo = lazy(() => import('../pages/Recalculo'));

// ==========================================
// NOVO: COMPONENTE DE PROTEÇÃO DE ROTA
// ==========================================
// Ele checa se existe usuário no localStorage. Se não tiver, manda pro /login.
const PrivateRoute = () => {
    const userAuth = lerUsuarioSalvo();
    return userAuth?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

// ==========================================
// GUARDA POR MÓDULO (permissoes[modulo].acessar)
// ==========================================
// O módulo de cada caminho vem do menu (mesma regra do SideBar). Caminho fora do
// menu (ex.: /manual) é livre. O backend continua validando cada chamada; isto só
// evita abrir pela URL uma tela que o perfil não enxerga.
const ITENS_MENU = [...atendimentoOptions, ...registerOptions, ...adminOptions];
const MODULOS_FORA_DO_MENU = {
    '/avaliacao/new': 'avaliacoes',
    '/chat': 'chat',
};

function moduloDoCaminho(caminho) {
    if (MODULOS_FORA_DO_MENU[caminho]) return MODULOS_FORA_DO_MENU[caminho];
    return ITENS_MENU.find((item) => item.path === caminho)?.modulo || null;
}

// Permissões do perfil: usa o storage na hora e troca pelo perfil fresco de
// GET /users/me (reflete permissão concedida/retirada depois do login).
function usePermissoes() {
    const [salvas] = useState(() => lerUsuarioSalvo()?.user?.perfil?.permissoes || null);
    const [frescas, setFrescas] = useState(undefined); // undefined = ainda carregando

    useEffect(() => {
        let ativo = true;
        api.get('/users/me')
            .then((res) => { if (ativo) setFrescas(res.data?.perfil?.permissoes || {}); })
            .catch(() => { if (ativo) setFrescas(null); }); // falhou: fica com o storage
        return () => { ativo = false; };
    }, []);

    return { permissoes: frescas || salvas, carregando: frescas === undefined };
}

const RotaPermitida = () => {
    const { pathname } = useLocation();
    const { permissoes, carregando } = usePermissoes();

    const pode = (modulo) => !modulo || permissoes?.[modulo]?.acessar === true;
    const caminho = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

    if (pode(moduloDoCaminho(caminho))) return <Outlet />;

    // O storage negou, mas o perfil fresco ainda não chegou: espera antes de bloquear.
    if (carregando) return <CarregandoPagina />;

    // Sem dashboard: em vez de bloquear o início, vai para a primeira tela liberada.
    if (caminho === '/') {
        const primeira = ITENS_MENU.find((item) => pode(item.modulo));
        return <Navigate to={primeira ? primeira.path : '/manual'} replace />;
    }

    return <SemAcesso />;
};

export default function Routes() {
    return (
        <Suspense fallback={<CarregandoPagina />}>
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
                <Route element={<RotaPermitida />}>
                    <Route path='/chat' element={<ChatModule />} />
                </Route>

                {/* 2. ROTAS DO SISTEMA - Ficam protegidas e DENTRO do UserLayout (Com Sidebar) */}
                <Route path='/' element={<UserLayout />}>
                  {/* Cada tela só abre se o perfil tem permissoes[modulo].acessar */}
                  <Route element={<RotaPermitida />}>
                    <Route index element={<Dashboard />} />
                    
                    <Route path='/necessidade-navegacao' element={<DetalhesEntrevista />} />
                    <Route path="/avaliacao/new" element={<NovaAvaliacao />} />

                    <Route path='/users' element={<UsersPage />} />
                    <Route path='/questionarios' element={<QuestionariosPage />} />
                    <Route path='/operadoras' element={<OperadorasPage />} />
                    <Route path='/linha-do-tempo' element={<TimelinePacientes />} />
                    <Route path='/permissoes' element={<PerfisPage />} />
                    <Route path='/telemonitoramento' element={<Telemonitoramento />} /> 
                    <Route path='/ficha-ram' element={<ReacoesAdversasPage />} />
                    <Route path='/auditoria' element={<AuditoriaPage />} />
                    <Route path='/manual' element={<ManualPage />} />
                    <Route path='/faturamento' element={<ListaFaturamento />} />
                    <Route path='/termo' element={<TermosListagemAdmin />} />
                    <Route path='/motivos-falha-contato' element={<MotivosFalhaContato />} />
                    <Route path='/motivos-pausa-tratamento' element={<MotivosPausaTratamento />} />
                    <Route path='/recalculo' element={<Recalculo />} />
                    <Route path='/base-conhecimento' element={<Navigate to='/manual' replace />} />
                  </Route>
                </Route>

            </Route>
        </Switch>
        </Suspense>
    )
}
