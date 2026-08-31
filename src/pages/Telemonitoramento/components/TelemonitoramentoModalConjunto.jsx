import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { LuUsers, LuTriangleAlert } from 'react-icons/lu';
import api from '../../../services/api';
import {
  ModalOverlay, ModalContent, FormGroup, ButtonGroup, Button, InfoBox, ModalLayoutWrapper
} from './styles';
import PassoRegistroMedicamento from './PassoRegistroMedicamento';
import PreMonitoramento from './PreMonitoramento';
import ResumoAnterior from './ResumoAnterior';
import HistoricoComprasPaciente from './HistoricoComprasPaciente';
import HistoricoAberturas from './HistoricoAberturas';
import useReservaEdicaoPaciente from '../../../hooks/useReservaEdicaoPaciente';
import TentativaContatoModal from './TentativaContatoModal';
import NpsModal from './NpsModal'; // 👈 NOVO

const DIAS_POR_NIVEL = { COMPLETAMENTE: 30, PARCIALMENTE: 15, NAO_ADERE: 7 };
const LABEL_NIVEL = {
  COMPLETAMENTE: 'Alta adesão ao uso do medicamento',
  PARCIALMENTE: 'Média adesão ao uso do medicamento',
  NAO_ADERE: 'Baixa adesão ao uso do medicamento'
};
const StepTransitionWrapper = styled.div`
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: ${props => (props.leaving ? 0 : 1)};
  transform: translateX(${props => (props.leaving ? '-16px' : '0')});
`;
function ajustarFimDeSemana(date) {
  const dia = date.getDay();
  if (dia === 6) date.setDate(date.getDate() + 2);
  else if (dia === 0) date.setDate(date.getDate() + 1);
  return date;
}
function calcularDataSugerida(nivelA, nivelB) {
  const dias = Math.round((DIAS_POR_NIVEL[nivelA] + DIAS_POR_NIVEL[nivelB]) / 2);
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return ajustarFimDeSemana(data);
}
function calcularDataPorModo(modo, nivelA, nivelB) {
  if (modo === 'SEMANAL') {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return ajustarFimDeSemana(d);
  }
  if (modo === 'MENSAL') {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return ajustarFimDeSemana(d);
  }
  return calcularDataSugerida(nivelA, nivelB);
}
const formatarDataISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const formatarDataBR = (isoStr) => isoStr.split('-').reverse().join('/');

