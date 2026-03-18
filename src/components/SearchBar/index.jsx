import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  gap: 1.5rem;

  input[type="text"] {
    flex: 1;
    padding: 0.7rem 1rem;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    transition: border 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      outline: none;
    }
  }

  .filter-options {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.text};
      user-select: none;
      white-space: nowrap;

      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
  }
`;

// Tornamos as props genéricas: placeholder e labels podem mudar
const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  showInactives, 
  setShowInactives, 
  placeholder = "Pesquisar...", 
  checkboxLabel = "Exibir Inativos" 
}) => {
  return (
    <SearchContainer>
      <input 
        type="text" 
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="filter-options">
        <label>
          <input 
            type="checkbox" 
            checked={showInactives} 
            onChange={(e) => setShowInactives(e.target.checked)}
          />
          {checkboxLabel}
        </label>
      </div>
    </SearchContainer>
  );
};

export default SearchBar;