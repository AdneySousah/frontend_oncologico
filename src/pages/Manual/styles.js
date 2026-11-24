import styled from 'styled-components';
import { media } from '../../themes/theme';

export const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text};

  ${media.md} {
    padding: 24px;
  }
`;

export const Header = styled.header`
  margin-bottom: 16px;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.25;
    display: flex;
    align-items: center;
    gap: 10px;

    svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; }
  }

  p {
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.95rem;
    max-width: 65ch;
  }

  ${media.md} {
    h1 { font-size: 1.75rem; }
  }
`;

export const SearchBox = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 16px;
  max-width: 560px;

  svg.lupa {
    position: absolute;
    left: 14px;
    color: ${({ theme }) => theme.colors.textLight};
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 48px;
    padding: 0 44px;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;

    &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }
    &::-webkit-search-cancel-button { display: none; }
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus}; }
  }

  button {
    position: absolute;
    right: 6px;
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    border-radius: ${({ theme }) => theme.radius.sm};
    color: ${({ theme }) => theme.colors.textLight};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;

  ${media.lg} {
    grid-template-columns: 280px minmax(0, 1fr);
    align-items: start;
  }
`;

/* Índice lateral: no celular vira a lista principal (quando nenhum tópico está aberto) */
export const Index = styled.nav`
  display: ${({ $hiddenOnMobile }) => ($hiddenOnMobile ? 'none' : 'block')};

  ${media.lg} {
    display: block;
    position: sticky;
    top: 24px;
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    padding-right: 4px;
  }

  h2 {
    font-size: 0.8rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textLight};
    margin: 20px 0 8px;
    padding-left: 4px;

    &:first-child { margin-top: 0; }
  }

  > div + div { margin-top: 20px; }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

export const IndexItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  min-height: 48px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : theme.colors.surface)};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 0.95rem;
  transition: border-color 0.15s, background 0.15s;

  .icone {
    width: 34px;
    height: 34px;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .textos { min-width: 0; flex: 1; }
  strong { display: block; font-weight: 600; }
  small {
    display: block;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.8rem;
    line-height: 1.35;
    margin-top: 2px;
  }
  .seta { color: ${({ theme }) => theme.colors.textLight}; flex-shrink: 0; }

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  ${media.lg} {
    min-height: 40px;
    padding: 8px 10px;
    border-color: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
    background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : 'transparent')};
    small, .seta { display: none; }
    .icone { width: 28px; height: 28px; }
    strong { font-weight: ${({ $active }) => ($active ? 600 : 500)}; }
  }
`;

export const Article = styled.article`
  display: ${({ $hiddenOnMobile }) => ($hiddenOnMobile ? 'none' : 'block')};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px 16px;
  min-width: 0;

  ${media.md} { padding: 28px 32px; }
  ${media.lg} { display: block; }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  margin-bottom: 12px;
  padding: 0 4px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;

  ${media.lg} { display: none; }
`;

export const TopicHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .titulo {
    display: flex;
    align-items: center;
    gap: 12px;

    .icone {
      width: 44px;
      height: 44px;
      border-radius: ${({ theme }) => theme.radius.md};
      background: ${({ theme }) => theme.colors.primary};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    h2 { font-size: 1.35rem; font-weight: 700; line-height: 1.25; }
  }

  .resumo {
    color: ${({ theme }) => theme.colors.textLight};
    max-width: 70ch;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.8rem;
`;

export const OpenScreenButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover { background: ${({ theme }) => theme.colors.primaryLight}; }
`;

export const Block = styled.section`
  margin-top: 22px;
  max-width: 75ch;

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p { line-height: 1.65; }

  ul, ol {
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  ul li {
    position: relative;
    padding-left: 20px;
    line-height: 1.6;

    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 0.65em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  ol { counter-reset: passo; }
  ol li {
    counter-increment: passo;
    position: relative;
    padding-left: 40px;
    min-height: 28px;
    line-height: 1.6;

    &::before {
      content: counter(passo);
      position: absolute;
      left: 0;
      top: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.primaryLight};
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  strong { font-weight: 600; }
`;

export const Callout = styled.aside`
  margin-top: 22px;
  max-width: 75ch;
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border-left: 4px solid ${({ theme, $tipo }) => ($tipo === 'atencao' ? theme.colors.warning : theme.colors.info)};
  background: ${({ theme, $tipo }) => ($tipo === 'atencao' ? theme.colors.warningLight : theme.colors.infoLight)};

  > svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${({ theme, $tipo }) => ($tipo === 'atencao' ? theme.colors.warning : theme.colors.info)};
  }

  h3 { font-size: 0.98rem; font-weight: 600; margin-bottom: 4px; }
  p { line-height: 1.6; font-size: 0.95rem; }
  strong { font-weight: 600; }
`;

export const Faq = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  details {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surfaceAlt};

    &[open] summary svg { transform: rotate(180deg); }
  }

  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 48px;
    padding: 10px 14px;
    font-weight: 600;
    line-height: 1.4;

    &::-webkit-details-marker { display: none; }
    svg { flex-shrink: 0; transition: transform 0.2s; color: ${({ theme }) => theme.colors.textLight}; }
  }

  details p {
    padding: 0 14px 14px;
    line-height: 1.6;
  }
`;

export const Pager = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  button {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 56px;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    text-align: left;
    min-width: 0;

    span { font-size: 0.75rem; color: ${({ theme }) => theme.colors.textLight}; display: flex; align-items: center; gap: 4px; }
    strong { font-size: 0.9rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    &.proximo { text-align: right; align-items: flex-end; grid-column: 2; }
    &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
  }
`;

export const Empty = styled.p`
  padding: 24px 4px;
  color: ${({ theme }) => theme.colors.textLight};
`;
