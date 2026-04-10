import React, { useMemo } from 'react';
import * as S from '../styles';

export default function FilterBar({ filters, setFilters, pacientes, isMaster }) {
  
  // Extrai uma lista única de operadoras para o Select
  const operadorasDisponiveis = useMemo(() => {
    const ops = pacientes
      .map(p => p.operadoras?.nome)
      .filter(nome => nome); // Remove nulos/undefined
    return [...new Set(ops)].sort();
  }, [pacientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ buscaGeral: '', cuidador: '', telefone: '', operadora: '' });
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <S.FilterContainer>
      <S.InputGroup>
        <label>Paciente ou CPF</label>
        <input 
          type="text" 
          name="buscaGeral" 
          placeholder="Nome, sobrenome ou CPF..." 
          value={filters.buscaGeral} 
          onChange={handleChange} 
        />
      </S.InputGroup>

      <S.InputGroup>
        <label>Nome do Cuidador</label>
        <input 
          type="text" 
          name="cuidador" 
          placeholder="Buscar cuidador..." 
          value={filters.cuidador} 
          onChange={handleChange} 
        />
      </S.InputGroup>

      <S.InputGroup>
        <label>Telefone / Celular</label>
        <input 
          type="text" 
          name="telefone" 
          placeholder="Apenas números..." 
          value={filters.telefone} 
          onChange={handleChange} 
        />
      </S.InputGroup>

      {/* Só mostra o filtro de operadora se for a clínica master, senão o usuário já é travado na dele */}
      {isMaster && (
        <S.InputGroup>
          <label>Operadora</label>
          <select name="operadora" value={filters.operadora} onChange={handleChange}>
            <option value="">Todas as operadoras</option>
            {operadorasDisponiveis.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </S.InputGroup>
      )}

      {hasActiveFilters && (
        <S.ClearButton onClick={clearFilters}>
          Limpar Filtros
        </S.ClearButton>
      )}
    </S.FilterContainer>
  );
}