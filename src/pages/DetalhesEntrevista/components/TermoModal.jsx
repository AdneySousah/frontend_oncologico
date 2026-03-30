import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  Overlay, Container, StatusBadge, ActionArea,
  Button, WaitingBox, ErrorBox, SuccessBox
} from './styles';

export default function TermoModal({ isOpen, onClose, paciente, onSuccess }) {
  const [step, setStep] = useState('initial');
  const [countdown, setCountdown] = useState(3);

  // Controle para quem enviar a mensagem
  const [destinoEnvio, setDestinoEnvio] = useState('paciente');

  useEffect(() => {
    if (isOpen && paciente) {
      setStep('initial');
      setCountdown(3);
      // Se tiver cuidador, o padrão já vira o cuidador
      setDestinoEnvio(paciente.possui_cuidador ? 'cuidador' : 'paciente');
    }
  }, [isOpen, paciente]);

  useEffect(() => {
    let intervalId;

    if (step === 'waiting' && paciente) {
      intervalId = setInterval(async () => {
        try {
          const res = await api.get(`/termos/paciente/${paciente.id}/status`);
          const statusAtual = res.data.status_termo;

          if (statusAtual === 'Aceito') {
            setStep('accepted');
            clearInterval(intervalId);
          } else if (statusAtual === 'Recusado') {
            setStep('rejected');
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Erro ao checar status do termo", err);
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, paciente]);

  useEffect(() => {
    let timerId;

    if (step === 'accepted') {
      timerId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            onSuccess(paciente);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [step, paciente, onSuccess]);

  const handleSendLink = async () => {
    // Validação de segurança
    if (paciente.possui_cuidador && destinoEnvio === 'paciente') {
      const confirmar = window.confirm("Atenção: Este paciente possui um cuidador/responsável cadastrado. Tem certeza que deseja fazer o disparo diretamente para o paciente?");
      if (!confirmar) return;
    }

    const telefoneFinal = destinoEnvio === 'cuidador' && paciente.contato_cuidador
      ? paciente.contato_cuidador
      : (paciente.celular || paciente.telefone);

    setStep('sending');
    try {
      await api.post('/termos/send', {
        paciente_id: paciente.id,
        telefone_destino: telefoneFinal,
        destino_tipo: destinoEnvio // <- MANDAMOS AQUI 'paciente' ou 'cuidador'
      });

      setTimeout(() => {
        setStep('waiting');
      }, 1000);

    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao enviar link');
      setStep('initial');
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !paciente) return null;

  return (
    <Overlay>
      <Container>
        {step === 'initial' && (
          <>
            <h2>Termos de Acompanhamento</h2>
            <p>O paciente <strong>{paciente?.nome} {paciente?.sobrenome}</strong> ainda não aceitou os termos de acompanhamento.</p>
            <p>Status Atual: <StatusBadge status={paciente?.status_termo || 'Pendente'}>{paciente?.status_termo || 'Pendente'}</StatusBadge></p>

            {/* ALERTA SE POSSUI CUIDADOR */}
            {paciente.possui_cuidador && (
              <div style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', padding: '15px', borderRadius: '6px', marginTop: '15px', textAlign: 'left', fontSize: '0.9rem' }}>
                <strong>⚠️ ATENÇÃO:</strong> Esse paciente possui um cuidador/responsável. Por questões de cuidado, o disparo automático está selecionado para o cuidador.
                <br /><br />
                <strong>Nome:</strong> {paciente.nome_cuidador}<br />
                <strong>Contato:</strong> {paciente.contato_cuidador}
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'left', padding: '15px', border: '1px solid #eee', borderRadius: '6px' }}>
              <strong style={{ display: 'block', marginBottom: '10px' }}>Selecione o destinatário do link:</strong>

              {paciente.possui_cuidador && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                  <input
                    type="radio"
                    name="destino"
                    value="cuidador"
                    checked={destinoEnvio === 'cuidador'}
                    onChange={() => setDestinoEnvio('cuidador')}
                  />
                  Disparar para o Cuidador ({paciente.contato_cuidador})
                </label>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="destino"
                  value="paciente"
                  checked={destinoEnvio === 'paciente'}
                  onChange={() => setDestinoEnvio('paciente')}
                />
                Disparar para o Paciente ({paciente.celular || paciente.telefone})
              </label>
            </div>

            <ActionArea style={{ marginTop: '25px' }}>
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
            <p>Aguardando resposta...</p>
            <small style={{ color: '#888' }}>Esta tela atualizará automaticamente.</small>

            <ActionArea style={{ marginTop: '20px' }}>
              <Button variant="cancel" onClick={handleClose}>Fechar e aguardar em 2º plano</Button>
            </ActionArea>
          </WaitingBox>
        )}

        {step === 'rejected' && (
          <ErrorBox>
            <div className="icon">✖</div>
            <h3>O Termo não foi aceito</h3>
            <p style={{ marginTop: '10px' }}>
              Confirme se a resposta informada foi não aceitar. Caso não tenha sido, clique em enviar o link novamente.
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
            <h2>Termo aceito com sucesso!</h2>
            <p>Prosseguindo para a entrevista em:</p>
            <h1>{countdown}</h1>
          </SuccessBox>
        )}

      </Container>
    </Overlay>
  );
}