import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import {
  ModalOverlay,
  ModalContent,
  ButtonGroup,
  Button,
  NpsContainer,
  PulseText,
  NpsScoreDisplay,
  FormGroup,
  Input
} from './styles';

export default function NpsModal({ monitoramento, onClose }) {
  const [step, setStep] = useState('prompt');
  const [score, setScore] = useState(null);
  const [manualScore, setManualScore] = useState('');

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
        monitoramento_id: monitoramento.id, // <--- ADICIONE ESTA LINHA
        telefone_destino: telefoneFinal,
        destino_tipo: destinoEnvio
      });
      toast.success('Link do NPS enviado pelo WhatsApp!');
      setStep('waiting');
    } catch (error) {
      toast.error('Erro ao enviar NPS.');
      setStep('prompt');
    }
  };

  // Função para salvar a nota inserida manualmente
  const handleManualSubmit = async () => {
    const notaNumber = Number(manualScore);

    if (manualScore === '' || isNaN(notaNumber) || notaNumber < 0 || notaNumber > 10) {
      toast.error('Por favor, insira uma nota válida de 0 a 10.');
      return;
    }

    try {
      await api.post('/nps/manual', {
        paciente_id: pacienteInfo.id,
        monitoramento_id: monitoramento.id, // <--- ADICIONE ESTA LINHA
        nota: notaNumber,
        destino_tipo: destinoEnvio
      });

      setScore(notaNumber);
      setStep('received');
      toast.success('Nota registrada manualmente com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar NPS manualmente.');
    }
  };

  useEffect(() => {
    let interval;

    // A escuta continua a mesma: verificando se o status no banco mudou
    if (step === 'waiting') {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`/nps/paciente/${pacienteInfo.id}/atendimento/${monitoramento.id}/status`);
          if (response.data && response.data.respondido) {
            setScore(response.data.nota);
            setStep('received');
            clearInterval(interval);
            toast.success('A nota acabou de ser registrada no sistema!');
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
      <ModalContent>
        <NpsContainer>
          {step === 'prompt' && (
            <>
              <h3>Avaliação de Atendimento (NPS)</h3>
              <p>Deseja enviar a pesquisa de satisfação (NPS) via WhatsApp sobre o atendimento prestado a <strong>{pacienteInfo?.nome}</strong>?</p>

              {/* ALERTA SE POSSUI CUIDADOR */}
              {pacienteInfo?.possui_cuidador && (
                <div style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', padding: '15px', borderRadius: '6px', marginTop: '15px', textAlign: 'left', fontSize: '0.9rem' }}>
                  <strong>⚠️ ATENÇÃO:</strong> Esse paciente possui um cuidador/responsável. Por questões de cuidado, o disparo do NPS está selecionado para o cuidador.
                  <br /><br />
                  <strong>Nome do Cuidador:</strong> {pacienteInfo.nome_cuidador}<br />
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
                    Disparar para o Cuidador  ({pacienteInfo.nome_cuidador} - {pacienteInfo.contato_cuidador})
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
                  Disparar para o Paciente ({pacienteInfo.nome} {pacienteInfo.sobrenome} - {pacienteInfo.celular || pacienteInfo.telefone})
                </label>
              </div>

              <ButtonGroup style={{ justifyContent: 'center', marginTop: '25px' }}>
                <Button variant="secondary" onClick={onClose}>Agora Não</Button>
                <Button onClick={handleSendNps}>Sim, Enviar Link do NPS</Button>
              </ButtonGroup>
            </>
          )}

          {step === 'sending' && (
            <PulseText>Enviando link para o WhatsApp...</PulseText>
          )}

          {/* AJUSTES AQUI NO PASSO WAITING */}
          {step === 'waiting' && (
            <>
              <h3>Aguardando Resposta...</h3>
              <PulseText>Aguardando submissão pelo link</PulseText>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>O link da pesquisa já foi entregue. Assim que a nota for registrada na página, ela aparecerá aqui automaticamente.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', width: '100%' }}>
                <Button variant="secondary" onClick={() => setStep('manual')}>
                  O paciente prefere falar a nota? Insira manualmente
                </Button>

                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', marginTop: '10px' }}>
                  Cancelar e Fechar
                </button>
              </div>
            </>
          )}

          {step === 'manual' && (
            <>
              <h3>Inserção Manual de NPS</h3>
              <p>Pergunte a nota ao paciente/cuidador por telefone e insira abaixo:</p>

              <FormGroup style={{ textAlign: 'center', width: '50%', margin: '0 auto' }}>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Nota (0 a 10)"
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '1.2rem' }}
                />
              </FormGroup>

              <ButtonGroup style={{ justifyContent: 'center', marginTop: '25px' }}>
                <Button variant="secondary" onClick={() => setStep('waiting')}>Voltar a escutar o sistema</Button>
                <Button onClick={handleManualSubmit}>Salvar Nota</Button>
              </ButtonGroup>
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