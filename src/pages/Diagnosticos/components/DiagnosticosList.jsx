import React from 'react';
import { LuPencil, LuPower } from "react-icons/lu";
import { TableContainer, Table, ActionButton } from '../styles';

export default function DiagnosticosList({ data, loading, onEdit, onToggleActive }) {
  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th style={{ width: '100px' }}>ID</th>
            <th>Diagnóstico / CID</th>
            <th style={{ width: '150px' }}>Status</th>
            <th style={{ textAlign: 'right', width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', opacity: 0.7 }}>
                Nenhum diagnóstico encontrado.
              </td>
            </tr>
          ) : (
            data.map((diag) => (
              <tr key={diag.id} style={{ opacity: diag.active ? 1 : 0.6 }}>
                <td>#{diag.id}</td>
                <td><strong>{diag.diagnostico}</strong></td>
                <td>
                  <span style={{ 
                    color: diag.active ? '#52c41a' : '#ff4d4f', 
                    fontWeight: 'bold' 
                  }}>
                    {diag.active ? '● Ativo' : '○ Inativo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <ActionButton className="edit" onClick={() => onEdit(diag)} title="Editar">
                    <LuPencil size={18} />
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => onToggleActive(diag)}
                    style={{ color: diag.active ? '#ff4d4f' : '#52c41a', borderColor: diag.active ? '#ff4d4f' : '#52c41a' }}
                    title={diag.active ? 'Desativar' : 'Ativar'}
                  >
                    <LuPower size={18} />
                  </ActionButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}