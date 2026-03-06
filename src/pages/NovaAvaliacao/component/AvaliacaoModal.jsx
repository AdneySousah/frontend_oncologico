// src/pages/NovaAvaliacao/AvaliacaoModal.jsx
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
  pacienteData, // Recebendo diretamente os dados do paciente
  pacienteId, 
  evaluationId, 
  pendingTemplatesCount 
}) {
  // Controle de Abas do Modal: 'success' -> 'medicamentos' -> 'nextTemplate'
  const [modalStep, setModalStep] = useState('success'); 
  const [medicamentoState, setMedicamentoState] = useState({});
  const [loadingMonitoramento, setLoadingMonitoramento] = useState(false);

  // Reseta o modal e prepara o medicamento sempre que for aberto
  useEffect(() => {
    if (isOpen) {
      setModalStep('success');
      // Verifica se o paciente possui UM medicamento vinculado
      if (pacienteData?.medicamento) {
        setMedicamentoState({
          [pacienteData.medicamento.id]: { usa: true, posologia: '' }
        });
      } else {
        setMedicamentoState({});
      }
    }
  }, [isOpen, pacienteData]);

  if (!isOpen) return null;

  const handleAvancarParaMedicamentos = () => {
    // Se o paciente tiver um medicamento atrelado no cadastro, abre a tela de posologia
    if (pacienteData?.medicamento) {
      setModalStep('medicamentos');
    } else {
      setModalStep('nextTemplate');
    }
  };

  const handleMonitoramentoChange = (medId, field, value) => {
    setMedicamentoState(prev => ({
      ...prev,
      [medId]: {
        ...prev[medId],
        [field]: value
      }
    }));
  };

  const handleSalvarMonitoramento = async () => {
    setLoadingMonitoramento(true);

    // Formata o payload (mantemos em formato de array para o backend não quebrar)
    const confirmados = Object.entries(medicamentoState)
      .map(([medId, data]) => ({
        medicamento_id: Number(medId),
        posologia_diaria: Number(data.posologia),
        usa: data.usa
      }))
      .filter(item => item.usa && item.posologia_diaria > 0);

    if (confirmados.length === 0) {
       setModalStep('nextTemplate');
       setLoadingMonitoramento(false);
       return;
    }

    try {
      // Retirado o entrevista_profissional_id do payload
      await api.post('/monitoramento-medicamentos', {
        paciente_id: Number(pacienteId),
        patient_evaluation_id: evaluationId,
        medicamentos_confirmados: confirmados
      });
      window.dispatchEvent(new Event('updateAlerts'));
      toast.success("Ciclo de monitoramento gerado!");
      setModalStep('nextTemplate');
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao gerar monitoramento.");
    } finally {
      setLoadingMonitoramento(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        
        {/* ETAPA 1: Sucesso da Avaliação */}
        {modalStep === 'success' && (
          <>
            <SuccessCheck viewBox="0 0 52 52">
              <circle className="check-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </SuccessCheck>
            <h2>Avaliação Enviada!</h2>
            <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
              Pontuação calculada: <strong>{scoreFinal} pts</strong>
            </p>
            <Button style={{ marginTop: '20px' }} onClick={handleAvancarParaMedicamentos}>
              Continuar
            </Button>
          </>
        )}

        {/* ETAPA 2: Configuração de Monitoramento */}
        {modalStep === 'medicamentos' && pacienteData?.medicamento && (
          <>
            <h3 style={{ marginBottom: '10px' }}>Confirmação de Uso Contínuo</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: '#555' }}>
              Paciente: <strong>{pacienteData.nome} {pacienteData.sobrenome}</strong><br/>
              Confirme a posologia para agendar os próximos contatos de monitoramento.
            </p>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {pacienteData.medicamento.nome} 
                </div>
                
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  O paciente continua usando este medicamento?
                </label>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                  <label style={{ cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name={`usa_${pacienteData.medicamento.id}`} 
                      checked={medicamentoState[pacienteData.medicamento.id]?.usa === true}
                      onChange={() => handleMonitoramentoChange(pacienteData.medicamento.id, 'usa', true)}
                    /> Sim
                  </label>
                  <label style={{ cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name={`usa_${pacienteData.medicamento.id}`} 
                      checked={medicamentoState[pacienteData.medicamento.id]?.usa === false}
                      onChange={() => handleMonitoramentoChange(pacienteData.medicamento.id, 'usa', false)}
                    /> Não
                  </label>
                </div>

                {medicamentoState[pacienteData.medicamento.id]?.usa && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Quantos comprimidos ao dia?</label>
                    <Input 
                      type="number" 
                      min="1"
                      value={medicamentoState[pacienteData.medicamento.id]?.posologia || ''}
                      onChange={(e) => handleMonitoramentoChange(pacienteData.medicamento.id, 'posologia', e.target.value)}
                      placeholder="Ex: 2"
                      style={{ width: '120px', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button onClick={handleSalvarMonitoramento} disabled={loadingMonitoramento}>
              {loadingMonitoramento ? 'Salvando...' : 'Confirmar Monitoramentos'}
            </Button>
          </>
        )}

        {/* ETAPA 3: Decisão do Próximo Template */}
        {modalStep === 'nextTemplate' && (
          <>
            {pendingTemplatesCount > 0 ? (
              <>
                <p style={{ margin: '25px 0', color: '#e67e22', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Existem mais {pendingTemplatesCount} questionário(s) pendente(s). Deseja responder agora?
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <Button onClick={() => onClose(true)}>Sim, Continuar</Button>
                  <Button style={{ backgroundColor: '#888' }} onClick={() => onClose(false)}>Não, Voltar à Tabela</Button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ margin: '20px 0' }}>Processo Concluído!</h3>
                <Button style={{ marginTop: 25 }} onClick={() => onClose(false)}>Voltar à Tabela</Button>
              </>
            )}
          </>
        )}

      </ModalContent>
    </ModalOverlay>
  );
}