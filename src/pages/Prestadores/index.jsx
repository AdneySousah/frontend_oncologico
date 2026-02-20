import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilterX, LuPlus, LuList } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, FilterBar, 
  FilterInput, FilterSelect, FilterButton 
} from './styles';

import PrestadoresList from './components/PrestadoresList';
import PrestadoresForm from './components/PrestadoresForm';

export default function PrestadoresPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrestador, setEditingPrestador] = useState(null);

  const [fNome, setFNome] = useState('');
  const [fCnpj, setFCnpj] = useState('');
  const [fTipo, setFTipo] = useState('');

  const loadPrestadores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prestadores-medicos', {
        params: { nome: fNome, cnpj: fCnpj, tipo: fTipo }
      });
      setPrestadores(res.data);
    } catch (err) {
      toast.error("Erro ao carregar prestadores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activeTab === 'list') loadPrestadores(); }, [activeTab, fTipo]);

  const clearFilters = () => {
    setFNome(''); setFCnpj(''); setFTipo('');
    loadPrestadores();
  };

  const handleEdit = (p) => {
    setEditingPrestador(p);
    setActiveTab('form');
  };

  return (
    <Container>
      <h1>Gestão de Prestadores Médicos</h1>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingPrestador(null)}}>
          <LuList style={{marginRight: '8px'}}/> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus style={{marginRight: '8px'}}/> {editingPrestador ? 'Editar' : 'Novo'} Prestador
        </TabButton>
      </TabContainer>

      {activeTab === 'list' && (
        <>
          <FilterBar>
            <div style={{flex: 2}}>
              <label>Nome / Razão Social</label>
              <FilterInput 
                value={fNome} 
                onChange={e => setFNome(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && loadPrestadores()} 
                placeholder="Buscar..."
              />
            </div>
            <div style={{width: '200px'}}>
              <label>Tipo</label>
              <FilterSelect value={fTipo} onChange={e => setFTipo(e.target.value)}>
                <option value="">Todos</option>
                <option value="hospital">Hospital</option>
                <option value="clinica">Clínica</option>
                <option value="laboratorio">Laboratório</option>
              </FilterSelect>
            </div>
            {/* Usando o FilterButton estilizado */}
            <FilterButton onClick={loadPrestadores}><LuSearch size={20}/></FilterButton>
            <FilterButton variant="clear" onClick={clearFilters}><LuFilterX size={20}/></FilterButton>
          </FilterBar>

          <PrestadoresList data={prestadores} loading={loading} onEdit={handleEdit} />
        </>
      )}

      {activeTab === 'form' && (
        <PrestadoresForm 
          prestadorToEdit={editingPrestador} 
          onSuccess={() => {setActiveTab('list'); loadPrestadores();}} 
          onCancel={() => {setActiveTab('list'); setEditingPrestador(null);}} 
        />
      )}
    </Container>
  );
}