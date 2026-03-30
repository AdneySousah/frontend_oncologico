import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, ButtonGroup, Button, NpsContainer, PulseText, NpsScoreDisplay } from './styles';

export default function NpsModal({ monitoramento, onClose }) {
  const [step, setStep] = useState('prompt');
  const [score, setScore] = useState(null);
  
  // Controle para quem enviar a mensagem do NPS
  const [destinoEnvio, setDestinoEnvio] = useState('paciente');

  const pacienteInfo = monitoramento.paciente;

  useEffect(() => {
    if (pacienteInfo) {
      // Se tiver cuidador, o padrão vira o cuidador
      setDestinoEnvio(pacienteInfo.possui_cuidador ? 'cuidador' : 'paciente');
    }
  }, [pacienteInfo]);

  const handleSendNps = async () => {
    // Validação de segurança: se tem cuidador e o atendente escolheu paciente
    if (pacienteInfo.possui_cuidador && destinoEnvio === 'paciente') {
        const confirmar = window.confirm("Atenção: Este paciente possui um cuidador/responsável cadastrado. Tem certeza que deseja fazer o disparo do NPS diretamente para o paciente?");
        if (!confirmar) return; 
    }

    const telefoneFinal = destinoEnvio === 'cuidador' && pacienteInfo.contato_cuidador 
        ? pacienteInfo.contato_cuidador 
        : (pacienteInfo.celular || pacienteInfo.telefone);

    try {
      setStep('sending');
      await api.post('/nps/send', { 
        paciente_id: pacienteInfo.id,
        telefone_destino: telefoneFinal,
        destino_tipo: destinoEnvio
      });
      toast.success('NPS enviado pelo WhatsApp!');
      setStep('waiting');
    } catch (error) {
      toast.error('Erro ao enviar NPS.');
      setStep('prompt'); 
    }
  };

  useEffect(() => {
    let interval;

    if (step === 'waiting') {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`/nps/paciente/${pacienteInfo.id}/status`);
          if (response.data && response.data.respondido) {
            setScore(response.data.nota);
            setStep('received');
            clearInterval(interval);
            toast.success('O paciente/cuidador acabou de responder!');
          }
        } catch (error) {
          console.error("Erro na escuta do NPS", error);
        }
      }, 5000); 
    }

    return () => clearInterval(interval);
  }, [step, pacienteInfo.id]);

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: '600px' }}>
        <NpsContainer>
          {step === 'prompt' && (
            <>
              <h3>Avaliação de Atendimento (NPS)</h3>
              <p>Deseja enviar a pesquisa de satisfação (NPS) via WhatsApp sobre o atendimento prestado a <strong>{pacienteInfo?.nome}</strong>?</p>
              
              {/* ALERTA SE POSSUI CUIDADOR */}
              {pacienteInfo?.possui_cuidador && (
                  <div style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', padding: '15px', borderRadius: '6px', marginTop: '15px', textAlign: 'left', fontSize: '0.9rem' }}>
                      <strong>⚠️ ATENÇÃO:</strong> Esse paciente possui um cuidador/responsável. Por questões de cuidado, o disparo do NPS está selecionado para o cuidador.
                      <br/><br/>
                      <strong>Nome do Cuidador:</strong> {pacienteInfo.nome_cuidador}<br/>
                      <strong>Contato:</strong> {pacienteInfo.contato_cuidador}
                  </div>
              )}

              <div style={{ marginTop: '20px', textAlign: 'left', padding: '15px', border: '1px solid #eee', borderRadius: '6px' }}>
                  <strong style={{ display: 'block', marginBottom: '10px' }}>Selecione quem irá avaliar o atendimento:</strong>
                  
                  {pacienteInfo?.possui_cuidador && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                          <input 
                              type="radio" 
                              name="destinoNps" 
                              value="cuidador" 
                              checked={destinoEnvio === 'cuidador'} 
                              onChange={() => setDestinoEnvio('cuidador')}
                          />
                          Disparar para o Cuidador ({pacienteInfo.contato_cuidador})
                      </label>
                  )}
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                          type="radio" 
                          name="destinoNps" 
                          value="paciente" 
                          checked={destinoEnvio === 'paciente'} 
                          onChange={() => setDestinoEnvio('paciente')}
                      />
                      Disparar para o Paciente ({pacienteInfo.celular || pacienteInfo.telefone})
                  </label>
              </div>

              <ButtonGroup style={{ justifyContent: 'center', marginTop: '25px' }}>
                <Button variant="secondary" onClick={onClose}>Agora Não</Button>
                <Button onClick={handleSendNps}>Sim, Enviar NPS</Button>
              </ButtonGroup>
            </>
          )}

          {step === 'sending' && (
            <PulseText>Enviando mensagem para o WhatsApp...</PulseText>
          )}

          {step === 'waiting' && (
            <>
              <h3>Aguardando Resposta...</h3>
              <PulseText>Escutando ativamente o WhatsApp</PulseText>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>A mensagem já foi entregue. Assim que a nota for digitada no celular, ela aparecerá aqui.</p>
              <Button variant="secondary" onClick={onClose} style={{ marginTop: '20px' }}>Fechar e Continuar em Segundo Plano</Button>
            </>
          )}

          {step === 'received' && (
            <>
              <h3>Pesquisa Concluída!</h3>
              <p>O atendimento foi avaliado com a nota:</p>
              <NpsScoreDisplay score={score}>{score}</NpsScoreDisplay>
              <Button onClick={onClose} style={{ marginTop: '20px', width: '100%' }}>Finalizar</Button>
            </>
          )}
        </NpsContainer>
      </ModalContent>
    </ModalOverlay>
  );
}