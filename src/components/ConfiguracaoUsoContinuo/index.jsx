import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { LuUsers } from 'react-icons/lu';
import api from '../../services/api';
// Importando os estilos proprietários do componente
import {
  Container, Title, Subtitle, Card, MedName, Label, RadioGroup,
  InputRow, InputGroup, Input, WarningBox, HelpText, DateWrapper,
  ButtonGroup, ButtonCancel, ButtonSubmit,
  ProgressoConjunto, ProgressoDots, Dot
} from './styles';

export default function ConfiguracaoUsoContinuo({
  paciente,
  evaluationId = null,
  onSuccess,
  onCancel,
  showUsoToggle = false,
  showCancelButton = true,
  title = "Configuração de Uso Contínuo",
  subtitle = ""
}) {
  const [medicamentoState, setMedicamentoState] = useState({});
  const [loadingMonitoramento, setLoadingMonitoramento] = useState(false);
  // Objeto por medicamento_id (em vez de um boolean único), pois com uso em
  // conjunto pode faltar qtd_capsula em mais de um medicamento ao mesmo tempo.
  const [missingQtdCapsula, setMissingQtdCapsula] = useState({});
  // 👇 NOVO: em qual medicamento da lista o usuário está agora (só usado
  // quando há mais de um medicamento — fluxo em etapas, um de cada vez).
  const [etapaAtual, setEtapaAtual] = useState(0);

  // Suporta tanto o formato antigo (paciente.medicamento único) quanto o novo
  // formato (paciente.medicamentos, array com 1 ou 2 itens).
  const medicamentosList = (paciente?.medicamentos && paciente.medicamentos.length > 0)
    ? paciente.medicamentos
    : (paciente?.medicamento ? [paciente.medicamento] : []);

  const usoConjunto = medicamentosList.length > 1;

  const calculateTelemonitoramentoDate = (baseDate) => {
    const date = baseDate ? new Date(`${baseDate}T12:00:00`) : new Date();
    date.setDate(date.getDate() + 5);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) date.setDate(date.getDate() + 2);
    else if (dayOfWeek === 0) date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const getDayOfWeek = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const dia = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
    return dia.charAt(0).toUpperCase() + dia.slice(1);
  };

  useEffect(() => {
    if (medicamentosList.length > 0) {
      const estadoInicial = {};

      medicamentosList.forEach((medicamento) => {
        const defaultEntrega = medicamento.data_entrega_medicamento
          ? medicamento.data_entrega_medicamento.split('T')[0]
          : (paciente.data_entrega_medicamento
            ? paciente.data_entrega_medicamento.split('T')[0]
            : new Date().toISOString().split('T')[0]);

        estadoInicial[medicamento.id] = {
          usa: true,
          posologia: '',
          data_entrega: defaultEntrega,
          data_telemonitoramento: calculateTelemonitoramentoDate(defaultEntrega),
          qtd_capsula_manual: '',
          qtd_caixas: medicamento.qtd_caixas || paciente.qtd_caixas || 1
        };
      });

      setMedicamentoState(estadoInicial);
      setMissingQtdCapsula({});
      setEtapaAtual(0); // 👈 NOVO: sempre reinicia no primeiro medicamento
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paciente]);

  // ==========================================================
  // USO EM CONJUNTO: unifica a data do primeiro telemonitoramento entre os
  // medicamentos. Sem isso, cada medicamento teria sua própria data (baseada
  // na própria entrega), e o primeiro contato apareceria como DOIS registros
  // pendentes com datas diferentes em vez de um só.
  // Usamos a MAIS TARDIA entre as datas calculadas, para garantir que o
  // primeiro contato só aconteça depois que todos os medicamentos já
  // tiverem sido entregues/iniciados.
  // ==========================================================
  const entregasKey = medicamentosList.map(m => medicamentoState[m.id]?.data_entrega || '').join('|');

  useEffect(() => {
    if (!usoConjunto) return;

    setMedicamentoState(prev => {
      const datasCalculadas = medicamentosList
        .filter(m => prev[m.id]?.usa !== false) // ignora medicamento que o paciente não vai usar
        .map(m => prev[m.id]?.data_entrega)
        .filter(Boolean)
        .map(calculateTelemonitoramentoDate);

      if (datasCalculadas.length === 0) return prev;

      const dataUnificada = datasCalculadas.reduce((maior, atual) => (atual > maior ? atual : maior));

      const atualizado = { ...prev };
      let mudou = false;
      medicamentosList.forEach(m => {
        if (atualizado[m.id] && atualizado[m.id].data_telemonitoramento !== dataUnificada) {
          atualizado[m.id] = { ...atualizado[m.id], data_telemonitoramento: dataUnificada };
          mudou = true;
        }
      });
      return mudou ? atualizado : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entregasKey, usoConjunto]);

  const handleMonitoramentoChange = (medId, field, value) => {
    setMedicamentoState(prev => {
      const updatedMed = { ...prev[medId], [field]: value };
      if (field === 'data_entrega' && value && !usoConjunto) {
        // Em uso individual, a data do telemonitoramento recalcula sozinha.
        // Em uso conjunto, isso é feito pelo useEffect de unificação acima.
        updatedMed.data_telemonitoramento = calculateTelemonitoramentoDate(value);
      }
      return { ...prev, [medId]: updatedMed };
    });
  };

  const handleDataTelemonitoramentoConjuntaChange = (novaData) => {
    setMedicamentoState(prev => {
      const atualizado = { ...prev };
      medicamentosList.forEach(m => {
        if (atualizado[m.id]) atualizado[m.id] = { ...atualizado[m.id], data_telemonitoramento: novaData };
      });
      return atualizado;
    });
  };

  // 👇 NOVO: valida só o medicamento da etapa atual, antes de avançar pro próximo
  const validarEtapaAtual = () => {
    const medicamentoDaEtapa = medicamentosList[etapaAtual];
    if (!medicamentoDaEtapa) return true;

    const dados = medicamentoState[medicamentoDaEtapa.id];
    if (!dados) return true;

    if (dados.usa === false) return true; // paciente não vai usar este, nada a validar

    if (!dados.posologia || Number(dados.posologia) <= 0) {
      toast.error(`Informe a posologia diária de ${medicamentoDaEtapa.nome}.`);
      return false;
    }
    if (!dados.data_entrega) {
      toast.error(`Informe a data de entrega de ${medicamentoDaEtapa.nome}.`);
      return false;
    }
    if (missingQtdCapsula[medicamentoDaEtapa.id] && !dados.qtd_capsula_manual) {
      toast.error(`Informe a quantidade total de comprimidos da caixa de ${medicamentoDaEtapa.nome}.`);
      return false;
    }
    return true;
  };

  const handleAvancarEtapa = () => {
    if (!validarEtapaAtual()) return;
    if (etapaAtual < medicamentosList.length - 1) {
      setEtapaAtual(prev => prev + 1);
    }
  };

  const handleVoltarEtapa = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(prev => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSalvarMonitoramento = async () => {
    if (usoConjunto && !validarEtapaAtual()) return;

    setLoadingMonitoramento(true);

    const confirmados = Object.entries(medicamentoState)
      .map(([medId, data]) => ({
        medicamento_id: Number(medId),
        posologia_diaria: Number(data.posologia),
        usa: data.usa,
        data_entrega: data.data_entrega,
        data_telemonitoramento: data.data_telemonitoramento,
        qtd_caixas: data.qtd_caixas ? Number(data.qtd_caixas) : 1,
        qtd_capsula_manual: data.qtd_capsula_manual ? Number(data.qtd_capsula_manual) : null
      }))
      .filter(item => item.usa === true);

    if (confirmados.length === 0) {
      setLoadingMonitoramento(false);
      if (onSuccess) onSuccess();
      return;
    }

    const itensInvalidos = confirmados.filter(
      item => !item.posologia_diaria || item.posologia_diaria <= 0 || !item.data_entrega || !item.data_telemonitoramento
    );
    if (itensInvalidos.length > 0) {
      toast.error("Por favor, preencha a posologia e as datas de todos os medicamentos corretamente.");
      setLoadingMonitoramento(false);
      return;
    }

    const algumFaltandoQtd = confirmados.some(
      item => missingQtdCapsula[item.medicamento_id] && !item.qtd_capsula_manual
    );
    if (algumFaltandoQtd) {
      toast.error("A quantidade total da caixa é obrigatória para os medicamentos sinalizados.");
      setLoadingMonitoramento(false);
      return;
    }

    try {
      await api.post('/monitoramento-medicamentos', {
        paciente_id: Number(paciente.id),
        patient_evaluation_id: evaluationId,
        medicamentos_confirmados: confirmados
      });
      window.dispatchEvent(new Event('updateAlerts'));
      toast.success("Monitoramento de medicamentos configurado com sucesso!");
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response?.data?.needs_qtd_capsula) {
        const medId = error.response.data.medicamento_id;
        toast.warning(error.response.data.message, { autoClose: 6000 });
        if (medId) {
          setMissingQtdCapsula(prev => ({ ...prev, [medId]: true }));
          // 👇 NOVO: leva o usuário direto pro medicamento que está faltando informação
          const indexDoMed = medicamentosList.findIndex(m => m.id === medId);
          if (indexDoMed >= 0) setEtapaAtual(indexDoMed);
        } else {
          const todos = {};
          confirmados.forEach(c => { todos[c.medicamento_id] = true; });
          setMissingQtdCapsula(todos);
        }
      } else {
        toast.error(error.response?.data?.error || "Erro ao gerar monitoramento.");
      }
    } finally {
      setLoadingMonitoramento(false);
    }
  };

  if (medicamentosList.length === 0) return null;

  const dataTelemonitoramentoConjunta = medicamentosList.length > 0
    ? medicamentoState[medicamentosList[0].id]?.data_telemonitoramento
    : '';

  // 👇 NOVO: em uso conjunto, só mostra UM medicamento por vez (o da etapa atual)
  const medicamentosParaExibir = usoConjunto ? [medicamentosList[etapaAtual]] : medicamentosList;
  const ehUltimaEtapa = !usoConjunto || etapaAtual === medicamentosList.length - 1;

  return (
    <Container>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}

      {usoConjunto && (
        <ProgressoConjunto>
          <LuUsers size={18} />
          <span>Este paciente utiliza <strong>{medicamentosList.length} medicamentos</strong> em conjunto</span>
          <ProgressoDots>
            {medicamentosList.map((m, idx) => (
              <Dot key={m.id} active={idx === etapaAtual} completed={idx < etapaAtual} />
            ))}
          </ProgressoDots>
          <span className="etapa-label">Medicamento {etapaAtual + 1} de {medicamentosList.length}</span>
        </ProgressoConjunto>
      )}

      {medicamentosParaExibir.map((medicamento) => (
        <Card key={medicamento.id}>
          <MedName>{medicamento.nome}</MedName>

          {showUsoToggle && (
            <>
              <Label>O paciente vai usar este medicamento?</Label>
              <RadioGroup>
                <label>
                  <input
                    type="radio"
                    checked={medicamentoState[medicamento.id]?.usa === true}
                    onChange={() => handleMonitoramentoChange(medicamento.id, 'usa', true)}
                  /> Sim
                </label>
                <label>
                  <input
                    type="radio"
                    checked={medicamentoState[medicamento.id]?.usa === false}
                    onChange={() => handleMonitoramentoChange(medicamento.id, 'usa', false)}
                  /> Não
                </label>
              </RadioGroup>
            </>
          )}

          {medicamentoState[medicamento.id]?.usa && (
            <>
              <InputRow>
                <InputGroup flex="1 1 150px">
                  <Label>Comprimidos ao dia?</Label>
                  <Input
                    type="number"
                    min="1"
                    value={medicamentoState[medicamento.id]?.posologia || ''}
                    onChange={(e) => handleMonitoramentoChange(medicamento.id, 'posologia', e.target.value)}
                    placeholder="Ex: 2"
                  />
                </InputGroup>
                <InputGroup flex="1 1 100px">
                  <Label>Qtd. Caixas:</Label>
                  <Input
                    type="number"
                    min="1"
                    value={medicamentoState[medicamento.id]?.qtd_caixas || ''}
                    onChange={(e) => handleMonitoramentoChange(medicamento.id, 'qtd_caixas', e.target.value)}
                    placeholder="Ex: 1"
                  />
                </InputGroup>
              </InputRow>

              {missingQtdCapsula[medicamento.id] && (
                <WarningBox>
                  <label>⚠️ Qtd. total de comprimidos por caixa:</label>
                  <Input
                    type="number"
                    min="1"
                    error={true}
                    value={medicamentoState[medicamento.id]?.qtd_capsula_manual || ''}
                    onChange={(e) => handleMonitoramentoChange(medicamento.id, 'qtd_capsula_manual', e.target.value)}
                    placeholder="Ex: 30"
                    style={{ width: '150px' }}
                  />
                </WarningBox>
              )}

              <InputRow style={{ flexDirection: 'column', gap: '15px' }}>
                <InputGroup>
                  <Label bold>Data de Início/Entrega do Medicamento</Label>
                  <Input
                    type="date"
                    value={medicamentoState[medicamento.id]?.data_entrega || ''}
                    onChange={(e) => handleMonitoramentoChange(medicamento.id, 'data_entrega', e.target.value)}
                  />
                </InputGroup>

                {/* Em uso individual, cada medicamento mostra sua própria data.
                    Em uso conjunto, essa data some daqui e vira um campo único
                    logo abaixo dos Cards, na última etapa. */}
                {!usoConjunto && (
                  <InputGroup>
                    <Label bold>Data do primeiro telemonitoramento</Label>
                    <HelpText>Agendado para ~5 dias após a previsão de administração.</HelpText>
                    <DateWrapper>
                      <Input
                        type="date"
                        value={medicamentoState[medicamento.id]?.data_telemonitoramento || ''}
                        onChange={(e) => handleMonitoramentoChange(medicamento.id, 'data_telemonitoramento', e.target.value)}
                        style={{ width: '180px' }}
                      />
                      {medicamentoState[medicamento.id]?.data_telemonitoramento && (
                        <span>({getDayOfWeek(medicamentoState[medicamento.id].data_telemonitoramento)})</span>
                      )}
                    </DateWrapper>
                  </InputGroup>
                )}
              </InputRow>
            </>
          )}
        </Card>
      ))}

      {usoConjunto && ehUltimaEtapa && dataTelemonitoramentoConjunta && (
        <Card>
          <Label bold>Data do Primeiro Telemonitoramento (Conjunto)</Label>
          <HelpText>
            Como os medicamentos serão acompanhados juntos, o primeiro contato é agendado em uma
            única data, calculada ~5 dias após a entrega mais tardia entre eles. Edite se necessário.
          </HelpText>
          <DateWrapper>
            <Input
              type="date"
              value={dataTelemonitoramentoConjunta}
              onChange={(e) => handleDataTelemonitoramentoConjuntaChange(e.target.value)}
              style={{ width: '180px' }}
            />
            <span>({getDayOfWeek(dataTelemonitoramentoConjunta)})</span>
          </DateWrapper>
        </Card>
      )}

      <ButtonGroup>
        {usoConjunto ? (
          <>
            {(etapaAtual > 0 || showCancelButton) && (
              <ButtonCancel onClick={handleVoltarEtapa}>
                {etapaAtual === 0 ? 'Voltar' : '← Voltar'}
              </ButtonCancel>
            )}
            {ehUltimaEtapa ? (
              <ButtonSubmit onClick={handleSalvarMonitoramento} disabled={loadingMonitoramento}>
                {loadingMonitoramento ? 'Salvando...' : 'Confirmar Monitoramentos'}
              </ButtonSubmit>
            ) : (
              <ButtonSubmit type="button" onClick={handleAvancarEtapa}>
                Confirmar e Avançar →
              </ButtonSubmit>
            )}
          </>
        ) : (
          <>
            {showCancelButton && (
              <ButtonCancel onClick={onCancel}>
                Voltar
              </ButtonCancel>
            )}
            <ButtonSubmit onClick={handleSalvarMonitoramento} disabled={loadingMonitoramento}>
              {loadingMonitoramento ? 'Salvando...' : 'Confirmar Monitoramentos'}
            </ButtonSubmit>
          </>
        )}
      </ButtonGroup>
    </Container>
  );
}