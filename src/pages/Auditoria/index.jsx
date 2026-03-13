import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilterX, LuUsers, LuHistory, LuDownload } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Container, TabContainer, TabButton, FilterBar,
  FilterInput, FilterButton
} from './styles';

import UsersList from './components/UsersList';
import HistoryList from './components/HistoryList';
import { exportToXLSX } from '../../utils/exportExcel';

export default function AuditoriaPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);

  // States para Usuários
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [fNome, setFNome] = useState('');

  // States para Histórico
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [fDataInicio, setFDataInicio] = useState('');
  const [fDataFim, setFDataFim] = useState('');
  const [fEntity, setFEntity] = useState('');
  const [fActionType, setFActionType] = useState('');

  // Carrega usuários ao montar a página
  useEffect(() => {
    loadUsers();
  }, []);

  // Recarrega os logs caso as datas mudem (quando estamos na aba history)
  useEffect(() => {
    if (activeTab === 'history' && selectedUser) {
      loadHistory();
    }
  }, [activeTab, selectedUser]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users');
      let fetchedUsers = res.data;
      if (fNome) {
        fetchedUsers = fetchedUsers.filter(u => u.name.toLowerCase().includes(fNome.toLowerCase()));
      }
      setUsers(fetchedUsers);
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadHistory = async () => {
    if (!selectedUser) return;
    setLoadingLogs(true);
    try {
      const res = await api.get('/audit-logs', {
        params: {
          user_id: selectedUser.id,
          data_inicio: fDataInicio,
          data_fim: fDataFim,
          entity: fEntity,
          action_type: fActionType,
          limit: 100
        }
      });
      setLogs(res.data.data || []);
    } catch (err) {
      toast.error("Erro ao carregar histórico");
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setActiveTab('history');
  };

  const clearUserFilters = () => {
    setFNome('');
    loadUsers();
  };

  const clearHistoryFilters = () => {
    setFDataInicio('');
    setFDataFim('');
    setFEntity('');
    setFActionType('');
    setTimeout(() => loadHistory(), 0);
  };

  const handleExport = () => {
    if (!logs || logs.length === 0) {
      toast.warning("Nenhum registro encontrado para exportar.");
      return;
    }

    // Estrutura as colunas esperadas pelo seu utilitário
    const columns = [
      { header: 'Data / Hora', key: 'dataHora', width: 22 },
      { header: 'Módulo Afetado', key: 'modulo', width: 20 },
      { header: 'Ação Realizada', key: 'acao', width: 20 },
      { header: 'Detalhes da Operação', key: 'detalhes', width: 60 },
    ];

    // Mapeia os dados do estado para o formato da planilha
    const dataToExport = logs.map(log => ({
      dataHora: `${new Date(log.createdAt).toLocaleDateString('pt-BR')} as ${new Date(log.createdAt).toLocaleTimeString('pt-BR')}`,
      modulo: log.entity || '-',
      acao: log.action_type || '-',
      detalhes: log.details || '-',
    }));

    const reportTitle = `Relatório de Auditoria - ${selectedUser?.name}`;
    const filename = `Auditoria_${selectedUser?.name.replace(/\s+/g, '_')}_${Date.now()}`;

    exportToXLSX(dataToExport, columns, filename, reportTitle);
  };

  return (
    <Container>
      <h1>Auditoria e Rastreio do Sistema</h1>

      <TabContainer>
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          <LuUsers style={{ marginRight: '8px' }} /> Selecionar Usuário
        </TabButton>
        <TabButton
          active={activeTab === 'history'}
          disabled={!selectedUser}
          onClick={() => selectedUser && setActiveTab('history')}
        >
          <LuHistory style={{ marginRight: '8px' }} />
          {selectedUser ? `Histórico de: ${selectedUser.name}` : 'Histórico (Selecione um usuário)'}
        </TabButton>
      </TabContainer>

      {/* VIEW DE USUÁRIOS */}
      {activeTab === 'users' && (
        <>
          <FilterBar>
            <div style={{ flex: 1 }}>
              <label>Nome do Usuário</label>
              <FilterInput
                value={fNome}
                onChange={e => setFNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadUsers()}
                placeholder="Buscar usuário..."
              />
            </div>
            <FilterButton onClick={loadUsers}><LuSearch size={20} /></FilterButton>
            <FilterButton variant="clear" onClick={clearUserFilters}><LuFilterX size={20} /></FilterButton>
          </FilterBar>

          <UsersList data={users} loading={loadingUsers} onSelectUser={handleSelectUser} />
        </>
      )}

      {/* VIEW DE HISTÓRICO */}
      {activeTab === 'history' && selectedUser && (
        <>
          <FilterBar style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <label>Data Início</label>
              <FilterInput
                type="date"
                value={fDataInicio}
                onChange={e => setFDataInicio(e.target.value)}
              />
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <label>Data Fim</label>
              <FilterInput
                type="date"
                value={fDataFim}
                onChange={e => setFDataFim(e.target.value)}
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label>Módulo</label>
              <FilterInput
                type="text"
                value={fEntity}
                onChange={e => setFEntity(e.target.value)}
                placeholder="Ex: Pacientes, Chamadas..."
                onKeyDown={e => e.key === 'Enter' && loadHistory()}
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label>Tipo de Ação</label>
              <select
                value={fActionType}
                onChange={e => setFActionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '4px',
                  backgroundColor: '#fff'
                }}
              >
                <option value="">Todas</option>
                <option value="CRIAÇÃO">Criação</option>
                <option value="EDIÇÃO">Edição</option>
                <option value="EXCLUSÃO">Exclusão</option>
                <option value="ENVIO">Envio</option>
                <option value="LOGIN">Acesso (Login)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <FilterButton onClick={loadHistory} title="Buscar"><LuSearch size={20} /></FilterButton>
              <FilterButton variant="clear" onClick={clearHistoryFilters} title="Limpar Filtros"><LuFilterX size={20} /></FilterButton>
              <FilterButton
                onClick={handleExport}
                title="Exportar para Excel"
                style={{ backgroundColor: '#107c41', color: 'white', borderColor: '#107c41' }}
              >
                <LuDownload size={20} />
              </FilterButton>
            </div>
          </FilterBar>

          <HistoryList data={logs} loading={loadingLogs} />
        </>
      )}
    </Container>
  );
}