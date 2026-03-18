import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilterX, LuPlus, LuList, LuUpload, LuDatabase, LuDollarSign } from "react-icons/lu";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Container, TabContainer, TabButton, FilterBar, 
  FilterInput, FilterButton, PaginationContainer, PageButton,
  InfoGrid, InfoCard // Importando os novos estilos
} from './styles';

import MedicamentosList from './Components/MedicamentosList';
import MedicamentosForm from './Components/MedicamentosForm';
import ImportarMedicamentos from './Components/ImportarMedicamentos';

export default function MedicamentosPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab('form');
  };

  // Filtro Front-end
  const filteredData = medicamentos.filter(item => {
    if (!filter) return true;
    const termo = filter.toLowerCase();
    return (
      (item.nome && item.nome.toLowerCase().includes(termo)) ||
      (item.principio_ativo && item.principio_ativo.toLowerCase().includes(termo)) ||
      (item.codigo_tuss && item.codigo_tuss.includes(termo))
    );
  });

  // CÁLCULOS DOS INDICADORES (Baseados nos dados filtrados ou totais)
  const totalItens = filteredData.length;
  const valorTotalSoma = filteredData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container>
      <h1>Gestão de Medicamentos</h1>

      <TabContainer>
        <TabButton active={activeTab === 'list'} onClick={() => {setActiveTab('list'); setEditingItem(null)}}>
          <LuList size={18} style={{marginRight: '8px'}}/> Listagem
        </TabButton>
        <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
          <LuPlus size={18} style={{marginRight: '8px'}}/> {editingItem ? 'Editar' : 'Novo'} Medicamento
        </TabButton>
        <TabButton active={activeTab === 'import'} onClick={() => setActiveTab('import')}>
          <LuUpload size={18} style={{marginRight: '8px'}}/> Importar Base (Excel)
        </TabButton>
      </TabContainer>

      {activeTab === 'list' && (
        <>
          <FilterBar>
            <div style={{flex: 1}}>
              <label>Busca Inteligente</label>
              <FilterInput 
                value={filter} 
                onChange={e => { setFilter(e.target.value); setCurrentPage(1); }} 
                placeholder="Busque por código TUSS, nome ou princípio ativo..."
              />
            </div>
            <FilterButton variant="clear" onClick={() => setFilter('')}>
              <LuFilterX size={20}/>
            </FilterButton>
          </FilterBar>

          {/* INDICADORES EM CIMA DA TABELA */}
          <InfoGrid>
            <InfoCard>
              <strong>{totalItens} Medicamentos Cadastrados no sistema</strong>
            </InfoCard>

          </InfoGrid>

          <MedicamentosList data={currentItems} loading={loading} onEdit={handleEdit} />

          {!loading && (
            <PaginationContainer>
              <PageButton onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1}>Anterior</PageButton>
              <span>Página {currentPage} de {totalPages}</span>
              <PageButton onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages}>Próxima</PageButton>
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

      {activeTab === 'import' && (
        <ImportarMedicamentos onSuccess={() => loadMedicamentos()} />
      )}
    </Container>
  );
}