import React from 'react';
import { LuPencil, LuPower } from "react-icons/lu";
import { TableContainer, Table } from '../styles';
import { ActionButton } from '../../Users/styles';

export default function ReacoesAdversasList({ data, loading, onEdit, onToggleActive }) {
  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th style={{ width: '100px' }}>ID</th>
            <th>Nome da Reação</th>
            <th style={{ width: '150px' }}>Status</th>
            <th style={{ textAlign: 'right', width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', opacity: 0.7 }}>
                Nenhuma reação encontrada.
              </td>
            </tr>
          ) : (
            data.map((reacao) => (
              <tr key={reacao.id} style={{ opacity: reacao.active ? 1 : 0.6 }}>
                <td>#{reacao.id}</td>
                <td><strong>{reacao.name}</strong></td>
                <td>
                  <span style={{ 
                    color: reacao.active ? '#52c41a' : '#ff4d4f', 
                    fontWeight: 'bold' 
                  }}>
                    {reacao.active ? '● Ativo' : '○ Inativo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <ActionButton className="edit" onClick={() => onEdit(reacao)} title="Editar">
                    <LuPencil size={18} />
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => onToggleActive(reacao)}
                    style={{ color: reacao.active ? '#ff4d4f' : '#52c41a', borderColor: reacao.active ? '#ff4d4f' : '#52c41a' }}
                    title={reacao.active ? 'Desativar' : 'Ativar'}
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