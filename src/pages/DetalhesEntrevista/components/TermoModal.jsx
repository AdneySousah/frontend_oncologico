import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import {
  Overlay, Container, StatusBadge, ActionArea,
  Button, WaitingBox, ErrorBox, SuccessBox, Input
} from './styles';

export default function TermoModal({ isOpen, onClose, paciente, onSuccess }) {
  const [step, setStep] = useState('initial');
  const [countdown, setCountdown] = useState(3);

  // Controle para quem enviar a mensagem
  const [destinoEnvio, setDestinoEnvio] = useState('paciente');

  // Novos estados para o Monitoramento sem Avaliação
  const [medicamentoState, setMedicamentoState] = useState({});
  const [loadingMonitoramento, setLoadingMonitoramento] = useState(false);
  const [missingQtdCapsula, setMissingQtdCapsula] = useState(false);

  useEffect(() => {
    if (isOpen && paciente) {
      setStep('initial');
      setCountdown(3);
      setMissingQtdCapsula(false);
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
        destino_tipo: destinoEnvio
      });

      setTimeout(() => {
        setStep('waiting');
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao enviar link');
      setStep('initial');
    }
  };

  const handleClose = () => {
    onClose();
  };

  // ==========================================
  // FUNÇÕES AUXILIARES DE DATA
  // ==========================================
  const calculateTelemonitoramentoDate = (baseDate) => {
    const date = baseDate ? new Date(`${baseDate}T12:00:00`) : new Date();
    date.setDate(date.getDate() + 15); // Soma 15 dias

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

  // ==========================================
  // FUNÇÕES DO FLUXO DE TELEMONITORAMENTO DIRETO
  // ==========================================
  const handleAbrirSetupMonitoramento = () => {
    if (paciente?.medicamento) {
      const defaultEntrega = paciente.data_entrega_medicamento
        ? paciente.data_entrega_medicamento.split('T')[0]
        : new Date().toISOString().split('T')[0];

      const defaultTelemonitoramento = calculateTelemonitoramentoDate(defaultEntrega);

      setMedicamentoState({
        [paciente.medicamento.id]: {
          usa: true,
          posologia: '',
          data_entrega: defaultEntrega,
          data_telemonitoramento: defaultTelemonitoramento,
          qtd_capsula_manual: '',
          qtd_caixas: paciente.qtd_caixas || 1 // Puxa do cadastro do paciente vindo do evento sync
        }
      });
      setMissingQtdCapsula(false);
      setStep('setup_monitoramento');
    } else {
      toast.error('Este paciente não possui um medicamento vinculado para monitorar.');
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
        qtd_caixas: data.qtd_caixas ? Number(data.qtd_caixas) : 1, // Envia as caixas para o controller
        qtd_capsula_manual: data.qtd_capsula_manual ? Number(data.qtd_capsula_manual) : null
      }))
      .filter(item => item.usa && item.posologia_diaria > 0);

    const itensSemData = confirmados.filter(item => !item.data_entrega || !item.data_telemonitoramento);
    if (itensSemData.length > 0) {
      toast.error("Por favor, preencha as datas do medicamento corretamente.");
      setLoadingMonitoramento(false);
      return;
    }

    if (missingQtdCapsula) {
      const itensSemQtd = confirmados.filter(item => !item.qtd_capsula_manual);
      if (itensSemQtd.length > 0) {
        toast.error("A quantidade total da caixa do medicamento é obrigatória.");
        setLoadingMonitoramento(false);
        return;
      }
    }

    if (confirmados.length === 0) {
      handleClose();
      setLoadingMonitoramento(false);
      return;
    }

    try {
      await api.post('/monitoramento-medicamentos', {
        paciente_id: Number(paciente.id),
        patient_evaluation_id: null, // <-- ENVIAMOS NULL POIS NÃO HOUVE AVALIAÇÃO
        medicamentos_confirmados: confirmados
      });
      window.dispatchEvent(new Event('updateAlerts'));
      toast.success("Paciente incluído no telemonitoramento com sucesso!");
      handleClose(); // Fecha o modal e conclui o processo
    } catch (error) {
      if (error.response?.data?.needs_qtd_capsula) {
        toast.warning(error.response.data.message, { autoClose: 6000 });
        setMissingQtdCapsula(true);
      } else {
        toast.error(error.response?.data?.error || "Erro ao gerar monitoramento.");
      }
    } finally {
      setLoadingMonitoramento(false);
    }
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
            <p style={{ marginTop: '10px', marginBottom: '20px' }}>
              Confirme se a resposta informada foi não aceitar. Caso não tenha sido, clique em enviar o link novamente.
            </p>

            <ActionArea style={{ marginTop: '10px', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%' }}>
                <Button variant="cancel" onClick={handleClose} style={{ flex: 1 }}>Cancelar</Button>
                <Button variant="resend" onClick={handleSendLink} style={{ flex: 1 }}>Reenviar Link</Button>
              </div>
              <Button
                onClick={handleAbrirSetupMonitoramento}
                style={{ width: '100%', backgroundColor: '#2c3e50', color: '#fff' }}
              >
                Incluir paciente direto no Telemonitoramento
              </Button>
            </ActionArea>
          </ErrorBox>
        )}

        {step === 'setup_monitoramento' && paciente?.medicamento && (
          <div style={{ textAlign: 'left', padding: '10px' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--text-color)' }}>Configurar Uso Contínuo</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: '#555' }}>
              Paciente recusou os termos, mas será incluído no acompanhamento de medicamentos.<br />
              Confirme a posologia e a data para agendar os contatos.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {paciente.medicamento.nome}
                </div>

                <label style={{ display: 'block', marginBottom: '8px' }}>
                  O paciente vai usar este medicamento?
                </label>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`usa_${paciente.medicamento.id}`}
                      checked={medicamentoState[paciente.medicamento.id]?.usa === true}
                      onChange={() => handleMonitoramentoChange(paciente.medicamento.id, 'usa', true)}
                    /> Sim
                  </label>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`usa_${paciente.medicamento.id}`}
                      checked={medicamentoState[paciente.medicamento.id]?.usa === false}
                      onChange={() => handleMonitoramentoChange(paciente.medicamento.id, 'usa', false)}
                    /> Não
                  </label>
                </div>

                {medicamentoState[paciente.medicamento.id]?.usa && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.9rem' }}>Comprimidos ao dia?</label>
                          <Input
                            type="number"
                            min="1"
                            value={medicamentoState[paciente.medicamento.id]?.posologia || ''}
                            onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'posologia', e.target.value)}
                            placeholder="Ex: 2"
                            style={{ width: '150px', padding: '8px', marginTop: '5px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.9rem' }}>Qtd. Caixas:</label>
                          <Input
                            type="number"
                            min="1"
                            value={medicamentoState[paciente.medicamento.id]?.qtd_caixas || ''}
                            onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'qtd_caixas', e.target.value)}
                            placeholder="Ex: 1"
                            style={{ width: '100px', padding: '8px', marginTop: '5px' }}
                          />
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          Data de Início/Entrega do Medicamento
                        </label>
                        <Input
                          type="date"
                          value={medicamentoState[paciente.medicamento.id]?.data_entrega || ''}
                          onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'data_entrega', e.target.value)}
                          style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '5px' }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          Data do primeiro telemonitoramento
                        </label>
                        <p style={{ fontSize: '0.8rem', color: '#666', margin: '3px 0 8px 0' }}>
                          Agendado para aproximadamente 15 dias após a entrega.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Input
                            type="date"
                            value={medicamentoState[paciente.medicamento.id]?.data_telemonitoramento || ''}
                            onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'data_telemonitoramento', e.target.value)}
                            style={{ width: '180px', padding: '8px' }}
                          />
                          {medicamentoState[paciente.medicamento.id]?.data_telemonitoramento && (
                            <span style={{ fontSize: '0.9rem', color: '#333', whiteSpace: 'nowrap', fontWeight: '500' }}>
                              ({getDayOfWeek(medicamentoState[paciente.medicamento.id].data_telemonitoramento)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {missingQtdCapsula && (
                      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(231, 76, 60, 0.1)', borderRadius: '6px', borderLeft: '4px solid #e74c3c' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#c0392b' }}>
                          ⚠️ Quantidade total de comprimidos/cápsulas por caixa:
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={medicamentoState[paciente.medicamento.id]?.qtd_capsula_manual || ''}
                          onChange={(e) => handleMonitoramentoChange(paciente.medicamento.id, 'qtd_capsula_manual', e.target.value)}
                          placeholder="Ex: 30"
                          style={{ width: '150px', padding: '8px', marginTop: '8px', border: '1px solid #e74c3c' }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <ActionArea style={{ justifyContent: 'space-between' }}>
              <Button variant="cancel" onClick={() => setStep('rejected')}>Voltar</Button>
              <Button onClick={handleSalvarMonitoramento} disabled={loadingMonitoramento}>
                {loadingMonitoramento ? 'Salvando...' : 'Confirmar Monitoramentos'}
              </Button>
            </ActionArea>
          </div>
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