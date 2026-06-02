import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import {
  ModalOverlay, ModalContent, SuccessCheck, Button, Input
} from '../styles';

export default function AvaliacaoModal({
  isOpen,
  onClose,
  scoreFinal,
  pacienteData,
  pacienteId,
  evaluationId,
  pendingTemplatesCount,
  requireMedicationSetup
}) {
  const [modalStep, setModalStep] = useState('success');
  const [medicamentoState, setMedicamentoState] = useState({});
  const [loadingMonitoramento, setLoadingMonitoramento] = useState(false);
  const [missingQtdCapsula, setMissingQtdCapsula] = useState(false);

  const calculateTelemonitoramentoDate = (baseDate) => {
    // Se baseDate não for passada, usa a data atual
    const date = baseDate ? new Date(`${baseDate}T12:00:00`) : new Date();
    date.setDate(date.getDate() + 5); // Soma 15 dias

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) {
      // Se cair no Sábado (6), joga pra Segunda (+2 dias)
      date.setDate(date.getDate() + 2);
    } else if (dayOfWeek === 0) {
      // Se cair no Domingo (0), joga pra Segunda (+1 dia)
      date.setDate(date.getDate() + 1);
    }

    // Retorna no formato YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const getDayOfWeek = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    // Cria a data com timezone local para evitar variação de fuso horário
    const date = new Date(year, month - 1, day);
    const dia = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
    return dia.charAt(0).toUpperCase() + dia.slice(1);
  };

  useEffect(() => {
    if (isOpen) {
      setModalStep('success');
      setMissingQtdCapsula(false);

      if (pacienteData?.medicamento) {
        // Usa a data de entrega sincronizada (se houver) ou a data atual
        const defaultEntrega = pacienteData.data_entrega_medicamento 
          ? pacienteData.data_entrega_medicamento.split('T')[0] 
          : new Date().toISOString().split('T')[0];
          
        const defaultTelemonitoramento = calculateTelemonitoramentoDate(defaultEntrega);

        setMedicamentoState({
          [pacienteData.medicamento.id]: {
            usa: true,
            posologia: '',
            data_entrega: defaultEntrega,
            data_telemonitoramento: defaultTelemonitoramento,
            qtd_capsula_manual: '',
            qtd_caixas: pacienteData.qtd_caixas || 1 // Puxa do cadastro do paciente
          }
        });
      }
    }
  }, [isOpen, pacienteData]);

  const getAdherenceInfo = (score) => {
    if (score <= 9) return { label: 'ALTA adesão', textColor: '#27ae60', bgColor: 'rgba(46, 204, 113, 0.15)' };
    if (score <= 12) return { label: 'MÉDIA adesão', textColor: '#d35400', bgColor: 'rgba(243, 156, 18, 0.15)' };
    return { label: 'BAIXA adesão', textColor: '#c0392b', bgColor: 'rgba(231, 76, 60, 0.15)' };
  };

  const adInfo = getAdherenceInfo(scoreFinal);

  const handleUpdateSilencioso = async () => {
    setLoadingMonitoramento(true);
    try {
      await api.put('/monitoramento-medicamentos/vincular-avaliacao', {
        paciente_id: Number(pacienteId),
        patient_evaluation_id: evaluationId
      });

      window.dispatchEvent(new Event('updateAlerts'));
      setModalStep('nextTemplate');
    } catch (error) {
      toast.error("Erro ao atualizar a pontuação no histórico.");
      console.error(error);
    } finally {
      setLoadingMonitoramento(false);
    }
  };

  const handleAvancarParaMedicamentos = () => {
    if (pacienteData?.medicamento) {
      if (!requireMedicationSetup) {
        handleUpdateSilencioso();
      } else {
        setModalStep('medicamentos');
      }
    } else {
      setModalStep('nextTemplate');
    }
  };

  const handleMonitoramentoChange = (medId, field, value) => {
    setMedicamentoState(prev => {
      const updatedMed = { ...prev[medId], [field]: value };
      
      // Recalcula o telemonitoramento automaticamente se a data de entrega mudar
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
        qtd_caixas: data.qtd_caixas ? Number(data.qtd_caixas) : 1, // Envia para o backend
        qtd_capsula_manual: data.qtd_capsula_manual ? Number(data.qtd_capsula_manual) : null
      }))
      .filter(item => item.usa === true);

    if (confirmados.some(item => item.posologia_diaria <= 0 || !item.data_entrega || !item.data_telemonitoramento)) {
      toast.error("Preencha a posologia e as datas corretamente.");
      setLoadingMonitoramento(false);
      return;
    }

    try {
      await api.post('/monitoramento-medicamentos', {
        paciente_id: Number(pacienteId),
        patient_evaluation_id: evaluationId,
        medicamentos_confirmados: confirmados
      });
      window.dispatchEvent(new Event('updateAlerts'));
      toast.success("Monitoramento configurado!");
      setModalStep('nextTemplate');
    } catch (error) {
      if (error.response?.data?.needs_qtd_capsula) {
        setMissingQtdCapsula(true);
        toast.warning(error.response.data.message);
      } else {
        toast.error("Erro ao salvar monitoramento.");
      }
    } finally {
      setLoadingMonitoramento(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        {modalStep === 'success' && (
          <>
            <SuccessCheck viewBox="0 0 52 52">
              <circle className="check-circle" cx="26" cy="26" r="22" fill="none" strokeWidth="3" />
              <path className="check-path" fill="none" d="M16 27 l6 6 l13 -13" strokeWidth="3" />
            </SuccessCheck>
            <h2>Avaliação Enviada!</h2>
            <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>Pontuação: <strong>{scoreFinal} pts</strong></p>
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: adInfo.bgColor, borderRadius: '8px', borderLeft: `5px solid ${adInfo.textColor}`, textAlign: 'left' }}>
              <p style={{ margin: 0, color: '#444' }}>
                O paciente <strong>{pacienteData?.nome}</strong> possui tendência de <strong style={{ color: adInfo.textColor }}>{adInfo.label}</strong>.
              </p>
            </div>
            <Button style={{ marginTop: '25px', width: '100%' }} onClick={handleAvancarParaMedicamentos} disabled={loadingMonitoramento}>
              {loadingMonitoramento ? 'Processando...' : 'Continuar'}
            </Button>
          </>
        )}

        {modalStep === 'medicamentos' && (
          <>
            <h3>Configuração de Uso Contínuo</h3>
            <div style={{ textAlign: 'left', margin: '20px 0' }}>
               <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                 <strong>{pacienteData.medicamento.nome}</strong>
                 <div style={{ marginTop: '15px' }}>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem' }}>Comprimidos ao dia?</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={medicamentoState[pacienteData.medicamento.id]?.posologia || ''} 
                          onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'posologia', e.target.value)} 
                          style={{ width: '100%', marginTop: '5px' }} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem' }}>Qtd. Caixas:</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={medicamentoState[pacienteData.medicamento.id]?.qtd_caixas || ''} 
                          onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'qtd_caixas', e.target.value)} 
                          style={{ width: '100%', marginTop: '5px' }} 
                        />
                      </div>
                    </div>

                    {missingQtdCapsula && (
                      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px', border: '1px solid #ffeeba' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#856404' }}>Qtd. de Comprimidos na Caixa</label>
                        <Input
                          type="number"
                          required={true}
                          value={medicamentoState[pacienteData.medicamento.id]?.qtd_capsula_manual || ''}
                          onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'qtd_capsula_manual', e.target.value)}
                          placeholder="Ex: 30"
                          style={{ width: '100%', marginTop: '5px', borderColor: '#ffc107' }}
                        />
                      </div>
                    )}

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Data de Início/Entrega do Medicamento</label>
                      <Input 
                        type="date" 
                        value={medicamentoState[pacienteData.medicamento.id]?.data_entrega || ''} 
                        onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'data_entrega', e.target.value)} 
                        style={{ width: '100%', marginTop: '5px' }} 
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Data do primeiro telemonitoramento</label>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: '3px 0 10px 0' }}>
                        Agendado para aproximadamente 5 dias após a data de previsão de administração.
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Input 
                          type="date" 
                          
                          value={medicamentoState[pacienteData.medicamento.id]?.data_telemonitoramento || ''} 
                          onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'data_telemonitoramento', e.target.value)} 
                          style={{ width: '100%' }} 
                        />
                        {medicamentoState[pacienteData.medicamento.id]?.data_telemonitoramento && (
                          <span style={{ fontSize: '0.9rem', color: '#333', whiteSpace: 'nowrap', fontWeight: '500' }}>
                            ({getDayOfWeek(medicamentoState[pacienteData.medicamento.id].data_telemonitoramento)})
                          </span>
                        )}
                      </div>
                    </div>
                 </div>
               </div>
            </div>
            <Button onClick={handleSalvarMonitoramento} disabled={loadingMonitoramento}>Confirmar</Button>
          </>
        )}

        {modalStep === 'nextTemplate' && (
          <>
            <h3>Processo Concluído!</h3>
            <Button style={{ marginTop: '20px', width: '100%' }} onClick={() => onClose(false)}>Voltar à Tabela</Button>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}