import React from 'react';
import { Table, ActionButton } from '../styles';
import { LuPencil, LuPaperclip, LuBan } from "react-icons/lu";

// Agora recebe onViewAnexos para lidar com o clique do botão de anexo
export default function PacientesList({ data, loading, onEdit, onViewAnexos }) {
  
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
            // Verifica se o paciente tem anexos retornados pelo backend
            const temAnexo = p.anexos && p.anexos.length > 0;

            return (
              <tr key={p.id}>
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

                  {/* Botão de Anexo Condicional */}
                  {temAnexo ? (
                    <ActionButton 
                      onClick={() => onViewAnexos(p)}
                      title="Ver Anexos"
                      style={{ background: '#17a2b8', color: '#fff' }} // Cor diferente para destacar
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