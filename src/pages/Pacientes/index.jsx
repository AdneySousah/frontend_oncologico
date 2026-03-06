import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LuSearch,
  LuFilterX,
  LuUserPlus,
  LuUpload,
  LuList,
  LuDownload,
  LuX
} from "react-icons/lu";

import api from '../../services/api';
import {
  Container,
  Header,
  TabContainer,
  TabButton,
  ContentBox,
  Button,
  FilterContainer
} from './styles';

import PacientesList from './components/PacientesList';
import PacientesForm from './components/PacientesForm';
import ImportarPacientes from './components/ImportarPacientes';

export default function PacientesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('list');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operadoras, setOperadoras] = useState([]);

  const [filterNome, setFilterNome] = useState('');
  const [filterCpf, setFilterCpf] = useState('');
  const [filterOperadora, setFilterOperadora] = useState('');
  const [filterStatus, setFilterStatus] = useState('ambos');

  const [editingPaciente, setEditingPaciente] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Verificação de Admin do LocalStorage para esconder botões de quem não pode ver
  const userStorage = JSON.parse(localStorage.getItem('oncologico:UserData') || '{}');
  const isAdmin = userStorage?.user?.is_admin === true;

  useEffect(() => {
    api.get('/operadoras').then(res => setOperadoras(res.data));
  }, []);

  async function loadPacientes() {
    setLoading(true);
    try {
      const response = await api.get('/pacientes', {
        params: {
          nome: filterNome,
          cpf: filterCpf,
          operadora_id: filterOperadora,
          status_active: filterStatus
        }
      });
      setPacientes(response.data);
    } catch (err) {
      toast.error("Erro ao carregar lista de pacientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'list') {
      loadPacientes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filterOperadora, filterStatus]);

  // Captura o parâmetro da URL que veio do clique no sino (AlertModal)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const confirmId = query.get('confirmar');

    if (confirmId) {
      // ADICIONE O /detalhes/ AQUI NESSA LINHA:
      api.get(`/pacientes/detalhes/${confirmId}`).then(res => {
        setEditingPaciente(res.data);
        setActiveTab('form');
        // Limpa a URL após carregar
        navigate('/pacientes', { replace: true });
      }).catch(() => toast.error("Paciente pendente não encontrado"));
    }
  }, [location.search, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      loadPacientes();
    }
  };

  const clearFilters = () => {
    setFilterNome('');
    setFilterCpf('');
    setFilterOperadora('');
    setFilterStatus('ambos');
    loadPacientes();
  };

  const handleActionSuccess = () => {
    setEditingPaciente(null);
    setActiveTab('list');
    loadPacientes();
    // ADICIONE ESTA LINHA PARA ACORDAR A SIDEBAR IMEDIATAMENTE:
    window.dispatchEvent(new Event('updateAlerts'));
  };

  const handleEditRequest = (paciente) => {
    setEditingPaciente(paciente);
    setActiveTab('form');
  };

  const handleViewAnexos = (paciente) => {
    setPacienteSelecionado(paciente);
    setShowModal(true);
  };

  const handleToggleActive = async (paciente) => {
    const statusAtual = paciente.is_active !== false;
    const acao = statusAtual ? 'inativar' : 'reativar';

    const confirmar = window.confirm(`Tem certeza que deseja ${acao} o paciente ${paciente.nome}?`);
    if (!confirmar) return;

    try {
      await api.patch(`/pacientes/${paciente.id}/status`);
      toast.success(`Paciente ${statusAtual ? 'inativado' : 'reativado'} com sucesso!`);
      loadPacientes();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error(`Falha ao ${acao} o paciente.`);
    }
  };

  // Função para confirmar e limpar a flag de novo usuário
  const handleConfirmPatient = async (paciente) => {
    const confirmacao = window.confirm(`Deseja confirmar o cadastro definitivo de ${paciente.nome}?`);
    if (!confirmacao) return;

    try {
      await api.patch(`/pacientes/${paciente.id}/confirmar`);
      toast.success("Paciente confirmado no sistema!");
      loadPacientes();
      if (activeTab === 'form') setActiveTab('list');
      // Emite um evento global para a Sidebar atualizar o sino
      window.dispatchEvent(new Event('updateAlerts'));
    } catch (err) {
      toast.error("Erro ao confirmar paciente.");
    }
  };

  return (
    <Container>
      <Header>
        <h1>Gestão de Pacientes</h1>
      </Header>

      <TabContainer>
        <TabButton
          active={activeTab === 'list'}
          onClick={() => { setActiveTab('list'); setEditingPaciente(null); }}
        >
          <LuList size={18} style={{ marginRight: '8px' }} />
          Listagem
        </TabButton>
        <TabButton
          active={activeTab === 'form'}
          onClick={() => setActiveTab('form')}
        >
          <LuUserPlus size={18} style={{ marginRight: '8px' }} />
          {editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}
        </TabButton>
        <TabButton
          active={activeTab === 'import'}
          onClick={() => { setActiveTab('import'); setEditingPaciente(null); }}
        >
          <LuUpload size={18} style={{ marginRight: '8px' }} />
          Importar Excel
        </TabButton>
      </TabContainer>

      <ContentBox>
        {activeTab === 'list' && (
          <FilterContainer>
            <div className="filter-group large">
              <label>Nome ou Sobrenome</label>
              <input
                value={filterNome}
                onChange={e => setFilterNome(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Busca por nome..."
              />
            </div>

            <div className="filter-group">
              <label>CPF</label>
              <input
                value={filterCpf}
                onChange={e => setFilterCpf(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Apenas números"
              />
            </div>

            <div className="filter-group">
              <label>Operadora</label>
              <select
                value={filterOperadora}
                onChange={e => setFilterOperadora(e.target.value)}
              >
                <option value="">Todas</option>
                {operadoras.map(op => (
                  <option key={op.id} value={op.id}>{op.nome}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="ambos">Todos</option>
                <option value="true">Apenas Ativos</option>
                <option value="false">Apenas Inativos</option>
              </select>
            </div>

            <div className="filter-actions">
              <Button onClick={loadPacientes} title="Pesquisar" style={{ height: '42px', display: 'flex', alignItems: 'center' }}>
                <LuSearch size={20} />
              </Button>
              <Button onClick={clearFilters} style={{ background: '#6c757d', height: '42px', display: 'flex', alignItems: 'center' }} title="Limpar Filtros">
                <LuFilterX size={20} />
              </Button>
            </div>
          </FilterContainer>
        )}

        {activeTab === 'list' && (
          <PacientesList
            data={pacientes}
            loading={loading}
            onEdit={handleEditRequest}
            onViewAnexos={handleViewAnexos}
            onToggleActive={handleToggleActive}
            onConfirm={handleConfirmPatient}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'form' && (
          <PacientesForm
            pacienteToEdit={editingPaciente}
            onSuccess={handleActionSuccess}
            onCancel={() => { setActiveTab('list'); setEditingPaciente(null); }}
            onConfirm={() => handleConfirmPatient(editingPaciente)}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'import' && (
          <ImportarPacientes onSuccess={handleActionSuccess} />
        )}
      </ContentBox>

      {/* MODAL DE ANEXOS */}
      {showModal && pacienteSelecionado && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#fff', padding: '25px', borderRadius: '8px',
            width: '500px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>
                Anexos: {pacienteSelecionado.nome} {pacienteSelecionado.sobrenome}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#888' }}
              >
                <LuX size={24} />
              </button>
            </div>

            {pacienteSelecionado.anexos && pacienteSelecionado.anexos.map(anexo => (
              <div key={anexo.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '10px',
                background: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '15px', color: '#444' }}>{anexo.nome}</strong>
                  <span style={{ fontSize: '12px', color: '#777' }}>{anexo.original_name}</span>
                </div>

                <a
                  href={`${api.defaults.baseURL}/files/${anexo.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: '#007bff', color: '#fff', padding: '8px 12px',
                    borderRadius: '4px', textDecoration: 'none', fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  <LuDownload size={16} /> Baixar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </Container>
  );
}