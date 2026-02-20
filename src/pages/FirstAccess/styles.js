import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.modernBg};
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const ThemeToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => theme.colors.modernCardBg};
  border: 1px solid ${({ theme }) => theme.colors.modernCardBorder};
  color: ${({ theme }) => theme.colors.modernText};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  box-shadow: ${({ theme }) => theme.colors.modernCardShadow};

  &:hover {
    transform: translateY(-2px);
  }
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.modernCardBg};
  border: 1px solid ${({ theme }) => theme.colors.modernCardBorder};
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.colors.modernCardShadow};
  padding: 40px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: ${fadeIn} 0.6s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TopIconContainer = styled.div`
  width: 56px;
  height: 56px;
  background: ${({ theme }) => theme.colors.modernIconBg};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme }) => theme.colors.danger}; /* Destaca o ícone como ação necessária */
  }
`;

export const HeaderBrand = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.modernText};
  margin-bottom: 30px;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.modernTextLight};
    margin-top: 8px;
    line-height: 1.4;
  }
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.modernTextLight};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 14px 14px 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.modernInputBorder};
  background-color: ${({ theme }) => theme.colors.modernInputBg};
  color: ${({ theme }) => theme.colors.modernInputText};
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.modernTextLight}40;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.modernTextLight};
    font-weight: 400;
  }
`;

export const Divider = styled.div`
  width: 100%;
  margin: 4px 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.modernCardBorder};
`;

/* --- ESTILOS ESPECÍFICOS PARA A BARRA DE FORÇA DA SENHA --- */

export const StrengthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: -8px;
  margin-bottom: 4px;
  padding: 0 4px;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const StrengthBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.modernCardBorder};
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    /* A largura da barra é proporcional ao score (max 5) */
    width: ${({ score }) => (score / 5) * 100}%;
    background-color: ${({ color }) => color};
    transition: all 0.3s ease-out;
    border-radius: 4px;
  }
`;

export const StrengthLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.modernTextLight};
  text-align: right;
  
  strong {
    color: ${({ color }) => color};
    transition: color 0.3s ease-out;
  }
`;

/* -------------------------------------------------------- */

export const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 8px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.modernButtonBg};
  color: ${({ theme }) => theme.colors.modernButtonText};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s, opacity 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.modernButtonHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;