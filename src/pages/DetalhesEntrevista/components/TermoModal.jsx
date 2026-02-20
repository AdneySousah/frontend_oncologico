import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { 
  Overlay, Container, StatusBadge, ActionArea, 
  Button, WaitingBox, ErrorBox, SuccessBox 
} from './styles';

export default function TermoModal({ isOpen, onClose, entrevista, onSuccess }) {
  const [step, setStep] = useState('initial'); // 'initial' | 'sending' | 'waiting' | 'accepted' | 'rejected'
  const [countdown, setCountdown] = useState(3);
  
  const paciente = entrevista?.paciente;

  // Reseta os estados toda vez que o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setStep('initial');
      setCountdown(3);
    }
  }, [isOpen]);

  // Efeito de Polling (Fica perguntando pro backend se o status mudou)
  useEffect(() => {
    let intervalId;

    if (step === 'waiting' && paciente) {
      intervalId = setInterval(async () => {
        try {
          const res = await api.get(`/termos/paciente/${paciente.id}/status`);
          const statusAtual = res.data.status_termo;

          if (statusAtual === 'Aceito') {
            setStep('accepted');
            clearInterval(intervalId); // Para de perguntar
          } else if (statusAtual === 'Recusado') {
            setStep('rejected');
            clearInterval(intervalId); // Para de perguntar
          }
        } catch (err) {
          console.error("Erro ao checar status do termo", err);
        }
      }, 3000); // Checa a cada 3 segundos
    }

    // Limpa o intervalo se o modal fechar ou mudar de step
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, paciente]);

  // Efeito da Contagem Regressiva quando é aceito
  useEffect(() => {
    let timerId;

    if (step === 'accepted') {
      timerId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            onSuccess(entrevista); // Função que faz a navegação lá no componente Pai
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [step, entrevista, onSuccess]);


  const handleSendLink = async () => {
    setStep('sending');
    try {
      await api.post('/termos/send', { paciente_id: paciente.id });
      setStep('waiting'); // Link enviado, agora entra no modo "escuta"
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao enviar link');
      setStep('initial');
    }
  };

  const handleClose = () => {
    // Se estiver esperando e o usuário fechar, avisamos o componente pai pra recarregar a lista
    onClose();
  };

  if (!isOpen || !entrevista) return null;

  return (
    <Overlay>
      <Container>
        {step === 'initial' && (
          <>
            <h2>Termos de Acompanhamento</h2>
            <p>O paciente <strong>{paciente?.nome} {paciente?.sobrenome}</strong> ainda não aceitou os termos de acompanhamento.</p>
            <p>Status Atual: <StatusBadge status={paciente?.status_termo || 'Pendente'}>{paciente?.status_termo || 'Pendente'}</StatusBadge></p>
            
            <p style={{ color: '#888', marginTop: '10px' }}>
              Deseja enviar o link de aceite para o número: <br/>
              <strong>{paciente?.celular || paciente?.telefone}</strong>?
            </p>

            <ActionArea>
              <Button variant="cancel" onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSendLink}>Enviar Link via WhatsApp</Button>
            </ActionArea>
          </>
        )}

        {step === 'sending' && (
          <WaitingBox>
            <h3>Enviando mensagem...</h3>
            <p>Aguarde enquanto comunicamos com o WhatsApp.</p>
          </WaitingBox>
        )}

        {step === 'waiting' && (
          <WaitingBox>
            <h3>Link Enviado!</h3>
            <p>Aguardando resposta do paciente...</p>
            <small style={{ color: '#888' }}>Esta tela atualizará automaticamente.</small>
            
            <ActionArea style={{ marginTop: '20px' }}>
              <Button variant="cancel" onClick={handleClose}>Fechar e aguardar em 2º plano</Button>
            </ActionArea>
          </WaitingBox>
        )}

        {step === 'rejected' && (
          <ErrorBox>
            <div className="icon">✖</div>
            <h3>Paciente não aceitou o termo</h3>
            <p style={{ marginTop: '10px' }}>
              Confirme com ele se a resposta informada foi não aceitar. Caso não tenha sido, clique em enviar o link novamente.
            </p>
            
            <ActionArea style={{ marginTop: '20px' }}>
              <Button variant="cancel" onClick={handleClose}>Cancelar</Button>
              <Button variant="resend" onClick={handleSendLink}>Reenviar Link</Button>
            </ActionArea>
          </ErrorBox>
        )}

        {step === 'accepted' && (
          <SuccessBox>
            <div className="icon">✔</div>
            <h2>Paciente aceitou o termo!</h2>
            <p>Prosseguindo para a entrevista em:</p>
            <h1>{countdown}</h1>
          </SuccessBox>
        )}

      </Container>
    </Overlay>
  );
}