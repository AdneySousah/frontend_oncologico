import React, { useState, useEffect } from 'react';
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
import { colors } from '../../themes/theme';
import { 
  Container, 
  Header, 
  TabContainer, 
  TabButton, 
  ContentBox,
  Button 
} from './styles';

// Componentes internos
import PacientesList from './components/PacientesList';
import PacientesForm from './components/PacientesForm';
import ImportarPacientes from './components/ImportarPacientes';

export default function PacientesPage() {
  // Controle de Abas: 'list', 'form', 'import'
  const [activeTab, setActiveTab] = useState('list');
  
  // Estados para a Lista e Filtros
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operadoras, setOperadoras] = useState([]);

  // Estados dos Filtros
  const [filterNome, setFilterNome] = useState('');
  const [filterCpf, setFilterCpf] = useState('');
  const [filterOperadora, setFilterOperadora] = useState('');

  // Estado para Edição e Visualização
  const [editingPaciente, setEditingPaciente] = useState(null);
  
  // ESTADOS DO MODAL DE ANEXOS
  const [showModal, setShowModal] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Carregar Operadoras para o Filtro
  useEffect(() => {
    api.get('/operadoras').then(res => setOperadoras(res.data));
  }, []);

  // Função Principal de Busca
  async function loadPacientes() {
    setLoading(true);
    try {
      const response = await api.get('/pacientes', {
        params: {
          nome: filterNome,
          cpf: filterCpf,
          operadora_id: filterOperadora
        }
      });
      setPacientes(response.data);
    } catch (err) {
      toast.error("Erro ao carregar lista de pacientes.");
    } finally {
      setLoading(false);
    }
  }

  // Executa a busca inicial e monitora a mudança de aba ou operadora
  useEffect(() => {
    if (activeTab === 'list') {
      loadPacientes();
    }
  }, [activeTab, filterOperadora]);

  // Gatilho de busca por teclado (Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      loadPacientes();
    }
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setFilterNome('');
    setFilterCpf('');
    setFilterOperadora('');
    loadPacientes();
  };

  // Função disparada após Sucesso
  const handleActionSuccess = () => {
    setEditingPaciente(null);
    setActiveTab('list');
    loadPacientes();
  };

  // Iniciar Edição
  const handleEditRequest = (paciente) => {
    setEditingPaciente(paciente);
    setActiveTab('form'); 
  };

  // Abrir Modal de Anexos
  const handleViewAnexos = (paciente) => {
    setPacienteSelecionado(paciente);
    setShowModal(true);
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
          <LuList size={18} style={{marginRight: '8px'}} />
          Listagem
        </TabButton>
        <TabButton 
          active={activeTab === 'form'} 
          onClick={() => setActiveTab('form')}
        >
          <LuUserPlus size={18} style={{marginRight: '8px'}} />
          {editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}
        </TabButton>
        <TabButton 
          active={activeTab === 'import'} 
          onClick={() => { setActiveTab('import'); setEditingPaciente(null); }}
        >
          <LuUpload size={18} style={{marginRight: '8px'}} />
          Importar Excel
        </TabButton>
      </TabContainer>

      <ContentBox>
        {activeTab === 'list' && (
          <div style={{ 
            display: 'flex', gap: '15px', marginBottom: '25px', 
            paddingBottom: '20px', borderBottom: `1px solid ${colors.border}`,
            alignItems: 'flex-end', flexWrap: 'wrap'
          }}>
            <div style={{ flex: 2, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Nome ou Sobrenome
              </label>
              <input 
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: `1px solid ${colors.border}` }}
                value={filterNome}
                onChange={e => setFilterNome(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Busca por nome..."
              />
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                CPF (Apenas números)
              </label>
              <input 
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: `1px solid ${colors.border}` }}
                value={filterCpf}
                onChange={e => setFilterCpf(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="00000000000"
              />
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Operadora
              </label>
              <select 
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: `1px solid ${colors.border}` }}
                value={filterOperadora}
                onChange={e => setFilterOperadora(e.target.value)}
              >
                <option value="">Todas</option>
                {operadoras.map(op => (
                  <option key={op.id} value={op.id}>{op.nome}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={loadPacientes} title="Pesquisar">
                <LuSearch size={20} />
              </Button>
              <Button onClick={clearFilters} style={{ background: '#6c757d' }} title="Limpar Filtros">
                <LuFilterX size={20} />
              </Button>
            </div>
          </div>
        )}

        {/* RENDERIZAÇÃO CONDICIONAL DE CONTEÚDO */}
        {activeTab === 'list' && (
          <PacientesList 
            data={pacientes} 
            loading={loading} 
            onEdit={handleEditRequest} 
            onViewAnexos={handleViewAnexos} // Passando a prop para a listagem
          />
        )}

        {activeTab === 'form' && (
          <PacientesForm 
            pacienteToEdit={editingPaciente}
            onSuccess={handleActionSuccess} 
            onCancel={() => { setActiveTab('list'); setEditingPaciente(null); }} 
          />
        )}

        {activeTab === 'import' && (
          <ImportarPacientes onSuccess={handleActionSuccess} />
        )}
      </ContentBox>

      {/* --- MODAL DE ANEXOS --- */}
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