import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;

  h2 { margin: 0 0 6px 0; }
  p { margin: 0; opacity: 0.75; font-size: 0.9rem; max-width: 640px; }
`;

export const SearchInput = styled.input`
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.inputBg};
  color: ${props => props.theme.colors.text};
  min-width: 260px;
  font-size: 0.9rem;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 12px 14px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    background: ${props => props.theme.colors.surfaceAlt || props.theme.colors.surface};
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    opacity: 0.7;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(0,0,0,0.02); }
`;

export const ActionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover { filter: brightness(1.1); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  padding: 28px;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  border: 1px solid ${props => props.theme.colors.border};

  h3 {
    margin: 0 0 6px 0;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.85rem;
  }

  span.hint {
    display: block;
    font-size: 0.78rem;
    opacity: 0.65;
    margin-top: 4px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.inputBg};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
`;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? props.theme.colors.text : '#fff'};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { filter: brightness(1.1); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  opacity: 0.65;
`;
