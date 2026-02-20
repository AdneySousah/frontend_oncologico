import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
  padding: 1rem;
`;

export const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.surface}; /* Tirado o 'white' fixo */
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${({ theme }) => theme.colors.primary}; /* Trocado de sidebarMiddle */
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border}; /* Trocado de backgroundAlt */
    font-size: 1.1rem;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .flex-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: ${({ theme }) => theme.colors.primary};
    }

    label {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      font-size: 0.95rem;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  label {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.text}; /* Trocado de textLight para dar mais leitura */
    font-weight: 600;
  }

  input, select, textarea {
    padding: 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Tirado o '#fff' fixo */
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33; /* Glow padronizado com transparência */
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textLight};
      opacity: 0.7;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding: 2rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ActionButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;

  &.save {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
    &:hover { 
      background-color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary}; 
      filter: brightness(0.9);
    }
  }

  &.cancel {
    background-color: ${({ theme }) => theme.colors.inputBg}; /* Tirado o '#f1f1f1' */
    color: ${({ theme }) => theme.colors.text}; /* Tirado o '#666' */
    border: 1px solid ${({ theme }) => theme.colors.border};
    
    &:hover { 
      background-color: ${({ theme }) => theme.colors.border}; /* Tirado o '#e5e5e5' */
    }
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border}; /* Tirado o '#ccc' */
    color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
    border: none;
  }
`;

// ==========================================
// ESTILOS ADICIONADOS PARA O MODAL DE DETALHES
// ==========================================

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  /* Estilização sutil da barra de rolagem */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 15px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.danger || '#dc3545'}; /* Cor de fechar/erro */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.border};
    }
  }
`;

export const ModalSection = styled.div`
  margin-bottom: 25px;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.inputBg || '#f8f9fa'};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 15px;
    margin-top: 0;
    font-size: 1.1rem;
  }
`;

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

export const ModalLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight || '#666'};
  margin-bottom: 4px;
  display: block;
  font-weight: 600;
`;

export const ModalText = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  
  /* Classe auxiliar para textos longos como observações */
  &.box {
    display: block;
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 10px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin-top: 5px;
    line-height: 1.5;
  }
`;

/* Adicionado Header e ContentBox e Table básicos para não dar erro na página principal */
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h1 { color: ${({ theme }) => theme.colors.text}; }
`;

export const ContentBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;