import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, SuccessCheck, Button } from '../styles';
// Ajuste este import para a pasta onde você salvou o componente
import ConfiguracaoUsoContinuo from '../../../components/ConfiguracaoUsoContinuo';

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
  const [loadingMonitoramento, setLoadingMonitoramento] = useState(false);
  // 👇 NOVO: medicamentos realmente ativos do paciente (1 ou 2), vindos do
  // backend (derivados dos EventosPaciente). pacienteData.medicamento sozinho
  // não é suficiente — ele só reflete UM medicamento, mesmo quando o paciente
  // tem dois em uso simultâneo.
  const [medicamentosAtivos, setMedicamentosAtivos] = useState(null);
  const [loadingMedicamentos, setLoadingMedicamentos] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setModalStep('success');
      setMedicamentosAtivos(null);
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

  // 👇 NOVO: busca os medicamentos ativos antes de abrir a etapa de
  // configuração. Sem isso, ConfiguracaoUsoContinuo nunca recebe o array
  // paciente.medicamentos e cai sempre no fallback de medicamento único.
  const buscarMedicamentosAtivosEAvancar = async () => {
    setLoadingMedicamentos(true);
    try {
      const response = await api.get(`/pacientes/${pacienteId}/medicamentos-ativos`);
      setMedicamentosAtivos(response.data.medicamentos || []);
    } catch (error) {
      toast.error('Erro ao buscar medicamentos ativos do paciente.');
      // Fallback defensivo: segue com o medicamento único já disponível,
      // pra não travar o fluxo caso o endpoint novo falhe.
      setMedicamentosAtivos(pacienteData?.medicamento ? [pacienteData.medicamento] : []);
    } finally {
      setLoadingMedicamentos(false);
      setModalStep('medicamentos');
    }
  };

  const handleAvancarParaMedicamentos = () => {
    if (pacienteData?.medicamento) {
      if (!requireMedicationSetup) {
        handleUpdateSilencioso();
      } else {
        buscarMedicamentosAtivosEAvancar();
      }
    } else {
      setModalStep('nextTemplate');
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
            <Button style={{ marginTop: '25px', width: '100%' }} onClick={handleAvancarParaMedicamentos} disabled={loadingMonitoramento || loadingMedicamentos}>
              {(loadingMonitoramento || loadingMedicamentos) ? 'Processando...' : 'Continuar'}
            </Button>
          </>
        )}

        {modalStep === 'medicamentos' && pacienteData?.medicamento && (
          <ConfiguracaoUsoContinuo
            paciente={{ ...pacienteData, medicamentos: medicamentosAtivos || [] }}
            evaluationId={evaluationId}
            showUsoToggle={false} // Nesta tela não precisa perguntar se usa/não usa
            showCancelButton={false} // Confirma direto
            onSuccess={() => setModalStep('nextTemplate')}
            title="Configuração de Uso Contínuo"
          />
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