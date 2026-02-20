import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); z-index: 1000;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface}; 
  width: 100%; 
  max-width: 900px; // Um pouco mais largo
  height: 90vh; 
  border-radius: 12px; // Bordas mais arredondadas
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex; 
  flex-direction: column;
  overflow: hidden; // Garante que nada vaze
`;

export const ModalHeader = styled.div`
  padding: 1.5rem 2rem; 
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  display: flex; justify-content: space-between; align-items: center;

  h2 { 
    color: ${({ theme }) => theme.colors.text}; /* Alterado de sidebarMiddle para text */
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem; 
  overflow-y: auto; 
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg}; // Fundo cinza suave atrás dos cards
  
  /* Scrollbar bonita e adaptável ao tema */
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

// -- Inputs e Labels Globais --
export const Label = styled.label`
  display: block; 
  margin-bottom: 0.5rem; 
  color: ${({ theme }) => theme.colors.text}; /* Alterado de sidebarMiddle */
  font-weight: 600;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  width: 100%; 
  padding: 0.9rem 1rem; // Maior altura interna
  border: 1px solid ${({ theme }) => theme.colors.border}; 
  border-radius: 6px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Trocado de #fff */
  transition: all 0.2s;

  &:focus { 
    outline: none; 
    border-color: ${({ theme }) => theme.colors.primary}; 
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33; // Glow usando cor dinâmica com transparência (33 = ~20%)
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
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Trocado de white */
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`;

// -- Card da Pergunta --
export const QuestionCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0; // Padding removido aqui, controlado internamente
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;

  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* Aumentei um pouco o alpha para o dark mode */
  }
`;

export const QuestionHeader = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 60px 1fr 200px auto; // Numeracao | Texto | Tipo | Delete
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const QuestionNumber = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Trocado de backgroundAlt */
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
`;

// -- Área de Opções --
export const OptionsArea = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBg}; /* Trocado de #f8fafc que ficaria branco no dark mode */
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const OptionRow = styled.div`
  display: flex; 
  gap: 1rem; 
  align-items: center; 
  margin-bottom: 0.8rem;
  
  .input-label { flex: 1; } // Ocupa o espaço restante
  .input-score { width: 100px; text-align: center; } // Largura fixa para pontos
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
      background-color: rgba(255, 77, 79, 0.1); /* Transparência em vez de cor sólida */
    }
  }

  &.add-option { 
    background: transparent; 
    color: ${({ theme }) => theme.colors.primary}; 
    border: 1px dashed ${({ theme }) => theme.colors.primary}; 
    width: 100%;
    margin-top: 0.5rem;
    &:hover { background-color: ${({ theme }) => theme.colors.primary}1A; } /* Fundo primário com 10% opacidade */
  }

  &.add-question {
    background-color: ${({ theme }) => theme.colors.primary}; /* Trocado de sidebarMiddle para primary */
    color: #ffffff;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    &:hover { filter: brightness(0.9); }
  }
  
  &:hover { opacity: 0.9; }
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
`;