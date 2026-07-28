import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

// Importando os estilos proprietários do componente
import {
  Container, Title, Subtitle, Card, MedName, Label, RadioGroup,
  InputRow, InputGroup, Input, WarningBox, HelpText, DateWrapper,
  ButtonGroup, ButtonCancel, ButtonSubmit
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
  const [missingQtdCapsula, setMissingQtdCapsula] = useState(false);

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
    if (paciente?.medicamento) {
      const defaultEntrega = paciente.data_entrega_medicamento
        ? paciente.data_entrega_medicamento.split('T')[0]
        : new Date().toISOString().split('T')[0];
      const defaultTelemonitoramento = calculateTelemonitoramentoDate(defaultEntrega);

      setMedicamentoState({
        [paciente.medicamento.id]: {
          usa: true,
          posologia: '',
          data_entrega: defaultEntrega,
          data_telemonitoramento: defaultTelemonitoramento,
          qtd_capsula_manual: '',
          qtd_caixas: paciente.qtd_caixas || 1
        }
      });
      setMissingQtdCapsula(false);
    }
  }, [paciente]);

  const handleMonitoramentoChange = (medId, field, value) => {
    setMedicamentoState(prev => {
      const updatedMed = { ...prev[medId], [field]: value };
      if (field === 'data_entrega' && value) {
        updatedMed.data_telemonitoramento = calculateTelemonitoramentoDate(value);
      }
      return { ...prev, [medId]: updatedMed };
    });
  };

  const handleSalvarMonitoramento = async () => {
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

    const itensInvalidos = confirmados.filter(item => !item.posologia_diaria || item.posologia_diaria <= 0 || !item.data_entrega || !item.data_telemonitoramento);
    if (itensInvalidos.length > 0) {
      toast.error("Por favor, preencha a posologia e as datas do medicamento corretamente.");
      setLoadingMonitoramento(false);
      return;
    }

    if (missingQtdCapsula) {
      const itensSemQtd = confirmados.filter(item => !item.qtd_capsula_manual);
      if (itensSemQtd.length > 0) {
        toast.error("A quantidade total da caixa do medicamento é obrigatória.");
        setLoadingMonitoramento(false);
        return;
      }
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
        toast.warning(error.response.data.message, { autoClose: 6000 });
        setMissingQtdCapsula(true);
      } else {
        toast.error(error.response?.data?.error || "Erro ao gerar monitoramento.");
      }
    } finally {
      setLoadingMonitoramento(false);
    }
  };

  if (!paciente?.medicamento) return null;

  return (
    <Container>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      
      <Card>
        <MedName>{paciente.medicamento.nome}</MedName>
        
        {showUsoToggle && (
          <>
            <Label>O paciente vai usar este medicamento?</Label>
            <RadioGroup>
              <label>
                <input 
                  type="radio" 
                  checked={medicamentoState[paciente.medicamento.id]?.usa === true} 
                  onChange={() => handleMonitoramentoChange(paciente.medicamento.id, 'usa', true)} 
                /> Sim
              </label>
              <label>
                <input 
                  type="radio" 
                  checked={medicamentoState[paciente.medicamento.id]?.usa === false} 
                  onChange={() => handleMonitoramentoChange(paciente.medicamento.id, 'usa', false)} 
                /> Não
              </label>
            </RadioGroup>
          </>
        )}

        {medicamentoState[paciente.medicamento.id]?.usa && (
          <>
            <InputRow>
              <InputGroup flex="1 1 150px">
                <Label>Comprimidos ao dia?</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={medicamentoState[paciente.medicamento.id]?.posologia || ''} 
                  onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'posologia', e.target.value)} 
                  placeholder="Ex: 2" 
                />
              </InputGroup>
              <InputGroup flex="1 1 100px">
                <Label>Qtd. Caixas:</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={medicamentoState[paciente.medicamento.id]?.qtd_caixas || ''} 
                  onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'qtd_caixas', e.target.value)} 
                  placeholder="Ex: 1" 
                />
              </InputGroup>
            </InputRow>

            {missingQtdCapsula && (
              <WarningBox>
                <label>⚠️ Qtd. total de comprimidos por caixa:</label>
                <Input 
                  type="number" 
                  min="1" 
                  error={true}
                  value={medicamentoState[paciente.medicamento.id]?.qtd_capsula_manual || ''} 
                  onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'qtd_capsula_manual', e.target.value)} 
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
                  value={medicamentoState[paciente.medicamento.id]?.data_entrega || ''} 
                  onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'data_entrega', e.target.value)} 
                />
              </InputGroup>
              
              <InputGroup>
                <Label bold>Data do primeiro telemonitoramento</Label>
                <HelpText>Agendado para ~5 dias após a previsão de administração.</HelpText>
                <DateWrapper>
                  <Input 
                    type="date" 
                    value={medicamentoState[paciente.medicamento.id]?.data_telemonitoramento || ''} 
                    onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'data_telemonitoramento', e.target.value)} 
                    style={{ width: '180px' }}
                  />
                  {medicamentoState[paciente.medicamento.id]?.data_telemonitoramento && (
                    <span>({getDayOfWeek(medicamentoState[paciente.medicamento.id].data_telemonitoramento)})</span>
                  )}
                </DateWrapper>
              </InputGroup>
            </InputRow>
          </>
        )}
      </Card>

      <ButtonGroup>
        {showCancelButton && (
          <ButtonCancel onClick={onCancel}>
            Voltar
          </ButtonCancel>
        )}
        <ButtonSubmit onClick={handleSalvarMonitoramento} disabled={loadingMonitoramento}>
          {loadingMonitoramento ? 'Salvando...' : 'Confirmar Monitoramentos'}
        </ButtonSubmit>
      </ButtonGroup>
    </Container>
  );
}