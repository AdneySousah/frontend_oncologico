import React from 'react';
import { LuSearch, LuCalendar } from "react-icons/lu";
import { SearchInputContainer, SearchInput } from '../styles'; // Reaproveita seus estilos

export default function FiltrosTelemonitoramento({ searchTerm, setSearchTerm, filterMonth, setFilterMonth }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
      
      {/* Filtro de Busca por Nome */}
      <SearchInputContainer style={{ flex: '1 1 250px' }}>
        <LuSearch size={18} />
        <SearchInput
          type="text"
          placeholder="Buscar paciente por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchInputContainer>

      

    </div>
  );
}