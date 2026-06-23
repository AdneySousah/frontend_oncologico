import React, { useMemo } from 'react';
import { LuRefreshCw, LuCheckCheck } from 'react-icons/lu';
import {
  SectionWrapper, Title, Button, HistoryWrapper, Table, Th, Td, Tr, ActionButton
} from '../styles';

export default function HistoricoAvaliacoes({
  historyData,
  loadingHistory,
  onBack,
  onRetake
}) {
  
  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    return dataStr.split('-').reverse().join('/');
  };

  // Função para verificar se a avaliação vence em 10 dias ou menos (ou se já passou)
  // Mantida para fins visuais (cor da data)
  const isWithin10Days = (dateStr) => {
    if (!dateStr) return false;
    
    const [year, month, day] = dateStr.split('-');
    const targetDate = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 10;
  };

  // Identifica qual é a avaliação mais recente de cada template
  const latestByTemplate = useMemo(() => {
    const latest = new Set();
    const seenTemplates = new Set();

    historyData.forEach(hist => {
      if (!seenTemplates.has(hist.template_id)) {
        seenTemplates.add(hist.template_id);
        latest.add(hist.id);
      }
    });

    return latest;
  }, [historyData]);

  return (
    <SectionWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title>Histórico de Avaliações</Title>
        <Button onClick={onBack}>Voltar para a Lista</Button>
      </div>

      {loadingHistory ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-color)', fontSize: '1.2rem' }}>
          Carregando histórico...
        </div>
      ) : (
        <HistoryWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Paciente</Th>
                <Th>Avaliação</Th>
                <Th>Data da Avaliação</Th>
                <Th>Pontuação</Th>
                <Th>Próxima Prevista</Th>
                <Th style={{ textAlign: 'center' }}>Ação</Th>
              </tr>
            </thead>
            <tbody>
              {historyData.map(hist => {
                // Checa se é a última avaliação feita deste questionário
                const isLatest = latestByTemplate.has(hist.id);
                
                // Usado agora apenas para estilizar a cor da data (alerta visual)
                const isCloseToDate = isWithin10Days(hist.data_proxima_avaliacao);
                
                return (
                  <Tr key={hist.id}>
                    <Td>{hist.paciente?.nome} {hist.paciente?.sobrenome}</Td>
                    <Td>{hist.template?.title}</Td>
                    <Td>{formatarData(hist.createdAt?.split('T')[0])}</Td>
                    <Td style={{ fontWeight: 'bold' }}>{hist.total_score} pts</Td>
                    
                    {/* A cor fica vermelha se estiver perto, azul se for a mais recente com folga, ou cinza se for antiga */}
                    <Td style={{ color: (isLatest && isCloseToDate) ? '#d9534f' : isLatest ? '#007BFF' : '#888', fontWeight: 'bold' }}>
                      {formatarData(hist.data_proxima_avaliacao)}
                    </Td>
                    
                    <Td style={{ textAlign: 'center' }}>
                      {!isLatest ? (
                        <span style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <LuCheckCheck size={16} /> Atualizada
                        </span>
                      ) : (
                        // O botão agora é renderizado sempre que isLatest for true, ignorando o prazo
                        <ActionButton onClick={() => onRetake(hist.template_id)}>
                          <LuRefreshCw size={16} /> Refazer
                        </ActionButton>
                      )}
                    </Td>
                  </Tr>
                );
              })}
              
              {historyData.length === 0 && (
                <Tr>
                  <Td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                    Nenhum histórico encontrado para este paciente.
                  </Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </HistoryWrapper>
      )}
    </SectionWrapper>
  );
}