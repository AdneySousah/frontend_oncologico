import styled from 'styled-components';
import { colors } from '../../../themes/theme';

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); z-index: 1000;
  display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);
`;

export const ModalContainer = styled.div`
  background: ${colors.surface}; width: 100%; max-width: 450px; padding: 2rem;
  border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  h2 { color: ${colors.primaryDark}; margin-bottom: 1.5rem; border-bottom: 1px solid ${colors.border}; padding-bottom: 0.5rem;}
`;

export const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;
  label { font-size: 0.9rem; color: ${colors.textLight}; font-weight: 500; }
  input {
    padding: 0.8rem; border: 1px solid ${colors.border}; border-radius: 4px; font-size: 1rem;
    &:focus { border-color: ${colors.primary}; outline: none; }
  }
`;

export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem;
  button {
    padding: 0.8rem 1.5rem; border-radius: 4px; border: none; cursor: pointer; font-weight: bold;
    &.cancel { background: ${colors.backgroundAlt}; color: ${colors.textLight}; }
    &.save { background: ${colors.primary}; color: ${colors.white}; }
  }
`;