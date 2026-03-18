import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { LuPencil, LuPower, LuPlus } from "react-icons/lu";
import api from '../../services/api';
import { Container, Header, TableContainer, Table } from './styles';
import { ActionButton } from '../Users/styles'; // Reutilizando seu botão de ação
import ReacaoAdversaModal from './components/ReacaoAdversaModal';
import  SearchBar  from '../../components/SearchBar';

const ReacoesAdversasPage = () => {
  const [reacoes, setReacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReacao, setSelectedReacao] = useState(null);
  
  // Estados de Filtro
  const [search, setSearch] = useState('');
  const [showInactives, setShowInactives] = useState(false);

  const loadReacoes = async () => {
    try {
      const response = await api.get('/reacao-adversa');
      setReacoes(response.data);
    } catch (err) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReacoes(); }, []);

  // Filtro em tempo real
  const filteredReacoes = useMemo(() => {
    return reacoes.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = showInactives ? true : r.active;
      return matchesSearch && matchesStatus;
    });
  }, [reacoes, search, showInactives]);

  const handleEdit = (reacao) => {
    setSelectedReacao(reacao);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (reacao) => {
    const action = reacao.active ? 'desativar' : 'ativar';
    if (window.confirm(`Deseja realmente ${action} esta reação?`)) {
      try {
        await api.delete(`/reacao-adversa/${reacao.id}`);
        toast.success(`Reação ${reacao.active ? 'desativada' : 'ativada'}!`);
        loadReacoes();
      } catch (err) {
        toast.error('Erro ao alterar status.');
      }
    }
  };

  return (
    <Container>
      <Header>
        <h1>Fichas RAM - Reações Adversas</h1>
        <button onClick={() => { setSelectedReacao(null); setIsModalOpen(true); }}>
          <LuPlus size={20} style={{marginRight: 8}} /> Nova Reação
        </button>
      </Header>

      <SearchBar 
        value={search} 
        onChange={setSearch} 
        showInactives={showInactives} 
        onToggleInactives={setShowInactives} 
      />

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>ID</th>
              <th>Nome da Reação</th>
              <th style={{ width: '150px' }}>Status</th>
              <th style={{ textAlign: 'right', width: '150px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : filteredReacoes.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Nenhuma reação encontrada.</td></tr>
            ) : (
              filteredReacoes.map((reacao) => (
                <tr key={reacao.id} style={{ opacity: reacao.active ? 1 : 0.6 }}>
                  <td>#{reacao.id}</td>
                  <td><strong>{reacao.name}</strong></td>
                  <td>
                    <span style={{ 
                      color: reacao.active ? '#52c41a' : '#ff4d4f', 
                      fontWeight: 'bold' 
                    }}>
                      {reacao.active ? '● Ativo' : '○ Inativo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionButton className="edit" onClick={() => handleEdit(reacao)}>
                      <LuPencil size={18} />
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => handleToggleActive(reacao)}
                      style={{ color: reacao.active ? '#ff4d4f' : '#52c41a', borderColor: reacao.active ? '#ff4d4f' : '#52c41a' }}
                    >
                      <LuPower size={18} />
                    </ActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      <ReacaoAdversaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadReacoes}
        dataToEdit={selectedReacao}
      />
    </Container>
  );
};

export default ReacoesAdversasPage;