import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./styles";
import {
  LuLogOut, LuChevronLeft, LuChevronRight, LuSun, LuMoon,
  LuChevronDown, LuTable2, LuBell, LuSettings, LuSmartphone, LuStethoscope
} from "react-icons/lu";

import { atendimentoOptions, registerOptions, adminOptions } from "./menu";
import { AuthContext } from "../../hooks/AuthConfig";
import { ThemeContext } from "../../hooks/ThemeConfig";
import api from "../../services/api";

import AlertModal from "./AlertModal";

import logoBranca from "../../assets/logo_branca.png";

export default function Sidebar({ isMobileMenuOpen, closeMobileMenu }) {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [userStorage, setUserStorage] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);

  const [isAtendimentoOpen, setIsAtendimentoOpen] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const [alertCount, setAlertCount] = useState(0);
  const [alertColor, setAlertColor] = useState('#888');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertsList, setAlertsList] = useState([]);

  const [npsHealth, setNpsHealth] = useState(null);

  const currentLogo = logoBranca;

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

  const temPermissaoDeAcesso = (modulo, userData = userProfileData || userStorage?.user) => {
    if (!modulo) return true;
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

  // 👇 NOVO: protege contra respostas fora de ordem. Se dois carregamentos
  // de alerta ficarem "em voo" ao mesmo tempo (ex: o evento "updateAlerts"
  // disparou de novo antes do anterior terminar), sem essa proteção a
  // resposta mais LENTA podia chegar DEPOIS e sobrescrever o resultado mais
  // recente com um dado desatualizado — fazendo o alerta "sumir sozinho"
  // mesmo sem nenhuma mudança real ter acontecido.
  const loadAlertsRequestIdRef = useRef(0);

  const loadAlerts = async (userDataOverride = null) => {
    const requestId = ++loadAlertsRequestIdRef.current;
    try {
      let unifiedAlerts = [];
      let mostCritical = 99;

      // 1. Verifica as permissões antes de fazer as requisições. Aceita um
      // "userDataOverride" pra quando é chamado logo na montagem (antes do
      // estado do React ainda ter sido atualizado com o dado do localStorage).
      const canAccessTele = temPermissaoDeAcesso('telemonitoramento', userDataOverride || undefined);
      const canAccessEval = temPermissaoDeAcesso('avaliacoes', userDataOverride || undefined);

      // 👇 CORREÇÃO: antes, se a chamada falhasse por qualquer motivo (rede
      // instável, backend reiniciando, timeout), o ".catch(() => ({data:
      // []}))" tratava isso como "zero pendências" — o alerta zerava e ficava
      // assim até a próxima checagem bem-sucedida (até 5 minutos depois),
      // dando a impressão de "sumiu sozinho" mesmo com pendências reais.
      // Agora, se qualquer uma das duas fontes falhar de verdade, a função
      // sai sem mexer no estado — mantém o último alerta válido conhecido
      // em vez de substituir por um "zero" que pode estar errado.
      let teleFalhou = false;
      let evalFalhou = false;

      const [resTele, resEval] = await Promise.all([
        canAccessTele
          ? api.get('/monitoramento-medicamentos/pendentes', { params: { limit: 9999 } }).catch(err => { teleFalhou = true; console.error('Alerta: falha ao buscar pendências de telemonitoramento', err); return { data: [] }; })
          : Promise.resolve({ data: [] }),
        canAccessEval
          ? api.get('/evaluations/pendentes-alerta').catch(err => { evalFalhou = true; console.error('Alerta: falha ao buscar avaliações pendentes', err); return { data: [] }; })
          : Promise.resolve({ data: [] })
      ]);

      // Se, enquanto essa chamada estava em andamento, outra mais recente
      // já foi disparada, descarta esse resultado — ele já está desatualizado.
      if (requestId !== loadAlertsRequestIdRef.current) return;

      if (teleFalhou || evalFalhou) {
        console.error('Alerta: uma ou mais fontes falharam nesta checagem — mantendo o último alerta conhecido em vez de zerar.');
        return;
      }

      const teleData = Array.isArray(resTele.data) ? resTele.data : (resTele.data?.data || []);
      const evalData = Array.isArray(resEval.data) ? resEval.data : [];

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

      evalData.forEach(item => {
        if (item.data_proxima_avaliacao) {
          const diffDays = processDate(item.data_proxima_avaliacao);
          if (diffDays <= 5) {
            if (diffDays < mostCritical) mostCritical = diffDays;
            unifiedAlerts.push({
              id: `eval_${item.id}`,
              type: 'Avaliação',
              patientName: `${item.paciente?.nome || 'Sem Nome'} ${item.paciente?.sobrenome || ''}`.trim(),
              description: `Renovar Questionário: ${item.template?.title || 'Avaliação'}`,
              diffDays,
              route: `/necessidade-navegacao?paciente_id=${item.paciente_id}`,
              score: item.total_score != null ? item.total_score : null
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

  const loadNpsHealth = async () => {
    try {
      const user = localStorage.getItem('oncologico:UserData');
      const parsedUser = user ? JSON.parse(user) : null;

      if (parsedUser?.user?.is_admin || temPermissaoDeAcesso('check-saude')) {
        const response = await api.get('/nps/health');
        setNpsHealth(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar saúde do NPS", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('oncologico:UserData');
    let parsedUser = null;
    if (user) {
      parsedUser = JSON.parse(user);
      setUserStorage(parsedUser);

      if (parsedUser?.token) {
        api.get('/users/me')
          .then(response => setUserProfileData(response.data))
          .catch(err => console.error("Erro ao buscar dados do perfil", err));
      }
    }

    // 👇 CORREÇÃO: antes o alerta só carregava depois de 5 minutos (intervalo)
    // ou quando alguma tela disparava o evento "updateAlerts" — se nada disso
    // acontecesse logo no início, o sino ficava "desligado" até um dos dois
    // ocorrer. Chama já na montagem, passando o usuário recém-lido do
    // localStorage diretamente (o estado "userStorage" ainda não teria sido
    // atualizado a tempo dentro desta mesma execução).
    loadAlerts(parsedUser?.user);
    loadNpsHealth();

    const alertInterval = setInterval(() => loadAlerts(), 300000);
    const healthInterval = setInterval(() => loadNpsHealth(), 600000);

    const handleUpdateAlerts = () => loadAlerts();
    window.addEventListener('updateAlerts', handleUpdateAlerts);

    return () => {
      clearInterval(alertInterval);
      clearInterval(healthInterval);
      window.removeEventListener('updateAlerts', handleUpdateAlerts);
    };
  }, []);

  useEffect(() => {
    if (userProfileData || userStorage) {
      loadAlerts();
    }
    // Toda vez que as permissões ou perfil atualizarem, ele busca os alertas novamente
  }, [userProfileData, userStorage]);

  useEffect(() => {
    if (collapsed) {
      setIsRegisterOpen(false);
      setIsAdminMenuOpen(false);
    }
  }, [collapsed]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsAlertModalOpen(false);
    if (closeMobileMenu) closeMobileMenu();
  };

  const getRoleText = () => {
    if (!userProfileData) return "Carregando...";
    if (userProfileData.is_admin) return "CICFARMA";
    if (userProfileData.operadoras && userProfileData.operadoras.length > 0) {
      return userProfileData.operadoras.map(op => op.nome).join(', ');
    }
    return "Sem Operadora";
  };

  const menusAtendimentoVisiveis = atendimentoOptions.filter(item => temPermissaoDeAcesso(item.modulo));
  const menusCadastroVisiveis = registerOptions.filter(item => temPermissaoDeAcesso(item.modulo));
  const menusAdminVisiveis = adminOptions.filter(item => temPermissaoDeAcesso(item.modulo));

  const userNameToShow = userProfileData?.name || userStorage?.user?.name || "Usuário";

  return (
    <>
      <S.MobileOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />

      <S.Container isCollapsed={collapsed} $isOpen={isMobileMenuOpen}>
        <S.ToggleButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <LuChevronRight size={18} /> : <LuChevronLeft size={18} />}
        </S.ToggleButton>

        <S.LogoArea isCollapsed={collapsed}>
          <img src={currentLogo} alt="Logo Onco Navegação" />
        </S.LogoArea>

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

          {menusAtendimentoVisiveis.length > 0 && (
            <S.MenuItem isCollapsed={collapsed} label="Atendimento" isOpen={isAtendimentoOpen}>
              <button className="submenu-trigger" onClick={() => { if (collapsed) setCollapsed(false); setIsAtendimentoOpen(!isAtendimentoOpen); }}>
                <LuStethoscope size={24} />
                <span>Atendimento</span>
                <LuChevronDown className="arrow-icon" size={18} />
              </button>
              <S.SubMenuContent isOpen={isAtendimentoOpen} isCollapsed={collapsed}>
                {menusAtendimentoVisiveis.map((item) => (
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
          {npsHealth && (
            <S.HealthStatus
              isCollapsed={collapsed}
              quality={npsHealth.qualidade}
              title={collapsed ? `WhatsApp: ${npsHealth.qualidade} | Saldo: ${npsHealth.saldo}` : ""}
            >
              <div className="status-dot" />
              <div className="health-info">
                <span>Status NPS (WhatsApp)</span>
                <strong>
                  {npsHealth.qualidade === 'Green' ? 'Qualidade Alta' :
                    npsHealth.qualidade === 'Yellow' ? 'Qualidade Média' :
                      npsHealth.qualidade === 'Red' ? 'Qualidade Baixa' : 'Indisponível'}
                </strong>

                <div className="balance-label">
                  <LuSmartphone size={12} />
                  Saldo: {npsHealth.saldo || '...'}
                </div>
              </div>
            </S.HealthStatus>
          )}

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