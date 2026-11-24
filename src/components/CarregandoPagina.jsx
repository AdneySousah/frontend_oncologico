import styled, { keyframes } from 'styled-components';

const girar = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;

  span.spinner {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.primary};
    animation: ${girar} 0.8s linear infinite;
  }
`;

// Exibido enquanto o código de uma página é baixado (rotas carregadas sob demanda).
export default function CarregandoPagina() {
  return (
    <Wrapper role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      Carregando…
    </Wrapper>
  );
}
