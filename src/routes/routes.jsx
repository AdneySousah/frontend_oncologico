import { Routes as Switch, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { UserLayout } from '../Layout/userLayout';
import HomePage from '../pages/HomePage';
import UsersPage from '../pages/Users';
import SpecialtiesPage from '../pages/Especialidades';
import OperadorasPage from '../pages/Operadoras';
import QuestionariosPage from '../pages/Questionarios';
import PacientesPage from '../pages/Pacientes';
import DiagnosticosPage from '../pages/Diagnosticos';
import PrestadoresPage from '../pages/Prestadores';
import EntrevistasPage from '../pages/Entrevistas';
import DetalhesEntrevista from '../pages/DetalhesEntrevista';
import NovaAvaliacao from '../pages/NovaAvaliacao';
import Medicos from '../pages/Medicos';
import ComorbidadesPage from '../pages/Comorbidades';
import MedicamentosPage from '../pages/Medicamentos';
import TimelinePacientes from '../pages/LinhaDoTempo';
import TelaAceiteTermo from '../pages/AceiteTermo';
import PerfisPage from '../pages/Permissoes';
import FirstAccess from '../pages/FirstAccess';
// Componente temporário para páginas em construção
const EmConstrucao = ({ title }) => (
    <div style={{ padding: '2rem' }}>
        <h1>{title}</h1>
        <p>Página em desenvolvimento...</p>
    </div>
);

export default function Routes() {
    return (
        <Switch>
            {/* Rota Pública */}
            <Route path='/login' element={<LoginPage />} />
            <Route path="/paciente/termo/:id" element={<TelaAceiteTermo />} />
            <Route path='/primeiro-acesso' element={<FirstAccess />} />
            {/* Rotas Privadas (Com Sidebar/Layout) */}
            <Route path='/' element={<UserLayout />}>

                {/* Menu Principal */}
                <Route index element={<HomePage />} /> {/* Caminho '/' */}
                <Route path='/dados-navegacao' element={<EmConstrucao title="Dados Pacientes" />} />
                <Route path='/necessidade-navegacao' element={<DetalhesEntrevista />} />
                <Route path="/avaliacao/new" element={<NovaAvaliacao />} />
                <Route path='/telemonitoramento' element={<EmConstrucao title="Telemonitoramento" />} />

                {/* Menu de Cadastros */}
                <Route path='/users' element={<UsersPage />} />
                <Route path='/pacientes' element={<PacientesPage />} />
                <Route path='/questionarios' element={<QuestionariosPage />} />
                <Route path='/especialidades' element={<SpecialtiesPage />} />
                <Route path='/operadoras' element={<OperadorasPage />} />
                <Route path='/diagnosticos' element={<DiagnosticosPage />} />
                <Route path='/prestadores' element={<PrestadoresPage />} />
                <Route path='/entrevista-medica' element={<EntrevistasPage />} />
                <Route path='/medicos' element={<Medicos />} />
                <Route path='/comorbidades' element={<ComorbidadesPage />} />
                <Route path='/medicamentos' element={<MedicamentosPage />} />
                <Route path='/linha-do-tempo' element={<TimelinePacientes />} />
                <Route path='/permissoes' element={<PerfisPage />} />
                

            </Route>
        </Switch>
    )
}