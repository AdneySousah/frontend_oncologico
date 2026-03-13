// src/components/Sidebar/index.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./styles";
import {
  LuLogOut, LuChevronLeft, LuChevronRight, LuSun, LuMoon,
  LuChevronDown, LuTable2, LuBell, LuSettings
} from "react-icons/lu";

import { navOptions, registerOptions, adminOptions } from "./menu";
import { AuthContext } from "../../hooks/AuthConfig";
import { ThemeContext } from "../../hooks/ThemeConfig";
import api from "../../services/api";

import AlertModal from "./AlertModal";

// IMPORT DAS LOGOS (Ajuste o caminho se necessário)
import logoBranca from "../../assets/logo_branca.png";


export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [userStorage, setUserStorage] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const [alertCount, setAlertCount] = useState(0);
  const [alertColor, setAlertColor] = useState('#888');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertsList, setAlertsList] = useState([]);

  // Lógica de qual logo exibir baseada no tema atual

  const currentLogo = theme === 'light' ? logoBranca : logoBranca;

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(names.length, 3); i++) {
      if (names[i].length > 0) {
        initials += names[i].charAt(0).toUpperCase();
      }
    }
    return initials;
  };

  const temPermissaoDeAcesso = (modulo, userData = userStorage?.user) => {
    if (!modulo) return true;
    if (userData?.is_admin) return true;
    if (!userData?.perfil?.permissoes) return false;
    return userData.perfil.permissoes[modulo]?.acessar === true;
  };

  const processDate = (dateString) => {
    if (!dateString) return 999;
    try {
      let dateToProcess = dateString;
      if (dateToProcess.includes('T')) dateToProcess = dateToProcess.split('T')[0];
      let year, month, day;
      if (dateToProcess.includes('-')) {
        [year, month, day] = dateToProcess.split('-');
      } else if (dateToProcess.includes('/')) {
        [day, month, year] = dateToProcess.split('/');
      } else {
        return 999;
      }
      const date = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return Math.round((date - today) / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 999;
    }
  };

  const loadAlerts = async () => {
     try {
      let unifiedAlerts = [];
      let mostCritical = 99;

      const [resNavegacao, resTele, resNovosPacientes] = await Promise.all([
        api.get('/evaluations/responses').catch(() => ({ data: [] })),
        api.get('/monitoramento-medicamentos/pendentes').catch(() => ({ data: [] })),
        api.get('/pacientes/pendentes').catch(() => ({ data: [] }))
      ]);

      const navData = Array.isArray(resNavegacao.data) ? resNavegacao.data : (resNavegacao.data?.data || []);
      const teleData = Array.isArray(resTele.data) ? resTele.data : (resTele.data?.data || []);
      const novosPacientesData = Array.isArray(resNovosPacientes.data) ? resNovosPacientes.data : [];

      novosPacientesData.forEach(item => {
        mostCritical = 0; 
        unifiedAlerts.push({
          id: `pac_new_${item.id}`,
          type: 'Novo Paciente',
          patientName: `${item.nome || ''} ${item.sobrenome || ''}`.trim(),
          description: 'Aguardando revisão e confirmação',
          diffDays: 0,
          route: `/pacientes?confirmar=${item.id}`
        });
      });

      navData.forEach(item => {
        const status = item.status_avaliacao ? String(item.status_avaliacao).toUpperCase() : '';
        const isConcluido = ['CONCLUÍDA', 'CONCLUIDA', 'CONCLUÍDO', 'CONCLUIDO', 'CANCELADO'].includes(status);

        if (!isConcluido && item.data_proximo_contato) {
          const diffDays = processDate(item.data_proximo_contato);
          if (diffDays <= 5) {
            if (diffDays < mostCritical) mostCritical = diffDays;
            unifiedAlerts.push({
              id: `nav_${item.id}`,
              type: 'Navegação',
              patientName: `${item.paciente?.nome || 'Sem Nome'} ${item.paciente?.sobrenome || ''}`.trim(),
              description: 'Avaliação Pendente',
              diffDays,
              route: `/necessidade-navegacao?highlight=${item.id}`
            });
          }
        }
      });

      teleData.forEach(item => {
        const status = item.status ? String(item.status).toUpperCase() : '';
        const isConcluido = ['CONCLUÍDO', 'CONCLUIDO', 'FINALIZADO', 'FINALIZADA', 'CANCELADO'].includes(status);

        if (!isConcluido && item.data_proximo_contato) {
          const diffDays = processDate(item.data_proximo_contato);
          if (diffDays <= 5) {
            if (diffDays < mostCritical) mostCritical = diffDays;
            unifiedAlerts.push({
              id: `tele_${item.id}`,
              type: 'Telemonitoramento',
              patientName: `${item.paciente?.nome || 'Sem Nome'} ${item.paciente?.sobrenome || ''}`.trim(),
              description: `Medicamento: ${item.medicamento?.nome || 'N/A'}`,
              diffDays,
              route: `/telemonitoramento?highlight=${item.paciente?.id}_${item.medicamento?.id}`,
              score: item.avaliacao?.total_score != null ? item.avaliacao.total_score : null
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

  useEffect(() => {
    const user = localStorage.getItem('oncologico:UserData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserStorage(parsedUser);
      
      if(parsedUser?.token) {
        api.get('/users/me')
          .then(response => setUserProfileData(response.data))
          .catch(err => console.error("Erro ao buscar dados do perfil", err));
      }
    }

    loadAlerts();
    const interval = setInterval(() => loadAlerts(), 300000);

    const handleUpdateAlerts = () => loadAlerts();
    window.addEventListener('updateAlerts', handleUpdateAlerts);

    return () => {
      clearInterval(interval);
      window.removeEventListener('updateAlerts', handleUpdateAlerts);
    };
  }, []);

  useEffect(() => {
    if (collapsed) {
      setIsRegisterOpen(false);
      setIsAdminMenuOpen(false);
    }
  }, [collapsed]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsAlertModalOpen(false);
  };

  const getRoleText = () => {
    if (!userProfileData) return "Carregando...";
    if (userProfileData.is_admin) return "Cic Oncologia";
    if (userProfileData.operadoras && userProfileData.operadoras.length > 0) {
      return userProfileData.operadoras.map(op => op.nome).join(', '); 
    }
    return "Sem Operadora";
  };

  const menusNavegacaoVisiveis = navOptions.filter(item => temPermissaoDeAcesso(item.modulo));
  const menusCadastroVisiveis = registerOptions.filter(item => temPermissaoDeAcesso(item.modulo));
  const menusAdminVisiveis = adminOptions.filter(item => temPermissaoDeAcesso(item.modulo));

  const userNameToShow = userProfileData?.name || userStorage?.user?.name || "Usuário";

  return (
    <>
      <S.Container isCollapsed={collapsed}>
        <S.ToggleButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <LuChevronRight size={18} /> : <LuChevronLeft size={18} />}
        </S.ToggleButton>

        {/* NOVA ÁREA DA LOGO */}
        <S.LogoArea isCollapsed={collapsed}>
          <img src={currentLogo} alt="Logo Onco Navegação" />
        </S.LogoArea>

        {/* ÁREA DO USUÁRIO (Abaixo da logo) */}
        <S.Header isCollapsed={collapsed}>
          <S.AvatarContainer theme={theme}>
            {getInitials(userNameToShow)}
          </S.AvatarContainer>
          
          <div className="user-info">
            <S.SystemName>Onco Navegação</S.SystemName>
            <S.UserName title={userNameToShow}>{userNameToShow}</S.UserName>
            <S.UserRole title={getRoleText()}>{getRoleText()}</S.UserRole>
          </div>
        </S.Header>

        <S.MenuList>
          {(temPermissaoDeAcesso('avaliacoes') || temPermissaoDeAcesso('telemonitoramento') || temPermissaoDeAcesso('pacientes')) && (
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

          {/* MENU TABELAS CADASTRAIS */}
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

          {/* MENU ADMINISTRATIVO */}
          {menusAdminVisiveis.length > 0 && (
            <S.MenuItem isCollapsed={collapsed} label="Administrativo" isOpen={isAdminMenuOpen}>
              <button className="submenu-trigger" onClick={() => { if (collapsed) setCollapsed(false); setIsAdminMenuOpen(!isAdminMenuOpen); }}>
                <LuSettings size={24} />
                <span>Administrativo</span>
                <LuChevronDown className="arrow-icon" size={18} />
              </button>
              <S.SubMenuContent isOpen={isAdminMenuOpen} isCollapsed={collapsed}>
                {menusAdminVisiveis.map((item) => (
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