import React from 'react';
import { 
  LuX, 
  LuUser, 
  LuStethoscope, 
  LuCircleAlert, 
  LuFlaskConical, 
  LuPill, 
  LuHistory,
  LuPaperclip, 
  LuDownload 
} from "react-icons/lu";
import api from '../../../services/api'; 
import { 
  ModalOverlay, 
  ModalContainer, 
  ModalHeader, 
  ModalSection, 
  ModalGrid, 
  ModalLabel, 
  ModalText 
} from './styles';

export default function EntrevistaDetailsModal({ data, onClose }) {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        
        <ModalHeader>
          <h2>Detalhes da Entrevista Médica</h2>
          <button onClick={onClose} title="Fechar modal">
            <LuX size={24} />
          </button>
        </ModalHeader>

        {/* PACIENTE */}
        <ModalSection>
          <h3><LuUser /> Paciente e Atendimento</h3>
          <ModalGrid>
            <div><ModalLabel>Paciente</ModalLabel><ModalText>{data.paciente?.nome} {data.paciente?.sobrenome}</ModalText></div>
            <div><ModalLabel>Data do Contato</ModalLabel><ModalText>{formatDate(data.data_contato)}</ModalText></div>
            <div><ModalLabel>Local de Atendimento</ModalLabel><ModalText>{data.prestador_medico?.nome}</ModalText></div>
          </ModalGrid>
        </ModalSection>

        {/* DADOS MÉDICOS */}
        <ModalSection>
          <h3><LuStethoscope /> Dados Clínicos</h3>
          <ModalGrid>
            <div><ModalLabel>Médico Responsável</ModalLabel><ModalText>{data.medico?.nome} (CRM: {data.medico?.crm})</ModalText></div>
            <div><ModalLabel>Diagnóstico Primário (CID)</ModalLabel><ModalText>{data.diagnostico_cid?.diagnostico}</ModalText></div>
            <div><ModalLabel>Estadiamento</ModalLabel><ModalText>{data.estadiamento}</ModalText></div>
          </ModalGrid>
          {data.observacoes && (
            <div style={{ marginTop: '15px' }}>
              <ModalLabel>Observações / Diagnóstico Completo</ModalLabel>
              <ModalText className="box">{data.observacoes}</ModalText>
            </div>
          )}
        </ModalSection>

        {/* COMORBIDADES */}
        <ModalSection>
          <h3><LuCircleAlert /> Comorbidades</h3>
          {data.infos_comorbidade?.possui_comorbidade ? (
            <ModalGrid>
              <div><ModalLabel>Comorbidade Relatada</ModalLabel><ModalText>{data.infos_comorbidade?.comorbidade_mestre?.nome}</ModalText></div>
              <div><ModalLabel>Paciente sabe o diagnóstico?</ModalLabel><ModalText>{data.infos_comorbidade?.sabe_diagnostico ? 'Sim' : 'Não'}</ModalText></div>
              {data.infos_comorbidade?.sabe_diagnostico && (
                <div><ModalLabel>Descrição Relatada</ModalLabel><ModalText>{data.infos_comorbidade?.descricao_diagnostico}</ModalText></div>
              )}
            </ModalGrid>
          ) : (
            <ModalText>Nenhuma comorbidade relatada.</ModalText>
          )}
        </ModalSection>

        {/* EXAMES */}
        <ModalSection>
          <h3><LuFlaskConical /> Exames Relevantes</h3>
          {data.exames?.possui_exame ? (
            <ModalGrid>
              <div><ModalLabel>Exame</ModalLabel><ModalText>{data.exames?.nome_exame} ({data.exames?.tipo_exame})</ModalText></div>
              <div><ModalLabel>Laboratório</ModalLabel><ModalText>{data.exames?.prestador_medico?.nome}</ModalText></div>
              <div><ModalLabel>Resultado</ModalLabel><ModalText>{data.exames?.resultado_exame}</ModalText></div>
              <div><ModalLabel>Data de Realização</ModalLabel><ModalText>{formatDate(data.exames?.data_exame_realizado)}</ModalText></div>
            </ModalGrid>
          ) : (
            <ModalText>Nenhum exame apresentado.</ModalText>
          )}
        </ModalSection>

        {/* MEDICAMENTOS */}
        <ModalSection>
          <h3><LuPill /> Uso de Medicamentos Contínuos</h3>
          {data.infos_medicamento?.possui_medicamento ? (
            <ModalGrid>
              <div><ModalLabel>Medicamento</ModalLabel><ModalText>{data.infos_medicamento?.medicamento_mestre?.nome}</ModalText></div>
              <div><ModalLabel>Dosagem Padrão</ModalLabel><ModalText>{data.infos_medicamento?.medicamento_mestre?.dosagem}</ModalText></div>
            </ModalGrid>
          ) : (
            <ModalText>O paciente não faz uso de medicamentos contínuos.</ModalText>
          )}
        </ModalSection>

        {/* ANEXOS */}
        <ModalSection>
          <h3><LuPaperclip /> Anexos da Entrevista</h3>
          {data.anexos && data.anexos.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {data.anexos.map(anexo => (
                <div key={anexo.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
                  background: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '15px', color: '#444' }}>{anexo.nome}</strong>
                    <span style={{ fontSize: '12px', color: '#777' }}>{anexo.original_name}</span>
                  </div>
                  
                  <a 
                    href={`${api.defaults.baseURL}/files/entrevistas/${anexo.file_path}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    download 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '5px',
                      background: '#007bff', color: '#fff', padding: '8px 12px',
                      borderRadius: '4px', textDecoration: 'none', fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    <LuDownload size={16} /> Baixar
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <ModalText>Nenhum anexo registrado nesta entrevista.</ModalText>
          )}
        </ModalSection>

        {/* PRÓXIMOS PASSOS */}
        <ModalSection>
          <h3><LuHistory /> Próximos Passos</h3>
          <ModalGrid>
            <div><ModalLabel>Data do Próximo Contato</ModalLabel><ModalText>{formatDate(data.data_proximo_contato)}</ModalText></div>
            <div><ModalLabel>Turno Preferencial</ModalLabel><ModalText>{data.turno_contato || '-'}</ModalText></div>
          </ModalGrid>
        </ModalSection>

      </ModalContainer>
    </ModalOverlay>
  );
}