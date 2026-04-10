import React from 'react';
import * as S from '../styles';

export default function Pagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  setItemsPerPage, 
  setCurrentPage 
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <S.PaginationContainer>
      <div className="info">
        Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
      </div>

      <div className="controls">
        <label style={{ fontSize: '12px', color: '#888' }}>Itens por página:</label>
        <select 
          value={itemsPerPage} 
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // Volta pra página 1 ao mudar a quantidade
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <S.PageButton onClick={handlePrev} disabled={currentPage === 1}>
          Anterior
        </S.PageButton>
        
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {currentPage} / {totalPages}
        </span>
        
        <S.PageButton onClick={handleNext} disabled={currentPage === totalPages}>
          Próxima
        </S.PageButton>
      </div>
    </S.PaginationContainer>
  );
}