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
  ModalText,
  ModalBlock,
  ModalList,
  ModalListItem,
  ModalItemTextGroup,
  ModalItemTitle,
  ModalItemSubtitle,
  ModalDownloadLink
} from './styles';

export default function EntrevistaDetailsModal({ data, onClose }) {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
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
            <ModalBlock mt="15px">
              <ModalLabel>Observações / Diagnóstico Completo</ModalLabel>
              <ModalText className="box">{data.observacoes}</ModalText>
            </ModalBlock>
          )}
        </ModalSection>

        {/* COMORBIDADES */}
        <ModalSection>
          <h3><LuCircleAlert /> Comorbidades</h3>
          {data.infos_comorbidade && data.infos_comorbidade.possui_comorbidade ? (
            <ModalGrid>
              <div><ModalLabel>Comorbidade Relatada</ModalLabel><ModalText>{data.infos_comorbidade.comorbidade_mestre?.nome}</ModalText></div>
              <div><ModalLabel>Paciente sabe o diagnóstico?</ModalLabel><ModalText>{data.infos_comorbidade.sabe_diagnostico ? 'Sim' : 'Não'}</ModalText></div>
              {data.infos_comorbidade.sabe_diagnostico && (
                <div><ModalLabel>Descrição Relatada</ModalLabel><ModalText>{data.infos_comorbidade.descricao_diagnostico}</ModalText></div>
              )}
            </ModalGrid>
          ) : (
            <ModalText>Nenhuma comorbidade relatada.</ModalText>
          )}
        </ModalSection>

        {/* EXAMES */}
        <ModalSection>
          <h3><LuFlaskConical /> Exames Relevantes</h3>
          {data.exames && data.exames.nome_exame ? (
            <ModalGrid>
              <div><ModalLabel>Exame</ModalLabel><ModalText>{data.exames.nome_exame} ({data.exames.tipo_exame})</ModalText></div>
              <div><ModalLabel>Laboratório</ModalLabel><ModalText>{data.exames.prestador_medico?.nome || '-'}</ModalText></div>
              <div><ModalLabel>Resultado</ModalLabel><ModalText>{data.exames.resultado_exame}</ModalText></div>
              <div><ModalLabel>Data de Realização</ModalLabel><ModalText>{formatDate(data.exames.data_exame_realizado)}</ModalText></div>
            </ModalGrid>
          ) : (
            <ModalText>Nenhum exame apresentado ou registrado.</ModalText>
          )}
        </ModalSection>

        {/* MEDICAMENTOS */}
        <ModalSection>
          <h3><LuPill /> Informações de Medicamentos</h3>
          
          <ModalBlock mb="20px">
            <ModalLabel>Outros Medicamentos (Não Oncológicos ou Uso Contínuo)</ModalLabel>
            <ModalText className="box">
              {data.observacao_medicacao || 'Nenhuma observação registrada para medicamentos não oncológicos.'}
            </ModalText>
          </ModalBlock>

          <ModalLabel>Medicamentos Oncológicos em Uso</ModalLabel>
          {data.medicamentos && data.medicamentos.length > 0 ? (
            <ModalList mt="10px">
              {data.medicamentos.map((med, index) => (
                <ModalListItem key={med.id || index} direction="column" gap="4px">
                  <ModalItemTitle>
                    {med.principio_ativo || med.nome_comercial 
                      ? `(${med.nome_comercial || 'S/N'}) ${med.principio_ativo || ''}` 
                      : med.nome}
                  </ModalItemTitle>
                  <ModalItemSubtitle>
                    <strong>Dosagem:</strong> {med.dosagem ? `${med.dosagem} ${med.tipo_dosagem || ''}` : 'Não informada'}
                  </ModalItemSubtitle>
                </ModalListItem>
              ))}
            </ModalList>
          ) : (
            <ModalText>O paciente não faz uso de medicamentos oncológicos.</ModalText>
          )}
        </ModalSection>

        {/* ANEXOS */}
        <ModalSection>
          <h3><LuPaperclip /> Anexos da Entrevista</h3>
          {data.anexos && data.anexos.length > 0 ? (
            <ModalList>
              {data.anexos.map(anexo => (
                <ModalListItem key={anexo.id} direction="row" align="center" justify="space-between">
                  <ModalItemTextGroup>
                    <ModalItemTitle>{anexo.nome}</ModalItemTitle>
                    <ModalItemSubtitle>{anexo.original_name}</ModalItemSubtitle>
                  </ModalItemTextGroup>
                  
                  <ModalDownloadLink 
                    href={`${api.defaults.baseURL}/files/entrevistas/${anexo.file_path}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    download
                  >
                    <LuDownload size={16} /> Baixar
                  </ModalDownloadLink>
                </ModalListItem>
              ))}
            </ModalList>
          ) : (
            <ModalText>Nenhum anexo registrado nesta entrevista.</ModalText>
          )}
        </ModalSection>

        {/* PRÓXIMOS PASSOS */}
        <ModalSection>
          <h3><LuHistory /> Próximos Passos</h3>
          <ModalGrid>
            <div><ModalLabel>Data do Próximo Contato</ModalLabel><ModalText>{formatDate(data.data_proximo_contato)}</ModalText></div>
            
          </ModalGrid>
        </ModalSection>

      </ModalContainer>
    </ModalOverlay>
  );
}