import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { LuLock } from 'react-icons/lu';

const Wrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.textLight};
  }

  h1 {
    font-size: 1.25rem;
    margin: 0;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textLight};
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 0 ${({ theme }) => theme.space.md};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.headerText};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryHover};
    }

    &:focus-visible {
      outline: 3px solid ${({ theme }) => theme.colors.focus};
      outline-offset: 2px;
    }
  }
`;

// Tela exibida quando o perfil do usuário não tem acesso ao módulo da rota.
export default function SemAcesso() {
  return (
    <Wrapper role="alert">
      <LuLock size={40} aria-hidden="true" />
      <h1>Você não tem acesso a esta tela</h1>
      <p>Se precisar dela, peça ao administrador para liberar no seu perfil.</p>
      <Link to="/">Voltar ao início</Link>
    </Wrapper>
  );
}
