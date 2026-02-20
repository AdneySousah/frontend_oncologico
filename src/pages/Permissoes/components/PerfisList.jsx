import React from 'react';
import { Table, ActionButton } from '../styles';
import { LuPencil } from "react-icons/lu";

export default function PerfisList({ data, loading, onEdit }) {
  
  if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>Buscando perfis...</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th style={{ width: '70%' }}>Nome do Perfil</th>
          <th style={{ textAlign: 'center' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
           <tr>
             <td colSpan="3" style={{textAlign:'center', padding: '30px', color: '#666'}}>
               Nenhum perfil cadastrado.
             </td>
           </tr>
        ) : (
          data.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><strong>{p.nome}</strong></td>
              <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <ActionButton 
                  onClick={() => onEdit(p)}
                  title="Editar Permissões"
                >
                  <LuPencil size={18} />
                </ActionButton>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}