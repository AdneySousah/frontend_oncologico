import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  LuList,
  LuShieldCheck 
} from "react-icons/lu";

import api from '../../services/api';
// Assumindo que a rota dos estilos é a mesma do seu exemplo
import { 
  Container, 
  Header, 
  TabContainer, 
  TabButton, 
  ContentBox 
} from './styles';

// Componentes internos
import PerfisList from './components/PerfisList';
import PerfisForm from './components/PerfisForm';

export default function PerfisPage() {
  const [activeTab, setActiveTab] = useState('list');
  
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingPerfil, setEditingPerfil] = useState(null);

  async function loadPerfis() {
    setLoading(true);
    try {
      const response = await api.get('/perfis');
      setPerfis(response.data);
    } catch (err) {
      toast.error("Erro ao carregar lista de perfis.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'list') {
      loadPerfis();
    }
  }, [activeTab]);

  const handleActionSuccess = () => {
    setEditingPerfil(null);
    setActiveTab('list');
    loadPerfis();
  };

  const handleEditRequest = (perfil) => {
    setEditingPerfil(perfil);
    setActiveTab('form'); 
  };

  return (
    <Container>
      <Header>
        <h1>Gestão de Perfis de Acesso</h1>
      </Header>

      <TabContainer>
        <TabButton 
          active={activeTab === 'list'} 
          onClick={() => { setActiveTab('list'); setEditingPerfil(null); }}
        >
          <LuList size={18} style={{marginRight: '8px'}} />
          Listagem
        </TabButton>
        <TabButton 
          active={activeTab === 'form'} 
          onClick={() => setActiveTab('form')}
        >
          <LuShieldCheck size={18} style={{marginRight: '8px'}} />
          {editingPerfil ? 'Editar Perfil' : 'Novo Perfil'}
        </TabButton>
      </TabContainer>

      <ContentBox>
        {activeTab === 'list' && (
          <PerfisList 
            data={perfis} 
            loading={loading} 
            onEdit={handleEditRequest} 
          />
        )}

        {activeTab === 'form' && (
          <PerfisForm 
            perfilToEdit={editingPerfil}
            onSuccess={handleActionSuccess} 
            onCancel={() => { setActiveTab('list'); setEditingPerfil(null); }} 
          />
        )}
      </ContentBox>
    </Container>
  );
}