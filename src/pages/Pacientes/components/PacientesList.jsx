import React from 'react';
import { Table, ActionButton } from '../styles';
import { LuPencil, LuPaperclip, LuBan, LuPower, LuUserCheck } from "react-icons/lu";

export default function PacientesList({ data, loading, onEdit, onViewAnexos, onToggleActive, onConfirm, isAdmin }) {

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Buscando pacientes...</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>Nome Completo</th>
          <th>CPF</th>
          <th>Celular</th>
          <th>Operadora</th>
          <th>Medicamento</th> {/* NOVA COLUNA */}
          <th style={{ textAlign: 'center' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
              Nenhum paciente encontrado com esses filtros.
            </td>
          </tr>
        ) : (
          data.map(p => {
            const temAnexo = p.anexos && p.anexos.length > 0;
            const inativo = p.is_active === false;

            return (
              <tr key={p.id} style={{ backgroundColor: inativo ? 'rgba(255, 60, 60, 0.12)' : 'transparent' }}>
                <td>
                  <strong>{p.nome} {p.sobrenome}</strong>
                  {p.is_new_user && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#faad14', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>NOVO</span>}
                </td>
                <td>{p.cpf}</td>
                <td>{p.celular}</td>
                <td>{p.operadoras?.nome || '-'}</td>
                
                {/* MOSTRANDO O NOME DO MEDICAMENTO OU TRAÇO SE FOR NULO */}
                <td>{p.medicamento?.nome || '-'}</td>

                <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {p.is_new_user && isAdmin ===true  &&  (
                    <ActionButton onClick={() => onConfirm(p)} title="Confirmar Cadastro" style={{ background: '#faad14', color: '#fff' }}>
                      <LuUserCheck size={18} />
                    </ActionButton>
                  )}

                  <ActionButton onClick={() => onEdit(p)} title="Editar Paciente">
                    <LuPencil size={18} />
                  </ActionButton>

                  <ActionButton
                    onClick={() => onToggleActive(p)}
                    title={inativo ? "Reativar Paciente" : "Inativar Paciente"}
                    style={{ background: inativo ? '#28a745' : '#d19399', color: '#fff' }}
                  >
                    <LuPower size={18} />
                  </ActionButton>

                  {temAnexo ? (
                    <ActionButton onClick={() => onViewAnexos(p)} title="Ver Anexos" style={{ background: '#17a2b8', color: '#fff' }}>
                      <LuPaperclip size={18} />
                    </ActionButton>
                  ) : (
                    <ActionButton title="Paciente sem anexo" style={{ background: '#f8f9fa', color: '#ccc', cursor: 'not-allowed' }} disabled>
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