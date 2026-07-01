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
  padding: 40px 20px;
  text-align: left;
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors?.primary || '#0056b3'};
`;

export const Text = styled.p`
  font-size: ${({ large }) => (large ? '18px' : '16px')};
  line-height: 1.6;
  margin-top: ${({ mt }) => mt || '0'};
  margin-bottom: 1rem;
  color: ${({ variant, theme }) => {
    if (variant === 'muted') return theme.colors?.textLight || '#666';
    return theme.colors?.text || '#333';
  }};
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

/* ===== AQUI ESTÁ O BUTTON QUE ESTAVA FALTANDO ===== */
export const Button = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case 'success': return '#28a745';
      case 'danger': return '#dc3545';
      case 'secondary': return '#6c757d';
      case 'primary': 
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

/* ===== COMPONENTES DE TABELA ===== */

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  text-align: left;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const Th = styled.th`
  padding: 12px 15px;
  background-color: ${({ theme }) => theme.colors?.background || '#f4f6f8'};
  color: ${({ theme }) => theme.colors?.textLight || '#555'};
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
`;

export const Td = styled.td`
  padding: 15px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.text || '#333'};
  vertical-align: middle;
`;