// Wizard de registro de contato para pacientes em USO EM CONJUNTO (2 medicamentos).
// Etapas: CONTATO_EFETIVO -> (PRE_TELE_A, se necessário) -> MED_0 ->
// (PRE_TELE_B, se necessário) -> MED_1 -> DIVERGENCIA (se aplicável) -> NPS -> envio.
export default function TelemonitoramentoModalConjunto({ isOpen, onClose, monitoramentos, monitoramentosAnteriores, onSucesso }) {
  const [etapa, setEtapa] = useState('CONTATO_EFETIVO'); // CONTATO_EFETIVO | PRE_TELE_A | MED_0 | PRE_TELE_B | MED_1 | DIVERGENCIA
  const [dadosPorMedicamento, setDadosPorMedicamento] = useState([]);
  const [modoDataProximoContato, setModoDataProximoContato] = useState('MEDIA');
  const [enviando, setEnviando] = useState(false);
  const [transicao, setTransicao] = useState(false);
  const [eventosReivindicados, setEventosReivindicados] = useState([]);
  const [monitoramentosLocais, setMonitoramentosLocais] = useState(null);
  const [showNpsPrompt, setShowNpsPrompt] = useState(false); // 👈 NOVO
  const [reabrirPreTele, setReabrirPreTele] = useState(null); // 👈 NOVO: null | 'A' | 'B'
  const pacienteIdAtual = monitoramentos?.[0]?.paciente_id || monitoramentos?.[0]?.paciente?.id;
  const { bloqueio: bloqueioEdicao } = useReservaEdicaoPaciente(
    pacienteIdAtual,
    isOpen && !!monitoramentos && monitoramentos.length >= 2
  );
  useEffect(() => {
    if (isOpen) {
      setEtapa('CONTATO_EFETIVO');
      setDadosPorMedicamento([]);
      setModoDataProximoContato('MEDIA');
      setEventosReivindicados([]);
      setShowNpsPrompt(false); // 👈 NOVO
      setReabrirPreTele(null); // 👈 NOVO
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && monitoramentos && monitoramentos.length >= 2) {
      setMonitoramentosLocais(monitoramentos);
    }
  }, [isOpen, monitoramentos]);
  if (!isOpen || !monitoramentos || monitoramentos.length < 2) return null;
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
  const [monitA, monitB] = monitoramentosLocais || monitoramentos;

  // 👇 NOVO: atualiza localmente a data de administração de A ou B, sem
  // mexer na etapa atual do wizard (usada tanto no fluxo normal quanto na correção manual).
  const atualizarMonitoramentoLocal = (qual, novaDataAdmin, novaDataFimCaixa) => {
    setMonitoramentosLocais(prev => {
      const base = prev || monitoramentos;
      const [a, b] = base;
      return qual === 'A'
        ? [{ ...a, data_administracao: novaDataAdmin, data_calculada_fim_caixa: novaDataFimCaixa }, b]
        : [a, { ...b, data_administracao: novaDataAdmin, data_calculada_fim_caixa: novaDataFimCaixa }];
    });
  };

  // 👇 NOVO: dispara o NPS assim que o registro conjunto é salvo com sucesso.
  if (showNpsPrompt) {
    return (
      <NpsModal
        monitoramento={monitA}
        onClose={() => onClose()}
      />
    );
  }

  // 👇 NOVO: permite reabrir o pré-tele de A ou B pra corrigir uma data errada,
  // mesmo depois que data_administracao já foi salva no banco.
  if (reabrirPreTele === 'A') {
    return (
      <PreMonitoramento
        monitoramento={monitA}
        onClose={() => setReabrirPreTele(null)}
        onSuccess={(novaDataAdmin, novaDataFimCaixa) => {
          atualizarMonitoramentoLocal('A', novaDataAdmin, novaDataFimCaixa);
          setReabrirPreTele(null);
        }}
      />
    );
  }
  if (reabrirPreTele === 'B') {
    return (
      <PreMonitoramento
        monitoramento={monitB}
        onClose={() => setReabrirPreTele(null)}
        onSuccess={(novaDataAdmin, novaDataFimCaixa) => {
          atualizarMonitoramentoLocal('B', novaDataAdmin, novaDataFimCaixa);
          setReabrirPreTele(null);
        }}
      />
    );
  }

  const avancarComEfeito = (proximaEtapa) => {
    setTransicao(true);
    setTimeout(() => {
      setEtapa(proximaEtapa);
      setTransicao(false);
    }, 220);
  };
  const precisaPreTele = (monit, anterior) => !anterior && !monit?.data_administracao;
  if (etapa === 'CONTATO_EFETIVO') {
    return (
      <TentativaContatoModal
        titulo={<><LuUsers size={22} color="#8a2be2" /> Registrar Contato — Uso em Conjunto</>}
        descricao={
          <>
            {monitA.paciente?.nome} {monitA.paciente?.sobrenome} está em uso de <strong>{monitA.medicamento?.nome}</strong> e{' '}
            <strong>{monitB.medicamento?.nome}</strong> ao mesmo tempo. Este contato será registrado para os dois medicamentos.
          </>
        }
        onCancelar={onClose}
        enviando={enviando}
        onContinuar={async (contatoEfetivoValue, motivoSelecionado) => {
          if (contatoEfetivoValue === false) {
            try {
              setEnviando(true);
              await api.put('/monitoramento-medicamentos/conjunto/registrar', {
                grupo_medicamentos_id: monitA.grupo_medicamentos_id,
                contato_efetivo: false,
                motivo_falha_contato_id: motivoSelecionado.value,
                registros: [{ monitoramento_id: monitA.id }, { monitoramento_id: monitB.id }]
              });
              toast.success('Contato sem sucesso registrado. Reagendado para o próximo dia útil.');
              onSucesso();
              onClose();
            } catch (error) {
              toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
            } finally {
              setEnviando(false);
            }
            return;
          }
          const precisaA = precisaPreTele(monitA, monitoramentosAnteriores?.[monitA.id]);
          avancarComEfeito(precisaA ? 'PRE_TELE_A' : 'MED_0');
        }}
      />
    );
  }
  const handlePreTeleASuccess = (novaDataAdmin, novaDataFimCaixa) => {
    atualizarMonitoramentoLocal('A', novaDataAdmin, novaDataFimCaixa);
    avancarComEfeito('MED_0');
  };
  const handlePreTeleBSuccess = (novaDataAdmin, novaDataFimCaixa) => {
    atualizarMonitoramentoLocal('B', novaDataAdmin, novaDataFimCaixa);
    avancarComEfeito('MED_1');
  };
  if (etapa === 'PRE_TELE_A') {
    return (
      <PreMonitoramento
        monitoramento={monitA}
        onClose={onClose}
        onSuccess={handlePreTeleASuccess}
      />
    );
  }
  if (etapa === 'PRE_TELE_B') {
    return (
      <PreMonitoramento
        monitoramento={monitB}
        onClose={onClose}
        onSuccess={handlePreTeleBSuccess}
      />
    );
  }
  const handleAvancarMedicamento = (dados) => {
    const novaLista = [...dadosPorMedicamento, dados];
    setDadosPorMedicamento(novaLista);
    if (dados.aplicarNovaCompra && dados.dadosNovaCompra?.evento_externo_id) {
      setEventosReivindicados(prev => [...prev, dados.dadosNovaCompra.evento_externo_id]);
    }
    if (novaLista.length === 1) {
      const precisaB = precisaPreTele(monitB, monitoramentosAnteriores?.[monitB.id]);
      avancarComEfeito(precisaB ? 'PRE_TELE_B' : 'MED_1');
    } else {
      const [dadosA, dadosB] = novaLista;
      const algumDescontinuado = dadosA.descontinuarMedicamento || dadosB.descontinuarMedicamento;
      if (algumDescontinuado || dadosA.nivelAdesao === dadosB.nivelAdesao) {
        enviarRegistroConjunto(novaLista, 'MEDIA');
      } else {
        avancarComEfeito('DIVERGENCIA');
      }
    }
  };
  const enviarRegistroConjunto = async (dadosLista, modo) => {
    const ativos = dadosLista.filter(d => !d.descontinuarMedicamento);
    let dataProximoContato = null;
    if (ativos.length > 0) {
      const nivelA = ativos[0].nivelAdesao;
      const nivelB = ativos[1] ? ativos[1].nivelAdesao : ativos[0].nivelAdesao;
      dataProximoContato = formatarDataISO(calcularDataPorModo(modo, nivelA, nivelB));
    }
    try {
      setEnviando(true);
      await api.put('/monitoramento-medicamentos/conjunto/registrar', {
        grupo_medicamentos_id: monitA.grupo_medicamentos_id,
        contato_efetivo: true,
        data_proximo_contato: dataProximoContato,
        registros: dadosLista.map(d => ({
          monitoramento_id: d.monitoramentoId,
          qtd_informada_caixa: Number(d.qtdInformada),
          nivel_adesao: d.nivelAdesao,
          is_reacao: d.isReacao,
          reacoes_adversas: d.isReacao ? d.reacoesSelecionadas.map(r => r.value) : [],
          observacao: d.observacao || null,
          mudou_posologia: d.mudouPosologia,
          nova_posologia: d.mudouPosologia ? Number(d.novaPosologia) : null,
          data_mudanca_posologia: d.mudouPosologia ? d.dataMudancaPosologia : null,
          aplicar_nova_compra: d.aplicarNovaCompra,
          dados_nova_compra: d.aplicarNovaCompra ? d.dadosNovaCompra : null,
          data_inicio_nova_caixa: d.aplicarNovaCompra ? d.dataRealInicioNovaCaixa : null,
          posologia_nova_caixa: d.aplicarNovaCompra ? Number(d.posologiaNovaCaixa) : null,
          modo_novo_medicamento: (d.aplicarNovaCompra && d.dadosNovaCompra?.mudou_medicamento) ? d.modoNovoMedicamento : null,
          descontinuar_medicamento: d.descontinuarMedicamento,
          motivo_encerramento: d.descontinuarMedicamento ? (d.motivoEncerramento || null) : null
        }))
      });
      toast.success('Contato registrado para os dois medicamentos com sucesso!');
      onSucesso();
      window.dispatchEvent(new Event('updateAlerts')); // 👈 NOVO: paridade com o modal individual
      setShowNpsPrompt(true); // 👈 NOVO: antes fechava direto e nunca oferecia o NPS
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
    } finally {
      setEnviando(false);
    }
  };
  const monitoramentoDaEtapa = etapa === 'MED_0' ? monitA : (etapa === 'MED_1' ? monitB : null);
  const monitoramentoAnteriorDaEtapa = monitoramentoDaEtapa
    ? monitoramentosAnteriores?.[monitoramentoDaEtapa.id]
    : null;
  return (
    <ModalOverlay style={{ overflowY: 'auto', padding: '20px 0' }}>
      {(etapa === 'MED_0' || etapa === 'MED_1') && (
        <ModalLayoutWrapper>
          <div className="left-column">
            {monitoramentoAnteriorDaEtapa && (
              <ResumoAnterior monitoramento={monitoramentoAnteriorDaEtapa} />
            )}
            <HistoricoComprasPaciente monitoramento={monitoramentoDaEtapa} />
          </div>
          <div className="center-column">
            {monitoramentoDaEtapa?.data_administracao && (
              <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setReabrirPreTele(etapa === 'MED_0' ? 'A' : 'B')}
                  disabled={enviando}
                  style={{ background: 'none', border: 'none', color: '#8a2be2', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', padding: 0 }}
                >
                  Corrigir data de administração informada
                </button>
              </div>
            )}
            <StepTransitionWrapper leaving={transicao}>
              <PassoRegistroMedicamento
                key={monitoramentoDaEtapa.id}
                monitoramento={monitoramentoDaEtapa}
                monitoramentoAnterior={monitoramentoAnteriorDaEtapa}
                numeroEtapa={etapa === 'MED_0' ? 1 : 2}
                totalEtapas={2}
                eventosExcluidos={etapa === 'MED_1' ? eventosReivindicados : []}
                onCancelar={onClose}
                onAvancar={handleAvancarMedicamento}
              />
            </StepTransitionWrapper>
          </div>
          <div className="right-column">
            <HistoricoAberturas monitoramento={monitoramentoDaEtapa} />
          </div>
        </ModalLayoutWrapper>
      )}
      {etapa === 'DIVERGENCIA' && (
        <ModalContent style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e67e22' }}>
            <LuTriangleAlert size={22} /> Divergência de Adesão Identificada
          </h3>
          <InfoBox style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)', borderColor: '#f39c12' }}>
            <p>Os dois medicamentos apresentaram níveis de adesão diferentes neste contato:</p>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li><strong>{dadosPorMedicamento[0]?.medicamentoNome}:</strong> {LABEL_NIVEL[dadosPorMedicamento[0]?.nivelAdesao]}</li>
              <li><strong>{dadosPorMedicamento[1]?.medicamentoNome}:</strong> {LABEL_NIVEL[dadosPorMedicamento[1]?.nivelAdesao]}</li>
            </ul>
            <p style={{ margin: 0 }}>
              Data sugerida com base na média entre os dois:{' '}
              <strong>
                {formatarDataBR(formatarDataISO(calcularDataSugerida(dadosPorMedicamento[0]?.nivelAdesao, dadosPorMedicamento[1]?.nivelAdesao)))}
              </strong>
            </p>
          </InfoBox>
          <FormGroup style={{ marginTop: '15px' }}>
            <label>Como deseja agendar o próximo contato?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" checked={modoDataProximoContato === 'MEDIA'} onChange={() => setModoDataProximoContato('MEDIA')} />
                Usar a data sugerida (média entre os dois medicamentos)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" checked={modoDataProximoContato === 'SEMANAL'} onChange={() => setModoDataProximoContato('SEMANAL')} />
                Agendar semanalmente (7 dias) — acompanhamento mais próximo
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" checked={modoDataProximoContato === 'MENSAL'} onChange={() => setModoDataProximoContato('MENSAL')} />
                Agendar mensalmente (30 dias)
              </label>
            </div>
          </FormGroup>
          <ButtonGroup style={{ marginTop: '20px' }}>
            <Button type="button" variant="secondary" onClick={() => setEtapa('MED_1')} disabled={enviando}>Voltar</Button>
            <Button type="button" onClick={() => enviarRegistroConjunto(dadosPorMedicamento, modoDataProximoContato)} disabled={enviando}>
              {enviando ? 'Salvando...' : 'Confirmar e Salvar'}
            </Button>
          </ButtonGroup>
        </ModalContent>
      )}
    </ModalOverlay>
  );
}