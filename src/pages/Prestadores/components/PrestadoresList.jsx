import React from 'react';
import { TableContainer, Table, ActionButton, TypeBadge } from '../styles'; 
import { LuPencil, LuPower } from "react-icons/lu";

export default function PrestadoresList({ data, loading, onEdit, onToggleActive }) {
  
  if (loading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', opacity: 0.7 }}>
        Buscando prestadores...
      </div>
    );
  }

  const formatTipo = (tipo) => {
    const tipos = { hospital: 'Hospital', clinica: 'Clínica', laboratorio: 'Laboratório' };
    return tipos[tipo] || tipo;
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>Nome / Razão Social</th>
            <th>CNPJ</th>
            <th>Tipo</th>
            <th>Localização</th>
            <th style={{ width: '120px' }}>Status</th>
            <th style={{ textAlign: 'right', width: '120px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', opacity: 0.7 }}>
                Nenhum prestador encontrado.
              </td>
            </tr>
          ) : (
            data.map(p => (
              <tr key={p.id} style={{ opacity: p.active === false ? 0.6 : 1 }}>
                <td><strong>{p.nome}</strong></td>
                <td>{p.cnpj}</td>
                <td>
                  <TypeBadge>{formatTipo(p.tipo)}</TypeBadge>
                </td>
                <td>{p.cidade} - {p.estado}</td>
                <td>
                  <span style={{ 
                    color: p.active !== false ? '#52c41a' : '#ff4d4f', 
                    fontWeight: 'bold' 
                  }}>
                    {p.active !== false ? '● Ativo' : '○ Inativo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <ActionButton 
                    className="edit" 
                    onClick={() => onEdit(p)} 
                    title="Editar Prestador"
                  >
                    <LuPencil size={18} />
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => onToggleActive(p)}
                    style={{ color: p.active !== false ? '#ff4d4f' : '#52c41a', borderColor: p.active !== false ? '#ff4d4f' : '#52c41a' }}
                    title={p.active !== false ? 'Desativar' : 'Ativar'}
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