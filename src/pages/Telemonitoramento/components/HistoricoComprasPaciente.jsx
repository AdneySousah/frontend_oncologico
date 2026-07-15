import React, { useState, useEffect } from 'react';
import { LuShoppingCart } from "react-icons/lu";
import api from '../../../services/api';
import { toast } from 'react-toastify';

export default function HistoricoComprasPaciente({ monitoramento }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!monitoramento?.id) return;
    
    let isMounted = true;
    setLoading(true);

    api.get(`/monitoramento-medicamentos/${monitoramento.id}/historico-compras`)
      .then(res => {
        if (isMounted) setHistorico(res.data);
      })
      .catch(err => {
        if (isMounted) toast.error("Erro ao carregar histórico de compras.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [monitoramento]);

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    return dataStr.split('-').reverse().join('/');
  };

  if (!monitoramento) return null;

  return (
    <div style={{
      width: '350px',
      backgroundColor: 'var(--surface-color, #ffffff)',
      border: '1px solid var(--border-color, #e0e0e0)',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      maxHeight: '500px',
      overflowY: 'auto'
    }}>
      <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: 0, fontSize: '1.2rem' }}>
        <LuShoppingCart style={{ marginRight: '8px' }} /> Histórico de Compras
      </h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Carregando...</div>
      ) : historico.map(evento => {
        // Verifica se este é o evento sendo monitorado agora
        const isCurrent = String(evento.external_id) === String(monitoramento.evento_externo_id);
        
        return (
          <div key={evento.id} style={{
            backgroundColor: isCurrent ? 'rgba(52, 152, 219, 0.1)' : 'rgba(0,0,0,0.02)',
            padding: '12px',
            borderRadius: '6px',
            border: isCurrent ? '1px solid #3498db' : '1px solid #eee',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong>ID Evento: {evento.external_id || '-'}</strong>
              {isCurrent && <span style={{ color: '#3498db', fontWeight: 'bold' }}>ATUAL</span>}
            </div>
            
            <div style={{ color: '#555' }}>
              <strong>{evento.medicamento?.nome}</strong><br/>
              {evento.qtd_caixas} caixa(s) | {evento.qtd_caixas * (evento.medicamento?.qtd_capsula || 0)} comps.
            </div>
            
            <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#888' }}>
              Recebimento: {formatarData(evento.data_entrega_real || evento.data_entrega_prevista)}
            </div>
          </div>
        );
      })}
    </div>
  );
}