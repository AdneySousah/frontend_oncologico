import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors?.background || '#f4f6f8'};
  padding: 20px;
  font-family: sans-serif;
`;

export const Card = styled.div`
  max-width: 600px;
  width: 100%;
  padding: ${({ isAlert }) => (isAlert ? '30px 20px' : '40px 20px')};
  text-align: center;
  background-color: ${({ theme, isAlert }) => isAlert ? '#f8d7da' : (theme.colors?.surface || '#ffffff')};
  border: 1px solid ${({ theme, isAlert }) => isAlert ? '#f5c6cb' : (theme.colors?.border || '#ccc')};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h2`
  margin-bottom: 1rem;
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'success': return '#28a745';
      case 'danger': return '#dc3545';
      case 'alert': return '#721c24';
      default: return theme.colors?.primary || '#0056b3';
    }
  }};
`;

export const Text = styled.p`
  font-size: ${({ large }) => (large ? '18px' : '16px')};
  line-height: 1.6;
  margin-top: ${({ mt }) => mt || '0'};
  margin-bottom: 1rem;
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'alert': return '#721c24';
      case 'muted': return theme.colors?.textLight || '#666';
      default: return theme.colors?.text || '#333';
    }
  }};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case 'success': return '#28a745';
      case 'danger': return '#dc3545';
      case 'secondary': return '#6c757d';
      default: return theme.colors?.primary || '#0056b3';
    }
  }};
  color: #ffffff;

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(0);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 18px;
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  background-color: ${({ theme }) => theme.colors?.background || '#f4f6f8'};
`;

/* ===== NOVOS COMPONENTES PARA O CHECKBOX E TERMOS ===== */

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 25px;
  margin-bottom: 5px;
  text-align: left;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors?.primary || '#0056b3'};
`;

export const CheckboxLabel = styled.label`
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.text || '#333'};
  cursor: pointer;
  user-select: none;
`;

export const TermLink = styled.a`
  color: ${({ theme }) => theme.colors?.primary || '#0056b3'};
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 14px;
  display: block;
  margin-top: 5px;
  font-weight: 600;
  min-height: 20px; /* Evita que a tela pule quando a mensagem aparece */
`;