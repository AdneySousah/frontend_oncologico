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

/* Novo estilo para a Logo inserida */
export const Logo = styled.img`
  width: 100%;
  max-width: 240px; /* Ajuste este valor conforme a necessidade do tamanho da sua logo */
  height: auto;
  margin-bottom: 24px;
  object-fit: contain;
`;

/* Mantive o TopIconContainer caso você use em outro lugar, mas ele não será mais usado no login/senha */
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
    color: ${({ theme }) => theme.colors.modernIconColor};
  }
`;

export const HeaderBrand = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.modernText};
  margin-bottom: 30px;

  h1 {
    font-size: 1.75rem;
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

export const ForgotPassword = styled.div`
  display: flex;
  justify-content: flex-end;

  a {
    color: ${({ theme }) => theme.colors.modernText};
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
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
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.modernButtonHover};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.modernTextLight};
  font-size: 0.85rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px dotted ${({ theme }) => theme.colors.modernCardBorder};
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

export const FooterLinks = styled.div`
  margin-top: 20px;
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.modernText};
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorMessage = styled.div`
  width: 100%;
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ef9a9a;
  margin-bottom: 16px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.modernTextLight};
    transition: color 0.2s;
  }

  &:hover svg {
    color: ${({ theme }) => theme.colors.modernText};
  }
`;

export const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
  margin-bottom: 8px;
`;

export const RememberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  input[type="checkbox"] {
    cursor: pointer;
    width: 14px;
    height: 14px;
    accent-color: ${({ theme }) => theme.colors.modernButtonBg};
  }

  label {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.modernText};
    font-size: 0.85rem;
    font-weight: 500;
  }
`;

export const StrengthContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: -8px;
  margin-bottom: 8px;
  padding: 0 4px;
`;

export const StrengthBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.modernInputBorder};
  border-radius: 4px;
  overflow: hidden;
`;

export const StrengthFill = styled.div`
  height: 100%;
  /* Calcula a largura baseada na nota de 0 a 5 (cada ponto vale 20%) */
  width: ${({ $strength }) => ($strength / 5) * 100}%;
  
  /* Define as cores com base na pontuação */
  background-color: ${({ $strength }) => {
    if ($strength <= 2) return '#ef4444'; // Vermelho (Fraca)
    if ($strength === 3) return '#f59e0b'; // Laranja (Razoável)
    if ($strength === 4) return '#84cc16'; // Verde claro (Boa)
    return '#22c55e'; // Verde escuro (Forte)
  }};
  
  transition: all 0.3s ease-in-out;
`;

export const StrengthText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.modernTextLight};
  text-align: right;

  strong {
    color: ${({ $strength }) => {
      if ($strength <= 2) return '#ef4444'; 
      if ($strength === 3) return '#f59e0b'; 
      if ($strength === 4) return '#84cc16'; 
      return '#22c55e'; 
    }};
  }
`;