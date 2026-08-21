import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Select from 'react-select';
import { useTheme } from 'styled-components';
import {
  ModalContent, FormGroup, Input, ButtonGroup, Button, InfoBox,
  ProjectedStockBox, SkeletonLoader, PosologiaChangeAlert, HighlightedSection
} from './styles';
import { getCustomSelectStyles } from '../../../utils/selectStyles';
import ComparativoNovaCompra from './ComparativoNovaCompra';

// Componente de UMA etapa do wizard de "uso em conjunto": coleta os dados de
// UM medicamento por vez (estoque, reação adversa, mudança de posologia, nova
// compra). Não calcula nem envia a data do próximo contato — isso é decidido
// em conjunto pelos dois medicamentos, no orquestrador (TelemonitoramentoModalConjunto).
export default function PassoRegistroMedicamento({
  monitoramento,
  monitoramentoAnterior,
  numeroEtapa,
  totalEtapas,
  // 👇 NOVO: ids de evento_externo_id já aplicados por OUTRO medicamento
  // nesta mesma rodada do wizard. Sem isso, o mesmo evento de compra (ex:
  // substituição de C por A/B) poderia aparecer como candidato de novo na
  // etapa do segundo medicamento, mesmo já tendo sido resolvido na primeira.
  eventosExcluidos = [],
  onCancelar,
  onAvancar
}) {
  const theme = useTheme();

  const [loadingCompra, setLoadingCompra] = useState(true);
  const [dadosNovaCompra, setDadosNovaCompra] = useState(null);
  const [aplicarNovaCompra, setAplicarNovaCompra] = useState(false);
  const [dataRealInicioNovaCaixa, setDataRealInicioNovaCaixa] = useState('');
  const [posologiaNovaCaixa, setPosologiaNovaCaixa] = useState('');
  const [modoNovoMedicamento, setModoNovoMedicamento] = useState(null);

  const [qtdInformada, setQtdInformada] = useState('');
  const [isReacao, setIsReacao] = useState(false);
  const [reacoesSelecionadas, setReacoesSelecionadas] = useState([]);
  const [listaReacoes, setListaReacoes] = useState([]);
  const [observacao, setObservacao] = useState('');

  const [mudouPosologia, setMudouPosologia] = useState(false);
  const [novaPosologia, setNovaPosologia] = useState('');
  const [dataMudancaPosologia, setDataMudancaPosologia] = useState('');

  const [descontinuarMedicamento, setDescontinuarMedicamento] = useState(false);
  const [motivoEncerramento, setMotivoEncerramento] = useState('');

  useEffect(() => {
    let isMounted = true;

    api.get('/reacao-adversa')
      .then(res => { if (isMounted) setListaReacoes(res.data); })
      .catch(() => { if (isMounted) toast.error('Erro ao carregar reações adversas.'); });

    setLoadingCompra(true);
    api.get(`/monitoramento-medicamentos/${monitoramento.id}/verificar-compra`, {
      params: eventosExcluidos.length > 0 ? { excluir_eventos: eventosExcluidos.join(',') } : {}
    })
      .then(res => {
        if (!isMounted) return;
        if (res.data && res.data.novaCompraDetectada) {
          setDadosNovaCompra(res.data.detalhes);
          setAplicarNovaCompra(true);
          setPosologiaNovaCaixa(monitoramento.posologia_diaria || '');
          if (res.data.detalhes.data_novo_inicio) {
            setDataRealInicioNovaCaixa(res.data.detalhes.data_novo_inicio.split('T')[0]);
          }
          setModoNovoMedicamento(
            res.data.detalhes.mudou_medicamento
              ? (res.data.detalhes.pode_ser_conjunto ? null : 'SUBSTITUICAO')
              : null
          );
        }
      })
      .catch(err => {
        if (isMounted && err.response?.data?.error) toast.error(err.response.data.error);
      })
      .finally(() => { if (isMounted) setLoadingCompra(false); });

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoramento.id]);

  // ==========================================
  // Cálculo de estoque projetado (mesma lógica do fluxo individual)
  // ==========================================
  let idealRemaining = 0;
  let margemMin = 0;
  let margemMax = 0;
  let dataReferenciaFormatada = '-';
  let dataFimCicloAtualFormatada = '-';
  let isAntesDoInicio = false;

  const qtdCaixas = Number(monitoramento?.qtd_caixas || 1);
  const qtdTotalCaixa = Number(
    monitoramento?.qtd_total_capsulas || (monitoramento?.medicamento?.qtd_capsula * qtdCaixas) || 0
  );
  const posologia = Number(monitoramento?.posologia_diaria || 1);
  let idealRemainingAntigo = 0;
  const dataUsoReferencia = monitoramento?.data_administracao || monitoramento?.data_entrega;

  let dataInicioObj = null;
  if (dataUsoReferencia) {
    const dataApenasData = dataUsoReferencia.split('T')[0];
    const [ano, mes, dia] = dataApenasData.split('-');
    dataReferenciaFormatada = `${dia}/${mes}/${ano}`;
    dataInicioObj = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (hoje < dataInicioObj) isAntesDoInicio = true;
  }

  if (monitoramento?.data_calculada_fim_caixa) {
    const [ano, mes, dia] = monitoramento.data_calculada_fim_caixa.split('T')[0].split('-');
    dataFimCicloAtualFormatada = `${dia}/${mes}/${ano}`;
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
      idealRemaining = dadosNovaCompra.total_capsulas_novas - (diasUsoNovaCaixa * posologiaNova);
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
  }

  const calcularNivelAdesao = () => {
    const posologiaVigente = (mudouPosologia && novaPosologia) ? Number(novaPosologia) : posologia;
    const qtdInformadaNum = Number(qtdInformada);
    const diferencaComprimidos = Math.abs(idealRemaining - qtdInformadaNum);
    const diferencaEmDias = diferencaComprimidos / posologiaVigente;
    if (diferencaEmDias <= 2) return 'COMPLETAMENTE';
    if (diferencaEmDias <= 6) return 'PARCIALMENTE';
    return 'NAO_ADERE';
  };

  const opcoesReacoes = listaReacoes.map(r => ({ value: r.id, label: r.name }));

  const handleAvancar = () => {
    if (!qtdInformada) {
      toast.error(`Informe a quantidade de comprimidos restantes de ${monitoramento.medicamento?.nome}.`);
      return;
    }
    if (descontinuarMedicamento && aplicarNovaCompra) {
      toast.error(`Não é possível descontinuar ${monitoramento.medicamento?.nome} e aplicar uma nova compra ao mesmo tempo.`);
      return;
    }
    if (!descontinuarMedicamento && aplicarNovaCompra) {
      if (!dataRealInicioNovaCaixa || !posologiaNovaCaixa) {
        toast.error(`Data de início e posologia da nova caixa de ${monitoramento.medicamento?.nome} são obrigatórias.`);
        return;
      }
      if (dadosNovaCompra?.mudou_medicamento && dadosNovaCompra?.pode_ser_conjunto && !modoNovoMedicamento) {
        toast.error('Selecione se deseja usar os medicamentos em conjunto ou substituir.');
        return;
      }
    }
    if (mudouPosologia && (!novaPosologia || !dataMudancaPosologia)) {
      toast.error('Preencha a nova dosagem e a data em que ela começou.');
      return;
    }

    onAvancar({
      monitoramentoId: monitoramento.id,
      medicamentoNome: monitoramento.medicamento?.nome,
      qtdInformada,
      nivelAdesao: calcularNivelAdesao(),
      isReacao,
      reacoesSelecionadas,
      observacao,
      mudouPosologia,
      novaPosologia,
      dataMudancaPosologia,
      aplicarNovaCompra,
      dadosNovaCompra,
      dataRealInicioNovaCaixa,
      posologiaNovaCaixa,
      modoNovoMedicamento,
      descontinuarMedicamento,
      motivoEncerramento
    });
  };

  return (
    <ModalContent style={{ width: '100%', maxWidth: '650px', margin: '0 auto' }}>
      <h3>Medicamento {numeroEtapa} de {totalEtapas}: {monitoramento.medicamento?.nome}</h3>

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
        <p className="sub-text">
          Quantidade total inicial: {qtdTotalCaixa} comprimidos ({qtdCaixas} caixa{qtdCaixas > 1 ? 's' : ''}) (Dose: {posologia}/dia)
        </p>
        <ProjectedStockBox>
          <p style={{ marginBottom: '6px', fontSize: '0.9em' }}>
            <strong>Data administração informada:</strong> {dataReferenciaFormatada}
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
              <span>Cálculo considerando a data de transição para a nova dosagem prescrita.</span>
            </PosologiaChangeAlert>
          )}
        </ProjectedStockBox>
      </InfoBox>

      {!aplicarNovaCompra && (
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
                  required
                />
              </div>
              <div className="input-group">
                <label>A partir de que dia começou a tomar a nova dose?</label>
                <Input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={dataMudancaPosologia}
                  onChange={(e) => setDataMudancaPosologia(e.target.value)}
                  required
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
              onChange={(e) => setDescontinuarMedicamento(e.target.checked)}
            />
            <strong>Paciente descontinuou {monitoramento.medicamento?.nome}</strong>
          </label>
          {descontinuarMedicamento && (
            <div className="inputs-row">
              <div className="input-group" style={{ flex: 1 }}>
                <label>Motivo do encerramento (opcional):</label>
                <Input as="textarea" rows="2" value={motivoEncerramento} onChange={(e) => setMotivoEncerramento(e.target.value)} />
              </div>
            </div>
          )}
        </HighlightedSection>
      )}


      <FormGroup>
        <label>Quantos comprimidos de {monitoramento.medicamento?.nome} restam com o paciente?</label>
        <Input
          type="number"
          min="0"
          value={qtdInformada}
          onChange={(e) => setQtdInformada(e.target.value)}
          placeholder="Ex: 45"
          required
        />
      </FormGroup>

      {/* Leitura em tempo real da adesão calculada para ESTE medicamento. A
          data final do próximo contato só é decidida depois que os dois
          medicamentos forem preenchidos, mas o atendente precisa ver, na
          hora, como está indo cada um. */}
      {qtdInformada !== '' && (
        <FormGroup>
          <label>O quanto ele adere a este medicamento? (Calculado automaticamente)</label>
          <Input as="select" value={calcularNivelAdesao()} disabled>
            <option value="COMPLETAMENTE">Alta adesão ao uso do medicamento</option>
            <option value="PARCIALMENTE">Média adesão ao uso do medicamento</option>
            <option value="NAO_ADERE">Baixa adesão ao uso do medicamento</option>
          </Input>
        </FormGroup>
      )}

      <FormGroup>
        <label>O paciente relatou alguma reação adversa a este medicamento?</label>
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
          <label>Quais foram as reações adversas?</label>
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

      <FormGroup>
        <label>Observação sobre este medicamento (Opcional)</label>
        <Input
          as="textarea"
          rows="2"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Descreva aqui informações específicas deste medicamento"
          style={{ resize: 'vertical', padding: '10px' }}
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button type="button" onClick={handleAvancar}>
          {numeroEtapa < totalEtapas ? 'Avançar para o próximo medicamento' : 'Continuar'}
        </Button>
      </ButtonGroup>
    </ModalContent>
  );
}