import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  width: ${(props) => (props.isCollapsed ? "80px" : "280px")};
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 4px 0 10px rgba(0,0,0,0.05);
  color: ${({ theme }) => theme.colors.text};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
  z-index: 100;
`;

export const Header = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 80px;

  .user-info {
    opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
    transition: opacity 0.2s;
    pointer-events: ${(props) => (props.isCollapsed ? "none" : "all")};
    overflow: hidden;
  }
`;

export const SystemName = styled.h3`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const UserName = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 25px;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.inputBg};
  }
`;

export const MenuList = styled.ul`
  list-style: none;
  padding: 20px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

export const MenuItem = styled.li`
  position: relative;
  
  .menu-link, .submenu-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-radius: 8px;
    background-color: ${({ theme, isActive }) => isActive ? `${theme.colors.primary}1A` : "transparent"};
    color: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.text};
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: ${({ isActive }) => (isActive ? "600" : "400")};
    transition: all 0.2s;

    &:hover {
      background-color: ${({ theme, isActive }) => isActive ? `${theme.colors.primary}2A` : theme.colors.inputBg};
    }

    svg:first-child {
      min-width: 24px;
      margin-right: ${(props) => (props.isCollapsed ? "0" : "15px")};
    }

    .arrow-icon {
        margin-left: auto;
        display: ${(props) => (props.isCollapsed ? "none" : "block")};
        transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
        transition: transform 0.3s ease;
    }

    span {
      display: ${(props) => (props.isCollapsed ? "none" : "block")};
    }
  }

  /* Tooltip Customizado para quando estiver colapsado */
  &:hover::after {
    content: "${(props) => (props.isCollapsed ? props.label : "")}";
    position: absolute;
    left: 70px;
    top: 50%;
    transform: translateY(-50%);
    background-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.surface};
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    white-space: nowrap;
    opacity: ${(props) => (props.isCollapsed ? 1 : 0)};
    pointer-events: none;
    z-index: 200;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

export const SubMenuContent = styled.div`
  max-height: ${({ isOpen, isCollapsed }) => (isOpen && !isCollapsed ? "800px" : "0")};
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding-left: ${(props) => (props.isCollapsed ? "0" : "20px")};
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 10px;

  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textLight};
    cursor: pointer;
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.inputBg};
      color: ${({ theme }) => theme.colors.text};
    }

    &.logout-btn:hover {
      background-color: rgba(255, 77, 79, 0.1); 
      color: #ff4d4f;
    }

    svg {
      margin-right: ${(props) => (props.isCollapsed ? "0" : "10px")};
    }

    span {
      display: ${(props) => (props.isCollapsed ? "none" : "block")};
    }
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 10px 15px;
`;