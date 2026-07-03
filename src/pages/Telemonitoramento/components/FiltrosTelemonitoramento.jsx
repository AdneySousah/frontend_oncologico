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

      {/* Filtro de Mês */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-color)', 
        padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color)' 
      }}>
        <LuCalendar size={18} color="var(--primary-color)" />
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{ 
            border: 'none', background: 'transparent', outline: 'none', 
            padding: '10px 0', cursor: 'pointer', color: 'var(--text-color)' 
          }}
        />
      </div>

    </div>
  );
}