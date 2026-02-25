// src/components/Sidebar/index.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./styles";
import { 
  LuLogOut, LuChevronLeft, LuChevronRight, LuSun, LuMoon,
  LuChevronDown, LuTable2, LuBell
} from "react-icons/lu";

import { navOptions, registerOptions } from "./menu"; 
import { AuthContext } from "../../hooks/AuthConfig";
import { ThemeContext } from "../../hooks/ThemeConfig";
import api from "../../services/api";

// Importando o novo componente filho
import AlertModal from "./AlertModal";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [userStorage, setUserStorage] = useState();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // Estados dos Alertas
  const [alertCount, setAlertCount] = useState(0);
  const [alertColor, setAlertColor] = useState('#888');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertsList, setAlertsList] = useState([]);

  const temPermissaoDeAcesso = (modulo, userData = userStorage?.user) => {
    if (!modulo) return true; 
    if (userData?.is_admin) return true; 
    if (!userData?.perfil?.permissoes) return false; 
    return userData.perfil.permissoes[modulo]?.acessar === true;
  };

  const processDate = (dateString) => {
    if (!dateString) return 999;
    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  };

  const loadAlerts = async () => {
    try {
      let unifiedAlerts = [];
      let mostCritical = 99;

      const [resNavegacao, resTele] = await Promise.all([
        api.get('/evaluations/responses').catch(() => ({ data: [] })),
        api.get('/monitoramento-medicamentos/pendentes').catch(() => ({ data: [] }))
      ]);

      // 1. Processar Alertas de Navegação
      resNavegacao.data.forEach(item => {
        const isConcluido = item.status_avaliacao === 'Concluída';
        if (!isConcluido && item.data_proximo_contato) {
          const diffDays = processDate(item.data_proximo_contato);
          if (diffDays <= 5) {
            if (diffDays < mostCritical) mostCritical = diffDays;
            unifiedAlerts.push({
              id: `nav_${item.id}`,
              type: 'Navegação',
              patientName: `${item.paciente?.nome} ${item.paciente?.sobrenome}`,
              description: 'Avaliação Pendente',
              diffDays,
              route: `/necessidade-navegacao?highlight=${item.id}`
            });
          }
        }
      });

      // 2. Processar Alertas de Telemonitoramento
      resTele.data.forEach(item => {
        if (item.status === 'PENDENTE' && item.data_proximo_contato) {
          const diffDays = processDate(item.data_proximo_contato);
          if (diffDays <= 5) {
            if (diffDays < mostCritical) mostCritical = diffDays;
            unifiedAlerts.push({
              id: `tele_${item.id}`,
              type: 'Telemonitoramento',
              patientName: `${item.paciente?.nome} ${item.paciente?.sobrenome}`,
              description: `Medicamento: ${item.medicamento?.nome}`,
              diffDays,
              route: `/telemonitoramento?highlight=${item.paciente.id}_${item.medicamento.id}`
            });
          }
        }
      });

      unifiedAlerts.sort((a, b) => a.diffDays - b.diffDays);

      setAlertsList(unifiedAlerts);
      setAlertCount(unifiedAlerts.length);

      if (unifiedAlerts.length === 0) setAlertColor('inherit');
      else if (mostCritical <= 1) setAlertColor('#ff4d4f'); 
      else if (mostCritical <= 3) setAlertColor('#faad14'); 
      else setAlertColor('#52c41a'); 

    } catch (error) {
      console.error("Erro ao carregar alertas", error);
    }
  };

  // EFEITO PRINCIPAL (Com atualização em tempo real)
  useEffect(() => {
    const user = localStorage.getItem('oncologico:UserData');
    if (user) setUserStorage(JSON.parse(user));
    
    // Carrega a primeira vez
    loadAlerts();
    
    // Continua checando a cada 5 minutos por segurança
    const interval = setInterval(() => loadAlerts(), 300000);
    
    // NOVO: Escuta os gritos (eventos) do resto do sistema
    const handleUpdateAlerts = () => loadAlerts();
    window.addEventListener('updateAlerts', handleUpdateAlerts);
    
    // Limpeza ao desmontar
    return () => {
      clearInterval(interval);
      window.removeEventListener('updateAlerts', handleUpdateAlerts);
    };
  }, []);

  useEffect(() => {
    if (collapsed) setIsRegisterOpen(false);
  }, [collapsed]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsAlertModalOpen(false); 
  };

  const menusNavegacaoVisiveis = navOptions.filter(item => temPermissaoDeAcesso(item.modulo));
  const menusCadastroVisiveis = registerOptions.filter(item => temPermissaoDeAcesso(item.modulo));

  return (
    <>
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
          {(temPermissaoDeAcesso('avaliacoes') || temPermissaoDeAcesso('telemonitoramento')) && (
            <S.MenuItem isCollapsed={collapsed} isActive={isAlertModalOpen} label={`Alertas (${alertCount})`}>
              <button 
                onClick={() => setIsAlertModalOpen(true)}
                className="menu-link"
                style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <LuBell size={24} color={alertCount > 0 ? alertColor : 'inherit'} />
                <span style={{ color: alertCount > 0 ? alertColor : 'inherit', fontWeight: alertCount > 0 ? '700' : '400' }}>
                  Alertas {alertCount > 0 && `(${alertCount})`}
                </span>
              </button>
            </S.MenuItem>
          )}

          <S.Divider isCollapsed={collapsed} />

          {menusNavegacaoVisiveis.map((item) => (
              <S.MenuItem key={item.id} isCollapsed={collapsed} isActive={location.pathname === item.path} label={item.label}>
                  <a href={item.path} className="menu-link" onClick={(e) => { e.preventDefault(); handleNavigation(item.path); }}>
                      <item.icon size={24} />
                      <span>{item.label}</span>
                  </a>
              </S.MenuItem>
          ))}

          <S.Divider isCollapsed={collapsed} />

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

      {/* Renderizando o Componente Filho que criamos no Passo 1 */}
      <AlertModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)} 
        alertsList={alertsList}
        alertCount={alertCount}
        onNavigate={handleNavigation}
      />
    </>
  );
}