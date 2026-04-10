// src/components/Sidebar/AlertModal.jsx
import React, { useState, useMemo } from 'react';
import { LuX, LuArrowDownUp } from 'react-icons/lu';
import * as S from './styles'; 

export default function AlertModal({ isOpen, onClose, alertsList, onNavigate }) {
  const [sortBy, setSortBy] = useState('URGENCIA'); 

  const processedAlerts = useMemo(() => {
    // 1. Não precisamos mais filtrar abas (Todos, Novos, Tele) pois tudo é Telemonitoramento.
    // 2. A segurança (filtragem por operadora) já é garantida pelo backend na rota /pendentes.

    // Apenas aplicamos a ordenação escolhida pelo usuário
    return [...alertsList].sort((a, b) => {
      if (sortBy === 'SCORE') {
        const scoreA = a.score != null ? Number(a.score) : -1;
        const scoreB = b.score != null ? Number(b.score) : -1;
        if (scoreA !== scoreB) return scoreB - scoreA;
      }
      // Padrão: Urgência (Mais atrasados primeiro)
      return a.diffDays - b.diffDays;
    });
  }, [alertsList, sortBy]);

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

        <S.AlertControls style={{ justifyContent: 'flex-end' }}>
          {/* Como removemos os filtros, alinhamos o botão de ordenação à direita */}
          <button 
            className="sort-btn" 
            onClick={() => setSortBy(prev => prev === 'URGENCIA' ? 'SCORE' : 'URGENCIA')}
            title="Mudar ordenação"
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
                      <h4>{alert.patientName}</h4>
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