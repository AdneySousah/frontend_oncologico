import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilterX, LuPlus, LuList } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, FilterBar, 
  FilterInput, FilterButton, PaginationContainer, PageButton
} from './styles';

import MedicamentosList from './Components/MedicamentosList';
import MedicamentosForm from './Components/MedicamentosForm';

export default function MedicamentosPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  
  // Estados para filtro e paginação
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Defina quantos itens quer por página aqui

  // Retiramos o envio do filtro para a API para fazer o filtro instantâneo no Front-end
  const loadMedicamentos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/medicamentos');
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

  // Se o filtro mudar, volta sempre para a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab('form');
  };

  const handleClearFilter = () => {
    setFilter('');
  };

  // --- LÓGICA DE FILTRO E PAGINAÇÃO ---
  const filteredData = medicamentos.filter(item => {
    if (!filter) return true;
    const termo = filter.toLowerCase();
    return (
      (item.nome && item.nome.toLowerCase().includes(termo)) ||
      (item.principio_ativo && item.principio_ativo.toLowerCase().includes(termo)) ||
      (item.nome_comercial && item.nome_comercial.toLowerCase().includes(termo)) ||
      (item.descricao && item.descricao.toLowerCase().includes(termo))
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                placeholder="Digite o princípio ativo, nome comercial ou descrição..."
              />
            </div>
            {/* O botão de pesquisa já não faz fetch à API, pois o filtro é automático ao digitar */}
            <FilterButton variant="clear" onClick={handleClearFilter} title="Limpar Filtro">
              <LuFilterX size={20}/>
            </FilterButton>
          </FilterBar>

          {/* Passamos o currentItems (página atual filtrada) para a tabela */}
          <MedicamentosList data={currentItems} loading={loading} onEdit={handleEdit} />

          {/* CONTROLOS DE PAGINAÇÃO */}
          {!loading && filteredData.length > 0 && (
            <PaginationContainer>
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </PageButton>
              <span>Página {currentPage} de {totalPages}</span>
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </PageButton>
            </PaginationContainer>
          )}
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