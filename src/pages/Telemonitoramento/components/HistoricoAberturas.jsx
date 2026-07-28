import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../../services/api';

const HistoricoContainer = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color, #e0e0e0);
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 1.1em;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
`;

const EventItem = styled.div`
  padding: 12px;
  border-left: 4px solid var(--primary-color, #007bff);
  background: #f8f9fa;
  margin-bottom: 12px;
  border-radius: 0 6px 6px 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(2px);
    background: #f1f3f5;
  }

  .med-name {
    font-weight: 600;
    font-size: 0.95em;
    color: #2c3e50;
    margin-bottom: 8px;
  }

  .event-info {
    font-size: 0.85em;
    color: #555;
    margin: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .badge {
    background: #e9ecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: bold;
    color: #495057;
  }
`;

export default function HistoricoAberturas({ monitoramento }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!monitoramento?.id) return;

    api.get(`/monitoramento-medicamentos/${monitoramento.id}/historico-aberturas`)
      .then(response => {
        // Lógica para filtrar apenas 1 item por evento_externo_id
        const historicoUnico = response.data.filter((item, index, self) =>
          item.evento_externo_id && index === self.findIndex((t) => (
            t.evento_externo_id === item.evento_externo_id
          ))
        );
        
        setHistorico(historicoUnico);
      })
      .catch(err => {
        console.error("Erro ao carregar histórico de aberturas", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [monitoramento]);

  const formatarData = (dataStr) => {
    if (!dataStr) return 'Não informada';
    const [ano, mes, dia] = dataStr.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  if (loading) {
    return (
      <HistoricoContainer>
        <h4>Aberturas de Caixas</h4>
        <p style={{ color: '#888', fontSize: '0.9em' }}>Carregando histórico...</p>
      </HistoricoContainer>
    );
  }

  return (
    <HistoricoContainer>
      <h4>Aberturas de Caixas</h4>
      {historico.length === 0 ? (
        <p style={{ fontSize: '0.9em', color: '#666' }}>Nenhum registro encontrado.</p>
      ) : (
        historico.map(item => (
          <EventItem key={item.id}>
            <div className="med-name">{item.medicamento?.nome || 'Medicamento não informado'}</div>
            <div className="event-info">
              <span><strong>Data de Abertura:</strong></span>
              <span>{formatarData(item.data_administracao)}</span>
            </div>
            <div className="event-info">
              <span><strong>ID do Evento:</strong></span>
              <span className="badge">{item.evento_externo_id || 'N/A'}</span>
            </div>
          </EventItem>
        ))
      )}
    </HistoricoContainer>
  );
}