import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import TelemonitoramentoModal from './components/TelemonitoramentoModal';
import { LuPhoneCall, LuChevronDown, LuChevronUp, LuInfo, LuSearch } from "react-icons/lu";
import { useSearchParams } from 'react-router-dom';

import {
  Container, SectionWrapper, Title, TableContainer, Table,
  SubTableWrapper, SubTable, StatusBadge, ActionButton,
  HeaderFlex, InfoButton, ModalOverlay, ModalContent, Button,
  AdherenceBadge, LegendList,
  ControlsContainer, SearchInputContainer, SearchInput, PaginationContainer, PageButton, PaginationInfo
} from './styles';

export const getAdherenceClassification = (score) => {
  if (score == null) return { label: 'Sem Avaliação', level: 'none' };

  if (score <= 9) {
    return { 
      label: 'Paciente com alta tendência a adesão ao tratamento', 
      level: 'alta' 
    };
  }

  if (score <= 12) {
    return { 
      label: 'Paciente com tendência moderada a adesão ao tratamento', 
      level: 'media' 
    };
  }

  return { 
    label: 'Paciente com tendência baixa a adesão ao tratamento', 
    level: 'baixa' 
  };
};

export default function Telemonitoramento() {
  const [monitoramentosAgrupados, setMonitoramentosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLegendModalOpen, setIsLegendModalOpen] = useState(false);
  const [selectedMonitoramento, setSelectedMonitoramento] = useState(null);

  const [searchParams] = useSearchParams();
  const highlightKey = searchParams.get('highlight');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); 
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

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
  }, [currentPage, debouncedSearch]);

  async function fetchMonitoramentos() {
    try {
      setLoading(true);
      
      const response = await api.get('/monitoramento-medicamentos/pendentes', {
        params: {
          page: currentPage,
          limit: limit,
          search: debouncedSearch
        }
      });

      const { data, total, totalPages: fetchedTotalPages } = response.data;
      
      setTotalPages(fetchedTotalPages || 1);
      setTotalItems(total || 0);

      const agrupados = data.reduce((acc, item) => {
        const key = `${item.paciente.id}_${item.medicamento.id}`;

        if (!acc[key]) {
          acc[key] = {
            key: key,
            paciente: item.paciente,
            medicamento: item.medicamento,
            avaliacao: item.avaliacao,
            historico: [],
            niveisAdesao: [], 
            qtdConcluido: 0,
            qtdPendente: 0,
            proximoContatoData: null,
            estoqueProjetado: null 
          };
        }

        acc[key].historico.push(item);
        if (item.status === 'CONCLUIDO') {
          acc[key].qtdConcluido++;
          if (item.nivel_adesao) {
            acc[key].niveisAdesao.push(item.nivel_adesao); 
          }
        }
        if (item.status === 'PENDENTE') acc[key].qtdPendente++;

        return acc;
      }, {});

      const agrupadosArray = Object.values(agrupados).map(grupo => {
        
        if (grupo.niveisAdesao.length > 0) {
          const somaPercentual = grupo.niveisAdesao.reduce((totalValor, nivel) => {
            if (nivel === 'COMPLETAMENTE') return totalValor + 100;
            if (nivel === 'PARCIALMENTE') return totalValor + 50;
            return totalValor; 
          }, 0);
          grupo.mediaAdesao = Math.round(somaPercentual / grupo.niveisAdesao.length);
        } else {
          grupo.mediaAdesao = null;
        }

        const pendentes = grupo.historico.filter(h => h.status === 'PENDENTE');
        if (pendentes.length > 0) {
          pendentes.sort((a, b) => new Date(a.data_proximo_contato) - new Date(b.data_proximo_contato));
          const contatoAtual = pendentes[0];
          
          grupo.proximoContatoData = contatoAtual.data_proximo_contato;

          if (contatoAtual.data_calculada_fim_caixa && contatoAtual.posologia_diaria) {
            const [ano, mes, dia] = contatoAtual.data_calculada_fim_caixa.split('-');
            const dataFim = new Date(ano, mes - 1, dia);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            const diffDays = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
            grupo.estoqueProjetado = Math.max(0, diffDays * contatoAtual.posologia_diaria);
          }
        }
        return grupo;
      });

      agrupadosArray.sort((a, b) => {
        const scoreA = a.avaliacao?.total_score != null ? a.avaliacao.total_score : -1;
        const scoreB = b.avaliacao?.total_score != null ? b.avaliacao.total_score : -1;

        if (scoreA !== scoreB) return scoreB - scoreA; 

        const mediaA = a.mediaAdesao != null ? a.mediaAdesao : 999;
        const mediaB = b.mediaAdesao != null ? b.mediaAdesao : 999;

        if (mediaA !== mediaB) return mediaA - mediaB; 

        if (!a.proximoContatoData) return 1;
        if (!b.proximoContatoData) return -1;
        
        return new Date(a.proximoContatoData) - new Date(b.proximoContatoData);
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

  return (
    <Container>
      <SectionWrapper>

        <HeaderFlex>
          <Title><LuPhoneCall style={{ marginRight: '10px' }} /> Telemonitoramentos agendados</Title>
          <InfoButton onClick={() => setIsLegendModalOpen(true)}>
            <LuInfo size={20} /> Entenda as Pontuações
          </InfoButton>
        </HeaderFlex>

        <ControlsContainer>
          <p style={{ margin: 0, color: 'var(--text-color)', opacity: 0.8 }}>
            Gerencie o uso contínuo de medicamentos. A lista está ordenada priorizando pacientes com maior risco de baixa adesão.
          </p>
          <SearchInputContainer>
            <LuSearch size={18} />
            <SearchInput 
              type="text" 
              placeholder="Buscar paciente por nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputContainer>
        </ControlsContainer>

        {loading && monitoramentosAgrupados.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', fontSize: '1.2rem' }}>Carregando contatos agendados...</div>
        ) : monitoramentosAgrupados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3>Nenhum paciente encontrado para este filtro.</h3>
          </div>
        ) : (
          <>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Paciente e Adesão</th>
                    {/* --- COLUNAS DO CUIDADOR ADICIONADAS AQUI --- */}
                    <th>Cuidador?</th>
                    <th>Nome Cuidador</th>
                    <th>Contato Cuidador</th>

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
                          id={`row-${grupo.key}`}
                          className="summary-row"
                          onClick={() => toggleRow(grupo.key)}
                          style={isHighlighted ? { backgroundColor: 'rgba(250, 173, 20, 0.15)', borderLeft: '4px solid #f39c12' } : {}}
                        >
                          <td>
                            <strong>{grupo.paciente?.nome} {grupo.paciente?.sobrenome}</strong>
                            
                            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span>Score Atual: <strong>{grupo.avaliacao?.total_score != null ? `${grupo.avaliacao?.total_score} pts` : '-'}</strong></span>
                              
                              {grupo.mediaAdesao !== null && (
                                <>
                                  <span style={{ color: '#ccc' }}>|</span>
                                  <span style={{ 
                                    color: grupo.mediaAdesao >= 80 ? '#27ae60' : grupo.mediaAdesao >= 50 ? '#f39c12' : '#e74c3c',
                                    fontWeight: 'bold',
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)'
                                  }}>
                                    Média de adesão: {grupo.mediaAdesao}%
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {grupo.avaliacao?.total_score != null && (
                              <AdherenceBadge level={adInfo.level}>
                                {adInfo.label}
                              </AdherenceBadge>
                            )}
                          </td>
                          
                          {/* --- DADOS DO CUIDADOR NA TABELA --- */}
                          <td>
                            <StatusBadge 
                              bg={grupo.paciente?.possui_cuidador ? 'rgba(23, 162, 184, 0.15)' : 'rgba(108, 117, 125, 0.15)'} 
                              color={grupo.paciente?.possui_cuidador ? '#17a2b8' : '#6c757d'}
                            >
                              {grupo.paciente?.possui_cuidador ? 'Sim' : 'Não'}
                            </StatusBadge>
                          </td>
                          <td>{grupo.paciente?.nome_cuidador || '-'}</td>
                          <td>{grupo.paciente?.contato_cuidador || '-'}</td>

                          <td>{grupo.paciente?.operadoras?.nome}</td>
                          
                          <td>
                            <div style={{ fontWeight: '500' }}>{grupo.medicamento?.nome}</div>
                            {grupo.estoqueProjetado != null && (
                              <div style={{ 
                                fontSize: '0.8rem', 
                                color: 'var(--primary-color)', 
                                backgroundColor: 'rgba(0,0,0,0.04)', 
                                padding: '2px 8px', 
                                borderRadius: '4px',
                                display: 'inline-block',
                                marginTop: '6px',
                                border: '1px solid var(--border-color)'
                              }}>
                                ~{grupo.estoqueProjetado} un. estimadas
                              </div>
                            )}
                          </td>

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

                          <td>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2ecc71', marginRight: '15px' }}>
                              {grupo.qtdConcluido} Concluído(s)
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f39c12' }}>
                              {grupo.qtdPendente} Pendente(s)
                            </span>
                          </td>

                          <td style={{ textAlign: 'right', color: 'var(--primary-color)' }}>
                            {expandedRows[grupo.key] ? <LuChevronUp size={24} /> : <LuChevronDown size={24} />}
                          </td>
                        </tr>

                        {expandedRows[grupo.key] && (
                          <tr className="details-row">
                            <td colSpan="9"> {/* Aumentei o colSpan para englobar todas as colunas novas */}
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

            {totalPages > 0 && (
              <PaginationContainer>
                <PaginationInfo>
                  Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> (Total: {totalItems} pendentes)
                </PaginationInfo>
                <div>
                  <PageButton 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Anterior
                  </PageButton>
                  <PageButton 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Próxima
                  </PageButton>
                </div>
              </PaginationContainer>
            )}
          </>
        )}
      </SectionWrapper>

      <TelemonitoramentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        monitoramento={selectedMonitoramento}
        onSucesso={fetchMonitoramentos}
      />

      {isLegendModalOpen && (
        <ModalOverlay onClick={() => setIsLegendModalOpen(false)}>
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