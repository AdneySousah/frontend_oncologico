// src/pages/NovaAvaliacao/AvaliacaoModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { 
  ModalOverlay, ModalContent, SuccessCheck, Button, Input 
} from '../styles'; // Certifique-se de que esses componentes existem no seu styles.js

export default function AvaliacaoModal({ 
  isOpen, 
  onClose, 
  scoreFinal, 
  entrevistaData, 
  pacienteId, 
  entrevistaId, 
  evaluationId, 
  pendingTemplatesCount 
}) {
  // Controle de Abas do Modal: 'success' -> 'medicamentos' -> 'nextTemplate'
  const [modalStep, setModalStep] = useState('success'); 
  const [medicamentosMonitoramento, setMedicamentosMonitoramento] = useState({});
  const [loadingMonitoramento, setLoadingMonitoramento] = useState(false);

  // Reseta o modal e prepara os medicamentos sempre que for aberto
  useEffect(() => {
    if (isOpen) {
      setModalStep('success');
      if (entrevistaData?.medicamentos?.length > 0) {
        const initialState = {};
        entrevistaData.medicamentos.forEach(med => {
          initialState[med.id] = { usa: true, posologia: '' };
        });
        setMedicamentosMonitoramento(initialState);
      }
    }
  }, [isOpen, entrevistaData]);

  if (!isOpen) return null;

  const handleAvançarParaMedicamentos = () => {
    if (entrevistaData?.medicamentos && entrevistaData.medicamentos.length > 0) {
      setModalStep('medicamentos');
    } else {
      setModalStep('nextTemplate');
    }
  };

  const handleMonitoramentoChange = (medId, field, value) => {
    setMedicamentosMonitoramento(prev => ({
      ...prev,
      [medId]: {
        ...prev[medId],
        [field]: value
      }
    }));
  };

  const handleSalvarMonitoramento = async () => {
    setLoadingMonitoramento(true);

    const confirmados = Object.entries(medicamentosMonitoramento)
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
      await api.post('/monitoramento-medicamentos', {
        paciente_id: Number(pacienteId),
        entrevista_profissional_id: Number(entrevistaId),
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
            <Button style={{ marginTop: '20px' }} onClick={handleAvançarParaMedicamentos}>
              Continuar
            </Button>
          </>
        )}

        {/* ETAPA 2: Configuração de Monitoramento */}
        {modalStep === 'medicamentos' && (
          <>
            <h3 style={{ marginBottom: '10px' }}>Confirmação de Uso Contínuo</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: '#555' }}>
              Paciente: <strong>{entrevistaData.paciente?.nome}</strong><br/>
              Confirme a posologia para agendar os próximos contatos de monitoramento.
            </p>

            <div style={{ textAlign: 'left', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {entrevistaData.medicamentos?.map(med => {
                const state = medicamentosMonitoramento[med.id] || { usa: true, posologia: '' };
                return (
                  <div key={med.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{med.nome} {med.dosagem ? `(${med.dosagem})` : ''}</div>
                    
                    <label style={{ display: 'block', marginBottom: '8px' }}>
                      O paciente continua usando este medicamento?
                    </label>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                      <label style={{ cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`usa_${med.id}`} 
                          checked={state.usa === true}
                          onChange={() => handleMonitoramentoChange(med.id, 'usa', true)}
                        /> Sim
                      </label>
                      <label style={{ cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`usa_${med.id}`} 
                          checked={state.usa === false}
                          onChange={() => handleMonitoramentoChange(med.id, 'usa', false)}
                        /> Não
                      </label>
                    </div>

                    {state.usa && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem' }}>Quantos comprimidos ao dia?</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={state.posologia}
                          onChange={(e) => handleMonitoramentoChange(med.id, 'posologia', e.target.value)}
                          placeholder="Ex: 2"
                          style={{ width: '120px', padding: '5px', marginTop: '5px' }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
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
                  {/* Se tiver uma variação de botão secondary, substitua a prop abaixo */}
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