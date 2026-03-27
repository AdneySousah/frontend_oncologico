// src/components/Sidebar/AlertModal.jsx
import React, { useState, useMemo } from 'react';
import { LuX, LuArrowDownUp, LuFilter } from 'react-icons/lu';
import * as S from './styles'; 

export default function AlertModal({ isOpen, onClose, alertsList, alertCount, onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('ALL'); 
  const [sortBy, setSortBy] = useState('URGENCIA'); 

  // 1. Pegamos os dados do usuário logado para validar permissões
  const userStorage = JSON.parse(localStorage.getItem('oncologico:UserData') || '{}');
  const user = userStorage?.user;
  const isAdmin = user?.is_admin === true;
  const userOperadoraId = user?.operadora_id; // ID da operadora atrelada ao usuário

  const processedAlerts = useMemo(() => {
    // 2. Filtragem de Segurança (Permissões de Unidade/Operadora)
    let filtered = alertsList;

    if (!isAdmin) {
      // Regra A: Se não é admin, só vê pacientes da mesma operadora
      if (userOperadoraId) {
        filtered = filtered.filter(a => a.operadora_id === userOperadoraId);
      }

      // Regra B: Se tem operadora atrelada, NÃO vê telemonitoramento (apenas novos pacientes)
      // Removemos qualquer alerta que contenha "monitoramento" no tipo
      filtered = filtered.filter(a => 
        !(a.type || '').toLowerCase().includes('monitoramento')
      );
    }

    // 3. Filtragem de Interface (Botões "Todos", "Novos", etc)
    if (activeFilter === 'TELE' && isAdmin) { 
      // Apenas Admin pode filtrar por Telemonitoramento no botão
      filtered = filtered.filter(a => (a.type || '').toLowerCase().includes('monitoramento'));
    } else if (activeFilter === 'NOVO') {
      filtered = filtered.filter(a => 
        (a.type || '').toLowerCase().includes('novo') || 
        (a.type || '').toLowerCase().includes('paciente')
      );
    }

    // 4. Ordenação
    return [...filtered].sort((a, b) => {
      if (sortBy === 'SCORE') {
        const scoreA = a.score != null ? Number(a.score) : -1;
        const scoreB = b.score != null ? Number(b.score) : -1;
        if (scoreA !== scoreB) return scoreB - scoreA;
      }
      return a.diffDays - b.diffDays;
    });
  }, [alertsList, activeFilter, sortBy, isAdmin, userOperadoraId]);

  if (!isOpen) return null;

  return (
    <S.AlertOverlay onClick={onClose}>
      <S.AlertModalContent onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Notificações e Alertas ({processedAlerts.length})</h3>
          <button className="close-btn" onClick={onClose}>
            <LuX size={24} />
          </button>
        </div>

        <S.AlertControls>
          <div className="filters">
            <LuFilter size={16} color="#888" />
            <S.FilterBtn $active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')}>
              Todos
            </S.FilterBtn>
            
            <S.FilterBtn $active={activeFilter === 'NOVO'} onClick={() => setActiveFilter('NOVO')}>
              Novos Pacientes
            </S.FilterBtn>

            {/* Apenas Admins vêem o botão de filtro de Telemonitoramento */}
            {isAdmin && (
              <S.FilterBtn $active={activeFilter === 'TELE'} onClick={() => setActiveFilter('TELE')}>
                Telemonitoramento
              </S.FilterBtn>
            )}
          </div>
          
          <button 
            className="sort-btn" 
            onClick={() => setSortBy(prev => prev === 'URGENCIA' ? 'SCORE' : 'URGENCIA')}
            title="Mudar ordenação"
          >
            <LuArrowDownUp size={14} /> 
            {sortBy === 'URGENCIA' ? 'Por Data' : 'Por Risco (Score)'}
          </button>
        </S.AlertControls>
        
        <div className="modal-body">
          {processedAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
              Nenhum alerta disponível para o seu nível de acesso. 🎉
            </div>
          ) : (
            processedAlerts.map(alert => {
              const absDays = Math.abs(alert.diffDays);
              const pluralS = absDays === 1 ? '' : 's'; 
              const isTele = (alert.type || '').toLowerCase().includes('monitoramento');

              return (
                <S.AlertCard key={alert.id} diffDays={alert.diffDays} $alertType={alert.type}>
                  <div className="alert-info">
                    <span className="badge">{alert.type}</span>
                    
                    <div className="name-row">
                      <h4>{alert.patientName}</h4>
                      {isTele && alert.score != null && (
                        <S.ScoreBadge score={Number(alert.score)}>
                          Score: {alert.score} pts
                        </S.ScoreBadge>
                      )}
                    </div>
                    
                    <p>{alert.description}</p>
                    <small className="time">
                      {alert.diffDays < 0 ? `Atrasado há ${absDays} dia${pluralS}` : 
                       alert.diffDays === 0 ? 'Vence Hoje' : `Vence em ${alert.diffDays} dia${pluralS}`}
                    </small>
                  </div>
                  <button className="action-btn" onClick={() => onNavigate(alert.route)}>Ir</button>
                </S.AlertCard>
              )
            })
          )}
        </div>
      </S.AlertModalContent>
    </S.AlertOverlay>
  );
}