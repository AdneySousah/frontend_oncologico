// src/components/Sidebar/AlertModal.jsx
import React from 'react';
import { LuX } from 'react-icons/lu';
import * as S from './styles'; // Usa os mesmos estilos da Sidebar

export default function AlertModal({ isOpen, onClose, alertsList, alertCount, onNavigate }) {
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
        
        <div className="modal-body">
          {alertsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
              Nenhum alerta crítico no momento. 🎉
            </div>
          ) : (
            alertsList.map(alert => (
              <S.AlertCard key={alert.id} diffDays={alert.diffDays}>
                <div className="alert-info">
                  <span className="badge">{alert.type}</span>
                  <h4>{alert.patientName}</h4>
                  <p>{alert.description}</p>
                  <small className="time">
                    {alert.diffDays < 0 ? `Atrasado há ${Math.abs(alert.diffDays)} dias` : 
                     alert.diffDays === 0 ? 'Vence Hoje' : `Vence em ${alert.diffDays} dias`}
                  </small>
                </div>
                <button className="action-btn" onClick={() => onNavigate(alert.route)}>Ir</button>
              </S.AlertCard>
            ))
          )}
        </div>
      </S.AlertModalContent>
    </S.AlertOverlay>
  );
}