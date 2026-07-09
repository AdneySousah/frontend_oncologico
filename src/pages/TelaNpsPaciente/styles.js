import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f7f6;
  padding: 20px;
  font-family: 'Inter', sans-serif;
`;

export const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

export const Header = styled.div`
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
`;

export const Title = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
`;

export const Subtitle = styled.p`
  color: #555;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 30px;

  strong {
    color: #222;
  }
`;

export const ScoreGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
`;

// Lógica de cores baseada no padrão NPS:
// 0-6 Detratores (Vermelho) | 7-8 Neutros (Amarelo) | 9-10 Promotores (Verde)
const getScoreColor = (nota) => {
  if (nota <= 6) return '#e74c3c'; // Detratores 
  if (nota <= 8) return '#f39c12'; // Neutros (Usando um tom levemente mais alaranjado para contraste com o texto branco)
  return '#2ecc71'; // Promotores
};

export const ScoreButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => getScoreColor(props.nota)};
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    filter: brightness(0.9); /* Escurece levemente a cor no hover */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    filter: none;
    box-shadow: none;
  }

  @media (max-width: 400px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

export const Message = styled.h3`
  font-size: 1.8rem;
  color: ${(props) => (props.error ? '#e74c3c' : props.success ? '#2ecc71' : '#333')};
  margin-bottom: 15px;
`;

export const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #007bff;
  animation: ${spin} 1s linear infinite;
`;