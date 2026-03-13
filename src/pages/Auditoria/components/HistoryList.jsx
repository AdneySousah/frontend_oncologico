import React from 'react';
import { Table, TypeBadge } from '../styles';

export default function HistoryList({ data, loading }) {
  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center' }}>Buscando histórico...</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Data / Hora</th>
          <th>Módulo afetado</th>
          <th>Ação Realizada</th>
          <th>Detalhes da Operação</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>
              Nenhum registro de auditoria encontrado para este filtro.
            </td>
          </tr>
        ) : (
          data.map(log => (
            <tr key={log.id}>
              <td style={{ whiteSpace: 'nowrap' }}>
                <strong>{new Date(log.createdAt).toLocaleDateString('pt-BR')}</strong><br/>
                <small>{new Date(log.createdAt).toLocaleTimeString('pt-BR')}</small>
              </td>
              <td><strong>{log.entity}</strong></td>
              <td>
                <TypeBadge type={log.action_type}>{log.action_type}</TypeBadge>
              </td>
              <td>{log.details}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}