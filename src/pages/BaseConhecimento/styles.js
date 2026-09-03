import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 40px);
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const TopicNav = styled.nav`
  width: 280px;
  flex-shrink: 0;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;
  padding: 20px 0;
`;

export const NavHeader = styled.div`
  padding: 0 20px 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 12px;

  h2 {
    margin: 0 0 4px 0;
    font-size: 1.15rem;
    color: ${props => props.theme.colors.text};
  }
  p {
    margin: 0;
    font-size: 0.8rem;
    color: ${props => props.theme.colors.textLight};
  }
`;

export const GroupLabel = styled.div`
  padding: 14px 20px 6px 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.theme.colors.textLight};
`;

export const TopicButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: ${props => props.$active ? `${props.theme.colors.primary}18` : 'transparent'};
  border: none;
  border-left: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.$active ? 700 : 500};
  font-size: 0.88rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.$pronto ? '#5cb85c' : '#f0ad4e'};
    flex-shrink: 0;
    margin-left: auto;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  background: ${props => props.theme.colors.background};
`;

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;

  .icon-badge {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$cor}20;
    color: ${props => props.$cor};
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text};
  }
`;

export const ContentResumo = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.95rem;
  margin: 6px 0 28px 0;
  max-width: 720px;
  line-height: 1.5;
`;

export const Secao = styled.section`
  max-width: 760px;
  margin-bottom: 28px;

  h3 {
    font-size: 1.05rem;
    color: ${props => props.theme.colors.text};
    margin: 0 0 10px 0;
  }

  p {
    color: ${props => props.theme.colors.text};
    line-height: 1.65;
    font-size: 0.92rem;
    margin: 0;
  }
`;

export const ListaItens = styled.ul`
  margin: 0;
  padding-left: 20px;
  li {
    color: ${props => props.theme.colors.text};
    line-height: 1.7;
    font-size: 0.92rem;
    margin-bottom: 6px;
  }
`;

export const PassosLista = styled.ol`
  margin: 0;
  padding-left: 20px;
  li {
    color: ${props => props.theme.colors.text};
    line-height: 1.7;
    font-size: 0.92rem;
    margin-bottom: 10px;
    padding-left: 4px;
  }
`;

export const CalloutBox = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 8px;
  background: ${props => props.$tipo === 'atencao' ? '#f0ad4e15' : '#5bc0de15'};
  border-left: 4px solid ${props => props.$tipo === 'atencao' ? '#f0ad4e' : '#5bc0de'};

  .icon {
    flex-shrink: 0;
    color: ${props => props.$tipo === 'atencao' ? '#f0ad4e' : '#5bc0de'};
    margin-top: 2px;
  }

  h3 {
    font-size: 0.95rem;
    margin: 0 0 6px 0;
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
  }
`;

export const EmConstrucaoBox = styled.div`
  max-width: 600px;
  padding: 28px;
  border-radius: 10px;
  border: 1px dashed ${props => props.theme.colors.border};
  text-align: center;
  color: ${props => props.theme.colors.textLight};

  svg { margin-bottom: 12px; opacity: 0.5; }
  p { margin: 0; font-size: 0.9rem; line-height: 1.6; }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 20px 8px 20px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.inputBg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;

  input {
    border: none;
    background: transparent;
    outline: none;
    color: ${props => props.theme.colors.text};
    font-size: 0.85rem;
    width: 100%;
  }

  svg { color: ${props => props.theme.colors.textLight}; flex-shrink: 0; }
`;
