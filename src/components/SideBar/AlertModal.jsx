import React, { useState, useMemo } from 'react';
import { LuX, LuArrowDownUp } from 'react-icons/lu';
import * as S from './styles';

export default function AlertModal({ isOpen, onClose, alertsList, onNavigate }) {
  const [sortBy, setSortBy] = useState('URGENCIA'); 
  const [filterType, setFilterType] = useState('TODOS');

  const processedAlerts = useMemo(() => {
    let filtered = alertsList;
    if (filterType !== 'TODOS') {
      filtered = alertsList.filter(a => a.type === filterType);
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'SCORE') {
        const scoreA = a.score != null ? Number(a.score) : -1;
        const scoreB = b.score != null ? Number(b.score) : -1;
        if (scoreA !== scoreB) return scoreB - scoreA;
      }
      return a.diffDays - b.diffDays;
    });
  }, [alertsList, sortBy, filterType]);

  if (!isOpen) return null;

  return (
    <S.AlertOverlay onClick={onClose}>
      <S.AlertModalContent onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Contatos Pendentes ({processedAlerts.length})</h3>
          <button className="close-btn" onClick={onClose}>
            <LuX size={24} />
          </button>
        </div>

        <S.AlertControls style={{ justifyContent: 'space-between', display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: filterType === 'TODOS' ? '#007BFF' : '#eee', color: filterType === 'TODOS' ? '#fff' : '#333', cursor: 'pointer' }}
              onClick={() => setFilterType('TODOS')}
            >
              Todos
            </button>
            <button 
              style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: filterType === 'Telemonitoramento' ? '#007BFF' : '#eee', color: filterType === 'Telemonitoramento' ? '#fff' : '#333', cursor: 'pointer' }}
              onClick={() => setFilterType('Telemonitoramento')}
            >
              Tele
            </button>
            <button 
              style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: filterType === 'Avaliação' ? '#007BFF' : '#eee', color: filterType === 'Avaliação' ? '#fff' : '#333', cursor: 'pointer' }}
              onClick={() => setFilterType('Avaliação')}
            >
              Avaliações
            </button>
          </div>

          <button 
            className="sort-btn" 
            onClick={() => setSortBy(prev => prev === 'URGENCIA' ? 'SCORE' : 'URGENCIA')}
            title="Mudar ordenação"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', fontWeight: 'bold' }}
          >
            <LuArrowDownUp size={14} /> 
            {sortBy === 'URGENCIA' ? 'Por Data (Urgência)' : 'Por Risco (Score)'}
          </button>
        </S.AlertControls>
        
        <div className="modal-body">
          {processedAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
              Nenhum contato agendado para os próximos dias. 🎉
            </div>
          ) : (
            processedAlerts.map(alert => {
              const absDays = Math.abs(alert.diffDays);
              const pluralS = absDays === 1 ? '' : 's'; 

              return (
                <S.AlertCard key={alert.id} diffDays={alert.diffDays} $alertType={alert.type}>
                  <div className="alert-info">
                    
                    <div className="name-row">
                      <h4>
                        {alert.patientName} 
                        <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666', background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', verticalAlign: 'middle' }}>
                          {alert.type}
                        </span>
                      </h4>
                      {alert.score != null && (
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