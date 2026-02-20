import React from 'react';
import { Table, ActionButton } from '../styles';
import { LuPencil } from "react-icons/lu";

export default function ComorbidadesList({ data, loading, onEdit }) {
  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome da Comorbidade</th>
          <th style={{ textAlign: 'right' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="3" style={{ textAlign: 'center', padding: '30px', opacity: 0.7 }}>
              Nenhuma comorbidade cadastrada.
            </td>
          </tr>
        ) : (
          data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td><strong>{item.nome}</strong></td>
              <td style={{ textAlign: 'right' }}>
                <ActionButton className="edit" onClick={() => onEdit(item)} title="Editar">
                  <LuPencil size={16} />
                </ActionButton>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}