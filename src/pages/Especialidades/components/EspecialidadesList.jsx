import React from 'react';
import { LuPencil, LuPower } from "react-icons/lu";
import { TableContainer, Table, ActionButton } from '../styles';

export default function EspecialidadesList({ data, loading, onEdit, onToggleActive }) {
  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th style={{ width: '100px' }}>ID</th>
            <th>Nome da Especialidade</th>
            <th style={{ width: '150px' }}>Status</th>
            <th style={{ textAlign: 'right', width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', opacity: 0.7 }}>
                Nenhuma especialidade encontrada.
              </td>
            </tr>
          ) : (
            data.map((spec) => (
              <tr key={spec.id} style={{ opacity: spec.active ? 1 : 0.6 }}>
                <td>#{spec.id}</td>
                <td><strong>{spec.name}</strong></td>
                <td>
                  <span style={{ 
                    color: spec.active ? '#52c41a' : '#ff4d4f', 
                    fontWeight: 'bold' 
                  }}>
                    {spec.active ? '● Ativo' : '○ Inativo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <ActionButton className="edit" onClick={() => onEdit(spec)} title="Editar">
                    <LuPencil size={18} />
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => onToggleActive(spec)}
                    style={{ color: spec.active ? '#ff4d4f' : '#52c41a', borderColor: spec.active ? '#ff4d4f' : '#52c41a' }}
                    title={spec.active ? 'Desativar' : 'Ativar'}
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