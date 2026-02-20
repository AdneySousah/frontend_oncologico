import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 40px 20px; /* Mais respiro no topo e laterais */
  transition: background-color 0.3s ease;
`;

// Componente para alinhar tudo no centro, evitando que fique esticado
export const SectionWrapper = styled.div`
  
  margin: 0 auto;
  width: 100%;
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding-bottom: 10px;
`;

export const AlertBox = styled.div`
  background-color: rgba(217, 83, 79, 0.1);
  border: 2px solid ${props => props.theme.colors.danger};
  color: ${props => props.theme.colors.danger};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.1rem;
`;

/* === BLOCO DO RESUMO DA ENTREVISTA === */

export const SummaryCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 35px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
`;

export const SummaryHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 1.4rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding-bottom: 15px;
  margin-bottom: 25px;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espaçamento entre as linhas */
`;

export const InfoItem = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};

  strong {
    color: ${props => props.theme.colors.textLight}; /* Deixa o label (ex: "Paciente:") mais suave que o dado */
    font-weight: 600;
    margin-right: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

export const SummaryDivider = styled.hr`
  border: 0;
  border-top: 1px dashed ${props => props.theme.colors.border};
  margin: 25px 0;
`;

export const ObservationBox = styled.div`
  background: ${props => props.theme.colors.inputBg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 18px;
  border-radius: 6px;
  font-style: italic;
  font-size: 1.05rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin-top: 10px;
`;

export const ListStyled = styled.ul`
  margin-top: 8px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 1.05rem;
  
  li {
    color: ${props => props.theme.colors.text};
  }

  .obs {
    font-size: 0.95rem;
    color: ${props => props.theme.colors.textLight};
    font-style: italic;
  }
`;

/* === FIM DO BLOCO DE RESUMO === */

export const Select = styled.select`
  width: 100%;
  padding: 14px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.inputBg};
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  margin-top: 8px;
  cursor: pointer;
`;

export const Form = styled.form`
  margin-top: 30px;
  background: ${props => props.theme.colors.surface};
  padding: 30px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);

  h3 { color: ${props => props.theme.colors.text}; margin-bottom: 10px; font-size: 1.5rem; }
  p { color: ${props => props.theme.colors.textLight}; font-size: 1.1rem; }
`;

export const QuestionCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 25px;
  border-radius: 6px;
  margin-bottom: 25px;

  h4 {
    margin-bottom: 15px;
    color: ${props => props.theme.colors.text};
    font-size: 1.2rem;
    line-height: 1.5;
  }

  label {
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    font-size: 1.1rem;
    cursor: pointer;
  }

  input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.inputBg};
  color: ${props => props.theme.colors.text};
  border-radius: 6px;
  font-size: 1.1rem;

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#555' : props.theme.colors.primary};
  color: #fff;
  border: none;
  padding: 14px 28px;
  margin-right: 10px;
  margin-top: 10px;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bold;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.2);
  }
`;

export const ButtonCancel = styled(Button)`
  background-color: ${props => props.theme.colors.danger};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  border: 1px solid ${props => props.theme.colors.border};
`;

const strokeAnimation = keyframes`
  100% { stroke-dashoffset: 0; }
`;

export const SuccessCheck = styled.svg`
  width: 80px;
  height: 80px;
  display: block;
  stroke-width: 4;
  stroke: #2ecc71; 
  margin: 0 auto 20px auto;
  fill: none;

  .check-path {
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: ${strokeAnimation} 0.5s ease forwards;
  }
`;

export const FloatingScore = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 1000;
  transition: transform 0.2s, background-color 0.2s;
  cursor: default;

  /* Efeito de pulso quando a pontuação muda (opcional, pode ser controlado por classe) */
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  svg {
    background: rgba(255, 255, 255, 0.2);
    padding: 6px;
    border-radius: 50%;
  }

  span {
    font-size: 1.6rem;
    color: #ffd700; /* Dourado para destacar a pontuação */
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    font-size: 1rem;
    padding: 12px 20px;

    span {
      font-size: 1.3rem;
    }
  }
`;