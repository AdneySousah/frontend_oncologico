import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./styles";
import { 
  LuLogOut,     
  LuChevronLeft, 
  LuChevronRight,
  LuSun,
  LuMoon,
  LuChevronDown,
  LuTable2,
  LuBell
} from "react-icons/lu";

import { navOptions, registerOptions } from "./menu"; 
import { AuthContext } from "../../hooks/AuthConfig";
import { ThemeContext } from "../../hooks/ThemeConfig";
import api from "../../services/api";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [userStorage, setUserStorage] = useState();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  const [alertCount, setAlertCount] = useState(0);
  const [alertColor, setAlertColor] = useState('#888');

  // ==========================================
  // 1. LÓGICA DE PERMISSÃO
  // ==========================================
  const temPermissaoDeAcesso = (modulo, userData = userStorage?.user) => {
    if (!modulo) return true; // Rotas livres (ex: Dashboard)
    if (userData?.is_admin) return true; // Admin vê tudo
    if (!userData?.perfil?.permissoes) return false; // Sem perfil = bloqueado
    
    return userData.perfil.permissoes[modulo]?.acessar === true;
  };

  useEffect(() => {
    const user = localStorage.getItem('oncologico:UserData');
    let parsedUser = null;

    if (user) {
      parsedUser = JSON.parse(user);
      setUserStorage(parsedUser);
    }
    
    // Só carrega os alertas e ativa o setInterval SE tiver permissão. 
    // Evita tomar erro 403 Forbidden do Backend!
    const podeVerAlertas = temPermissaoDeAcesso('avaliacoes', parsedUser?.user);
    
    if (podeVerAlertas) {
      loadAlerts();
      const interval = setInterval(loadAlerts, 300000);
      return () => clearInterval(interval);
    }
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await api.get('/evaluations/responses');
      const data = res.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let count = 0;
      let mostCritical = 99;

      data.forEach(item => {
        if (item.templates_respondidos === 0 && item.data_proximo_contato) {
          const contactDate = new Date(item.data_proximo_contato);
          contactDate.setHours(0, 0, 0, 0);
          
          const diffTime = contactDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 5) {
            count++;
            if (diffDays < mostCritical) mostCritical = diffDays;
          }
        }
      });

      setAlertCount(count);
      if (mostCritical <= 1) setAlertColor('#ff4d4f'); 
      else if (mostCritical <= 3) setAlertColor('#faad14'); 
      else if (mostCritical <= 5) setAlertColor('#52c41a'); 
    } catch (error) {
      console.error("Erro ao carregar alertas no sidebar", error);
    }
  };

  useEffect(() => {
    if (collapsed) setIsRegisterOpen(false);
  }, [collapsed]);

  const handleNavigation = (path) => navigate(path);

  // ==========================================
  // 2. FILTRAGEM DOS MENUS ANTES DE RENDERIZAR
  // ==========================================
  const menusNavegacaoVisiveis = navOptions.filter(item => temPermissaoDeAcesso(item.modulo));
  const menusCadastroVisiveis = registerOptions.filter(item => temPermissaoDeAcesso(item.modulo));

  return (
    <S.Container isCollapsed={collapsed}>
      <S.ToggleButton onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <LuChevronRight size={18} /> : <LuChevronLeft size={18} />}
      </S.ToggleButton>

      <S.Header isCollapsed={collapsed}>
        <div style={{
          minWidth: '40px', height:'40px', borderRadius:'50%', 
          background: theme === 'light' ? '#007D99' : '#203a43',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: '1.2rem', fontWeight: 'bold', color: '#fff'
        }}>
          {userStorage?.user?.name ? userStorage.user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="user-info">
          <S.SystemName>Onco Navegação</S.SystemName>
          <S.UserName>{userStorage?.user?.name || "Usuário"}</S.UserName>
        </div>
      </S.Header>

      <S.MenuList>
        
        {/* Item de Alertas Centralizado - SÓ MOSTRA SE TIVER PERMISSÃO */}
        {temPermissaoDeAcesso('avaliacoes') && (
          <S.MenuItem 
            isCollapsed={collapsed} 
            isActive={location.pathname === '/necessidade-navegacao'}
            label={`Alertas (${alertCount})`}
          >
            <a 
              href="/necessidade-navegacao" 
              className="menu-link"
              onClick={(e) => { e.preventDefault(); handleNavigation('/necessidade-navegacao'); }}
            >
              <LuBell size={24} color={alertCount > 0 ? alertColor : 'inherit'} />
              <span style={{ 
                color: alertCount > 0 ? alertColor : 'inherit', 
                fontWeight: alertCount > 0 ? '700' : '400' 
              }}>
                Alertas {alertCount > 0 && `(${alertCount})`}
              </span>
            </a>
          </S.MenuItem>
        )}

        <S.Divider isCollapsed={collapsed} />

        {/* Menu Principal (Já Filtrado) */}
        {menusNavegacaoVisiveis.map((item) => (
            <S.MenuItem key={item.id} isCollapsed={collapsed} isActive={location.pathname === item.path} label={item.label}>
                <a href={item.path} className="menu-link" onClick={(e) => { e.preventDefault(); handleNavigation(item.path); }}>
                    <item.icon size={24} />
                    <span>{item.label}</span>
                </a>
            </S.MenuItem>
        ))}

        <S.Divider isCollapsed={collapsed} />

        {/* Submenu de Cadastros - SÓ MOSTRA SE TIVER PELO MENOS 1 ITEM PRA ELE VER */}
        {menusCadastroVisiveis.length > 0 && (
          <S.MenuItem isCollapsed={collapsed} label="Tabelas Cadastrais" isOpen={isRegisterOpen}>
            <button className="submenu-trigger" onClick={() => { if (collapsed) setCollapsed(false); setIsRegisterOpen(!isRegisterOpen); }}>
              <LuTable2 size={24} />
              <span>Tabelas Cadastrais</span>
              <LuChevronDown className="arrow-icon" size={18} />
            </button>
            <S.SubMenuContent isOpen={isRegisterOpen} isCollapsed={collapsed}>
              {menusCadastroVisiveis.map((item) => (
                <S.MenuItem key={item.id} isCollapsed={collapsed} isActive={location.pathname === item.path} label={item.label}>
                  <a href={item.path} className="menu-link" onClick={(e) => { e.preventDefault(); handleNavigation(item.path); }} style={{ padding: '10px 15px', fontSize: '0.85rem' }}>
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </a>
                </S.MenuItem>
              ))}
            </S.SubMenuContent>
          </S.MenuItem>
        )}
      </S.MenuList>

      <S.Footer isCollapsed={collapsed}>
        <button onClick={toggleTheme} title={collapsed ? "Trocar Tema" : ""}>
          {theme === 'light' ? <LuMoon size={24} /> : <LuSun size={24} />}
          <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>
        <button onClick={logout} className="logout-btn" title={collapsed ? "Sair" : ""}>
          <LuLogOut size={24} />
          <span>Sair do Sistema</span>
        </button>
      </S.Footer>
    </S.Container>
  );
}