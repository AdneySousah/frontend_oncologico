// src/pages/Telemonitoramento/index.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import TelemonitoramentoModal from './components/TelemonitoramentoModal';
import { LuPhoneCall, LuChevronDown, LuChevronUp, LuInfo } from "react-icons/lu";
import { useSearchParams } from 'react-router-dom';

import {
  Container, SectionWrapper, Title, TableContainer, Table,
  SubTableWrapper, SubTable, StatusBadge, ActionButton,
  HeaderFlex, InfoButton, ModalOverlay, ModalContent, Button,
  AdherenceBadge, LegendList
} from './styles';

// Função para classificar o nível de adesão baseado no score
export const getAdherenceClassification = (score) => {
  if (score == null) return { label: 'Sem Avaliação', level: 'none' };
  if (score <= 10) return { label: 'Alta Probabilidade de Adesão', level: 'alta' };
  if (score <= 14) return { label: 'Adesão Moderada (Atenção)', level: 'media' };
  return { label: 'Risco de Baixa Adesão', level: 'baixa' };
};

export default function Telemonitoramento() {
  const [monitoramentosAgrupados, setMonitoramentosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  // Controle de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLegendModalOpen, setIsLegendModalOpen] = useState(false);
  const [selectedMonitoramento, setSelectedMonitoramento] = useState(null);

  const [searchParams] = useSearchParams();
  const highlightKey = searchParams.get('highlight');


  useEffect(() => {
    if (highlightKey && monitoramentosAgrupados.length > 0) {
      setExpandedRows(prev => ({ ...prev, [highlightKey]: true }));

      setTimeout(() => {
        const element = document.getElementById(`row-${highlightKey}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [highlightKey, monitoramentosAgrupados]);


  useEffect(() => {
    fetchMonitoramentos();
  }, []);

  async function fetchMonitoramentos() {
    try {
      setLoading(true);
      const response = await api.get('/monitoramento-medicamentos/pendentes');


      const agrupados = response.data.reduce((acc, item) => {
        const key = `${item.paciente.id}_${item.medicamento.id}`;

        if (!acc[key]) {
          acc[key] = {
            key: key,
            paciente: item.paciente,
            medicamento: item.medicamento,
            avaliacao: item.avaliacao,
            historico: [],
            qtdConcluido: 0,
            qtdPendente: 0,
            proximoContatoData: null // Nova propriedade
          };
        }

        acc[key].historico.push(item);
        if (item.status === 'CONCLUIDO') acc[key].qtdConcluido++;
        if (item.status === 'PENDENTE') acc[key].qtdPendente++;

        return acc;
      }, {});

      // Lógica para encontrar qual é a data do próximo contato na aba de resumo
      const agrupadosArray = Object.values(agrupados).map(grupo => {
        const pendentes = grupo.historico.filter(h => h.status === 'PENDENTE');
        if (pendentes.length > 0) {
          // Ordena pelas datas mais antigas primeiro
          pendentes.sort((a, b) => new Date(a.data_proximo_contato) - new Date(b.data_proximo_contato));
          grupo.proximoContatoData = pendentes[0].data_proximo_contato;
        }
        return grupo;
      });

      setMonitoramentosAgrupados(agrupadosArray);
    } catch (error) {
      toast.error('Erro ao carregar lista de monitoramentos.');
    } finally {
      setLoading(false);
    }
  }

  const toggleRow = (key) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenModal = (item) => {
    setSelectedMonitoramento(item);
    setIsModalOpen(true);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    return dataStr.split('-').reverse().join('/');
  };

  const calcularStatusTempo = (dataStr) => {
    if (!dataStr) return { texto: '-', status: 'pendente' };

    const dataContato = new Date(dataStr + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diffTime = dataContato - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { texto: 'Hoje', status: 'pendente' };
    if (diffDays === 1) return { texto: 'Amanhã', status: 'pendente' };
    if (diffDays > 1) return { texto: `Em ${diffDays} dias`, status: 'pendente' };

    if (diffDays === -1) return { texto: 'Atrasado há 1 dia', status: 'atrasado' };
    return { texto: `Atrasado há ${Math.abs(diffDays)} dias`, status: 'atrasado' };
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: '1.2rem' }}>Carregando contatos agendados...</div>;
  }

  return (
    <Container>
      <SectionWrapper>

        {/* CABEÇALHO ATUALIZADO */}
        <HeaderFlex>
          <Title><LuPhoneCall style={{ marginRight: '10px' }} /> Telemonitoramento Ativo</Title>
          <InfoButton onClick={() => setIsLegendModalOpen(true)}>
            <LuInfo size={20} /> Entenda as Pontuações
          </InfoButton>
        </HeaderFlex>

        <p style={{ marginBottom: '20px', color: 'var(--text-color)', opacity: 0.8 }}>
          Lista de pacientes em uso contínuo de medicamentos. Clique no paciente para expandir o histórico de contatos.
        </p>

        {monitoramentosAgrupados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3>Nenhum paciente no ciclo de monitoramento ainda.</h3>
          </div>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Paciente e Adesão</th>
                  <th>Operadora</th>
                  <th>Medicamento</th>
                  <th>Próximo Contato</th>
                  <th>Status Geral</th>
                  <th style={{ textAlign: 'right' }}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {monitoramentosAgrupados.map(grupo => {
                  const adInfo = getAdherenceClassification(grupo.avaliacao?.total_score);
                  const tempoProximoContato = calcularStatusTempo(grupo.proximoContatoData);
                  const isHighlighted = highlightKey === grupo.key;

                  return (
                    <React.Fragment key={grupo.key}>
                      <tr
                        id={`row-${grupo.key}`} // <-- ADD O ID AQUI
                        className="summary-row"
                        onClick={() => toggleRow(grupo.key)}
                        // <-- ADD ESTE STYLE
                        style={isHighlighted ? { backgroundColor: 'rgba(250, 173, 20, 0.15)', borderLeft: '4px solid #f39c12' } : {}}
                      >
                        {/* 1. Nome e Badge de Adesão */}
                        <td>
                          <strong>{grupo.paciente?.nome} {grupo.paciente?.sobrenome}</strong>
                          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>
                            Score Atual: {grupo.avaliacao?.total_score || '-'} pts
                          </div>
                          {grupo.avaliacao?.total_score != null && (
                            <AdherenceBadge level={adInfo.level}>
                              {adInfo.label}
                            </AdherenceBadge>
                          )}
                        </td>
                          <td>{grupo.paciente?.operadoras?.nome}</td>
                        {/* 2. Medicamento */}
                        <td>{grupo.medicamento?.nome}</td>

                        {/* 3. Próximo Contato Rápido */}
                        <td>
                          {grupo.proximoContatoData ? (
                            <>
                              <div style={{ fontWeight: 'bold' }}>{formatarData(grupo.proximoContatoData)}</div>
                              <span style={{ fontSize: '0.85rem', color: tempoProximoContato.status === 'atrasado' ? '#e74c3c' : '#888' }}>
                                {tempoProximoContato.texto}
                              </span>
                            </>
                          ) : (
                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Ciclo Concluído</span>
                          )}
                        </td>

                        {/* 4. Status (Quantidades) */}
                        <td>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2ecc71', marginRight: '15px' }}>
                            {grupo.qtdConcluido} Concluído(s)
                          </span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f39c12' }}>
                            {grupo.qtdPendente} Pendente(s)
                          </span>
                        </td>

                        {/* 5. Setinha */}
                        <td style={{ textAlign: 'right', color: 'var(--primary-color)' }}>
                          {expandedRows[grupo.key] ? <LuChevronUp size={24} /> : <LuChevronDown size={24} />}
                        </td>
                      </tr>

                      {expandedRows[grupo.key] && (
                        <tr className="details-row">
                          <td colSpan="5">
                            <SubTableWrapper>
                              <SubTable>
                                <thead>
                                  <tr>
                                    <th>Data Programada</th>
                                    <th>Previsão Fim da Caixa</th>
                                    <th>Status do Contato</th>
                                    <th>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {grupo.historico.map(hist => {
                                    const infoTempo = calcularStatusTempo(hist.data_proximo_contato);

                                    return (
                                      <tr key={hist.id}>
                                        <td>
                                          <strong>{formatarData(hist.data_proximo_contato)}</strong>
                                        </td>
                                        <td>{formatarData(hist.data_calculada_fim_caixa)}</td>
                                        <td>
                                          {hist.status === 'CONCLUIDO' ? (
                                            <StatusBadge status="concluido">CONCLUÍDO</StatusBadge>
                                          ) : (
                                            <StatusBadge status={infoTempo.status}>
                                              {infoTempo.texto}
                                            </StatusBadge>
                                          )}
                                        </td>
                                        <td>
                                          {hist.status === 'PENDENTE' ? (
                                            <ActionButton onClick={() => handleOpenModal(hist)}>
                                              Registrar Contato
                                            </ActionButton>
                                          ) : (
                                            <span style={{ color: '#888', fontSize: '0.85rem' }}>Contato já realizado</span>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </SubTable>
                            </SubTableWrapper>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </SectionWrapper>

      {/* Modal Principal de Registro */}
      <TelemonitoramentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        monitoramento={selectedMonitoramento}
        onSucesso={fetchMonitoramentos}
      />

      {/* NOVO: Modal de Legenda das Pontuações */}
      {isLegendModalOpen && (
        <ModalOverlay onClick={() => setIsLegendModalOpen(false)}>
          {/* onClick no Content com e.stopPropagation() evita que feche se clicar dentro da caixa branca */}
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Entenda o Score de Adesão</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              A pontuação máxima do questionário é 17 pontos. Ela nos ajuda a prever a probabilidade do paciente abandonar ou falhar na adesão ao tratamento.
            </p>

            <LegendList>
              <li>
                <AdherenceBadge level="alta" style={{ fontSize: '1rem', padding: '6px 14px' }}>0 a 10 pontos: Alta Probabilidade de Adesão</AdherenceBadge>
                <span style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px', marginLeft: '5px' }}>O paciente apresenta baixo risco de abandono. Manter monitoramento padrão.</span>
              </li>
              <li>
                <AdherenceBadge level="media" style={{ fontSize: '1rem', padding: '6px 14px' }}>11 a 14 pontos: Adesão Moderada (Atenção)</AdherenceBadge>
                <span style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px', marginLeft: '5px' }}>Risco moderado. O paciente pode apresentar esquecimentos ou dificuldades com horários. Requer reforço de orientações.</span>
              </li>
              <li>
                <AdherenceBadge level="baixa" style={{ fontSize: '1rem', padding: '6px 14px' }}>15 a 17 pontos: Risco de Baixa Adesão</AdherenceBadge>
                <span style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px', marginLeft: '5px' }}>Alta chance de interrupção do tratamento. Necessário acompanhamento próximo e escuta ativa.</span>
              </li>
            </LegendList>

            <Button style={{ width: '100%' }} onClick={() => setIsLegendModalOpen(false)}>Entendi</Button>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
}