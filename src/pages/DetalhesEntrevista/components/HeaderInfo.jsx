import React from 'react';
import { Section, InfoGrid, InfoItem, TotalScoreBadge, Title } from '../styles';

export default function HeaderInfo({ data }) {
  const avaliacao = data.avaliacao || {};

  return (
    <Section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Title>Entrevista Médica #{data.id}</Title>
          
          <InfoGrid>
            <InfoItem>
              <strong>Paciente</strong>
              {/* Usa o objeto paciente */}
              <span>{data.paciente?.nome} {data.paciente?.sobrenome}</span>
            </InfoItem>
            <InfoItem>
              <strong>Médico Responsável</strong>
              {/* Usa o objeto medico */}
              <span>{data.medico?.nome}</span>
            </InfoItem>
            <InfoItem>
              <strong>Data Contato</strong>
              <span>{data.data_contato}</span>
            </InfoItem>
            <InfoItem>
              <strong>Estadiamento</strong>
              <span>{data.estadiamento || '-'}</span>
            </InfoItem>
             <InfoItem>
              <strong>Próx. Contato</strong>
              <span>{avaliacao.data_proximo_contato || data.data_proximo_contato}</span>
            </InfoItem>
          </InfoGrid>

          <InfoItem>
            <strong>Observações Gerais</strong>
            <p style={{ marginTop: 5, color: '#444' }}>{data.observacoes || "Sem observações."}</p>
          </InfoItem>
        </div>

        {avaliacao.total_score !== undefined && (
          <TotalScoreBadge>
            <span>Score Total</span>
            <strong>{avaliacao.total_score} pts</strong>
          </TotalScoreBadge>
        )}
      </div>
    </Section>
  );
}