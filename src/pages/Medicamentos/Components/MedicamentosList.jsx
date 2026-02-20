import React from 'react';
import { Table, TableWrapper, ActionButton } from '../styles';
import { LuPencil } from "react-icons/lu";

export default function MedicamentosList({ data, loading, onEdit }) {
  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>Cód TUSS</th>
            <th>Nome Comercial</th>
            <th>Princípio Ativo</th>
            <th>Apresentação</th>
            <th>Dosagem</th>
            <th>Laboratório</th>
            <th>Qtd</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '30px', opacity: 0.7 }}>
                Nenhum medicamento encontrado.
              </td>
            </tr>
          ) : (
            data.map(item => (
              <tr key={item.id}>
                <td>{item.codigo_tuss || '-'}</td>
                <td><strong>{item.nome_comercial || '-'}</strong></td>
                <td>{item.principio_ativo || '-'}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.nome}>
                  {item.nome}
                </td>
                <td>
                  {item.dosagem ? `${item.dosagem} ${item.tipo_dosagem || ''}` : '-'}
                </td>
                <td>{item.laboratorio || '-'}</td>
                <td>{item.qtd_capsula || '-'}</td>
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
    </TableWrapper>
  );
}