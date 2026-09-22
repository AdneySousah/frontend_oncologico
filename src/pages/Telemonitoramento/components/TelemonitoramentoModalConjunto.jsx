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
import NpsModal from './NpsModal';

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
// 👇 GENERALIZADO: antes recebia (nivelA, nivelB) e tirava a média de
// exatamente 2 — agora recebe um array com N níveis (um por medicamento
// ativo, não descontinuado) e tira a média de todos. Com 2 níveis, dá
// exatamente o mesmo resultado de antes — não muda nada do comportamento
// já existente pra quem tem 2 medicamentos.
function calcularDataSugerida(niveis) {
  const soma = niveis.reduce((acc, nivel) => acc + (DIAS_POR_NIVEL[nivel] || 0), 0);
  const dias = Math.round(soma / niveis.length);
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return ajustarFimDeSemana(data);
}
function calcularDataPorModo(modo, niveis) {
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
  return calcularDataSugerida(niveis);
}
const formatarDataISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const formatarDataBR = (isoStr) => isoStr.split('-').reverse().join('/');

// Wizard de registro de contato para pacientes em USO EM CONJUNTO (N
// medicamentos, N >= 2). Etapas: CONTATO_EFETIVO -> (PRE_TELE, se
// necessário, por medicamento) -> MEDICAMENTO (um de cada vez, por índice)
// -> DIVERGENCIA (se aplicável, comparando todos) -> NPS -> envio.
// 👇 GENERALIZADO: antes eram 2 medicamentos fixos (A/B, MED_0/MED_1) —
// agora é um array de qualquer tamanho, percorrido por índice
// (indiceAtual). Com exatamente 2 medicamentos, o comportamento é
// idêntico ao de antes — só a forma de representar internamente mudou.
export default function TelemonitoramentoModalConjunto({ isOpen, onClose, monitoramentos, monitoramentosAnteriores, onSucesso }) {
  const [etapa, setEtapa] = useState('CONTATO_EFETIVO'); // CONTATO_EFETIVO | PRE_TELE | MEDICAMENTO | DIVERGENCIA
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [dadosPorMedicamento, setDadosPorMedicamento] = useState([]);
  const [modoDataProximoContato, setModoDataProximoContato] = useState('MEDIA');
  const [enviando, setEnviando] = useState(false);
  const [transicao, setTransicao] = useState(false);
  const [eventosReivindicados, setEventosReivindicados] = useState([]);
  const [monitoramentosLocais, setMonitoramentosLocais] = useState(null);
  const [showNpsPrompt, setShowNpsPrompt] = useState(false);
  const [reabrirPreTele, setReabrirPreTele] = useState(null); // null | índice do medicamento
  const pacienteIdAtual = monitoramentos?.[0]?.paciente_id || monitoramentos?.[0]?.paciente?.id;
  const { bloqueio: bloqueioEdicao } = useReservaEdicaoPaciente(
    pacienteIdAtual,
    isOpen && !!monitoramentos && monitoramentos.length >= 2
  );
  useEffect(() => {
    if (isOpen) {
      setEtapa('CONTATO_EFETIVO');
      setIndiceAtual(0);
      setDadosPorMedicamento([]);
      setModoDataProximoContato('MEDIA');
      setEventosReivindicados([]);
      setShowNpsPrompt(false);
      setReabrirPreTele(null);
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && monitoramentos && monitoramentos.length >= 2) {
      setMonitoramentosLocais(monitoramentos);
    }
  }, [isOpen, monitoramentos]);
  // 👇 GENERALIZADO: continua exigindo pelo menos 2 (essa tela é só pra
  // uso em conjunto — 1 medicamento sozinho usa o outro modal) — mas não
  // trava mais em "exatamente 2", aceita 2, 3, 4...
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
  const listaAtual = monitoramentosLocais || monitoramentos;
  const monitoramentoDaEtapa = listaAtual[indiceAtual];

  // 👇 GENERALIZADO: antes recebia 'A'|'B' e atualizava monitA/monitB
  // diretamente — agora recebe o ÍNDICE e atualiza esse item específico do
  // array, mantendo todos os outros intocados.
  const atualizarMonitoramentoLocal = (indice, novaDataAdmin, novaDataFimCaixa) => {
    setMonitoramentosLocais(prev => {
      const base = prev || monitoramentos;
      return base.map((m, i) => (
        i === indice ? { ...m, data_administracao: novaDataAdmin, data_calculada_fim_caixa: novaDataFimCaixa } : m
      ));
    });
  };

  // 👇 Dispara o NPS assim que o registro conjunto é salvo com sucesso —
  // usa o primeiro medicamento do grupo como referência (o NPS é do
  // paciente, não de um medicamento específico, então qualquer um serve).
  if (showNpsPrompt) {
    return (
      <NpsModal
        monitoramento={listaAtual[0]}
        onClose={() => onClose()}
      />
    );
  }

  // 👇 GENERALIZADO: permite reabrir o pré-tele de QUALQUER medicamento do
  // grupo (por índice) pra corrigir uma data errada, mesmo depois que
  // data_administracao já foi salva no banco.
  if (reabrirPreTele !== null) {
    return (
      <PreMonitoramento
        monitoramento={listaAtual[reabrirPreTele]}
        onClose={() => setReabrirPreTele(null)}
        onSuccess={(novaDataAdmin, novaDataFimCaixa) => {
          atualizarMonitoramentoLocal(reabrirPreTele, novaDataAdmin, novaDataFimCaixa);
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

  // 👇 GENERALIZADO: decide se o próximo medicamento (por índice) precisa
  // de pré-tele antes de mostrar o formulário completo — mesma regra de
  // sempre, só que reutilizável pra qualquer posição da lista, não só a
  // segunda.
  const irParaMedicamento = (indice) => {
    const monit = listaAtual[indice];
    const anterior = monitoramentosAnteriores?.[monit.id];
    setIndiceAtual(indice);
    avancarComEfeito(precisaPreTele(monit, anterior) ? 'PRE_TELE' : 'MEDICAMENTO');
  };

  if (etapa === 'CONTATO_EFETIVO') {
    return (
      <TentativaContatoModal
        titulo={<><LuUsers size={22} color="#8a2be2" /> Registrar Contato — Uso em Conjunto ({listaAtual.length} medicamentos)</>}
        descricao={
          <>
            {listaAtual[0].paciente?.nome} {listaAtual[0].paciente?.sobrenome} está em uso de{' '}
            {listaAtual.map((m, i) => (
              <React.Fragment key={m.id}>
                <strong>{m.medicamento?.nome}</strong>
                {i < listaAtual.length - 2 ? ', ' : (i === listaAtual.length - 2 ? ' e ' : '')}
              </React.Fragment>
            ))}
            {' '}ao mesmo tempo. Este contato será registrado para todos.
          </>
        }
        onCancelar={onClose}
        enviando={enviando}
        onContinuar={async (contatoEfetivoValue, motivoSelecionado) => {
          if (contatoEfetivoValue === false) {
            try {
              setEnviando(true);
              await api.put('/monitoramento-medicamentos/conjunto/registrar', {
                grupo_medicamentos_id: listaAtual[0].grupo_medicamentos_id,
                contato_efetivo: false,
                motivo_falha_contato_id: motivoSelecionado.value,
                registros: listaAtual.map(m => ({ monitoramento_id: m.id }))
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
          irParaMedicamento(0);
        }}
      />
    );
  }

  const handlePreTeleSuccess = (novaDataAdmin, novaDataFimCaixa) => {
    atualizarMonitoramentoLocal(indiceAtual, novaDataAdmin, novaDataFimCaixa);
    avancarComEfeito('MEDICAMENTO');
  };
  if (etapa === 'PRE_TELE') {
    return (
      <PreMonitoramento
        monitoramento={monitoramentoDaEtapa}
        onClose={onClose}
        onSuccess={handlePreTeleSuccess}
      />
    );
  }

  // 👇 GENERALIZADO: antes só sabia lidar com exatamente 2 posições
  // (avançar da 1ª pra 2ª, depois checar divergência entre as duas) —
  // agora avança item por item até acabar a lista, e só então checa
  // divergência entre TODOS os que ficaram ativos (não descontinuados).
  const handleAvancarMedicamento = (dados) => {
    const novaLista = [...dadosPorMedicamento, dados];
    setDadosPorMedicamento(novaLista);
    if (dados.aplicarNovaCompra && dados.dadosNovaCompra?.evento_externo_id) {
      setEventosReivindicados(prev => [...prev, dados.dadosNovaCompra.evento_externo_id]);
    }
    if (indiceAtual < listaAtual.length - 1) {
      irParaMedicamento(indiceAtual + 1);
      return;
    }
    const algumDescontinuado = novaLista.some(d => d.descontinuarMedicamento);
    const niveisAtivos = novaLista.filter(d => !d.descontinuarMedicamento).map(d => d.nivelAdesao);
    const todosIguais = niveisAtivos.length <= 1 || niveisAtivos.every(n => n === niveisAtivos[0]);
    if (algumDescontinuado || todosIguais) {
      enviarRegistroConjunto(novaLista, 'MEDIA');
    } else {
      avancarComEfeito('DIVERGENCIA');
    }
  };
  const enviarRegistroConjunto = async (dadosLista, modo) => {
    const ativos = dadosLista.filter(d => !d.descontinuarMedicamento);
    let dataProximoContato = null;
    if (ativos.length > 0) {
      const niveis = ativos.map(a => a.nivelAdesao);
      dataProximoContato = formatarDataISO(calcularDataPorModo(modo, niveis));
    }
    try {
      setEnviando(true);
      await api.put('/monitoramento-medicamentos/conjunto/registrar', {
        grupo_medicamentos_id: listaAtual[0].grupo_medicamentos_id,
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
          tipo_posologia_nova: (d.mudouPosologia && d.padraoPosologiaNova) ? d.padraoPosologiaNova.tipo_posologia : null,
          posologia_ciclo_dias_toma_nova: (d.mudouPosologia && d.padraoPosologiaNova) ? d.padraoPosologiaNova.posologia_ciclo_dias_toma : null,
          posologia_ciclo_dias_pausa_nova: (d.mudouPosologia && d.padraoPosologiaNova) ? d.padraoPosologiaNova.posologia_ciclo_dias_pausa : null,
          posologia_intervalo_dias_nova: (d.mudouPosologia && d.padraoPosologiaNova) ? d.padraoPosologiaNova.posologia_intervalo_dias : null,
          posologia_datas_personalizadas_nova: (d.mudouPosologia && d.padraoPosologiaNova) ? d.padraoPosologiaNova.posologia_datas_personalizadas : null,
          aplicar_nova_compra: d.aplicarNovaCompra,
          dados_nova_compra: d.aplicarNovaCompra ? d.dadosNovaCompra : null,
          data_inicio_nova_caixa: d.aplicarNovaCompra ? d.dataRealInicioNovaCaixa : null,
          posologia_nova_caixa: d.aplicarNovaCompra ? Number(d.posologiaNovaCaixa) : null,
          modo_novo_medicamento: (d.aplicarNovaCompra && d.dadosNovaCompra?.mudou_medicamento) ? d.modoNovoMedicamento : null,
          descontinuar_medicamento: d.descontinuarMedicamento,
          motivo_encerramento: d.descontinuarMedicamento ? (d.motivoEncerramento || null) : null,
          motivo_encerramento_id: d.descontinuarMedicamento ? (d.motivoEncerramentoId || null) : null
        }))
      });
      toast.success(`Contato registrado para os ${dadosLista.length} medicamentos com sucesso!`);
      onSucesso();
      window.dispatchEvent(new Event('updateAlerts'));
      setShowNpsPrompt(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
    } finally {
      setEnviando(false);
    }
  };
  const monitoramentoAnteriorDaEtapa = monitoramentoDaEtapa
    ? monitoramentosAnteriores?.[monitoramentoDaEtapa.id]
    : null;

  // 👇 GENERALIZADO: pra tela de divergência, lista TODOS os medicamentos
  // ativos (não só dois fixos) e calcula a data sugerida pela média de
  // TODOS os níveis de adesão — com 2, dá o mesmo resultado de sempre.
  const dadosAtivosParaDivergencia = dadosPorMedicamento.filter(d => !d.descontinuarMedicamento);
  const niveisParaSugestao = dadosAtivosParaDivergencia.map(d => d.nivelAdesao);
  const dataSugeridaISO = niveisParaSugestao.length > 0
    ? formatarDataISO(calcularDataSugerida(niveisParaSugestao))
    : null;

  return (
    <ModalOverlay style={{ overflowY: 'auto', padding: '20px 0' }}>
      {etapa === 'MEDICAMENTO' && (
        <ModalLayoutWrapper>
          <div className="left-column">
            {monitoramentoAnteriorDaEtapa && (
              <ResumoAnterior monitoramento={monitoramentoAnteriorDaEtapa} />
            )}
            <HistoricoComprasPaciente monitoramento={monitoramentoDaEtapa} />
          </div>
          <div className="center-column">
            <StepTransitionWrapper leaving={transicao}>
              <PassoRegistroMedicamento
                key={monitoramentoDaEtapa.id}
                monitoramento={monitoramentoDaEtapa}
                monitoramentoAnterior={monitoramentoAnteriorDaEtapa}
                numeroEtapa={indiceAtual + 1}
                totalEtapas={listaAtual.length}
                eventosExcluidos={eventosReivindicados}
                onCancelar={onClose}
                onAvancar={handleAvancarMedicamento}
                onCorrigirData={() => setReabrirPreTele(indiceAtual)}
                corrigirDataDisabled={enviando}
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
            <p>Os medicamentos apresentaram níveis de adesão diferentes neste contato:</p>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              {dadosAtivosParaDivergencia.map((d) => (
                <li key={d.monitoramentoId}><strong>{d.medicamentoNome}:</strong> {LABEL_NIVEL[d.nivelAdesao]}</li>
              ))}
            </ul>
            {dataSugeridaISO && (
              <p style={{ margin: 0 }}>
                Data sugerida com base na média entre os {dadosAtivosParaDivergencia.length}:{' '}
                <strong>{formatarDataBR(dataSugeridaISO)}</strong>
              </p>
            )}
          </InfoBox>
          <FormGroup style={{ marginTop: '15px' }}>
            <label>Como deseja agendar o próximo contato?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" checked={modoDataProximoContato === 'MEDIA'} onChange={() => setModoDataProximoContato('MEDIA')} />
                Usar a data sugerida (média entre os medicamentos)
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
            <Button type="button" variant="secondary" onClick={() => setEtapa('MEDICAMENTO')} disabled={enviando}>Voltar</Button>
            <Button type="button" onClick={() => enviarRegistroConjunto(dadosPorMedicamento, modoDataProximoContato)} disabled={enviando}>
              {enviando ? 'Salvando...' : 'Confirmar e Salvar'}
            </Button>
          </ButtonGroup>
        </ModalContent>
      )}
    </ModalOverlay>
  );
}
