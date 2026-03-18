import styled from "styled-components";

// ==============================
// OVERLAY PARA MOBILE (Fundo escuro)
// ==============================
export const MobileOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 95; /* Atrás da sidebar (100) */
    backdrop-filter: blur(2px);
  }
`;

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  width: ${(props) => (props.isCollapsed ? "80px" : "280px")};
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 4px 0 10px rgba(0,0,0,0.05);
  color: ${({ theme }) => theme.colors.text};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
  z-index: 100;

  /* RESPONSIVIDADE MOBILE */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px; /* Ignora o estado de colapsado no mobile */
    transform: ${(props) => (props.$isOpen ? "translateX(0)" : "translateX(-100%)")};
    box-shadow: ${(props) => (props.$isOpen ? "4px 0 15px rgba(0,0,0,0.3)" : "none")};
  }
`;

// ==============================
// CONTAINER PARA A LOGO
// ==============================
export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.isCollapsed ? "80px" : "100px")};
  padding: ${(props) => (props.isCollapsed ? "15px" : "20px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    max-width: ${(props) => (props.isCollapsed ? "40px" : "160px")};
    max-height: ${(props) => (props.isCollapsed ? "40px" : "60px")};
    object-fit: contain; 
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export const Header = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 90px;
  flex-shrink: 0;

  .user-info {
    opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
    transition: opacity 0.2s;
    pointer-events: ${(props) => (props.isCollapsed ? "none" : "all")};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const AvatarContainer = styled.div`
  min-width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${({ theme }) => theme === 'light' ? '#007D99' : '#203a43'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  border: 2px solid #52c41a; 
  box-shadow: 0 0 5px rgba(82, 196, 26, 0.5); 
  flex-shrink: 0;
  letter-spacing: 1px;
`;

export const SystemName = styled.h3`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const UserName = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.2;
  word-break: break-word;
  padding: 10px 0;
`;

export const UserRole = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  word-break: break-word;
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

  /* Oculta no mobile, pois o overlay cuida do fechamento */
  @media (max-width: 768px) {
    display: none;
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
  flex-shrink: 0;

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

export const AlertOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); z-index: 1000;
  display: flex; justify-content: flex-end; 
`;

export const AlertModalContent = styled.div`
  background: ${props => props.theme.colors.surface || '#fff'};
  width: 450px;
  height: 100%;
  box-shadow: -5px 0 25px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .modal-header {
    padding: 20px 25px;
    border-bottom: 1px solid ${props => props.theme.colors.border || '#eee'};
    display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; color: ${props => props.theme.colors.text || '#333'}; }
    .close-btn { background: none; border: none; cursor: pointer; color: #888; }
  }

  .modal-body {
    padding: 20px 25px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

export const AlertControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px 25px;
  background-color: ${props => props.theme.colors.surface || '#fafafa'};
  border-bottom: 1px solid ${props => props.theme.colors.border || '#eee'};

  .filters {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .sort-btn {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 1px solid ${props => props.theme.colors.border || '#ddd'};
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    color: ${props => props.theme.colors.textLight || '#666'};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${props => props.theme.colors.inputBg || '#eee'};
      color: ${props => props.theme.colors.text || '#333'};
    }
  }
`;

export const FilterBtn = styled.button`
  background: ${props => props.$active ? (props.theme.colors.primary || '#007D99') : 'transparent'};
  color: ${props => props.$active ? '#fff' : (props.theme.colors.textLight || '#666')};
  border: 1px solid ${props => props.$active ? (props.theme.colors.primary || '#007D99') : (props.theme.colors.border || '#ddd')};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? (props.theme.colors.primary || '#007D99') : (props.theme.colors.inputBg || '#eee')};
  }
`;

export const ScoreBadge = styled.span`
  display: inline-block;
  font-size: 0.70rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  margin-left: 10px; 
  white-space: nowrap;

  background-color: ${props => {
    if (props.score <= 10) return props.theme.colors.successLight || 'rgba(82, 196, 26, 0.15)'; 
    if (props.score <= 14) return props.theme.colors.warningLight || 'rgba(250, 173, 20, 0.15)'; 
    return props.theme.colors.dangerLight || 'rgba(255, 77, 79, 0.15)'; 
  }};

  color: ${props => {
    if (props.score <= 10) return props.theme.colors.success || '#52c41a';
    if (props.score <= 14) return props.theme.colors.warning || '#faad14';
    return props.theme.colors.danger || '#ff4d4f';
  }};
  
  border: 1px solid ${props => {
    if (props.score <= 10) return props.theme.colors.success || '#52c41a';
    if (props.score <= 14) return props.theme.colors.warning || '#faad14';
    return props.theme.colors.danger || '#ff4d4f';
  }};
`;

export const AlertCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBg || '#fafafa'};
  border-left: 5px solid ${props => 
    props.diffDays <= 1 ? (props.theme.colors.danger || '#ff4d4f') : 
    props.diffDays <= 3 ? (props.theme.colors.warning || '#faad14') : 
    (props.theme.colors.success || '#52c41a')
  };
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  .alert-info {
    flex: 1;
    
    .badge {
      display: inline-block; 
      font-size: 0.70rem; 
      font-weight: 800; 
      padding: 4px 8px; 
      border-radius: 4px; 
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      background-color: ${props => {
        const t = (props.$alertType || '').toLowerCase();
        if (t.includes('monitoramento')) return props.theme.colors.warningLight || 'rgba(250, 84, 28, 0.15)'; 
        if (t.includes('novo') || t.includes('paciente')) return props.theme.colors.infoLight || 'rgba(24, 144, 255, 0.15)'; 
        if (t.includes('termo')) return props.theme.colors.successLight || 'rgba(82, 196, 26, 0.15)'; 
        return props.theme.colors.inputBg || '#e6f7ff'; 
      }};
      
      color: ${props => {
        const t = (props.$alertType || '').toLowerCase();
        if (t.includes('monitoramento')) return props.theme.colors.warning || '#fa541c'; 
        if (t.includes('novo') || t.includes('paciente')) return props.theme.colors.info || '#1890ff';
        if (t.includes('termo')) return props.theme.colors.success || '#52c41a';
        return props.theme.colors.primary || '#1890ff';
      }};
    }

    .name-row {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      
      h4 { 
        margin: 0; 
        color: ${props => props.theme.colors.text || '#333'}; 
        font-size: 1rem; 
      }
    }

    p { margin: 0 0 5px 0; font-size: 0.85rem; color: ${props => props.theme.colors.textLight || '#666'}; }
    
    .time { 
      font-size: 0.8rem; 
      font-weight: bold; 
      color: ${props => props.diffDays <= 1 ? (props.theme.colors.danger || '#ff4d4f') : (props.theme.colors.textLight || '#888')}; 
    }
  }

  .action-btn {
    background: ${props => props.theme.colors.primary || '#007D99'};
    color: #fff; 
    border: none; 
    padding: 8px 16px; 
    border-radius: 6px;
    cursor: pointer; 
    font-weight: bold; 
    transition: filter 0.2s;
    
    &:hover { filter: brightness(1.1); }
  }

  small {
    color: ${props => props.diffDays < 0 ? `${props.theme.colors.text}` : (props.theme.colors.danger || '#ff4d4f')} !important;
    font-weight: ${props => props.diffDays <= 0 ? 'bold' : 'normal'} !important;
  }
`;

export const HealthStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* Aumentado o gap entre o ponto e os textos */
  padding: 12px; /* Aumentado o padding para dar mais respiro */
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.inputBg};
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid ${({ theme }) => theme.colors.border};
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};

  .status-dot {
    width: 12px; /* Ponto levemente maior */
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: ${(props) => {
      if (props.quality === 'Green') return '#52c41a';
      if (props.quality === 'Yellow') return '#faad14';
      if (props.quality === 'Red') return '#ff4d4f';
      return '#888';
    }};
    box-shadow: 0 0 10px ${(props) => {
      if (props.quality === 'Green') return 'rgba(82, 196, 26, 0.4)';
      if (props.quality === 'Yellow') return 'rgba(250, 173, 20, 0.4)';
      if (props.quality === 'Red') return 'rgba(255, 77, 79, 0.4)';
      return 'transparent';
    }};
  }

  .health-info {
    display: ${(props) => (props.isCollapsed ? "none" : "flex")};
    flex-direction: column;
    gap: 4px; /* Espaço entre o título e a qualidade */
    overflow: hidden;

    span {
      color: ${({ theme }) => theme.colors.textLight};
      font-size: 0.7rem; /* Fonte aumentada de 0.65 para 0.7 */
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    strong {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 700;
      font-size: 0.85rem; /* Fonte aumentada de 0.75 para 0.85 */
    }

    .balance-label {
        margin-top: 4px;
        font-size: 0.8rem;
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
    }
  }
`;