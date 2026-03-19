import React, { useState, useEffect, useMemo } from 'react';
import { LuList, LuPlus, LuUpload } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, Header 
} from './styles';

import DiagnosticosList from './components/DiagnosticosList';
import DiagnosticosForm from './components/DiagnosticosForm';
import ImportarDiagnosticos from './components/ImportarDiagnosticos';
import SearchBar from '../../components/SearchBar'; 

export default function DiagnosticosPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  
  const [search, setSearch] = useState('');
  const [showInactives, setShowInactives] = useState(false);

  const loadDiagnosticos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/diagnosticos');
      setDiagnosticos(res.data);
    } catch (err) {
      toast.error("Erro ao carregar diagnósticos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === 'list') loadDiagnosticos(); 
  }, [activeTab]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab('form');
  };

  const handleToggleActive = async (diag) => {
    const action = diag.active ? 'desativar' : 'ativar';
    if (window.confirm(`Deseja realmente ${action} este diagnóstico?`)) {
      try {
        await api.delete(`/diagnosticos/${diag.id}`);
        toast.success(`Diagnóstico ${diag.active ? 'desativado' : 'ativado'}!`);
        loadDiagnosticos();
      } catch (err) {
        toast.error('Erro ao alterar status.');
      }
    }
  };

  const filteredDiagnosticos = useMemo(() => {
    return diagnosticos.filter(d => {
      // Importante: a chave no backend de diagnóstico é 'd.diagnostico', não 'd.name'
      const matchesSearch = d.diagnostico?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = showInactives ? true : d.active;
      return matchesSearch && matchesStatus;
    });
  }, [diagnosticos, search, showInactives]);

  return (
    <Container>
      <Header>
        <h1>Gestão de Diagnósticos (CID)</h1>
      </Header>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingItem(null)}}>
          <LuList size={18} style={{marginRight: '8px'}}/> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus size={18} style={{marginRight: '8px'}}/> {editingItem ? 'Editar' : 'Novo'} Diagnóstico
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
          <DiagnosticosList 
            data={filteredDiagnosticos} 
            loading={loading} 
            onEdit={handleEdit} 
            onToggleActive={handleToggleActive} 
          />
        </>
      )}

      {activeTab === 'form' && (
        <DiagnosticosForm 
          diagToEdit={editingItem} 
          onSuccess={() => {setActiveTab('list'); loadDiagnosticos();}} 
          onCancel={() => {setActiveTab('list'); setEditingItem(null);}} 
        />
      )}

      {activeTab === 'import' && (
        <ImportarDiagnosticos onSuccess={() => loadDiagnosticos()} />
      )}
    </Container>
  );
}