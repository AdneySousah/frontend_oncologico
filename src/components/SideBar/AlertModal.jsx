// src/components/Sidebar/AlertModal.jsx
import React, { useState, useMemo } from 'react';
import { LuX, LuArrowDownUp, LuFilter } from 'react-icons/lu';
import * as S from './styles'; 

export default function AlertModal({ isOpen, onClose, alertsList, alertCount, onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('ALL'); 
  const [sortBy, setSortBy] = useState('URGENCIA'); 

  const processedAlerts = useMemo(() => {
    let filtered = alertsList;
    if (activeFilter === 'TELE') {
      filtered = alertsList.filter(a => (a.type || '').toLowerCase().includes('monitoramento'));
    } else if (activeFilter === 'NOVO') {
      filtered = alertsList.filter(a => (a.type || '').toLowerCase().includes('novo') || (a.type || '').toLowerCase().includes('paciente'));
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'SCORE') {
        const scoreA = a.score != null ? Number(a.score) : -1;
        const scoreB = b.score != null ? Number(b.score) : -1;
        if (scoreA !== scoreB) return scoreB - scoreA;
      }
      return a.diffDays - b.diffDays;
    });
  }, [alertsList, activeFilter, sortBy]);

  if (!isOpen) return null;

  return (
    <S.AlertOverlay onClick={onClose}>
      <S.AlertModalContent onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Notificações e Alertas ({alertCount})</h3>
          <button className="close-btn" onClick={onClose}>
            <LuX size={24} />
          </button>
        </div>

        <S.AlertControls>
          <div className="filters">
            <LuFilter size={16} color="#888" />
            <S.FilterBtn $active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')}>Todos</S.FilterBtn>
            <S.FilterBtn $active={activeFilter === 'NOVO'} onClick={() => setActiveFilter('NOVO')}>Novos Pacientes</S.FilterBtn>
            <S.FilterBtn $active={activeFilter === 'TELE'} onClick={() => setActiveFilter('TELE')}>Telemonitoramento</S.FilterBtn>
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
              Nenhum alerta encontrado para este filtro. 🎉
            </div>
          ) : (
            processedAlerts.map(alert => {
              const absDays = Math.abs(alert.diffDays);
              const pluralS = absDays === 1 ? '' : 's'; 
              const isTele = (alert.type || '').toLowerCase().includes('monitoramento');

              return (
                <S.AlertCard key={alert.id} diffDays={alert.diffDays} $alertType={alert.type}>
                  <div className="alert-info">
                    {/* A Tag do tipo fica sozinha em cima */}
                    <span className="badge">{alert.type}</span>
                    
                    {/* NOME E SCORE NA MESMA LINHA */}
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