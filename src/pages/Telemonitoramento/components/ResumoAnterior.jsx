import React from 'react';
import { LuHistory } from "react-icons/lu";

export default function ResumoAnterior({ monitoramento }) {
  if (!monitoramento) return null;

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const dataApenasData = dataStr.split('T')[0];
    return dataApenasData.split('-').reverse().join('/');
  };

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
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // Sombra para destacar igual ao modal
    }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: 0, fontSize: '1.2rem', color: 'var(--text-color)' }}>
        <LuHistory /> Resumo do Último Contato
      </h3>

      <div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Data do último contato:</span>
        <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{formatarData(monitoramento.createdAt)}</div>
      </div>

      <div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Adesão ao uso do medicamento:</span>
        <div style={{ 
            fontWeight: 'bold', 
            fontSize: '1.05rem',
            color: monitoramento.nivel_adesao === 'COMPLETAMENTE' ? '#2ecc71' : monitoramento.nivel_adesao === 'PARCIALMENTE' ? '#f39c12' : '#e74c3c'
        }}>
          {monitoramento.nivel_adesao.replace('_', ' ')}
        </div>
      </div>

      <div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Quantidade Informada na Caixa:</span>
        <div style={{ fontWeight: '500', fontSize: '1.05rem' }}>
          {monitoramento.qtd_informada_caixa != null ? `${monitoramento.qtd_informada_caixa} comprimidos` : 'Não informada'}
        </div>
      </div>

      <div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Teve reação adversa?</span>
        <div style={{ fontWeight: '500', fontSize: '1.05rem' }}>{monitoramento.is_reacao ? 'Sim' : 'Não'}</div>
      </div>

      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Observação Registrada:</span>
        <div style={{ 
          backgroundColor: 'rgba(0,0,0,0.02)', 
          padding: '10px', 
          borderRadius: '4px', 
          border: '1px solid #eee',
          marginTop: '4px',
          fontSize: '0.9rem',
          minHeight: '80px',
          color: '#555'
        }}>
          {monitoramento.observacao || 'Nenhuma observação registrada neste contato.'}
        </div>
      </div>
    </div>
  );
}