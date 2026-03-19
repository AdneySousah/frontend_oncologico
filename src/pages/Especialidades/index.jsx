import React, { useState, useEffect, useMemo } from 'react';
import { LuList, LuPlus, LuUpload } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, Header 
} from './styles';

import EspecialidadesList from './components/EspecialidadesList';
import EspecialidadesForm from './components/EspecialidadesForm';
import ImportarEspecialidades from './components/ImportarEspecialidades';
import SearchBar from '../../components/SearchBar';

export default function SpecialtiesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  
  // Filtros
  const [search, setSearch] = useState('');
  const [showInactives, setShowInactives] = useState(false);

  const loadSpecialties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/specialities');
      setSpecialties(res.data);
    } catch (err) {
      toast.error("Erro ao carregar especialidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === 'list') loadSpecialties(); 
  }, [activeTab]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab('form');
  };

  const handleToggleActive = async (specialty) => {
    const action = specialty.active ? 'desativar' : 'ativar';
    if (window.confirm(`Deseja realmente ${action} esta especialidade?`)) {
      try {
        await api.delete(`/specialities/${specialty.id}`);
        toast.success(`Especialidade ${specialty.active ? 'desativada' : 'ativada'}!`);
        loadSpecialties();
      } catch (err) {
        toast.error('Erro ao alterar status.');
      }
    }
  };

  const filteredSpecialties = useMemo(() => {
    return specialties.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = showInactives ? true : s.active;
      return matchesSearch && matchesStatus;
    });
  }, [specialties, search, showInactives]);

  return (
    <Container>
      <Header>
        <h1>Gestão de Especialidades</h1>
      </Header>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingItem(null)}}>
          <LuList size={18} style={{marginRight: '8px'}}/> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus size={18} style={{marginRight: '8px'}}/> {editingItem ? 'Editar' : 'Nova'} Especialidade
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
          <EspecialidadesList 
            data={filteredSpecialties} 
            loading={loading} 
            onEdit={handleEdit} 
            onToggleActive={handleToggleActive} 
          />
        </>
      )}

      {activeTab === 'form' && (
        <EspecialidadesForm 
          specialtyToEdit={editingItem} 
          onSuccess={() => {setActiveTab('list'); loadSpecialties();}} 
          onCancel={() => {setActiveTab('list'); setEditingItem(null);}} 
        />
      )}

      {activeTab === 'import' && (
        <ImportarEspecialidades onSuccess={() => loadSpecialties()} />
      )}
    </Container>
  );
}