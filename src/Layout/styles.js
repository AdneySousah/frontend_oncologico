import styled from "styled-components";
import { media } from "../themes/theme";

// Layout mobile first: no celular a sidebar vira gaveta e aparece um cabeçalho fixo.
export const Container = styled.div`
  display: flex;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MobileHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 12px;
  padding-top: calc(8px + env(safe-area-inset-top));
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  z-index: 90;
  flex-shrink: 0;

  img {
    height: 28px;
    width: auto;
  }

  h1 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${media.md} {
    display: none;
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  flex-shrink: 0;

  &:active {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const ContainerOutlet = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 12px 12px calc(96px + env(safe-area-inset-bottom));

  ${media.md} {
    padding: 0;
  }
`;

// ==========================================================
// Botões flutuantes (chat e caixa de notificações)
// ==========================================================
export const FloatingStack = styled.div`
  position: fixed;
  right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;

  > * { pointer-events: auto; }

  ${media.md} {
    right: 28px;
    bottom: 28px;
  }
`;

export const FabWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .tooltip {
    position: absolute;
    right: calc(100% + 12px);
    background-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.surface};
    padding: 6px 12px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transform: translateX(6px);
    transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
    pointer-events: none;
  }

  ${media.md} {
    &:hover .tooltip,
    &:focus-within .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }
  }
`;

export const Fab = styled.button`
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: #ffffff;
  background-color: ${({ theme, $variant }) =>
    $variant === "mail" ? theme.colors.accent : theme.colors.whatsapp};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover { filter: brightness(1.08); }
  &:active { transform: scale(0.94); }

  ${media.md} {
    width: 58px;
    height: 58px;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background-color: ${({ theme }) => theme.colors.danger};
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.surface};
`;

export const MailboxPanel = styled.div`
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(84px + env(safe-area-inset-bottom));
  max-height: min(70vh, 480px);
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1001;

  ${media.md} {
    left: auto;
    right: 28px;
    bottom: 100px;
    width: 360px;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.accent};
    color: #fff;

    h2 {
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${({ theme }) => theme.radius.sm};
    }
  }

  ul {
    list-style: none;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export const MailboxItem = styled.li`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 4px 0 10px;
    font-size: 0.82rem;
    color: ${({ theme, $nps }) => ($nps ? theme.colors.primary : theme.colors.textLight)};
  }

  button {
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: none;
    border-radius: ${({ theme }) => theme.radius.sm};
    cursor: pointer;
    font-weight: 600;
    color: #fff;
    background-color: ${({ theme, $nps }) => ($nps ? theme.colors.info : theme.colors.success)};
  }
`;
