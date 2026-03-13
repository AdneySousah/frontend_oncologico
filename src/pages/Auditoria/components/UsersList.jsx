import React from 'react';
import { Table, ActionButton } from '../styles';
import { LuHistory } from "react-icons/lu";

export default function UsersList({ data, loading, onSelectUser }) {
  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center' }}>Buscando usuários...</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Nome do Usuário</th>
          <th>Email</th>
          <th>Perfil</th>
          <th style={{ textAlign: 'right' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>
              Nenhum usuário encontrado.
            </td>
          </tr>
        ) : (
          data.map(u => (
            <tr key={u.id}>
              <td><strong>{u.name}</strong></td>
              <td>{u.email}</td>
              <td>{u.perfil?.nome || (u.is_admin ? 'Administrador' : 'Padrão')}</td>
              <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                <ActionButton onClick={() => onSelectUser(u)} title="Ver Histórico">
                  <LuHistory size={16} /> Histórico
                </ActionButton>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}