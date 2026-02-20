import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilterX, LuPlus, LuList } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, FilterBar, 
  FilterInput, FilterButton 
} from './styles';

import ComorbidadesList from './components/ComorbidadesList';
import ComorbidadesForm from './components/ComorbidadesForm';

export default function ComorbidadesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [comorbidades, setComorbidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('');

  const loadComorbidades = async () => {
    setLoading(true);
    try {
      // Passando o filtro se o seu backend suportar query params futuramente
      const res = await api.get('/comorbidades', { params: { nome: filter } });
      setComorbidades(res.data);
    } catch (err) {
      toast.error("Erro ao carregar comorbidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === 'list') loadComorbidades(); 
  }, [activeTab]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab('form');
  };

  return (
    <Container>
      <h1>Gestão de Comorbidades</h1>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingItem(null)}}>
          <LuList style={{marginRight: '8px'}}/> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus style={{marginRight: '8px'}}/> {editingItem ? 'Editar' : 'Nova'} Comorbidade
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
                onKeyDown={e => e.key === 'Enter' && loadComorbidades()} 
                placeholder="Digite o nome..."
              />
            </div>
            <FilterButton onClick={loadComorbidades}><LuSearch size={20}/></FilterButton>
            <FilterButton variant="clear" onClick={() => { setFilter(''); loadComorbidades(); }}><LuFilterX size={20}/></FilterButton>
          </FilterBar>

          <ComorbidadesList data={comorbidades} loading={loading} onEdit={handleEdit} />
        </>
      )}

      {activeTab === 'form' && (
        <ComorbidadesForm 
          comorbidadeToEdit={editingItem} 
          onSuccess={() => {setActiveTab('list'); loadComorbidades();}} 
          onCancel={() => {setActiveTab('list'); setEditingItem(null);}} 
        />
      )}
    </Container>
  );
}