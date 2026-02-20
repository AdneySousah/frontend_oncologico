import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilterX, LuPlus, LuList } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, FilterBar, 
  FilterInput, FilterButton 
} from './styles';

import MedicamentosList from './components/MedicamentosList';
import MedicamentosForm from './components/MedicamentosForm';

export default function MedicamentosPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('');

  const loadMedicamentos = async (searchQuery = filter) => {
    setLoading(true);
    try {
      // Passando o filtro para o backend. Certifique-se de que seu Controller trata isso (ex: Where nome LIKE)
      const res = await api.get('/medicamentos', { params: { nome: searchQuery } });
      setMedicamentos(res.data);
    } catch (err) {
      toast.error("Erro ao carregar medicamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === 'list') loadMedicamentos(); 
  }, [activeTab]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab('form');
  };

  const handleClearFilter = () => {
    setFilter('');
    loadMedicamentos(''); // Força a busca vazia imediatamente
  };

  return (
    <Container>
      <h1>Gestão de Medicamentos</h1>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingItem(null)}}>
          <LuList style={{marginRight: '8px'}}/> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus style={{marginRight: '8px'}}/> {editingItem ? 'Editar' : 'Novo'} Medicamento
        </TabButton>
      </TabContainer>

      {activeTab === 'list' && (
        <>
          <FilterBar>
            <div style={{flex: 1}}>
              <label>Filtrar por nome</label>
              <FilterInput 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && loadMedicamentos()} 
                placeholder="Digite o princípio ativo, nome comercial ou descrição..."
              />
            </div>
            <FilterButton onClick={() => loadMedicamentos()}><LuSearch size={20}/></FilterButton>
            <FilterButton variant="clear" onClick={handleClearFilter}><LuFilterX size={20}/></FilterButton>
          </FilterBar>

          <MedicamentosList data={medicamentos} loading={loading} onEdit={handleEdit} />
        </>
      )}

      {activeTab === 'form' && (
        <MedicamentosForm 
          medicamentoToEdit={editingItem} 
          onSuccess={() => {setActiveTab('list'); loadMedicamentos();}} 
          onCancel={() => {setActiveTab('list'); setEditingItem(null);}} 
        />
      )}
    </Container>
  );
}