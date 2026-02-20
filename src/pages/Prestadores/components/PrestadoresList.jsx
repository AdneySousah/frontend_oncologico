import React from 'react';
import { Table, ActionButton, TypeBadge } from '../styles'; /* Importamos a TypeBadge */
import { LuPencil } from "react-icons/lu";

export default function PrestadoresList({ data, loading, onEdit }) {
  
  if (loading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', opacity: 0.7 }}>
        Buscando prestadores...
      </div>
    );
  }

  const formatTipo = (tipo) => {
    const tipos = {
      hospital: 'Hospital',
      clinica: 'Clínica',
      laboratorio: 'Laboratório'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Nome / Razão Social</th>
          <th>CNPJ</th>
          <th>Tipo</th>
          <th>Localização</th>
          <th style={{ textAlign: 'right' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', padding: '30px', opacity: 0.7 }}>
              Nenhum prestador encontrado com os filtros aplicados.
            </td>
          </tr>
        ) : (
          data.map(p => (
            <tr key={p.id}>
              <td><strong>{p.nome}</strong></td>
              <td>{p.cnpj}</td>
              <td>
                <TypeBadge>{formatTipo(p.tipo)}</TypeBadge>
              </td>
              <td>{p.cidade} - {p.estado}</td>
              <td style={{ textAlign: 'right' }}>
                <ActionButton 
                  onClick={() => onEdit(p)} 
                  title="Editar Prestador"
                >
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