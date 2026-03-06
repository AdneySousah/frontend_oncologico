import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
  padding: 1rem;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
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

/* --- NOVOS ESTILOS PARA OS DADOS DO PACIENTE --- */
export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;

  &.col-2 {
    grid-template-columns: 1fr 2fr;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: 15px;
  }

  &.border-top {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: 15px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.8rem;
    font-weight: 600;
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    margin: 0;
  }
`;

/* --- NOVOS ESTILOS PARA LISTAS (Medicamentos, Anexos, etc) --- */
export const NestedContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface}; /* Usando surface ao invés de branco */
`;

export const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const FlexRowEnd = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: ${props => props.mb || '0'};
`;

export const ItemCard = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg};
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
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
  flex: ${props => props.flex || 'initial'};
  margin: ${props => props.margin || '0 0 1rem 0'};

  label {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }

  input, select, textarea {
    padding: 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textLight};
      opacity: 0.7;
    }

    &:read-only, &:disabled {
      background-color: ${({ theme }) => theme.colors.surface}; /* Ajuste para dark mode */
      color: ${({ theme }) => theme.colors.textLight};
      cursor: not-allowed;
      opacity: 0.8;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 45px;
  padding: 0 15px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &.danger-outline {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.danger || '#dc3545'};
    border: 1px solid ${({ theme }) => theme.colors.danger || '#dc3545'};
    &:hover {
      background-color: ${({ theme }) => theme.colors.danger || '#dc3545'}1A;
    }
  }

  &.danger {
    background-color: ${({ theme }) => theme.colors.danger || '#dc3545'};
    color: #fff;
    border: none;
    height: 40px;
    &:hover { filter: brightness(0.9); }
  }

  &.primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border: none;
    width: fit-content;
    padding: 10px 15px;
    &:hover { filter: brightness(0.9); }
  }

  &.success {
    background-color: ${({ theme }) => theme.colors.success || '#28a745'};
    color: #fff;
    border: none;
    width: fit-content;
    padding: 10px 15px;
    margin-top: 10px;
    height: auto;
    &:hover { filter: brightness(0.9); }
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
    background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    
    &:hover { 
      background-color: ${({ theme }) => theme.colors.border};
    }
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
    border: none;
  }
`;

// ==========================================
// ESTILOS PARA O MODAL DE DETALHES 
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
    color: ${({ theme }) => theme.colors.danger || '#dc3545'};
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
  
  &.box {
    display: block;
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 10px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin-top: 5px;
    line-height: 1.5;
    min-height: 40px; /* Adicionado para garantir o tamanho visual do textarea no modal */
  }
`;

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

// ==========================================
// NOVOS ESTILOS PARA SUBSTITUIR OS INLINES NO MODAL
// ==========================================

export const ModalBlock = styled.div`
  margin-top: ${props => props.mt || '0'};
  margin-bottom: ${props => props.mb || '0'};
`;

export const ModalList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: ${props => props.mt || '0'};
`;

export const ModalListItem = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  gap: ${props => props.gap || '0'};
  align-items: ${props => props.align || 'flex-start'};
  justify-content: ${props => props.justify || 'flex-start'};
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#ddd'};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.surface || '#f8f9fa'};
`;

export const ModalItemTextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalItemTitle = styled.strong`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text || '#333'};
`;

export const ModalItemSubtitle = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight || '#666'};
`;

export const ModalDownloadLink = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${({ theme }) => theme.colors.primary || '#007bff'};
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;