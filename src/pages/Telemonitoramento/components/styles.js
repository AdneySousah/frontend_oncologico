import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 999;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface}; 
  color: ${props => props.theme.colors.text};
  padding: 40px; 
  border-radius: 12px; 
  max-width: 900px; 
  width: 90%;
  max-height: 90vh; 
  overflow-y: auto; 
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 { 
    margin-bottom: 20px; 
    border-bottom: 1px solid ${props => props.theme.colors.border}; 
    padding-bottom: 10px; 
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px; 
  text-align: left;
  label { 
    display: block; 
    margin-bottom: 8px; 
    font-weight: bold; 
    color: ${props => props.theme.colors.text}; 
  }
`;

export const Input = styled.input`
  width: 100%; 
  padding: 12px; 
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.inputBg}; 
  color: ${props => props.theme.colors.text};
  border-radius: 6px; 
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }
`;

export const ButtonGroup = styled.div` 
  display: flex; 
  gap: 10px; 
  justify-content: flex-end; 
  margin-top: 30px; 
`;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#555' : props.theme.colors.primary};
  color: #fff; 
  border: none; 
  padding: 12px 24px; 
  border-radius: 6px; 
  font-size: 1rem; 
  cursor: pointer; 
  font-weight: bold;
  transition: filter 0.2s;
  
  &:hover { filter: brightness(1.2); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

export const InfoBox = styled.div`
  margin-bottom: 25px; 
  padding: 15px; 
  background-color: ${props => props.theme.colors.inputBg}; 
  border-radius: 8px; 
  border: 1px solid ${props => props.theme.colors.border};
  
  p {
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  .sub-text {
    font-size: 0.9em;
    opacity: 0.7; 
  }
`;

export const ProjectedStockBox = styled.div`
  padding: 12px; 
  background-color: ${props => props.theme.colors.surface}; 
  border-left: 4px solid ${props => props.theme.colors.primary}; 
  border-radius: 4px; 
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  p {
    margin: 0;
    color: ${props => props.theme.colors.text};
  }

  .destaque {
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 15px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.inputBg};

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: normal;
    cursor: pointer;
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-size: 0.95rem;
  }
`;

export const NpsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;

  h3 {
    border-bottom: none;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 25px;
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text};
    opacity: 0.9;
  }
`;

export const PulseText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  animation: pulse 1.5s infinite;
  margin: 30px 0;

  @keyframes pulse {
    0% { opacity: 0.5; transform: scale(0.98); }
    50% { opacity: 1; transform: scale(1.02); }
    100% { opacity: 0.5; transform: scale(0.98); }
  }
`;

export const NpsScoreDisplay = styled.div`
  font-size: 5rem;
  font-weight: bold;
  margin: 20px 0;
  color: ${props => {
    if (props.score >= 9) return '#28a745'; 
    if (props.score >= 7) return '#ffc107'; 
    return '#dc3545'; 
  }};
  text-shadow: 0px 4px 10px rgba(0,0,0,0.1);
`;

export const PreMonitoramentoTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 25px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding-bottom: 15px;
`;

export const SkeletonLoader = styled.div`
  background: linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite linear;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${props => props.theme.colors.border};

  @keyframes pulse {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .text-line {
    height: 12px;
    background: rgba(0,0,0,0.06);
    border-radius: 4px;
    margin-bottom: 10px;
    width: 100%;
  }
  .text-line.short { width: 60%; }
`;

export const ModalLayoutWrapper = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1450px;
  width: 95%;
  margin: 20px auto;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 1150px) {
    flex-direction: column;
    align-items: center;
  }

  .left-column, .right-column {
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-shrink: 0;

    @media (max-width: 1150px) {
      width: 100%;
      max-width: 750px;
    }
  }

  .center-column {
    flex: 1;
    width: 100%;
    max-width: 750px;
  }
`;

export const PosologiaChangeAlert = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 0.9em;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* NOVO: Componente para destacar o form de mudança de posologia e alinhar os inputs */
export const HighlightedSection = styled.div`
  background-color: ${props => props.theme.colors.surface === '#121212' ? '#1e1e1e' : '#f8f9fa'};
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Sombra em volta */
  margin-bottom: 25px;

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    margin: 0;
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin: 0;
    }

    strong {
      font-size: 1.05rem;
      color: ${props => props.theme.colors.text};
      line-height: 1.3;
    }
  }

  .inputs-row {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    align-items: flex-end; /* ALINHAMENTO MÁGICO PELA BASE DOS INPUTS */

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: stretch;
      gap: 15px;
    }

    .input-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      label {
        font-size: 0.85em;
        color: ${props => props.theme.colors.text};
        opacity: 0.8;
        margin-bottom: 8px;
        line-height: 1.4;
      }
    }
  }
`;