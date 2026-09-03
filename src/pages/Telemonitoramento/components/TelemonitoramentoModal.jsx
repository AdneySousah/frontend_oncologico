import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Select from 'react-select';
import { useTheme } from 'styled-components';
import {
  ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button, InfoBox,
  ProjectedStockBox, SkeletonLoader, ModalLayoutWrapper, PosologiaChangeAlert,
  HighlightedSection
} from './styles';
import { AdherenceBadge } from '../styles';
import { getAdherenceClassification } from '../index';
import { getCustomSelectStyles } from '../../../utils/selectStyles';
import NpsModal from './NpsModal';
import ResumoAnterior from './ResumoAnterior';
import PreMonitoramento from './PreMonitoramento';
import ComparativoNovaCompra from './ComparativoNovaCompra';
import HistoricoComprasPaciente from './HistoricoComprasPaciente';
import HistoricoAberturas from './HistoricoAberturas';
import useReservaEdicaoPaciente from '../../../hooks/useReservaEdicaoPaciente';
import TentativaContatoModal from './TentativaContatoModal';
import PassoRegistroMedicamento from './PassoRegistroMedicamento'; // 👈 NOVO
import EventoReembolsoModal from './EventoReembolsoModal'; // 👈 NOVO

// 👇 NOVO: mesma lógica de "data sugerida" / divergência de adesão já usada
// em TelemonitoramentoModalConjunto.jsx, reaproveitada aqui pro fluxo
// imediato de uso em conjunto (medicamento atual + adicional na mesma sessão).
const DIAS_POR_NIVEL_CONJUNTO = { COMPLETAMENTE: 30, PARCIALMENTE: 15, NAO_ADERE: 7 };
const LABEL_NIVEL_CONJUNTO = {
  COMPLETAMENTE: 'Alta adesão ao uso do medicamento',
  PARCIALMENTE: 'Média adesão ao uso do medicamento',
  NAO_ADERE: 'Baixa adesão ao uso do medicamento'
};
function ajustarFimDeSemanaConjunto(date) {
  const dia = date.getDay();
  if (dia === 6) date.setDate(date.getDate() + 2);
  else if (dia === 0) date.setDate(date.getDate() + 1);
  return date;
}
function calcularDataSugeridaConjunto(nivelA, nivelB) {
  const dias = Math.round((DIAS_POR_NIVEL_CONJUNTO[nivelA] + DIAS_POR_NIVEL_CONJUNTO[nivelB]) / 2);
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return ajustarFimDeSemanaConjunto(data);
}
function calcularDataPorModoConjunto(modo, nivelA, nivelB) {
  if (modo === 'SEMANAL') {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return ajustarFimDeSemanaConjunto(d);
  }
  if (modo === 'MENSAL') {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return ajustarFimDeSemanaConjunto(d);
  }
  return calcularDataSugeridaConjunto(nivelA, nivelB);
}
function formatarDataISOConjunto(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
const formatarDataBRConjunto = (isoStr) => isoStr.split('-').reverse().join('/');

export default function TelemonitoramentoModal({ isOpen, onClose, monitoramento, monitoramentoAnterior, onSucesso }) {
  const theme = useTheme();
  const [localMonitoramento, setLocalMonitoramento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNpsPrompt, setShowNpsPrompt] = useState(false);
  const [reabrirPreTele, setReabrirPreTele] = useState(false); // 👈 NOVO
  // Etapas: CONTATO_EFETIVO (sempre primeiro) -> PRE_TELE (só se necessário)
  // -> FORMULARIO (só alcançável depois de confirmar "Sim" e, se precisou,
  // já ter passado pelo pré-tele).
  const [etapa, setEtapa] = useState('CONTATO_EFETIVO');
  // Estados de Sincronização
  const [loadingCompra, setLoadingCompra] = useState(false);
  const [syncPrompt, setSyncPrompt] = useState(null);
  const [dadosNovaCompra, setDadosNovaCompra] = useState(null);
  const [aplicarNovaCompra, setAplicarNovaCompra] = useState(false);
  const [dataRealInicioNovaCaixa, setDataRealInicioNovaCaixa] = useState('');
  const [posologiaNovaCaixa, setPosologiaNovaCaixa] = useState('');
  const [modoNovoMedicamento, setModoNovoMedicamento] = useState(null);
  const [descontinuarMedicamento, setDescontinuarMedicamento] = useState(false);
  const [motivoEncerramentoSelecionado, setMotivoEncerramentoSelecionado] = useState(null);
  const [listaMotivosEncerramento, setListaMotivosEncerramento] = useState([]);
  const [motivoEncerramento, setMotivoEncerramento] = useState('');
  // Estados Formulario Base
  const [qtdInformada, setQtdInformada] = useState('');
  const [dataAbertura, setDataAbertura] = useState('');
  const [isReacao, setIsReacao] = useState(false);
  const [reacoesSelecionadas, setReacoesSelecionadas] = useState([]);
  const [listaReacoes, setListaReacoes] = useState([]);
  const [nivelAdesao, setNivelAdesao] = useState('COMPLETAMENTE');
  const [observacao, setObservacao] = useState('');
  // Mudança de Posologia no meio do ciclo
  const [mudouPosologia, setMudouPosologia] = useState(false);
  const [novaPosologia, setNovaPosologia] = useState('');
  const [dataMudancaPosologia, setDataMudancaPosologia] = useState('');
  // 👇 NOVO: uso em conjunto — segunda etapa, coleta completa do medicamento adicional
  const [monitoramentoAdicionalConjunto, setMonitoramentoAdicionalConjunto] = useState(null);
  const [carregandoAdicional, setCarregandoAdicional] = useState(false);
  // 👇 NOVO: guarda o id do próximo ciclo do medicamento ATUAL (já criado no
  // primeiro submit) e os dados do medicamento adicional quando há
  // divergência de adesão, pra poder alinhar as duas datas depois.
  const [proximoCicloAtualId, setProximoCicloAtualId] = useState(null);
  const [dadosAdicionalPendente, setDadosAdicionalPendente] = useState(null);
  const [modoDataProximoContatoConjunto, setModoDataProximoContatoConjunto] = useState('MEDIA');
  // 👇 NOVO: evento de reembolso — permite criar o ciclo de reembolso sem
  // sair da tela de "Registrar Contato" quando o estoque zerou, e depois
  // coletar a entrevista completa (comprimidos, adesão, reação) na mesma hora.
  const [mostrarReembolso, setMostrarReembolso] = useState(false);
  const [monitoramentoReembolso, setMonitoramentoReembolso] = useState(null);
  const [carregandoReembolso, setCarregandoReembolso] = useState(false);
  useEffect(() => {
    if (monitoramento) {
      setLocalMonitoramento(monitoramento);
    }
  }, [monitoramento]);
  const setupDates = (monit) => {
    if (monit.data_calculada_fim_caixa) {
      const [ano, mes, dia] = monit.data_calculada_fim_caixa.split('T')[0].split('-');
      const dateObj = new Date(ano, mes - 1, dia);
      dateObj.setDate(dateObj.getDate() + 1);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      setDataRealInicioNovaCaixa(`${y}-${m}-${d}`);
    }
  };
  const checkFuturePurchase = async (monit, isMountedCheck = () => true) => {
    try {
      setLoadingCompra(true);
      const response = await api.get(`/monitoramento-medicamentos/${monit.id}/verificar-compra`);
      if (!isMountedCheck()) return;
      if (response.data && response.data.novaCompraDetectada) {
        setDadosNovaCompra(response.data.detalhes);
        setAplicarNovaCompra(true);
        setPosologiaNovaCaixa(monit.posologia_diaria || '');
        if (response.data.detalhes.data_novo_inicio) {
          const dataDoBackend = response.data.detalhes.data_novo_inicio.split('T')[0];
          setDataRealInicioNovaCaixa(dataDoBackend);
        }
        setModoNovoMedicamento(
          response.data.detalhes.mudou_medicamento
            ? (response.data.detalhes.pode_ser_conjunto ? null : 'SUBSTITUICAO')
            : null
        );
        setDescontinuarMedicamento(false);
        setMotivoEncerramento('');
      }
    } catch (error) {
      if (!isMountedCheck()) return;
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      }
    } finally {
      if (isMountedCheck()) {
        setLoadingCompra(false);
      }
    }
  };
  useEffect(() => {
    let isMounted = true;
    if (isOpen && localMonitoramento?.id) {
      setEtapa('CONTATO_EFETIVO');
      setQtdInformada('');
      setDataAbertura('');
      setIsReacao(false);
      setReacoesSelecionadas([]);
      setNivelAdesao('COMPLETAMENTE');
      setShowNpsPrompt(false);
      setReabrirPreTele(false); // 👈 NOVO
      setObservacao('');
      setMudouPosologia(false);
      setNovaPosologia('');
      setDataMudancaPosologia('');
      setDadosNovaCompra(null);
      setAplicarNovaCompra(false);
      setPosologiaNovaCaixa('');
      setModoNovoMedicamento(null);
      setDescontinuarMedicamento(false);
      setMotivoEncerramento('');
      setSyncPrompt(null);
      setMonitoramentoAdicionalConjunto(null); // 👈 NOVO
      setCarregandoAdicional(false); // 👈 NOVO
      setProximoCicloAtualId(null); // 👈 NOVO
      setDadosAdicionalPendente(null); // 👈 NOVO
      setModoDataProximoContatoConjunto('MEDIA'); // 👈 NOVO
      setMostrarReembolso(false); // 👈 NOVO
      setMonitoramentoReembolso(null); // 👈 NOVO
      setCarregandoReembolso(false); // 👈 NOVO
      setMotivoEncerramentoSelecionado(null);
      setupDates(localMonitoramento);
      api.get('/reacao-adversa')
        .then(response => { if (isMounted) setListaReacoes(response.data); })
        .catch(() => { if (isMounted) toast.error('Erro ao carregar reações adversas.'); });
      // Mesma lista usada em "Pausar Tratamento" (Necessidade de Navegação),
      // pra manter os motivos contabilizáveis de forma consistente.
      api.get('/motivos-pausa-tratamento')
        .then(response => { if (isMounted) setListaMotivosEncerramento(response.data); })
        .catch(() => { if (isMounted) toast.error('Erro ao carregar motivos de descontinuação.'); });
      setLoadingCompra(true);
      api.get(`/monitoramento-medicamentos/${localMonitoramento.id}/verificar-sincronizacao-atual`)
        .then(resSync => {
          if (!isMounted) return;
          if (resSync.data?.requiresConfirmation) {
            setSyncPrompt(resSync.data.details);
            setLoadingCompra(false);
          } else {
            checkFuturePurchase(localMonitoramento, () => isMounted);
          }
        })
        .catch(err => {
          if (!isMounted) return;
          setLoadingCompra(false);
        });
    }
    return () => { isMounted = false; };
  }, [isOpen, localMonitoramento?.id]);
  const handleConfirmSync = async () => {
    try {
      setLoadingCompra(true);
      const res = await api.put(`/monitoramento-medicamentos/${localMonitoramento.id}/confirmar-sincronizacao-atual`, {
        novo_medicamento_id: syncPrompt.novoMedicamentoId,
        nova_qtd_caixas: syncPrompt.qtdCaixasNova,
        nova_qtd_capsula_por_caixa: syncPrompt.novaQtdCapsulaPorCaixa,
        mudou_medicamento: syncPrompt.mudouMedicamento
      });
      setLocalMonitoramento(res.data.monitoramento);
      setupDates(res.data.monitoramento);
      toast.success('Fornecimento atualizado com sucesso!');
      setSyncPrompt(null);
      await checkFuturePurchase(res.data.monitoramento);
    } catch (error) {
      toast.error('Erro ao confirmar atualização');
      setLoadingCompra(false);
    }
  };
  const handleIgnoreSync = async () => {
    setSyncPrompt(null);
    await checkFuturePurchase(localMonitoramento);
  };
  // ==========================================
  // LÓGICA DE RECALCULO E ESTOQUE IDEAL (inalterada)
  // ==========================================
  let idealRemaining = 0;
  let margemMin = 0;
  let margemMax = 0;
  let dataReferenciaFormatada = '-';
  let dataFimCicloAtualFormatada = '-';
  let isAntesDoInicio = false;
  const qtdCaixas = Number(localMonitoramento?.qtd_caixas || 1);
  const qtdTotalCaixa = Number(
    localMonitoramento?.qtd_total_capsulas || (localMonitoramento?.medicamento?.qtd_capsula * qtdCaixas) || 0
  );
  const posologia = Number(localMonitoramento?.posologia_diaria || 1);
  let idealRemainingAntigo = 0;
  const dataUsoReferencia = localMonitoramento?.data_administracao || localMonitoramento?.data_entrega;
  let dataInicioObj = null;
  if (dataUsoReferencia) {
    const dataApenasData = dataUsoReferencia.split('T')[0];
    const [ano, mes, dia] = dataApenasData.split('-');
    dataReferenciaFormatada = `${dia}/${mes}/${ano}`;
    dataInicioObj = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (hoje < dataInicioObj) {
      isAntesDoInicio = true;
    }
  }
  if (localMonitoramento?.data_calculada_fim_caixa) {
    const [ano, mes, dia] = localMonitoramento.data_calculada_fim_caixa.split('T')[0].split('-');
    dataFimCicloAtualFormatada = `${dia}/${mes}/${ano}`;
    const dataFim = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (isAntesDoInicio) {
      idealRemainingAntigo = qtdTotalCaixa;
    } else {
      if (mudouPosologia && dataMudancaPosologia && novaPosologia) {
        const [aM, mM, dM] = dataMudancaPosologia.split('-');
        const dataMudancaObj = new Date(aM, mM - 1, dM);
        const safeDataMudanca = dataMudancaObj < dataInicioObj ? dataInicioObj : dataMudancaObj;
        const diasAntigos = Math.floor((safeDataMudanca - dataInicioObj) / (1000 * 60 * 60 * 24));
        const diasNovos = Math.max(0, Math.floor((hoje - safeDataMudanca) / (1000 * 60 * 60 * 24)));
        const consumoAntigo = diasAntigos * posologia;
        const consumoNovo = diasNovos * Number(novaPosologia);
        idealRemainingAntigo = qtdTotalCaixa - (consumoAntigo + consumoNovo);
      } else {
        const diffDays = Math.max(0, Math.floor((hoje - dataInicioObj) / (1000 * 60 * 60 * 24)));
        idealRemainingAntigo = qtdTotalCaixa - (diffDays * posologia);
      }
      if (idealRemainingAntigo < 0) idealRemainingAntigo = 0;
      if (idealRemainingAntigo > qtdTotalCaixa) idealRemainingAntigo = qtdTotalCaixa;
    }
  }
  if (aplicarNovaCompra && dadosNovaCompra && dataRealInicioNovaCaixa && modoNovoMedicamento !== 'CONJUNTO') {
    const posologiaNova = Number(posologiaNovaCaixa || posologia);
    const [anoNovo, mesNovo, diaNovo] = dataRealInicioNovaCaixa.split('-');
    const dataInicioNovaObj = new Date(anoNovo, mesNovo - 1, diaNovo);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataReferenciaFormatada = `${diaNovo}/${mesNovo}/${anoNovo} (Início Novo Ciclo)`;
    if (hoje < dataInicioNovaObj) {
      idealRemaining = dadosNovaCompra.total_capsulas_novas;
    } else {
      const diasUsoNovaCaixa = Math.floor((hoje - dataInicioNovaObj) / (1000 * 60 * 60 * 24));
      const consumoDesdeOInicio = diasUsoNovaCaixa * posologiaNova;
      idealRemaining = dadosNovaCompra.total_capsulas_novas - consumoDesdeOInicio;
    }
    if (idealRemaining < 0) idealRemaining = 0;
    const diasRestantesTotais = posologiaNova > 0 ? Math.floor(idealRemaining / posologiaNova) : 0;
    const fimNovaCaixaObj = new Date(hoje);
    fimNovaCaixaObj.setDate(fimNovaCaixaObj.getDate() + diasRestantesTotais);
    dataFimCicloAtualFormatada = `${String(fimNovaCaixaObj.getDate()).padStart(2, '0')}/${String(fimNovaCaixaObj.getMonth() + 1).padStart(2, '0')}/${fimNovaCaixaObj.getFullYear()}`;
    margemMin = Math.max(0, idealRemaining - posologiaNova);
    margemMax = idealRemaining + posologiaNova;
  } else {
    idealRemaining = idealRemainingAntigo;
    const posologiaVigente = (mudouPosologia && novaPosologia) ? Number(novaPosologia) : posologia;
    margemMin = Math.max(0, idealRemaining - posologiaVigente);
    margemMax = Math.min(qtdTotalCaixa, idealRemaining + posologiaVigente);
    if (mudouPosologia && novaPosologia > 0 && idealRemaining > 0) {
      const diasRestantesProjetados = Math.floor(idealRemaining / Number(novaPosologia));
      const projetadoObj = new Date();
      projetadoObj.setDate(projetadoObj.getDate() + diasRestantesProjetados);
      dataFimCicloAtualFormatada = `${String(projetadoObj.getDate()).padStart(2, '0')}/${String(projetadoObj.getMonth() + 1).padStart(2, '0')}/${projetadoObj.getFullYear()} (Reajustada)`;
    }
  }
  useEffect(() => {
    if (qtdInformada === '' || !localMonitoramento) return;
    const posologiaVigente = (mudouPosologia && novaPosologia) ? Number(novaPosologia) : posologia;
    const qtdInformadaNum = Number(qtdInformada);
    const diferencaComprimidos = Math.abs(idealRemaining - qtdInformadaNum);
    const diferencaEmDias = diferencaComprimidos / posologiaVigente;
    if (diferencaEmDias <= 2) {
      setNivelAdesao('COMPLETAMENTE');
    } else if (diferencaEmDias <= 6) {
      setNivelAdesao('PARCIALMENTE');
    } else {
      setNivelAdesao('NAO_ADERE');
    }
  }, [qtdInformada, localMonitoramento, idealRemaining, posologia, mudouPosologia, novaPosologia]);
  useEffect(() => {
    if (qtdInformada !== '') {
      let daysToAdd = 30;
      if (nivelAdesao === 'PARCIALMENTE') {
        daysToAdd = 15;
      } else if (nivelAdesao === 'NAO_ADERE') {
        daysToAdd = 7;
      }
      const date = new Date();
      date.setDate(date.getDate() + daysToAdd);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 6) {
        date.setDate(date.getDate() + 2);
      } else if (dayOfWeek === 0) {
        date.setDate(date.getDate() + 1);
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setDataAbertura(`${year}-${month}-${day}`);
    } else {
      setDataAbertura('');
    }
  }, [qtdInformada, nivelAdesao]);
  const pacienteIdAtual = localMonitoramento?.paciente_id || localMonitoramento?.paciente?.id;
  const { bloqueio: bloqueioEdicao } = useReservaEdicaoPaciente(pacienteIdAtual, isOpen && !!localMonitoramento?.id);
  if (!isOpen || !localMonitoramento) return null;
  if (bloqueioEdicao) {
    return (
      <ModalOverlay>
        <ModalContent style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
          <h3>⏳ Paciente em Atendimento</h3>
          <p style={{ margin: '15px 0' }}>
            Este paciente já está sendo atendido por <strong>{bloqueioEdicao.usuario}</strong>.
          </p>
          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Tente novamente em alguns minutos.</p>
          <ButtonGroup style={{ marginTop: '20px', justifyContent: 'center' }}>
            <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  }
  if (showNpsPrompt) {
    return (
      <NpsModal
        monitoramento={localMonitoramento}
        onClose={() => onClose()}
      />
    );
  }
  if (syncPrompt) {
    return (
      <ModalOverlay>
        <ModalContent style={{ maxWidth: '600px', margin: 'auto' }}>
          <h3 style={{ color: 'var(--primary-color, #d9534f)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ⚠️ Alteração no Fornecimento Detectada
          </h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
            O sistema externo relata que houve uma modificação nos dados do fornecimento atual (Evento: <strong>{localMonitoramento?.evento_externo_id}</strong>). Você deseja aplicar essa atualização antes de continuar o registro?
          </p>
          <InfoBox style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffeeba', color: '#856404' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.7 }}>Informação Anterior (Local)</span>
              <p style={{ margin: '5px 0 0 0' }}>💊 {syncPrompt.medicamentoAntigo}</p>
              <p style={{ margin: 0, fontSize: '0.9em' }}>📦 {syncPrompt.qtdCaixasAntiga} caixa(s)</p>
            </div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', margin: '10px 0' }}></div>
            <div>
              <span style={{ fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.7 }}>Informação Atualizada (Externa)</span>
              <p style={{ margin: '5px 0 0 0' }}>💊 <strong>{syncPrompt.medicamentoNovo}</strong></p>
              <p style={{ margin: 0, fontSize: '0.9em' }}>📦 <strong>{syncPrompt.qtdCaixasNova} caixa(s)</strong></p>
            </div>
          </InfoBox>
          <ButtonGroup style={{ marginTop: '30px' }}>
            <Button type="button" variant="secondary" onClick={handleIgnoreSync} disabled={loadingCompra}>
              Ignorar
            </Button>
            <Button type="button" onClick={handleConfirmSync} disabled={loadingCompra}>
              {loadingCompra ? 'Aplicando...' : 'Confirmar Troca'}
            </Button>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  }
  // 👇 NOVO: reabre o pré-tele pra corrigir a data de administração já salva,
  // sem perder o que já foi preenchido no formulário (mesma instância do componente).
  if (reabrirPreTele) {
    return (
      <PreMonitoramento
        monitoramento={localMonitoramento}
        onClose={() => setReabrirPreTele(false)}
        onSuccess={(novaDataAdmin, novaDataFimCaixa) => {
          setLocalMonitoramento(prev => ({
            ...prev,
            data_administracao: novaDataAdmin,
            data_calculada_fim_caixa: novaDataFimCaixa
          }));
          setReabrirPreTele(false);
        }}
      />
    );
  }
  // 👇 Etapa 1, sempre — modal pequeno e isolado, sem nenhum painel lateral.
  if (etapa === 'CONTATO_EFETIVO') {
    return (
      <TentativaContatoModal
        titulo={`Registrar Contato - ${localMonitoramento.paciente?.nome} ${localMonitoramento.paciente?.sobrenome} | ${localMonitoramento.evento_externo_id || ''}`}
        onCancelar={onClose}
        enviando={loading}
        onContinuar={async (contatoEfetivoValue, motivoSelecionado) => {
          if (contatoEfetivoValue === false) {
            try {
              setLoading(true);
              await api.put(`/monitoramento-medicamentos/${localMonitoramento.id}`, {
                contato_efetivo: false,
                nivel_adesao: 'NAO_ADERE',
                qtd_informada_caixa: null,
                data_abertura_nova_caixa: null,
                descontinuar_medicamento: false,
                motivo_encerramento: null,
                is_reacao: null,
                reacoes_adversas: [],
                observacao: null,
                aplicar_nova_compra: false,
                dados_nova_compra: null,
                data_inicio_nova_caixa: null,
                posologia_nova_caixa: null,
                mudou_posologia: false,
                nova_posologia: null,
                data_mudanca_posologia: null,
                motivo_falha_contato_id: motivoSelecionado.value,
                modo_novo_medicamento: null
              });
              toast.success('Contato registrado com sucesso!');
              onSucesso();
              window.dispatchEvent(new Event('updateAlerts'));
              onClose();
            } catch (error) {
              toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
            } finally {
              setLoading(false);
            }
            return;
          }
          const precisaPreTele = !monitoramentoAnterior && !localMonitoramento.data_administracao;
          setEtapa(precisaPreTele ? 'PRE_TELE' : 'FORMULARIO');
        }}
      />
    );
  }
  // 👇 Etapa opcional — pré-tele, só quando necessário.
  if (etapa === 'PRE_TELE') {
    return (
      <PreMonitoramento
        monitoramento={localMonitoramento}
        onClose={onClose}
        onSuccess={(novaDataAdmin, novaDataFimCaixa) => {
          setLocalMonitoramento(prev => ({
            ...prev,
            data_administracao: novaDataAdmin,
            data_calculada_fim_caixa: novaDataFimCaixa
          }));
          setEtapa('FORMULARIO');
        }}
      />
    );
  }
  // 👇 A partir daqui, etapa === 'FORMULARIO' garantido: contato já
  // confirmado como efetivado, e pré-tele já resolvido se era necessário.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const hojeDate = new Date();
    const dataHojeFormat = `${hojeDate.getFullYear()}-${String(hojeDate.getMonth() + 1).padStart(2, '0')}-${String(hojeDate.getDate()).padStart(2, '0')}`;
    if (!qtdInformada || (!descontinuarMedicamento && !dataAbertura)) {
      toast.error('Preencha os dados da caixa do medicamento.');
      return;
    }
    if (!descontinuarMedicamento && dataAbertura < dataHojeFormat) {
      toast.error('A data do próximo contato não pode ser no passado.');
      return;
    }
    if (descontinuarMedicamento && aplicarNovaCompra) {
      toast.error('Não é possível descontinuar o medicamento e aplicar uma nova compra ao mesmo tempo.');
      return;
    }
    if (descontinuarMedicamento && !motivoEncerramentoSelecionado) {
      toast.error('Selecione o motivo do encerramento.');
      return;
    }
    if (aplicarNovaCompra) {
      if (!dataRealInicioNovaCaixa || !posologiaNovaCaixa) {
        toast.error('Data de início e posologia da nova caixa são obrigatórias.');
        return;
      }
      if (dadosNovaCompra?.mudou_medicamento && dadosNovaCompra?.pode_ser_conjunto && !modoNovoMedicamento) {
        toast.error('Selecione se deseja usar os medicamentos em conjunto ou substituir o medicamento atual.');
        return;
      }
    }
    if (mudouPosologia && !aplicarNovaCompra && !descontinuarMedicamento) {
      if (!novaPosologia || !dataMudancaPosologia) {
        toast.error('Preencha a nova dosagem e a data em que ela começou.');
        return;
      }
      if (dataMudancaPosologia > dataHojeFormat) {
        toast.error('A data da mudança de dosagem não pode ser no futuro.');
        return;
      }
    }
    try {
      setLoading(true);
      const reacoesIds = reacoesSelecionadas ? reacoesSelecionadas.map(r => r.value) : [];
      const response = await api.put(`/monitoramento-medicamentos/${localMonitoramento.id}`, {
        contato_efetivo: true,
        nivel_adesao: nivelAdesao,
        qtd_informada_caixa: Number(qtdInformada),
        data_abertura_nova_caixa: !descontinuarMedicamento ? dataAbertura : null,
        descontinuar_medicamento: descontinuarMedicamento,
        motivo_encerramento: descontinuarMedicamento ? (motivoEncerramento || null) : null,
        motivo_encerramento_id: descontinuarMedicamento ? (motivoEncerramentoSelecionado?.value || null) : null,
        is_reacao: isReacao,
        reacoes_adversas: isReacao ? reacoesIds : [],
        observacao: observacao || null,
        aplicar_nova_compra: aplicarNovaCompra,
        dados_nova_compra: aplicarNovaCompra ? dadosNovaCompra : null,
        data_inicio_nova_caixa: aplicarNovaCompra ? dataRealInicioNovaCaixa : null,
        posologia_nova_caixa: aplicarNovaCompra ? Number(posologiaNovaCaixa) : null,
        mudou_posologia: mudouPosologia,
        nova_posologia: mudouPosologia ? Number(novaPosologia) : null,
        data_mudanca_posologia: mudouPosologia ? dataMudancaPosologia : null,
        motivo_falha_contato_id: null,
        modo_novo_medicamento: (aplicarNovaCompra && dadosNovaCompra?.mudou_medicamento) ? modoNovoMedicamento : null
      });
      toast.success('Contato registrado com sucesso!');
      window.dispatchEvent(new Event('updateAlerts'));

      // 👇 NOVO: se este contato acabou de criar o medicamento adicional em
      // "uso em conjunto", não fecha o modal ainda — carrega esse registro
      // recém-criado e encaminha pro mesmo formulário completo (comprimidos,
      // adesão, reação), fazendo o processo inteiro dos dois medicamentos
      // nesta mesma sessão, em vez de deixar o adicional pendente pra um
      // contato futuro sem nenhum dado preenchido.
      const idAdicional = response.data?.monitoramento_adicional_id;
      if (idAdicional) {
        setProximoCicloAtualId(response.data?.proximo_ciclo_atual_id || null); // 👈 NOVO
        setCarregandoAdicional(true);
        try {
          const resAdicional = await api.get(`/monitoramento-medicamentos/${idAdicional}`);
          setMonitoramentoAdicionalConjunto(resAdicional.data);
          setEtapa('MEDICAMENTO_ADICIONAL_CONJUNTO');
        } catch (errAdicional) {
          toast.error('O contato do medicamento atual foi salvo, mas houve um erro ao abrir o medicamento adicional. Registre o contato dele diretamente na lista.');
          onSucesso();
          onClose();
        } finally {
          setCarregandoAdicional(false);
        }
      } else {
        onSucesso();
        setShowNpsPrompt(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
    } finally {
      setLoading(false);
    }
  };

  // 👇 NOVO: mesma regra de "dias até o próximo contato" já usada no
  // formulário principal, aplicada aqui pro medicamento adicional (o
  // PassoRegistroMedicamento não decide essa data sozinho).
  const calcularProximaDataPorAdesao = (nivel) => {
    let dias = 30;
    if (nivel === 'PARCIALMENTE') dias = 15;
    else if (nivel === 'NAO_ADERE') dias = 7;
    const data = new Date();
    data.setDate(data.getDate() + dias);
    const diaSemana = data.getDay();
    if (diaSemana === 6) data.setDate(data.getDate() + 2);
    else if (diaSemana === 0) data.setDate(data.getDate() + 1);
    const y = data.getFullYear();
    const m = String(data.getMonth() + 1).padStart(2, '0');
    const d = String(data.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 👇 NOVO: recebe os dados coletados pelo PassoRegistroMedicamento pro
  // medicamento adicional. Se a adesão bateu com a do medicamento atual (ou
  // ele foi descontinuado), envia direto usando a "data média" (que, com
  // níveis iguais, dá exatamente a mesma data). Se divergiu, para e pede
  // pro atendente decidir a data compartilhada — igual ao
  // TelemonitoramentoModalConjunto.jsx faz quando os dois medicamentos já
  // estão pendentes ao mesmo tempo.
  const handleAvancarMedicamentoAdicional = (dados) => {
    if (dados.descontinuarMedicamento || dados.nivelAdesao === nivelAdesao) {
      enviarContatoAdicionalConjunto(dados, 'MEDIA');
    } else {
      setDadosAdicionalPendente(dados);
      setEtapa('DIVERGENCIA_CONJUNTO');
    }
  };

  // 👇 NOVO: fecha o ciclo do medicamento adicional com a data decidida
  // (média/semanal/mensal) e ALINHA essa mesma data no próximo ciclo do
  // medicamento atual (já criado no primeiro submit) — sem isso os dois
  // ficariam com datas de próximo contato diferentes, quebrando o
  // acompanhamento conjunto.
  const enviarContatoAdicionalConjunto = async (dados, modo) => {
    try {
      setCarregandoAdicional(true);
      const reacoesIds = dados.isReacao ? dados.reacoesSelecionadas.map(r => r.value) : [];
      const dataEscolhidaISO = dados.descontinuarMedicamento
        ? null
        : formatarDataISOConjunto(calcularDataPorModoConjunto(modo, nivelAdesao, dados.nivelAdesao));

      await api.put(`/monitoramento-medicamentos/${dados.monitoramentoId}`, {
        contato_efetivo: true,
        nivel_adesao: dados.nivelAdesao,
        qtd_informada_caixa: Number(dados.qtdInformada),
        data_abertura_nova_caixa: dataEscolhidaISO,
        descontinuar_medicamento: dados.descontinuarMedicamento,
        motivo_encerramento: dados.descontinuarMedicamento ? (dados.motivoEncerramento || null) : null,
        motivo_encerramento_id: dados.descontinuarMedicamento ? (dados.motivoEncerramentoId || null) : null,
        is_reacao: dados.isReacao,
        reacoes_adversas: reacoesIds,
        observacao: dados.observacao || null,
        aplicar_nova_compra: dados.aplicarNovaCompra,
        dados_nova_compra: dados.aplicarNovaCompra ? dados.dadosNovaCompra : null,
        data_inicio_nova_caixa: dados.aplicarNovaCompra ? dados.dataRealInicioNovaCaixa : null,
        posologia_nova_caixa: dados.aplicarNovaCompra ? Number(dados.posologiaNovaCaixa) : null,
        mudou_posologia: dados.mudouPosologia,
        nova_posologia: dados.mudouPosologia ? Number(dados.novaPosologia) : null,
        data_mudanca_posologia: dados.mudouPosologia ? dados.dataMudancaPosologia : null,
        motivo_falha_contato_id: null,
        modo_novo_medicamento: (dados.aplicarNovaCompra && dados.dadosNovaCompra?.mudou_medicamento) ? dados.modoNovoMedicamento : null
      });

      if (dataEscolhidaISO && proximoCicloAtualId) {
        try {
          await api.put(`/monitoramento-medicamentos/${proximoCicloAtualId}/data-proximo-contato`, {
            data_proximo_contato: dataEscolhidaISO
          });
        } catch (errData) {
          console.error('Erro ao alinhar data do próximo contato do medicamento atual:', errData);
          toast.warning('O medicamento adicional foi registrado, mas a data do próximo contato do medicamento atual pode ter ficado divergente. Confira na lista.');
        }
      }

      toast.success('Contato do medicamento adicional registrado com sucesso!');
      onSucesso();
      window.dispatchEvent(new Event('updateAlerts'));
      setShowNpsPrompt(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar contato do medicamento adicional.');
    } finally {
      setCarregandoAdicional(false);
    }
  };

  // 👇 NOVO: finalização do ciclo de reembolso — é sempre um único
  // medicamento (sem par), então não existe divergência de adesão pra
  // checar aqui: usa direto a mesma regra de dias-por-adesão do formulário.
  const handleFinalizarReembolso = async (dados) => {
    try {
      setCarregandoReembolso(true);
      const reacoesIds = dados.isReacao ? dados.reacoesSelecionadas.map(r => r.value) : [];
      await api.put(`/monitoramento-medicamentos/${dados.monitoramentoId}`, {
        contato_efetivo: true,
        nivel_adesao: dados.nivelAdesao,
        qtd_informada_caixa: Number(dados.qtdInformada),
        data_abertura_nova_caixa: dados.descontinuarMedicamento ? null : calcularProximaDataPorAdesao(dados.nivelAdesao),
        descontinuar_medicamento: dados.descontinuarMedicamento,
        motivo_encerramento: dados.descontinuarMedicamento ? (dados.motivoEncerramento || null) : null,
        motivo_encerramento_id: dados.descontinuarMedicamento ? (dados.motivoEncerramentoId || null) : null,
        is_reacao: dados.isReacao,
        reacoes_adversas: reacoesIds,
        observacao: dados.observacao || null,
        aplicar_nova_compra: dados.aplicarNovaCompra,
        dados_nova_compra: dados.aplicarNovaCompra ? dados.dadosNovaCompra : null,
        data_inicio_nova_caixa: dados.aplicarNovaCompra ? dados.dataRealInicioNovaCaixa : null,
        posologia_nova_caixa: dados.aplicarNovaCompra ? Number(dados.posologiaNovaCaixa) : null,
        mudou_posologia: dados.mudouPosologia,
        nova_posologia: dados.mudouPosologia ? Number(dados.novaPosologia) : null,
        data_mudanca_posologia: dados.mudouPosologia ? dados.dataMudancaPosologia : null,
        motivo_falha_contato_id: null,
        modo_novo_medicamento: (dados.aplicarNovaCompra && dados.dadosNovaCompra?.mudou_medicamento) ? dados.modoNovoMedicamento : null
      });
      toast.success('Contato registrado com sucesso!');
      onSucesso();
      window.dispatchEvent(new Event('updateAlerts'));
      setShowNpsPrompt(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
    } finally {
      setCarregandoReembolso(false);
    }
  };

  // 👇 NOVO: dispara ao concluir a criação do evento de reembolso — busca o
  // registro completo (com medicamento/qtd_capsula) e encaminha direto pra
  // entrevista, em vez de deixar o monitoramento esperando um contato futuro.
  const handleReembolsoCriado = async (novoRegistro) => {
    setMostrarReembolso(false);
    if (!novoRegistro?.id) {
      onSucesso();
      onClose();
      return;
    }
    setCarregandoReembolso(true);
    try {
      const res = await api.get(`/monitoramento-medicamentos/${novoRegistro.id}`);
      setMonitoramentoReembolso(res.data);
      setEtapa('MEDICAMENTO_REEMBOLSO');
    } catch (err) {
      toast.error('Evento de reembolso criado, mas houve um erro ao abrir o monitoramento. Registre o contato dele diretamente na lista.');
      onSucesso();
      onClose();
    } finally {
      setCarregandoReembolso(false);
    }
  };

  // 👇 NOVO: segunda etapa do "uso em conjunto" — coleta os dados completos
  // (comprimidos, adesão, reação, nova compra, descontinuação) do
  // medicamento adicional, reaproveitando o mesmo componente já usado no
  // wizard TelemonitoramentoModalConjunto.
  if (etapa === 'MEDICAMENTO_ADICIONAL_CONJUNTO') {
    if (carregandoAdicional || !monitoramentoAdicionalConjunto) {
      return (
        <ModalOverlay>
          <ModalContent style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <p>Carregando medicamento adicional...</p>
          </ModalContent>
        </ModalOverlay>
      );
    }
    return (
      <ModalOverlay style={{ overflowY: 'auto', padding: '20px 0' }}>
        <ModalLayoutWrapper>
          <div className="left-column">
            <InfoBox style={{ marginBottom: '15px' }}>
              <p style={{ margin: 0 }}>
                ✅ Contato de <strong>{localMonitoramento.medicamento?.nome}</strong> já foi registrado.
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85em', opacity: 0.85 }}>
                Agora complete o registro do medicamento usado em conjunto.
              </p>
            </InfoBox>
            <HistoricoComprasPaciente monitoramento={monitoramentoAdicionalConjunto} />
          </div>
          <div className="center-column">
            <PassoRegistroMedicamento
              monitoramento={monitoramentoAdicionalConjunto}
              monitoramentoAnterior={null}
              numeroEtapa={2}
              totalEtapas={2}
              onCancelar={onClose}
              onAvancar={handleAvancarMedicamentoAdicional}
            />
          </div>
          <div className="right-column">
            <HistoricoAberturas monitoramento={monitoramentoAdicionalConjunto} />
          </div>
        </ModalLayoutWrapper>
      </ModalOverlay>
    );
  }

  // 👇 NOVO: os dois medicamentos tiveram níveis de adesão diferentes neste
  // contato — pede pro atendente decidir a data compartilhada do próximo
  // contato, igual ao TelemonitoramentoModalConjunto.jsx.
  if (etapa === 'DIVERGENCIA_CONJUNTO' && dadosAdicionalPendente) {
    const nivelAtual = nivelAdesao;
    const nivelAdicional = dadosAdicionalPendente.nivelAdesao;
    const dataSugeridaISO = formatarDataISOConjunto(calcularDataSugeridaConjunto(nivelAtual, nivelAdicional));
    return (
      <ModalOverlay>
        <ModalContent style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e67e22' }}>
            ⚠️ Divergência de Adesão Identificada
          </h3>
          <InfoBox style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)', borderColor: '#f39c12' }}>
            <p>Os dois medicamentos apresentaram níveis de adesão diferentes neste contato:</p>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li><strong>{localMonitoramento.medicamento?.nome}:</strong> {LABEL_NIVEL_CONJUNTO[nivelAtual]}</li>
              <li><strong>{monitoramentoAdicionalConjunto?.medicamento?.nome}:</strong> {LABEL_NIVEL_CONJUNTO[nivelAdicional]}</li>
            </ul>
            <p style={{ margin: 0 }}>
              Data sugerida com base na média entre os dois: <strong>{formatarDataBRConjunto(dataSugeridaISO)}</strong>
            </p>
          </InfoBox>
          <FormGroup style={{ marginTop: '15px' }}>
            <label>Como deseja agendar o próximo contato?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" checked={modoDataProximoContatoConjunto === 'MEDIA'} onChange={() => setModoDataProximoContatoConjunto('MEDIA')} />
                Usar a data sugerida (média entre os dois medicamentos)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" checked={modoDataProximoContatoConjunto === 'SEMANAL'} onChange={() => setModoDataProximoContatoConjunto('SEMANAL')} />
                Agendar semanalmente (7 dias) — acompanhamento mais próximo
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" checked={modoDataProximoContatoConjunto === 'MENSAL'} onChange={() => setModoDataProximoContatoConjunto('MENSAL')} />
                Agendar mensalmente (30 dias)
              </label>
            </div>
          </FormGroup>
          <ButtonGroup style={{ marginTop: '20px' }}>
            <Button type="button" variant="secondary" onClick={() => setEtapa('MEDICAMENTO_ADICIONAL_CONJUNTO')} disabled={carregandoAdicional}>Voltar</Button>
            <Button type="button" onClick={() => enviarContatoAdicionalConjunto(dadosAdicionalPendente, modoDataProximoContatoConjunto)} disabled={carregandoAdicional}>
              {carregandoAdicional ? 'Salvando...' : 'Confirmar e Salvar'}
            </Button>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // 👇 NOVO: etapa da entrevista completa do ciclo de reembolso recém-criado
  // — mesmo componente PassoRegistroMedicamento usado no "uso em conjunto",
  // mas com handleFinalizarReembolso próprio: aqui é sempre um único
  // medicamento (sem par), então não há divergência de adesão a checar.
  if (etapa === 'MEDICAMENTO_REEMBOLSO') {
    if (carregandoReembolso || !monitoramentoReembolso) {
      return (
        <ModalOverlay>
          <ModalContent style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <p>Carregando evento de reembolso...</p>
          </ModalContent>
        </ModalOverlay>
      );
    }
    return (
      <ModalOverlay style={{ overflowY: 'auto', padding: '20px 0' }}>
        <ModalLayoutWrapper>
          <div className="left-column">
            <InfoBox style={{ marginBottom: '15px' }}>
              <p style={{ margin: 0 }}>
                💊 Evento de reembolso de <strong>{monitoramentoReembolso.medicamento?.nome}</strong> criado.
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85em', opacity: 0.85 }}>
                Agora complete o contato deste ciclo (comprimidos, adesão e reações).
              </p>
            </InfoBox>
            <HistoricoComprasPaciente monitoramento={monitoramentoReembolso} />
          </div>
          <div className="center-column">
            <PassoRegistroMedicamento
              monitoramento={monitoramentoReembolso}
              monitoramentoAnterior={null}
              numeroEtapa={1}
              totalEtapas={1}
              onCancelar={onClose}
              onAvancar={handleFinalizarReembolso}
            />
          </div>
          <div className="right-column">
            <HistoricoAberturas monitoramento={monitoramentoReembolso} />
          </div>
        </ModalLayoutWrapper>
      </ModalOverlay>
    );
  }

  const scoreAtual = localMonitoramento.avaliacao?.total_score;
  const adInfo = getAdherenceClassification(scoreAtual);
  const hojeDate = new Date();
  const dataHoje = `${hojeDate.getFullYear()}-${String(hojeDate.getMonth() + 1).padStart(2, '0')}-${String(hojeDate.getDate()).padStart(2, '0')}`;
  const opcoesReacoes = listaReacoes.map(reacao => ({
    value: reacao.id,
    label: reacao.name
  }));
  let dataMaxMudanca = dataHoje;
  let dataMinMudanca = localMonitoramento?.data_administracao?.split('T')[0] || '';
  return (
    <>
    <ModalOverlay style={{ overflowY: 'auto', padding: '20px 0' }}>
      <ModalLayoutWrapper>
        <div className="left-column">
          {monitoramentoAnterior && (
            <ResumoAnterior monitoramento={monitoramentoAnterior} />
          )}
          <HistoricoComprasPaciente monitoramento={localMonitoramento} />
        </div>
        <div className="center-column">
          <ModalContent style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
            <h3>Registrar Contato - {localMonitoramento.paciente?.nome} {localMonitoramento.paciente?.sobrenome} | {localMonitoramento.evento_externo_id} </h3>
            {loadingCompra ? (
              <SkeletonLoader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Consultando atualizações externas...</span>
                </div>
                <div className="text-line"></div>
                <div className="text-line short"></div>
              </SkeletonLoader>
            ) : (
              <ComparativoNovaCompra
                data={dadosNovaCompra}
                checked={aplicarNovaCompra}
                onChangeChecked={setAplicarNovaCompra}
                dataInicioManual={dataRealInicioNovaCaixa}
                onChangeDataInicio={setDataRealInicioNovaCaixa}
                posologiaAtual={posologia}
                posologiaNovaCaixa={posologiaNovaCaixa}
                onChangePosologiaNova={setPosologiaNovaCaixa}
                estoqueHoje={qtdInformada !== '' && !aplicarNovaCompra ? Number(qtdInformada) : idealRemainingAntigo}
                dataInicioAtual={dataUsoReferencia}
                isAntesDoInicio={isAntesDoInicio}
                modoNovoMedicamento={modoNovoMedicamento}
                onChangeModoNovoMedicamento={setModoNovoMedicamento}
              />
            )}
            <InfoBox>
              <p><strong>Medicamento Atual:</strong> {localMonitoramento.medicamento?.nome}</p>
              {localMonitoramento.mudou_posologia && (
                <span style={{ display: 'inline-block', backgroundColor: '#e2e3e5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '5px' }}>
                  ⚠️ Veio de Mudança de Posologia ({localMonitoramento.posologia_diaria} cp/dia)
                </span>
              )}
              <p className="sub-text">
                Quantidade total inicial: {qtdTotalCaixa} comprimidos ({qtdCaixas} caixa{qtdCaixas > 1 ? 's' : ''}) (Dose: {posologia}/dia)
              </p>
              <ProjectedStockBox>
                {aplicarNovaCompra && modoNovoMedicamento !== 'CONJUNTO' && (
                  <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed rgba(0,0,0,0.1)', opacity: 0.7 }}>
                    <p style={{ fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold' }}>Ciclo Anterior</p>
                    <p style={{ marginBottom: '4px', fontSize: '0.85em', textDecoration: 'line-through' }}>
                      Início original: {dataReferenciaFormatada.replace(' (Início Novo Ciclo)', '')}
                    </p>
                    <p style={{ marginBottom: '0', fontSize: '0.85em', textDecoration: 'line-through' }}>
                      Fim previsto original: {localMonitoramento?.data_calculada_fim_caixa ? localMonitoramento.data_calculada_fim_caixa.split('T')[0].split('-').reverse().join('/') : '-'}
                    </p>
                  </div>
                )}
                <p style={{ marginBottom: '6px', fontSize: '0.9em' }}>
                  <strong>{aplicarNovaCompra && modoNovoMedicamento !== 'CONJUNTO' ? 'Início do Novo Ciclo:' : 'Data administração informada:'}</strong> {dataReferenciaFormatada}
                  {!aplicarNovaCompra && localMonitoramento?.data_administracao && (
                    <button
                      type="button"
                      onClick={() => setReabrirPreTele(true)}
                      disabled={loading}
                      style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#8a2be2', cursor: 'pointer', fontSize: '0.85em', textDecoration: 'underline', padding: 0 }}
                    >
                      Corrigir
                    </button>
                  )}
                </p>
                <p style={{ marginBottom: '10px', fontSize: '0.9em', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '6px' }}>
                  <strong>Data prevista para o fim do ciclo:</strong> {dataFimCicloAtualFormatada}
                </p>
                <p style={{ marginBottom: '5px', fontSize: '1.05em' }}>
                  Estoque Projetado para Hoje: <span className="destaque">~{idealRemaining} comprimidos</span>
                </p>
                <p style={{ fontSize: '0.85em', opacity: 0.8 }}>
                  (Margem aceitável calculada: {margemMin} a {margemMax})
                </p>
                {mudouPosologia && !aplicarNovaCompra && (
                  <PosologiaChangeAlert>
                    <strong>Matemática Reajustada:</strong>
                    <span>Cálculo quebrado considerando a data de transição para a nova dosagem prescrita.</span>
                  </PosologiaChangeAlert>
                )}
              </ProjectedStockBox>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <strong>Score Atual:</strong> {scoreAtual != null ? `${scoreAtual} pts` : '-'}
                {scoreAtual != null && (
                  <AdherenceBadge level={adInfo.level} style={{ margin: 0 }}>
                    {adInfo.label}
                  </AdherenceBadge>
                )}
              </div>
            </InfoBox>
            {/* 👇 NOVO: paciente comprou o medicamento por conta própria e foi
                reembolsado pela operadora — permite criar o ciclo de reembolso
                sem sair desta tela, quando o estoque projetado já zerou. */}
            {!aplicarNovaCompra && !descontinuarMedicamento && idealRemaining <= 0 && (
              <div style={{ margin: '0 0 20px 0', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setMostrarReembolso(true)}
                  style={{
                    background: 'none', border: '1px solid #e67e22', color: '#e67e22',
                    borderRadius: '6px', padding: '6px 12px', cursor: 'pointer',
                    fontSize: '0.85rem', fontWeight: 'bold'
                  }}
                >
                  💊 Paciente comprou por conta e foi reembolsado pela operadora? Criar Evento de Reembolso
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {!aplicarNovaCompra && !descontinuarMedicamento && (
                <HighlightedSection>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={mudouPosologia}
                      onChange={(e) => {
                        setMudouPosologia(e.target.checked);
                        if (!e.target.checked) {
                          setNovaPosologia('');
                          setDataMudancaPosologia('');
                        }
                      }}
                    />
                    <strong>Houve alteração da posologia (dosagem) no meio deste ciclo?</strong>
                  </label>
                  {mudouPosologia && (
                    <div className="inputs-row">
                      <div className="input-group">
                        <label>Nova Posologia (comprimidos/dia):</label>
                        <Input
                          type="number"
                          min="1"
                          value={novaPosologia}
                          onChange={(e) => setNovaPosologia(e.target.value)}
                          required={mudouPosologia}
                          placeholder="Ex: 2"
                        />
                      </div>
                      <div className="input-group">
                        <label>A partir de que dia começou a tomar a nova dose?</label>
                        <Input
                          type="date"
                          max={dataMaxMudanca}
                          min={dataMinMudanca}
                          value={dataMudancaPosologia}
                          onChange={(e) => setDataMudancaPosologia(e.target.value)}
                          required={mudouPosologia}
                        />
                      </div>
                    </div>
                  )}
                </HighlightedSection>
              )}
              {!aplicarNovaCompra && (
                <HighlightedSection>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={descontinuarMedicamento}
                      onChange={(e) => {
                        setDescontinuarMedicamento(e.target.checked);
                        if (e.target.checked) {
                          setDataAbertura('');
                          setMudouPosologia(false);
                          setNovaPosologia('');
                          setDataMudancaPosologia('');
                        }
                      }}
                    />
                    <strong>Paciente descontinuou este medicamento (encerrar acompanhamento)</strong>
                  </label>
                  {descontinuarMedicamento && (
                    <div className="inputs-row">
                      <div className="input-group" style={{ flex: 1 }}>
                        <label>Motivo do encerramento *</label>
                        <Select
                          options={listaMotivosEncerramento.map(m => ({ value: m.id, label: m.descricao }))}
                          value={motivoEncerramentoSelecionado}
                          onChange={setMotivoEncerramentoSelecionado}
                          styles={getCustomSelectStyles(theme)}
                          placeholder="Selecione o motivo..."
                          noOptionsMessage={() => "Nenhum motivo cadastrado — cadastre em Tabelas Cadastrais"}
                          menuPosition="fixed"
                        />
                      </div>
                      <div className="input-group" style={{ flex: 1, marginTop: '10px' }}>
                        <label>Observação adicional (opcional):</label>
                        <Input
                          as="textarea"
                          rows="2"
                          value={motivoEncerramento}
                          onChange={(e) => setMotivoEncerramento(e.target.value)}
                          placeholder="Detalhes adicionais, se necessário..."
                        />
                      </div>
                    </div>
                  )}
                </HighlightedSection>
              )}
              <FormGroup>
                <label>Quantos comprimidos restam com o paciente no total?</label>
                <Input
                  type="number"
                  min="0"
                  value={qtdInformada}
                  onChange={(e) => setQtdInformada(e.target.value)}
                  placeholder="Ex: 45"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>O quanto ele adere? (Calculado automaticamente)</label>
                <Input as="select" value={nivelAdesao} disabled required>
                  <option value="COMPLETAMENTE">Alta adesão ao uso do medicamento</option>
                  <option value="PARCIALMENTE">Média adesão ao uso do medicamento</option>
                  <option value="NAO_ADERE">Baixa adesão ao uso do medicamento</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <label>O paciente relatou alguma reação adversa?</label>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={isReacao === true} onChange={() => setIsReacao(true)} /> Sim
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={isReacao === false} onChange={() => { setIsReacao(false); setReacoesSelecionadas([]); }} /> Não
                  </label>
                </div>
              </FormGroup>
              {isReacao && (
                <FormGroup>
                  <label>Quais foram as reações adversas? (Marque todas que se aplicam)</label>
                  <Select
                    isMulti
                    options={opcoesReacoes}
                    value={reacoesSelecionadas}
                    onChange={setReacoesSelecionadas}
                    styles={getCustomSelectStyles(theme)}
                    placeholder="Selecione as reações..."
                    noOptionsMessage={() => "Nenhuma reação encontrada"}
                  />
                </FormGroup>
              )}
              {!descontinuarMedicamento && (
                <FormGroup>
                  <label>Data do próximo contato de acordo com a adesão ao medicamento</label>
                  <Input type="date" min={dataHoje} value={dataAbertura} onChange={(e) => setDataAbertura(e.target.value)} required />
                </FormGroup>
              )}
              <FormGroup>
                <label>Observação (Opcional)</label>
                <Input
                  as="textarea"
                  rows="3"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Descreva aqui informações em relação aos comprimidos do paciente"
                  style={{ resize: 'vertical', padding: '10px' }}
                />
              </FormGroup>
              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Registro'}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </div>
        <div className="right-column">
          <HistoricoAberturas monitoramento={localMonitoramento} />
        </div>
      </ModalLayoutWrapper>
    </ModalOverlay>
    {/* 👇 NOVO: abre por cima desta tela, sem perder o que já foi preenchido aqui */}
    <EventoReembolsoModal
      isOpen={mostrarReembolso}
      onClose={() => setMostrarReembolso(false)}
      monitoramento={localMonitoramento}
      onSucesso={handleReembolsoCriado}
    />
    </>
  );
}