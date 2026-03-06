import styled, { css } from 'styled-components';

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); z-index: 1000;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface}; 
  width: 100%; 
  max-width: 1000px; /* Alargado um pouco para caber as 3 colunas confortavelmente */
  height: 90vh; 
  border-radius: 12px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex; 
  flex-direction: column;
  overflow: hidden; 
`;

export const ModalHeader = styled.div`
  padding: 1.5rem 2rem; 
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  display: flex; justify-content: space-between; align-items: center;

  h2 { 
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem; 
  overflow-y: auto; 
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg}; 
  
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: ${({ theme }) => theme.colors.border}; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background-color: ${({ theme }) => theme.colors.textLight}; }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem 2rem; 
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex; 
  justify-content: flex-end; 
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
`;

// -- Inputs e Labels Globais --
export const Label = styled.label`
  display: block; 
  margin-bottom: 0.5rem; 
  color: ${({ theme }) => theme.colors.text}; 
  font-weight: 600;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  width: 100%; 
  padding: 0.9rem 1rem; 
  border: 1px solid ${({ theme }) => theme.colors.border}; 
  border-radius: 6px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.inputBg}; 
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
`;

export const Textarea = styled.textarea`
  width: 100%; 
  padding: 0.9rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border}; 
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  &:focus { 
    outline: none; 
    border-color: ${({ theme }) => theme.colors.primary}; 
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33; 
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem; 
  border: 1px solid ${({ theme }) => theme.colors.border}; 
  border-radius: 6px; 
  background-color: ${({ theme }) => theme.colors.inputBg}; 
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`;

// -- Card da Pergunta --
export const QuestionCard = styled.div`
  position: relative; /* Mantém a lixeira posicionada relativa ao card */
  background-color: ${({ theme, isOrientacao }) => 
    isOrientacao ? (theme.colors.infoBg || '#f0f9fa') : theme.colors.surface
  };
  padding: 0; 
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  /* Borda lateral azul se for orientação */
  ${({ isOrientacao }) => isOrientacao && css`
    border-left: 4px solid #17a2b8;
  `}

  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
  }
`;

export const QuestionHeader = styled.div`
  padding: 1.5rem;
  padding-right: 40px; /* Espaço para não encavalar o texto na lixeira */
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-start;
`;

export const QuestionNumber = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg}; 
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0; /* Impede que o número diminua */
  margin-top: 5px; /* Alinha com os inputs */
`;

/* Wrappers para os blocos dentro do Header (Substituindo os flex inline) */
export const QuestionCategoryWrapper = styled.div`
  flex: 1 1 200px;
`;

export const QuestionTypeWrapper = styled.div`
  flex: 1 1 200px;
`;

export const QuestionTextWrapper = styled.div`
  width: 100%;
  margin-top: 5px;
`;

export const DeleteButtonWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;

export const FormSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 { color: ${({ theme }) => theme.colors.text}; }
  small { color: ${({ theme }) => theme.colors.textLight}; }
`;

// -- Área de Opções --
export const OptionsArea = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg}; 
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const OptionRow = styled.div`
  display: flex; 
  gap: 1rem; 
  align-items: center; 
  margin-bottom: 0.8rem;
  
  .input-label { flex: 1; } 
  .input-score { width: 100px; text-align: center; } 
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem; 
  border-radius: 6px; 
  border: none; 
  cursor: pointer; 
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s, background-color 0.2s;
  
  &.primary { 
    background-color: ${({ theme }) => theme.colors.primary}; 
    color: #ffffff; 
  }
  
  &.secondary { 
    background-color: ${({ theme }) => theme.colors.inputBg}; 
    color: ${({ theme }) => theme.colors.text}; 
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  &.danger-icon { 
    background: transparent; 
    color: ${({ theme }) => theme.colors.textLight};
    padding: 0.5rem;
    &:hover { 
      color: ${({ theme }) => theme.colors.danger || '#ff4d4f'}; 
      background-color: rgba(255, 77, 79, 0.1); 
    }
  }

  &.add-option { 
    background: transparent; 
    color: ${({ theme }) => theme.colors.primary}; 
    border: 1px dashed ${({ theme }) => theme.colors.primary}; 
    width: 100%;
    margin-top: 0.5rem;
    &:hover { background-color: ${({ theme }) => theme.colors.primary}1A; } 
  }

  &.add-question {
    background-color: ${({ theme }) => theme.colors.primary}; 
    color: #ffffff;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    &:hover { filter: brightness(0.9); }
  }
  
  &:hover { opacity: 0.9; }
`;