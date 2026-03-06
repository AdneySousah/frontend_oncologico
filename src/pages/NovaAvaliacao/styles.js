import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 40px 20px; 
  transition: background-color 0.3s ease;
`;

export const SectionWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px; /* Limitando a largura para não esticar demais em telas ultrawide */
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
  gap: 15px; 
`;

export const InfoItem = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};

  strong {
    color: ${props => props.theme.colors.textLight}; 
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

/* === BLOCO DO FORMULÁRIO E PROGRESSO === */
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
  padding: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-bottom: 100px; /* Espaço para o FloatingScore não cobrir botões */

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const StepperHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 20px;

  .title-area {
    flex: 1;
    h3 { color: ${props => props.theme.colors.text}; margin-bottom: 10px; font-size: 1.6rem; }
    p { color: ${props => props.theme.colors.textLight}; font-size: 1.05rem; line-height: 1.4; }
  }

  .progress-area {
    min-width: 300px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    .progress-area { width: 100%; min-width: auto; }
  }
`;

export const ProgressText = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;

  span {
    color: ${props => props.theme.colors.textLight};
    font-size: 0.9rem;
    font-weight: normal;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 5px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background-color: ${props => props.progress === 100 ? '#2ecc71' : props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.4s ease, background-color 0.4s ease;
`;

export const CategoryTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: 1.3rem;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

export const QuestionCard = styled.div`
  background: ${props => props.isOrientacao ? (props.theme.colors.infoBg || '#f0f9fa') : props.theme.colors.inputBg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 25px;
  transition: border-color 0.2s;

  ${props => props.isOrientacao && css`
    border-left: 5px solid #17a2b8;
  `}

  &:hover {
    border-color: ${props => !props.isOrientacao && props.theme.colors.primary};
  }

  h4 {
    margin-bottom: 20px;
    color: ${props => props.theme.colors.text};
    font-size: 1.25rem;
    line-height: 1.5;
  }

  .options-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  label {
    background: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    padding: 15px;
    border-radius: 6px;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${props => props.theme.colors.inputBg};
    }

    /* Estilo aplicado quando o radio está checado */
    &.selected {
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.primary}10; /* Fundo com 10% de opacidade */
      font-weight: 600;
    }
  }

  input[type="radio"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
`;

export const OrientacaoText = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  color: #0c5460;
  font-size: 1.15rem;
  line-height: 1.6;
  font-weight: 500;

  svg {
    flex-shrink: 0;
    color: #17a2b8;
    margin-top: 2px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border-radius: 6px;
  font-size: 1.1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}33;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    gap: 15px;
    
    div { width: 100%; display: flex; flex-direction: column; gap: 10px; }
    button { width: 100%; margin: 0; }
  }
`;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? props.theme.colors.inputBg : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? props.theme.colors.text : '#fff'};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};
  padding: 14px 28px;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
  }

  &.btn-next {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }

  &.btn-success {
    background-color: #2ecc71;
    color: white;
  }
`;

export const ButtonCancel = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.danger};
  border: 1px solid ${props => props.theme.colors.danger};

  &:hover {
    background-color: ${props => props.theme.colors.danger}15;
  }
`;

/* === MODAL E PONTUAÇÃO FLUTUANTE === */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 850px;
  width: 90%;
  border: 1px solid ${props => props.theme.colors.border};
`;

const strokeAnimation = keyframes`
  100% { stroke-dashoffset: 0; }
`;

export const SuccessCheck = styled.svg`
  width: 80px; height: 80px; display: block; stroke-width: 4; stroke: #2ecc71; 
  margin: 0 auto 20px auto; fill: none;

  .check-path {
    stroke-dasharray: 48; stroke-dashoffset: 48;
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
    color: #ffd700; 
  }

  @media (max-width: 768px) {
    bottom: 20px; right: 20px; font-size: 1rem; padding: 12px 20px;
    span { font-size: 1.3rem; }
  }
`;