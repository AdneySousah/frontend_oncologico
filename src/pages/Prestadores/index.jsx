import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilterX, LuPlus, LuList, LuUpload } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Container, TabContainer, TabButton, FilterBar,
  FilterInput, FilterSelect, FilterButton, Header
} from './styles';

import PrestadoresList from './components/PrestadoresList';
import PrestadoresForm from './components/PrestadoresForm';
import ImportarPrestadores from './components/ImportarPrestadores';

export default function PrestadoresPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrestador, setEditingPrestador] = useState(null);

  // Filtros
  const [fNome, setFNome] = useState('');
  const [fCnpj, setFCnpj] = useState('');
  const [fTipo, setFTipo] = useState('');
  const [showInactives, setShowInactives] = useState(false);

  // Agora a requisição envia o 'showInactives' para o backend filtrar na raiz
  const loadPrestadores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prestadores-medicos', {
        params: {
          nome: fNome || undefined,
          cnpj: fCnpj || undefined,
          tipo: fTipo || undefined,
          // Forçamos o envio como string para o backend entender sem erro:
          showInactives: showInactives ? 'true' : 'false'
        }
      });
      setPrestadores(res.data);
    } catch (err) {
      toast.error("Erro ao carregar prestadores");
    } finally {
      setLoading(false);
    }
  };

  // Adicionamos showInactives no array de dependências para recarregar quando clicar na caixinha
  useEffect(() => {
    if (activeTab === 'list') loadPrestadores();
  }, [activeTab, fTipo, showInactives]);

  const clearFilters = () => {
    setFNome(''); setFCnpj(''); setFTipo('');
    // O useEffect com showInactives vai se encarregar de recarregar se necessário, 
    // mas se quiser forçar aqui para campos de texto, mantemos a chamada.
    setTimeout(() => loadPrestadores(), 100);
  };

  const handleEdit = (p) => {
    setEditingPrestador(p);
    setActiveTab('form');
  };

  const handleToggleActive = async (prestador) => {
    const action = prestador.active !== false ? 'desativar' : 'ativar';
    if (window.confirm(`Deseja realmente ${action} este prestador?`)) {
      try {
        await api.delete(`/prestadores-medicos/${prestador.id}`);
        toast.success(`Prestador ${prestador.active !== false ? 'desativado' : 'ativado'}!`);
        loadPrestadores();
      } catch (err) {
        toast.error('Erro ao alterar status.');
      }
    }
  };

  return (
    <Container>
      <Header>
        <h1>Gestão de Prestadores Médicos</h1>
      </Header>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => { setActiveTab('list'); setEditingPrestador(null) }}>
          <LuList style={{ marginRight: '8px' }} /> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus style={{ marginRight: '8px' }} /> {editingPrestador ? 'Editar' : 'Novo'} Prestador
        </TabButton>
        <TabButton active={activeTab === 'import'} onClick={() => setActiveTab('import')}>
          <LuUpload style={{ marginRight: '8px' }} /> Importar Base (Excel)
        </TabButton>
      </TabContainer>

      {activeTab === 'list' && (
        <>
          <FilterBar>
            <div style={{ flex: 2 }}>
              <label>Nome / Razão Social</label>
              <FilterInput
                value={fNome}
                onChange={e => setFNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadPrestadores()}
                placeholder="Buscar por nome..."
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>CNPJ</label>
              <FilterInput
                value={fCnpj}
                onChange={e => setFCnpj(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadPrestadores()}
                placeholder="Apenas números..."
              />
            </div>
            <div style={{ width: '200px' }}>
              <label>Tipo</label>
              <FilterSelect value={fTipo} onChange={e => setFTipo(e.target.value)}>
                <option value="">Todos</option>
                <option value="hospital">Hospital</option>
                <option value="clinica">Clínica</option>
                <option value="laboratorio">Laboratório</option>
              </FilterSelect>
            </div>
            <FilterButton onClick={loadPrestadores}><LuSearch size={20} /></FilterButton>
            <FilterButton variant="clear" onClick={clearFilters}><LuFilterX size={20} /></FilterButton>
          </FilterBar>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#888' }}>
              <input
                type="checkbox"
                checked={showInactives}
                onChange={(e) => setShowInactives(e.target.checked)}
              />
              Mostrar prestadores inativos
            </label>
          </div>

          <PrestadoresList
            data={prestadores} // Agora mandamos a lista direto, pois o back já filtrou
            loading={loading}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
          />
        </>
      )}

      {activeTab === 'form' && (
        <PrestadoresForm
          prestadorToEdit={editingPrestador}
          onSuccess={() => { setActiveTab('list'); loadPrestadores(); }}
          onCancel={() => { setActiveTab('list'); setEditingPrestador(null); }}
        />
      )}

      {activeTab === 'import' && (
        <ImportarPrestadores onSuccess={() => loadPrestadores()} />
      )}
    </Container>
  );
}