import React, { useState, useEffect, useMemo } from 'react';
import { LuList, LuPlus, LuUpload } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, Header // Reaproveite os estilos do seu MedicamentosPage
} from './styles';

import ReacoesAdversasList from './components/ReacoesAdversasList';
import ReacoesAdversasForm from './components/ReacoesAdversasForm';
import ImportarReacoesAdversas from './components/ImportarReacoesAdversas';
import SearchBar from '../../components/SearchBar'; // Seu SearchBar existente

export default function ReacoesAdversasPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [reacoes, setReacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  
  // Filtros
  const [search, setSearch] = useState('');
  const [showInactives, setShowInactives] = useState(false);

  const loadReacoes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reacao-adversa');
      setReacoes(res.data);
    } catch (err) {
      toast.error("Erro ao carregar reações adversas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === 'list') loadReacoes(); 
  }, [activeTab]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab('form');
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

  const filteredReacoes = useMemo(() => {
    return reacoes.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = showInactives ? true : r.active;
      return matchesSearch && matchesStatus;
    });
  }, [reacoes, search, showInactives]);

  return (
    <Container>
      <Header>
        <h1>Gestão de Reações Adversas (RAM)</h1>
      </Header>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingItem(null)}}>
          <LuList size={18} style={{marginRight: '8px'}}/> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus size={18} style={{marginRight: '8px'}}/> {editingItem ? 'Editar' : 'Nova'} Reação
        </TabButton>
        <TabButton active={activeTab === 'import'} onClick={() => setActiveTab('import')}>
          <LuUpload size={18} style={{marginRight: '8px'}}/> Importar Base (Excel)
        </TabButton>
      </TabContainer>

      {activeTab === 'list' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <SearchBar 
              value={search} 
              onChange={setSearch} 
              showInactives={showInactives} 
              onToggleInactives={setShowInactives} 
            />
          </div>
          <ReacoesAdversasList 
            data={filteredReacoes} 
            loading={loading} 
            onEdit={handleEdit} 
            onToggleActive={handleToggleActive} 
          />
        </>
      )}

      {activeTab === 'form' && (
        <ReacoesAdversasForm 
          reacaoToEdit={editingItem} 
          onSuccess={() => {setActiveTab('list'); loadReacoes();}} 
          onCancel={() => {setActiveTab('list'); setEditingItem(null);}} 
        />
      )}

      {activeTab === 'import' && (
        <ImportarReacoesAdversas onSuccess={() => loadReacoes()} />
      )}
    </Container>
  );
}