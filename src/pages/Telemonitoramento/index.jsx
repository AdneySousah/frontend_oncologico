import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import TelemonitoramentoModal from './components/TelemonitoramentoModal';
import TelemonitoramentoModalConjunto from './components/TelemonitoramentoModalConjunto';
import EditTelemonitoramentoModal from './components/EditTelemonitoramentoModal';
import NpsModal from './components/NpsModal';
import FiltrosTelemonitoramento from './components/FiltrosTelemonitoramento';
import { LuPhoneCall, LuChevronDown, LuChevronUp, LuInfo, LuPencil, LuUsers } from "react-icons/lu";
import { useSearchParams } from 'react-router-dom';
import {
  Container, SectionWrapper, Title, TableWrapper, Table,
  SubTableWrapper, SubTable, StatusBadge, ActionButton,
  HeaderFlex, InfoButton, ModalOverlay, ModalContent, Button,
  AdherenceBadge, LegendList,
  ControlsContainer, PaginationContainer, PageButton, PaginationInfo, TooltipContainer, TruncatedText
} from './styles';


import IniciarTratamentoModal from './components/IniciarTratamentoModal';

export const getAdherenceClassification = (score) => {
  if (score == null) return { label: 'Sem Avaliação', level: 'none' };
  if (score <= 9) return { label: 'Paciente com alta tendência a adesão ao tratamento', level: 'alta' };
  if (score <= 12) return { label: 'Paciente com tendência moderada a adesão ao tratamento', level: 'media' };
  return { label: 'Paciente com tendência baixa a adesão ao tratamento', level: 'baixa' };
};

const percentualAdesao = (nivel) => {
  if (nivel === 'COMPLETAMENTE') return 100;
  if (nivel === 'PARCIALMENTE') return 50;
  if (nivel === 'NAO_ADERE') return 0;
  return null;
};

