import React from 'react';
import { Table, ActionButton } from '../styles';
import { LuPencil, LuPaperclip, LuBan, LuPower } from "react-icons/lu"; // Importei o LuPower

export default function PacientesList({ data, loading, onEdit, onViewAnexos, onToggleActive }) {
  
  if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>Buscando pacientes...</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>Nome Completo</th>
          <th>CPF</th>
          <th>Celular</th>
          <th>Cidade/UF</th>
          <th>Operadora</th>
          <th style={{ textAlign: 'center' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
           <tr>
             <td colSpan="6" style={{textAlign:'center', padding: '30px', color: '#666'}}>
               Nenhum paciente encontrado com esses filtros.
             </td>
           </tr>
        ) : (
          data.map(p => {
            const temAnexo = p.anexos && p.anexos.length > 0;
            // Se is_active for estritamente false, ele está inativo. Se for null/true, está ativo.
            const inativo = p.is_active === false; 

            return (
              <tr key={p.id} style={{ backgroundColor: inativo ? 'rgba(255, 60, 60, 0.12)' : 'transparent' }}>
                <td><strong>{p.nome} {p.sobrenome}</strong></td>
                <td>{p.cpf}</td>
                <td>{p.celular}</td>
                <td>{p.cidade} - {p.estado}</td>
                <td>{p.operadoras?.nome || '-'}</td>
                <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  
                  {/* Botão de Editar */}
                  <ActionButton 
                    onClick={() => onEdit(p)}
                    title="Editar Paciente"
                  >
                    <LuPencil size={18} />
                  </ActionButton>

                  {/* Botão de Inativar / Ativar */}
                  <ActionButton 
                    onClick={() => onToggleActive(p)}
                    title={inativo ? "Reativar Paciente" : "Inativar Paciente"}
                    style={{ background: inativo ? '#28a745' : '#dc3545', color: '#fff' }}
                  >
                    <LuPower size={18} />
                  </ActionButton>

                  {/* Botão de Anexo Condicional */}
                  {temAnexo ? (
                    <ActionButton 
                      onClick={() => onViewAnexos(p)}
                      title="Ver Anexos"
                      style={{ background: '#17a2b8', color: '#fff' }}
                    >
                      <LuPaperclip size={18} />
                    </ActionButton>
                  ) : (
                    <ActionButton 
                      title="Paciente sem anexo"
                      style={{ background: '#f8f9fa', color: '#ccc', cursor: 'not-allowed' }}
                      disabled
                    >
                      <LuBan size={18} />
                    </ActionButton>
                  )}

                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </Table>
  );
}