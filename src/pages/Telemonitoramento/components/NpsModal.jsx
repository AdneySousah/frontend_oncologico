import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, ButtonGroup, Button, NpsContainer, PulseText, NpsScoreDisplay } from './styles';

export default function NpsModal({ monitoramento, onClose }) {
  // Passos: 'prompt' -> 'sending' -> 'waiting' -> 'received'
  const [step, setStep] = useState('prompt');
  const [score, setScore] = useState(null);

  const handleSendNps = async () => {
    try {
      setStep('sending');
      await api.post('/nps/send', { paciente_id: monitoramento.paciente.id });
      toast.success('NPS enviado pelo WhatsApp!');
      setStep('waiting');
    } catch (error) {
      toast.error('Erro ao enviar NPS.');
      setStep('prompt'); // Volta para tentar de novo se der erro
    }
  };

  // Escuta ativa (Polling) quando entra no passo 'waiting'
  useEffect(() => {
    let interval;

    if (step === 'waiting') {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`/nps/paciente/${monitoramento.paciente.id}/status`);
          if (response.data && response.data.respondido) {
            setScore(response.data.nota);
            setStep('received');
            clearInterval(interval);
            toast.success('O paciente acabou de responder!');
          }
        } catch (error) {
          console.error("Erro na escuta do NPS", error);
        }
      }, 5000); // Pergunta ao banco a cada 5 segundos
    }

    // Limpa o intervalo caso o modal seja fechado antes da resposta
    return () => clearInterval(interval);
  }, [step, monitoramento.paciente.id]);

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: '600px' }}>
        <NpsContainer>
          {step === 'prompt' && (
            <>
              <h3>Avaliação de Atendimento (NPS)</h3>
              <p>Deseja enviar a pesquisa de satisfação (NPS) diretamente no WhatsApp de <strong>{monitoramento.paciente?.nome}</strong>?</p>
              <ButtonGroup style={{ justifyContent: 'center' }}>
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
              <PulseText>Escutando ativamente o WhatsApp do paciente</PulseText>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>O paciente já recebeu a mensagem. Assim que ele votar na enquete, a nota aparecerá aqui.</p>
              <Button variant="secondary" onClick={onClose} style={{ marginTop: '20px' }}>Fechar e Continuar em Segundo Plano</Button>
            </>
          )}

          {step === 'received' && (
            <>
              <h3>Pesquisa Concluída!</h3>
              <p>O paciente avaliou o atendimento com a nota:</p>
              <NpsScoreDisplay score={score}>{score}</NpsScoreDisplay>
              <Button onClick={onClose} style={{ marginTop: '20px', width: '100%' }}>Finalizar</Button>
            </>
          )}
        </NpsContainer>
      </ModalContent>
    </ModalOverlay>
  );
}