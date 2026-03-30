import React, { useState } from 'react';
import { 
  Table, 
  ActionButton, 
  ListHeader, 
  PaginationContainer, 
  PageButton, 
  SelectItemsPerPage 
} from '../styles';
import { 
  LuPencil, 
  LuPaperclip, 
  LuBan, 
  LuPower, 
  LuUserCheck, 
  LuChevronLeft, 
  LuChevronRight 
} from "react-icons/lu";

export default function PacientesList({ data, loading, onEdit, onViewAnexos, onToggleActive, onConfirm, isAdmin }) {
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Buscando pacientes...</div>;

  // Lógica de Paginação
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Garantir que a página atual não ultrapasse o limite após um novo filtro ser aplicado
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Retorna para a primeira página ao mudar a quantidade de itens
  };

  return (
    <div>
      {/* CABEÇALHO DA LISTA: TOTAL E FILTRO POR PÁGINA */}
      <ListHeader>
        <span>Total encontrado: <strong>{totalItems}</strong> paciente(s)</span>
        <div>
          <label htmlFor="itemsPerPage">Exibir por página: </label>
          <SelectItemsPerPage id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </SelectItemsPerPage>
        </div>
      </ListHeader>

      <Table>
        <thead>
          <tr>
            <th style={{ width: '40px', textAlign: 'center' }}>#</th> {/* NOVA COLUNA DE NUMERAÇÃO */}
            <th>Nome Completo</th>
            <th>CPF</th>
            <th>Celular</th>
            <th>Operadora</th>
            <th>Medicamento</th>
            <th style={{ textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {totalItems === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                Nenhum paciente encontrado com esses filtros.
              </td>
            </tr>
          ) : (
            currentItems.map((p, index) => {
              const temAnexo = p.anexos && p.anexos.length > 0;
              const inativo = p.is_active === false;
              
              // Cálculo sequencial independente do ID do banco de dados
              const sequencial = indexOfFirstItem + index + 1;

              return (
                <tr key={p.id} style={{ backgroundColor: inativo ? 'rgba(255, 60, 60, 0.12)' : 'transparent' }}>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#888' }}>{sequencial}</td>
                  
                  <td>
                    <strong>{p.nome} {p.sobrenome}</strong>
                    {p.is_new_user && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#faad14', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>NOVO</span>}
                  </td>
                  <td>{p.cpf}</td>
                  <td>{p.celular}</td>
                  <td>{p.operadoras?.nome || '-'}</td>
                  <td>{p.medicamento?.nome || '-'}</td>

                  <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {p.is_new_user && isAdmin === true && (
                      <ActionButton onClick={() => onConfirm(p)} title="Confirmar Cadastro" style={{ background: '#faad14', color: '#fff' }}>
                        <LuUserCheck size={18} />
                      </ActionButton>
                    )}

                    <ActionButton onClick={() => onEdit(p)} title="Editar Paciente">
                      <LuPencil size={18} />
                    </ActionButton>

                    <ActionButton
                      onClick={() => onToggleActive(p)}
                      title={inativo ? "Reativar Paciente" : "Inativar Paciente"}
                      style={{ background: inativo ? '#28a745' : '#d19399', color: '#fff' }}
                    >
                      <LuPower size={18} />
                    </ActionButton>

                    {temAnexo ? (
                      <ActionButton onClick={() => onViewAnexos(p)} title="Ver Anexos" style={{ background: '#17a2b8', color: '#fff' }}>
                        <LuPaperclip size={18} />
                      </ActionButton>
                    ) : (
                      <ActionButton title="Paciente sem anexo" style={{ background: '#f8f9fa', color: '#ccc', cursor: 'not-allowed' }} disabled>
                        <LuBan size={18} />
                      </ActionButton>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {/* CONTROLES DE PAGINAÇÃO */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton onClick={() => handlePageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 1}>
            <LuChevronLeft size={20} />
          </PageButton>
          <span>Página <strong>{safeCurrentPage}</strong> de <strong>{totalPages}</strong></span>
          <PageButton onClick={() => handlePageChange(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages}>
            <LuChevronRight size={20} />
          </PageButton>
        </PaginationContainer>
      )}
    </div>
  );
}