const construirLinhasSubtabela = (grupo) => {
  const historicoOrdenado = [...grupo.historico].sort((a, b) => {
    if (a.status === 'PENDENTE' && b.status !== 'PENDENTE') return -1;
    if (a.status !== 'PENDENTE' && b.status === 'PENDENTE') return 1;
    const dateA = a.data_telemonitoramento_efetivado ? new Date(a.data_telemonitoramento_efetivado) : new Date(a.createdAt);
    const dateB = b.data_telemonitoramento_efetivado ? new Date(b.data_telemonitoramento_efetivado) : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  const linhas = [];
  const idsJaAgrupados = new Set();

  historicoOrdenado.forEach(hist => {
    if (idsJaAgrupados.has(hist.id)) return;

    if (!hist.grupo_medicamentos_id) {
      linhas.push({ tipo: 'INDIVIDUAL', item: hist });
      return;
    }

    let parceiros;
    if (hist.status === 'PENDENTE') {
      parceiros = historicoOrdenado.filter(
        h => h.status === 'PENDENTE' && h.grupo_medicamentos_id === hist.grupo_medicamentos_id
      );
    } else if (hist.data_telemonitoramento_efetivado) {
      parceiros = historicoOrdenado.filter(
        h => h.status === 'CONCLUIDO'
          && h.grupo_medicamentos_id === hist.grupo_medicamentos_id
          && h.data_telemonitoramento_efetivado === hist.data_telemonitoramento_efetivado
      );
    } else {
      parceiros = [hist];
    }

    if (parceiros.length > 1) {
      parceiros.forEach(p => idsJaAgrupados.add(p.id));
      linhas.push({ tipo: 'CONJUNTO', itens: parceiros });
    } else {
      linhas.push({ tipo: 'INDIVIDUAL', item: hist });
    }
  });

  return linhas;
};

export default function Telemonitoramento() {
  const [monitoramentosAgrupados, setMonitoramentosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [linhasConjuntoExpandidas, setLinhasConjuntoExpandidas] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7));
  const [incluirDescontinuados, setIncluirDescontinuados] = useState(false);

  const [resumo, setResumo] = useState({ concluidos: 0, pendentes: 0 });
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLegendModalOpen, setIsLegendModalOpen] = useState(false);
  const [selectedMonitoramento, setSelectedMonitoramento] = useState(null);
  const [monitoramentoAnterior, setMonitoramentoAnterior] = useState(null);

  const [isConjuntoModalOpen, setIsConjuntoModalOpen] = useState(false);
  const [monitoramentosConjuntoSelecionados, setMonitoramentosConjuntoSelecionados] = useState(null);
  const [monitoramentosAnterioresConjunto, setMonitoramentosAnterioresConjunto] = useState({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState(null);

  const [npsWaitingItems, setNpsWaitingItems] = useState([]);
  const [isNpsModalOpen, setIsNpsModalOpen] = useState(false);
  const [monitoramentoParaNps, setMonitoramentoParaNps] = useState(null);

  const [sincronizandoId, setSincronizandoId] = useState(null);


  const [candidatosPorPaciente, setCandidatosPorPaciente] = useState({});
  const [verificandoCandidatosId, setVerificandoCandidatosId] = useState(null);
  const [isIniciarTratamentoModalOpen, setIsIniciarTratamentoModalOpen] = useState(false);
  const [pacienteParaIniciarTratamento, setPacienteParaIniciarTratamento] = useState(null);
  const [candidatosParaIniciarTratamento, setCandidatosParaIniciarTratamento] = useState([]);


  const [searchParams] = useSearchParams();
  const highlightKey = searchParams.get('highlight');

  useEffect(() => {
    const loadNpsWaiting = () => {
      const waiting = JSON.parse(localStorage.getItem('oncologico:nps_waiting') || '[]');
      setNpsWaitingItems(waiting);
    };
    loadNpsWaiting();
    window.addEventListener('updateNpsWaiting', loadNpsWaiting);
    return () => window.removeEventListener('updateNpsWaiting', loadNpsWaiting);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterMonth, incluirDescontinuados]);

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
  }, [currentPage, debouncedSearch, filterMonth, sortConfig, incluirDescontinuados]);

  async function fetchMonitoramentos() {
    try {
      setLoading(true);
      setCandidatosPorPaciente({}); // evita badge vazado de página/filtro anterior
      const response = await api.get('/monitoramento-medicamentos/pendentes', {
        params: {
          page: currentPage,
          limit: limit,
          search: debouncedSearch,
          mes: filterMonth,
          incluir_descontinuados: incluirDescontinuados // 👈 NOVO
        }
      });

      const { data, total, totalPages: fetchedTotalPages, resumoGlobal } = response.data;
      setTotalPages(fetchedTotalPages || 1);
      setTotalItems(total || 0);
      if (resumoGlobal) {
        setResumo({ concluidos: resumoGlobal.concluidos, pendentes: resumoGlobal.pendentes });
      }

      const agrupados = data.reduce((acc, item) => {
        const key = item.paciente?.id;
        if (!key) return acc;

        let scoreMaisRecente = item.avaliacao?.total_score;
        if (item.paciente?.avaliacoes && item.paciente.avaliacoes.length > 0) {
          const avaliacoesOrdenadas = [...item.paciente.avaliacoes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          scoreMaisRecente = avaliacoesOrdenadas[0].total_score;
        }

        if (!acc[key]) {
          acc[key] = {
            key: key,
            paciente: item.paciente,
            avaliacao: { total_score: scoreMaisRecente },
            historico: []
          };
        } else {
          acc[key].avaliacao = { total_score: scoreMaisRecente };
        }

        acc[key].historico.push(item);
        return acc;
      }, {});

      const agrupadosArray = Object.values(agrupados).map(grupo => {
        const pendentes = grupo.historico.filter(h => h.status === 'PENDENTE');

        if (pendentes.length > 0) {
          pendentes.sort((a, b) => new Date(a.data_proximo_contato).getTime() - new Date(b.data_proximo_contato).getTime());
          grupo.contatoAtual = pendentes[0];
          grupo.proximoContatoData = grupo.contatoAtual.data_proximo_contato;
        } else {
          const historicoOrdenado = [...grupo.historico].sort((a, b) => {
            const dateA = a.data_telemonitoramento_efetivado ? new Date(a.data_telemonitoramento_efetivado) : new Date(a.createdAt);
            const dateB = b.data_telemonitoramento_efetivado ? new Date(b.data_telemonitoramento_efetivado) : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          grupo.contatoAtual = historicoOrdenado[0];
          grupo.proximoContatoData = null;
        }

        grupo.medicamentoAtual = grupo.contatoAtual?.medicamento || null;

        if (grupo.contatoAtual?.status === 'PENDENTE' && grupo.contatoAtual.grupo_medicamentos_id) {
          grupo.contatosConjuntoAtual = pendentes.filter(
            p => p.grupo_medicamentos_id === grupo.contatoAtual.grupo_medicamentos_id
          );
        } else {
          grupo.contatosConjuntoAtual = grupo.contatoAtual ? [grupo.contatoAtual] : [];
        }

        grupo.estoqueProjetado = null;
        if (grupo.contatoAtual?.status === 'PENDENTE' && grupo.contatoAtual.data_calculada_fim_caixa && grupo.contatoAtual.posologia_diaria) {
          try {
            const dataFimStr = grupo.contatoAtual.data_calculada_fim_caixa.split('T')[0];
            const [ano, mes, dia] = dataFimStr.split('-');
            const dataFim = new Date(ano, mes - 1, dia);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
            let calculado = Math.max(0, diffDays * grupo.contatoAtual.posologia_diaria);
            const qtdCaixa = grupo.medicamentoAtual?.qtd_capsula || calculado;
            grupo.estoqueProjetado = Math.min(qtdCaixa, calculado);
          } catch (err) {
            console.error("Erro na conversão de data para o estoque:", err);
            grupo.estoqueProjetado = null;
          }
        }

        // Conta RODADAS DE CONTATO (monitoramentos), não linhas cruas do banco.
        // Um par em uso conjunto é UMA rodada, mesmo gerando 2 registros.
        const linhasSubtabela = construirLinhasSubtabela(grupo);
        grupo.linhasSubtabela = linhasSubtabela;

        let qtdConcluido = 0;
        let qtdPendente = 0;
        const percentuaisAdesao = [];

        linhasSubtabela.forEach(linha => {
          if (linha.tipo === 'INDIVIDUAL') {
            const item = linha.item;
            if (item.status === 'CONCLUIDO') {
              qtdConcluido++;
              const pct = percentualAdesao(item.nivel_adesao);
              if (pct !== null) percentuaisAdesao.push(pct);
            }
            if (item.status === 'PENDENTE') qtdPendente++;
          } else {
            const status = linha.itens[0].status;
            if (status === 'CONCLUIDO') {
              qtdConcluido++;
              const pcts = linha.itens.map(i => percentualAdesao(i.nivel_adesao)).filter(p => p !== null);
              if (pcts.length > 0) percentuaisAdesao.push(pcts.reduce((a, b) => a + b, 0) / pcts.length);
            }
            if (status === 'PENDENTE') qtdPendente++;
          }
        });

        grupo.qtdConcluido = qtdConcluido;
        grupo.qtdPendente = qtdPendente;
        grupo.mediaAdesao = percentuaisAdesao.length > 0
          ? Math.round(percentuaisAdesao.reduce((a, b) => a + b, 0) / percentuaisAdesao.length)
          : null;

        return grupo;
      });


      agrupadosArray.sort((a, b) => {


        if (sortConfig.key === 'data') {
          const timeA = a.proximoContatoData ? new Date(a.proximoContatoData).getTime() : (sortConfig.direction === 'asc' ? Infinity : -Infinity);
          const timeB = b.proximoContatoData ? new Date(b.proximoContatoData).getTime() : (sortConfig.direction === 'asc' ? Infinity : -Infinity);
          return sortConfig.direction === 'asc' ? timeA - timeB : timeB - timeA;
        } else {
          const scoreA = a.avaliacao?.total_score != null ? a.avaliacao.total_score : -1;
          const scoreB = b.avaliacao?.total_score != null ? b.avaliacao.total_score : -1;

          if (scoreA !== scoreB) {
            return sortConfig.direction === 'desc' ? scoreB - scoreA : scoreA - scoreB;
          }
          const mediaA = a.mediaAdesao != null ? a.mediaAdesao : 999;
          const mediaB = b.mediaAdesao != null ? b.mediaAdesao : 999;
          if (mediaA !== mediaB) return mediaA - mediaB;
          if (!a.proximoContatoData) return 1;
          if (!b.proximoContatoData) return -1;
          return new Date(a.proximoContatoData).getTime() - new Date(b.proximoContatoData).getTime();
        }
      });

      setMonitoramentosAgrupados(agrupadosArray);

      if (incluirDescontinuados && agrupadosArray.length > 0) {
        buscarCandidatosRetomada(agrupadosArray.map(g => g.key));
      }
    } catch (error) {
      toast.error('Erro ao carregar lista de monitoramentos.');
    } finally {
      setLoading(false);
    }
  }

  const buscarCandidatosRetomada = async (idsPacientes) => {
    if (!idsPacientes || idsPacientes.length === 0) return;
    try {
      const response = await api.get('/monitoramento-medicamentos/candidatos-retomada', {
        params: { paciente_ids: idsPacientes.join(',') }
      });
      setCandidatosPorPaciente(prev => ({ ...prev, ...response.data.candidatos }));
    } catch (error) {
      console.error('Erro ao buscar candidatos de retomada:', error);
    }
  };

  const verificarNovamenteCandidatos = async (pacienteId) => {
    try {
      setVerificandoCandidatosId(pacienteId);
      await api.post(`/pacientes/${pacienteId}/sync-individual`);
    } catch (error) {
      console.error('Erro ao sincronizar paciente:', error);
      toast.warning('Não foi possível verificar atualizações recentes deste paciente.', { autoClose: 5000 });
    }
    await buscarCandidatosRetomada([pacienteId]);
    setVerificandoCandidatosId(null);
  };

  const abrirIniciarTratamento = (grupo) => {
    setPacienteParaIniciarTratamento(grupo.paciente);
    setCandidatosParaIniciarTratamento(candidatosPorPaciente[grupo.key] || []);
    setIsIniciarTratamentoModalOpen(true);
  };


const toggleRow = (key) => {
  setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
};

const toggleLinhaConjunto = (linhaId) => {
  setLinhasConjuntoExpandidas(prev => ({ ...prev, [linhaId]: !prev[linhaId] }));
};

// ==========================================================
// 👇 NOVO: sincroniza este paciente com o sistema externo antes de abrir o
// modal de registro. Sem isso, se um segundo medicamento (ou uma nova
// compra) foi criado no sistema externo depois do último sync geral, o
// atendente veria informação desatualizada ao registrar o contato.
// Falha na sincronização não bloqueia o fluxo — segue com os dados locais.
// ==========================================================
const sincronizarPacienteAntesDeAbrir = async (pacienteId) => {
  try {
    await api.post(`/pacientes/${pacienteId}/sync-individual`);
  } catch (error) {
    console.error('Erro ao sincronizar paciente antes de abrir o contato:', error);
    toast.warning('Não foi possível verificar atualizações recentes deste paciente. Os dados exibidos podem estar desatualizados.', { autoClose: 6000 });
  }
};

const handleOpenModal = async (hist, latestScore, historicoDoGrupo) => {
  setSincronizandoId(hist.id);
  await sincronizarPacienteAntesDeAbrir(hist.paciente_id);
  setSincronizandoId(null);

  const concluidos = historicoDoGrupo.filter(
    item => item.status === 'CONCLUIDO' && item.medicamento_id === hist.medicamento_id
  );
  concluidos.sort((a, b) => {
    const dateA = a.data_telemonitoramento_efetivado ? new Date(a.data_telemonitoramento_efetivado) : new Date(a.createdAt);
    const dateB = b.data_telemonitoramento_efetivado ? new Date(b.data_telemonitoramento_efetivado) : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  const ultimoConcluido = concluidos.length > 0 ? concluidos[0] : null;

  const updatedHist = {
    ...hist,
    avaliacao: { total_score: latestScore }
  };

  setSelectedMonitoramento(updatedHist);
  setMonitoramentoAnterior(ultimoConcluido);
  setIsModalOpen(true);
};

const handleOpenModalConjunto = async (pendentesDoGrupo, historicoDoGrupo, latestScore) => {
  const primeiroItem = pendentesDoGrupo[0];
  setSincronizandoId(primeiroItem?.id);
  if (primeiroItem?.paciente_id) {
    await sincronizarPacienteAntesDeAbrir(primeiroItem.paciente_id);
  }
  setSincronizandoId(null);

  const anteriores = {};
  pendentesDoGrupo.forEach(hist => {
    const concluidos = historicoDoGrupo
      .filter(item => item.status === 'CONCLUIDO' && item.medicamento_id === hist.medicamento_id)
      .sort((a, b) => {
        const dateA = a.data_telemonitoramento_efetivado ? new Date(a.data_telemonitoramento_efetivado) : new Date(a.createdAt);
        const dateB = b.data_telemonitoramento_efetivado ? new Date(b.data_telemonitoramento_efetivado) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    anteriores[hist.id] = concluidos.length > 0 ? concluidos[0] : null;
  });

  const pendentesComScore = pendentesDoGrupo.map(p => ({ ...p, avaliacao: { total_score: latestScore } }));

  setMonitoramentosConjuntoSelecionados(pendentesComScore);
  setMonitoramentosAnterioresConjunto(anteriores);
  setIsConjuntoModalOpen(true);
};

const handleOpenEditModal = (monitoramentoId) => {
  setSelectedEditId(monitoramentoId);
  setIsEditModalOpen(true);
};

const formatarData = (dataStr) => {
  if (!dataStr) return '-';
  const dataApenasData = dataStr.split('T')[0];
  return dataApenasData.split('-').reverse().join('/');
};

const calcularStatusTempo = (dataStr) => {
  if (!dataStr) return { texto: '-', status: 'pendente' };
  const dataApenasData = dataStr.split('T')[0];
  const dataContato = new Date(dataApenasData + 'T00:00:00');
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

const handleSort = (key) => {
  setSortConfig((prevConfig) => {
    if (prevConfig.key === key) {
      return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
    }
    return { key, direction: key === 'score' ? 'desc' : 'asc' };
  });
};

// Linha resumo de um par "Uso Conjunto" (pendente ou concluído), clicável
// para expandir. zebraBg é a cor de fundo alternada vinda do índice da linha.
const renderLinhaConjunto = (itens, grupo, zebraBg) => {
  const isPendente = itens[0].status === 'PENDENTE';
  const linhaId = `conjunto-${[...itens].map(i => i.id).sort((a, b) => a - b).join('-')}`;
  const expandido = !!linhasConjuntoExpandidas[linhaId];
  const estaSincronizando = sincronizandoId === itens[0].id;

  const dataProgContato = isPendente
    ? [...itens].sort((a, b) => new Date(a.data_proximo_contato) - new Date(b.data_proximo_contato))[0].data_proximo_contato
    : itens[0].data_abertura_nova_caixa;

  const infoTempo = isPendente ? calcularStatusTempo(dataProgContato) : null;

  const niveisAdesaoUnicos = [...new Set(itens.map(i => i.nivel_adesao).filter(Boolean))];
  const adesaoCombinadaLabel = isPendente
    ? '-'
    : (niveisAdesaoUnicos.length === 1
      ? (niveisAdesaoUnicos[0] === 'NAO_ADERE' ? 'NAO ADERE' : niveisAdesaoUnicos[0])
      : 'Divergente');

  return (
    <React.Fragment key={linhaId}>
      <tr
        onClick={() => toggleLinhaConjunto(linhaId)}
        style={{ cursor: 'pointer', backgroundColor: expandido ? 'rgba(138, 43, 226, 0.08)' : zebraBg }}
      >
        <td style={{ color: '#999' }}>—</td>
        <td style={{ whiteSpace: 'nowrap' }}>
          <strong>{dataProgContato ? formatarData(dataProgContato) : '-'}</strong>
        </td>
        <td style={{ fontWeight: '600', color: '#8a2be2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LuUsers size={14} />
            <span>Uso Conjunto</span>
            <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'normal' }}>({itens.length} medicamentos)</span>
            {expandido ? <LuChevronUp size={14} /> : <LuChevronDown size={14} />}
          </div>
          {!expandido && (
            <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 'normal', marginTop: '2px' }}>
              {itens.map(i => i.medicamento?.nome).join(' + ')}
            </div>
          )}
        </td>
        <td style={{ color: '#999' }}>—</td>
        <td>
          {adesaoCombinadaLabel === 'Divergente' ? (
            <span style={{ color: '#e67e22', fontWeight: 'bold' }}>Divergente</span>
          ) : adesaoCombinadaLabel}
        </td>
        <td>
          {isPendente ? (
            <StatusBadge status={infoTempo.status}>{infoTempo.texto}</StatusBadge>
          ) : (
            <StatusBadge status="concluido">CONCLUÍDO</StatusBadge>
          )}
        </td>
        <td style={{ color: '#999' }}>—</td>
        <td onClick={(e) => e.stopPropagation()}>
          {isPendente ? (
            <ActionButton
              disabled={estaSincronizando}
              onClick={() => handleOpenModalConjunto(itens, grupo.historico, grupo.avaliacao?.total_score)}
            >
              {estaSincronizando ? 'Sincronizando...' : 'Registrar Contato (2 medicamentos)'}
            </ActionButton>
          ) : (
            <span
              style={{ color: '#8a2be2', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => toggleLinhaConjunto(linhaId)}
            >
              {expandido ? 'Ocultar detalhes' : 'Ver detalhes'}
            </span>
          )}
        </td>
      </tr>

      {expandido && itens.map(item => {
        const infoTempoItem = calcularStatusTempo(item.data_proximo_contato);
        const observacaoExibir = item.observacao || '-';
        const isNpsWaiting = npsWaitingItems.some(n => n.monitoramentoId === item.id);

        return (
          <tr key={item.id} style={{ backgroundColor: 'rgba(138, 43, 226, 0.05)' }}>
            <td style={{ whiteSpace: 'nowrap', paddingLeft: '28px', fontSize: '0.85rem', color: '#888' }}>
              {formatarData(item.data_entrega)}
            </td>
            <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{formatarData(item.data_proximo_contato)}</td>

            <td style={{ fontWeight: '500', color: 'var(--text-color)' }}>
              <span style={{ color: '#8a2be2', marginRight: '4px' }}>↳</span>{item.medicamento?.nome || '-'}
              {item.mudou_posologia && (
                <TooltipContainer
                  data-tooltip={`Alterado para ${item.nova_posologia} cp/dia em ${formatarData(item.data_mudanca_posologia)}`}
                >
                  <span style={{
                    marginLeft: '6px', fontSize: '0.68rem', backgroundColor: '#e2e3e5',
                    color: '#555', padding: '2px 6px', borderRadius: '4px',
                    fontWeight: 'bold', cursor: 'help', whiteSpace: 'nowrap'
                  }}>
                    ⚙ posologia alterada
                  </span>
                </TooltipContainer>
              )}
            </td>
            <td style={{ whiteSpace: 'nowrap' }}>{formatarData(item.data_calculada_fim_caixa)}</td>
            <td>{item.nivel_adesao === 'NAO_ADERE' ? 'NAO ADERE' : item.nivel_adesao || '-'}</td>
            <td>
              {item.status === 'CONCLUIDO' ? (
                <StatusBadge status="concluido">CONCLUÍDO</StatusBadge>
              ) : (
                <StatusBadge status={infoTempoItem.status}>{infoTempoItem.texto}</StatusBadge>
              )}
            </td>
            <td style={{ maxWidth: '180px', fontSize: '0.85rem', color: '#555' }}>
              {observacaoExibir !== '-' ? (
                <TooltipContainer data-tooltip={observacaoExibir}>
                  <TruncatedText>{observacaoExibir}</TruncatedText>
                </TooltipContainer>
              ) : '-'}
            </td>
            <td>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {item.status === 'PENDENTE' ? (
                  <span style={{ color: '#888', fontSize: '0.78rem', fontStyle: 'italic' }}>
                    Registrado junto com o outro medicamento
                  </span>
                ) : (
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>Já realizado</span>
                    <ActionButton
                      onClick={() => handleOpenEditModal(item.id)}
                      style={{ padding: '6px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Editar este contato concluído"
                    >
                      <LuPencil size={14} />
                    </ActionButton>
                  </div>
                )}
                {isNpsWaiting && (
                  <ActionButton
                    style={{ backgroundColor: '#8a2be2', borderColor: '#8a2be2', color: '#fff' }}
                    onClick={() => {
                      setMonitoramentoParaNps({ ...item, paciente: grupo.paciente });
                      setIsNpsModalOpen(true);
                    }}
                  >
                    Acompanhar NPS
                  </ActionButton>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </React.Fragment>
  );
};

return (
  <Container>
    <SectionWrapper>
      <HeaderFlex>
        <Title><LuPhoneCall style={{ marginRight: '10px' }} /> Telemonitoramentos agendados</Title>
        <InfoButton onClick={() => setIsLegendModalOpen(true)}>
          <LuInfo size={18} /> Entenda as Pontuações
        </InfoButton>
      </HeaderFlex>

      <ControlsContainer>
        <p style={{ margin: 0, color: 'var(--text-color)', opacity: 0.8, fontSize: '0.95rem' }}>
          Gerencie o uso contínuo de medicamentos. A lista está ordenada priorizando pacientes com maior risco de baixa adesão.
        </p>


        <FiltrosTelemonitoramento
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#666', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={incluirDescontinuados}
            onChange={(e) => setIncluirDescontinuados(e.target.checked)}
          />
          Mostrar apenas pacientes com acompanhamento encerrado
        </label>
      </ControlsContainer>

      {loading && monitoramentosAgrupados.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', fontSize: '1.1rem' }}>Carregando contatos agendados...</div>
      ) : monitoramentosAgrupados.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3>Nenhum paciente encontrado para este filtro.</h3>
        </div>
      ) : (
        <>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('score')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    title="Ordenar por Score de Adesão"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Paciente e Adesão
                      {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />)}
                    </div>
                  </th>
                  <th>Cuidador</th>
                  <th>Operadora</th>
                  <th>Medicamento Atual</th>
                  <th
                    onClick={() => handleSort('data')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    title="Ordenar por Data do Próximo Contato"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Próximo Contato
                      {sortConfig.key === 'data' && (sortConfig.direction === 'asc' ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />)}
                    </div>
                  </th>
                  <th>Status Geral</th>
                  <th style={{ textAlign: 'right' }}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {monitoramentosAgrupados.map(grupo => {
                  const adInfo = getAdherenceClassification(grupo.avaliacao?.total_score);
                  const tempoProximoContato = calcularStatusTempo(grupo.proximoContatoData);
                  const isHighlighted = highlightKey === String(grupo.key);
                  const usoConjuntoAtivo = grupo.contatosConjuntoAtual && grupo.contatosConjuntoAtual.length > 1;

                  return (
                    <React.Fragment key={grupo.key}>
                      <tr
                        id={`row-${grupo.key}`}
                        className="summary-row"
                        onClick={() => toggleRow(grupo.key)}
                        style={
                          isHighlighted
                            ? { backgroundColor: 'rgba(250, 173, 20, 0.15)', borderLeft: '4px solid #f39c12' }
                            : incluirDescontinuados
                              ? { backgroundColor: 'rgba(231, 76, 60, 0.08)', opacity: 0.85 }
                              : {}
                        }
                      >
                        <td>
                          <strong>{grupo.paciente?.nome} {grupo.paciente?.sobrenome}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>Score: <strong>{grupo.avaliacao?.total_score != null ? `${grupo.avaliacao?.total_score} pts` : '-'}</strong></span>
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
                                  Média: {grupo.mediaAdesao}%
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
                        <td>
                          {grupo.paciente?.possui_cuidador ? (
                            <div style={{ lineHeight: '1.4' }}>
                              <strong>{grupo.paciente?.nome_cuidador || 'Não informado'}</strong><br />
                              <small style={{ opacity: 0.8 }}>{grupo.paciente?.contato_cuidador || '-'}</small>
                            </div>
                          ) : (
                            <StatusBadge status="none" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', borderColor: 'transparent' }}>
                              Não Possui
                            </StatusBadge>
                          )}
                        </td>
                        <td>{grupo.paciente?.operadoras?.nome}</td>
                        <td>
                          {usoConjuntoAtivo ? (
                            <>
                              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8a2be2', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <LuUsers size={13} /> Uso Conjunto ({grupo.contatosConjuntoAtual.length} medicamentos)
                              </div>
                              {grupo.contatosConjuntoAtual.map(c => (
                                <div key={c.id} style={{ fontWeight: '500' }}>{c.medicamento?.nome}</div>
                              ))}
                            </>
                          ) : grupo.medicamentoAtual ? (
                            <>
                              <div style={{ fontWeight: '500' }}>{grupo.medicamentoAtual.nome}</div>
                              {grupo.estoqueProjetado != null && (
                                <div style={{
                                  fontSize: '0.75rem', color: 'var(--primary-color)', backgroundColor: 'rgba(0,0,0,0.04)',
                                  padding: '2px 6px', borderRadius: '4px', display: 'inline-block',
                                  marginTop: '4px', border: '1px solid var(--border-color)'
                                }}>
                                  ~{grupo.estoqueProjetado} un. estimadas
                                </div>
                              )}
                            </>
                          ) : (
                            <div style={{ color: '#888', fontStyle: 'italic' }}>Não encontrado</div>
                          )}
                        </td>
                        <td onClick={(e) => incluirDescontinuados && e.stopPropagation()}>
                            {incluirDescontinuados ? (
                              <div>
                                <span style={{ color: '#c0392b', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                                  Acompanhamento Encerrado
                                </span>
                                {candidatosPorPaciente[grupo.key] && candidatosPorPaciente[grupo.key].length > 0 ? (
                                  <>
                                    <span style={{ fontSize: '0.78rem', color: '#27ae60', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                                      🔔 {candidatosPorPaciente[grupo.key].map(c => c.medicamento_nome).join(' + ')}
                                    </span>
                                    <ActionButton
                                      style={{ backgroundColor: '#27ae60', borderColor: '#27ae60' }}
                                      onClick={() => abrirIniciarTratamento(grupo)}
                                    >
                                      Iniciar Tratamento
                                    </ActionButton>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={verificandoCandidatosId === grupo.key}
                                    onClick={() => verificarNovamenteCandidatos(grupo.key)}
                                    style={{
                                      background: 'none', border: '1px solid var(--border-color, #ccc)', borderRadius: '4px',
                                      padding: '4px 8px', fontSize: '0.78rem', color: '#666', cursor: 'pointer'
                                    }}
                                  >
                                    {verificandoCandidatosId === grupo.key ? 'Verificando...' : 'Verificar novamente'}
                                  </button>
                                )}
                              </div>
                            ) : grupo.proximoContatoData ? (
                            <>
                              <div style={{ fontWeight: 'bold' }}>{formatarData(grupo.proximoContatoData)}</div>
                              <span style={{ fontSize: '0.8rem', color: tempoProximoContato.status === 'atrasado' ? '#e74c3c' : '#888' }}>
                                {tempoProximoContato.texto}
                              </span>
                            </>
                          ) : (
                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Ciclo Concluído</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2ecc71' }}>
                              ✓ {grupo.qtdConcluido} Concluído(s)
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f39c12' }}>
                              ⏳ {grupo.qtdPendente} Pendente(s)
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--primary-color)' }}>
                          {expandedRows[grupo.key] ? <LuChevronUp size={22} /> : <LuChevronDown size={22} />}
                        </td>
                      </tr>
                      {expandedRows[grupo.key] && (
                        <tr className="details-row">
                          <td colSpan="7">
                            <SubTableWrapper>
                              <SubTable>
                                <thead>
                                  <tr>
                                    <th>Data Prev. Adm.</th>
                                    <th>Data Prog. Contato</th>
                                    <th>Medicamento</th>
                                    <th>Fim da Caixa</th>
                                    <th>Adesão Tele.</th>
                                    <th>Status Contato</th>
                                    <th>Observações</th>
                                    <th>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {grupo.linhasSubtabela.map((linha, index) => {
                                    const zebraBg = index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.025)';

                                    if (linha.tipo === 'CONJUNTO') {
                                      return renderLinhaConjunto(linha.itens, grupo, zebraBg);
                                    }

                                    // DEPOIS
                                    const hist = linha.item;
                                    const isDescontinuado = hist.status === 'DESCONTINUADO'; // 👈 NOVO
                                    const infoTempo = calcularStatusTempo(hist.data_proximo_contato);
                                    const observacaoExibir = hist.observacao || '-';
                                    const isNpsWaiting = npsWaitingItems.some(n => n.monitoramentoId === hist.id);
                                    const estaSincronizando = sincronizandoId === hist.id;

                                    return (
                                      <tr key={hist.id} style={{ backgroundColor: isDescontinuado ? 'rgba(231, 76, 60, 0.08)' : zebraBg }}>
                                        <td style={{ whiteSpace: 'nowrap' }}>{formatarData(hist.data_entrega)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}><strong>{formatarData(hist.data_proximo_contato)}</strong></td>

                                        <td style={{ fontWeight: '500', color: 'var(--text-color)' }}>
                                          {hist.medicamento?.nome || '-'}
                                          {hist.mudou_posologia && (
                                            <TooltipContainer
                                              data-tooltip={`Alterado para ${hist.nova_posologia} cp/dia em ${formatarData(hist.data_mudanca_posologia)}`}
                                            >
                                              <span style={{
                                                marginLeft: '6px', fontSize: '0.68rem', backgroundColor: '#e2e3e5',
                                                color: '#555', padding: '2px 6px', borderRadius: '4px',
                                                fontWeight: 'bold', cursor: 'help', whiteSpace: 'nowrap'
                                              }}>
                                                ⚙ posologia alterada
                                              </span>
                                            </TooltipContainer>
                                          )}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{formatarData(hist.data_calculada_fim_caixa)}</td>
                                        <td>{hist.nivel_adesao === 'NAO_ADERE' ? 'NAO ADERE' : hist.nivel_adesao || '-'}</td>
                                        <td>
                                          {isDescontinuado ? (
                                            <StatusBadge
                                              status="descontinuado"
                                              style={{ backgroundColor: '#fdecea', color: '#c0392b', borderColor: '#e74c3c' }}
                                              title={hist.motivo_encerramento ? `Motivo: ${hist.motivo_encerramento}` : 'Motivo não informado'}
                                            >
                                              DESCONTINUADO
                                            </StatusBadge>
                                          ) : hist.status === 'CONCLUIDO' ? (
                                            <StatusBadge status="concluido">CONCLUÍDO</StatusBadge>
                                          ) : (
                                            <StatusBadge status={infoTempo.status}>{infoTempo.texto}</StatusBadge>
                                          )}
                                        </td>
                                        <td style={{ maxWidth: '180px', fontSize: '0.85rem', color: '#555' }}>
                                          {observacaoExibir !== '-' ? (
                                            <TooltipContainer data-tooltip={observacaoExibir}>
                                              <TruncatedText>{observacaoExibir}</TruncatedText>
                                            </TooltipContainer>
                                          ) : '-'}
                                        </td>
                                        <td>
                                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {hist.status === 'PENDENTE' ? (
                                              <ActionButton
                                                disabled={estaSincronizando}
                                                onClick={() => handleOpenModal(hist, grupo.avaliacao?.total_score, grupo.historico)}
                                              >
                                                {estaSincronizando ? 'Sincronizando...' : 'Registrar Contato'}
                                              </ActionButton>
                                            ) : isDescontinuado ? (
                                              // 👇 NOVO: sem botão de editar aqui — a edição retroativa (updateRetroativo,
                                              // backend) só aceita status CONCLUIDO, clicar aqui daria erro 400.
                                              <span style={{ color: '#c0392b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                                Acompanhamento encerrado
                                              </span>
                                            ) : (
                                              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                <span style={{ color: '#888', fontSize: '0.8rem' }}>Já realizado</span>
                                                <ActionButton
                                                  onClick={() => handleOpenEditModal(hist.id)}
                                                  style={{ padding: '6px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                  title="Editar este contato concluído"
                                                >
                                                  <LuPencil size={14} />
                                                </ActionButton>
                                              </div>
                                            )}
                                            {isNpsWaiting && (
                                              <ActionButton
                                                style={{ backgroundColor: '#8a2be2', borderColor: '#8a2be2', color: '#fff' }}
                                                onClick={() => {
                                                  setMonitoramentoParaNps({ ...hist, paciente: grupo.paciente });
                                                  setIsNpsModalOpen(true);
                                                }}
                                              >
                                                Acompanhar NPS
                                              </ActionButton>
                                            )}
                                          </div>
                                        </td>
                                      </tr>

                                    );
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
          </TableWrapper>

          {totalPages > 0 && (
            <PaginationContainer>
              <PaginationInfo>
                Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> (Total: {totalItems} pendentes)
              </PaginationInfo>
              <div>
                <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                  Anterior
                </PageButton>
                <PageButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
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
      monitoramentoAnterior={monitoramentoAnterior}
      onSucesso={fetchMonitoramentos}
    />

    <TelemonitoramentoModalConjunto
      isOpen={isConjuntoModalOpen}
      onClose={() => setIsConjuntoModalOpen(false)}
      monitoramentos={monitoramentosConjuntoSelecionados}
      monitoramentosAnteriores={monitoramentosAnterioresConjunto}
      onSucesso={fetchMonitoramentos}
    />

    <EditTelemonitoramentoModal
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false);
        setSelectedEditId(null);
      }}
      monitoramentoId={selectedEditId}
      onSucesso={fetchMonitoramentos}
    />

     <IniciarTratamentoModal
        isOpen={isIniciarTratamentoModalOpen}
        onClose={() => setIsIniciarTratamentoModalOpen(false)}
        paciente={pacienteParaIniciarTratamento}
        candidatos={candidatosParaIniciarTratamento}
        onSucesso={fetchMonitoramentos}
      />

    {isNpsModalOpen && monitoramentoParaNps && (
      <NpsModal
        monitoramento={monitoramentoParaNps}
        initialStep="waiting"
        onClose={() => {
          setIsNpsModalOpen(false);
          setMonitoramentoParaNps(null);
        }}
        onBackground={() => setIsNpsModalOpen(false)}
      />
    )}

    {isLegendModalOpen && (
      <ModalOverlay onClick={() => setIsLegendModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <h3>Entenda o Score de Adesão</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            A pontuação máxima do questionário é 17 pontos. Ela nos ajuda a prever a probabilidade do paciente abandonar ou falhar na adesão ao tratamento.
          </p>
          <LegendList>
            <li>
              <AdherenceBadge level="alta" style={{ fontSize: '1rem', padding: '6px 14px' }}>0 a 9 pontos: Alta Probabilidade de Adesão</AdherenceBadge>
              <span style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px', marginLeft: '5px' }}>O paciente apresenta baixo risco de abandono. Manter monitoramento padrão.</span>
            </li>
            <li>
              <AdherenceBadge level="media" style={{ fontSize: '1rem', padding: '6px 14px' }}>10 a 12 pontos: Adesão Moderada (Atenção)</AdherenceBadge>
              <span style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px', marginLeft: '5px' }}>Risco moderado. O paciente pode apresentar esquecimentos ou dificuldades com horários. Requer reforço de orientações.</span>
            </li>
            <li>
              <AdherenceBadge level="baixa" style={{ fontSize: '1rem', padding: '6px 14px' }}>13 ou mais: Risco de Baixa Adesão</AdherenceBadge>
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