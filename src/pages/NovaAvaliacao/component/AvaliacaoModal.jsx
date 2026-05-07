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
  requireMedicationSetup // 👇 Propriedade nova e direta
}) {
  const [modalStep, setModalStep] = useState('success');
  const [medicamentoState, setMedicamentoState] = useState({});
  const [loadingMonitoramento, setLoadingMonitoramento] = useState(false);
  const [missingQtdCapsula, setMissingQtdCapsula] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setModalStep('success');
      setMissingQtdCapsula(false);

      if (pacienteData?.medicamento) {
        let defaultDate = '';
        if (pacienteData.data_entrega_medicamento) {
          defaultDate = String(pacienteData.data_entrega_medicamento).substring(0, 10);
        } else if (pacienteData.events?.[0]?.date_delivery) {
          defaultDate = String(pacienteData.events[0].date_delivery).substring(0, 10);
        }

        setMedicamentoState({
          [pacienteData.medicamento.id]: {
            usa: true,
            posologia: '',
            date_delivery: defaultDate,
            qtd_capsula_manual: ''
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
      // 👇 AGORA USA A REGRA DEFINITIVA DO PAI 👇
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
    setMedicamentoState(prev => ({
      ...prev,
      [medId]: { ...prev[medId], [field]: value }
    }));
  };

  const handleSalvarMonitoramento = async () => {
    setLoadingMonitoramento(true);
    const confirmados = Object.entries(medicamentoState)
      .map(([medId, data]) => ({
        medicamento_id: Number(medId),
        posologia_diaria: Number(data.posologia),
        usa: data.usa,
        date_delivery: data.date_delivery,
        qtd_capsula_manual: data.qtd_capsula_manual ? Number(data.qtd_capsula_manual) : null
      }))
      .filter(item => item.usa === true);

    if (confirmados.some(item => item.posologia_diaria <= 0 || !item.date_delivery)) {
      toast.error("Preencha a posologia e a data de entrega.");
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
                 <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Comprimidos ao dia?</label>
                    <Input type="number" value={medicamentoState[pacienteData.medicamento.id]?.posologia || ''} onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'posologia', e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Data de Entrega</label>
                    <Input type="date" value={medicamentoState[pacienteData.medicamento.id]?.date_delivery || ''} onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'date_delivery', e.target.value)} style={{ width: '100%' }} />
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
