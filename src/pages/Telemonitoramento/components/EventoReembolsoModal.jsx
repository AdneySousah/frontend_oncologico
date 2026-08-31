import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { LuTriangleAlert } from 'react-icons/lu';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button, InfoBox } from './styles';

export default function EventoReembolsoModal({ isOpen, onClose, monitoramento, onSucesso }) {
  const [qtdCaixasReembolsadas, setQtdCaixasReembolsadas] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [posologia, setPosologia] = useState(''); // 👈 NOVO
  const [qtdCapsulaManual, setQtdCapsulaManual] = useState('');
  const [precisaQtdCapsula, setPrecisaQtdCapsula] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // 👇 NOVO: pré-preenche a posologia com a atual do ciclo, mas o atendente
  // pode alterar — a dosagem pode ter mudado nesse meio tempo.
  useEffect(() => {
    if (isOpen && monitoramento) {
      setPosologia(monitoramento.posologia_diaria ? String(monitoramento.posologia_diaria) : '');
    }
  }, [isOpen, monitoramento]);

  if (!isOpen || !monitoramento) return null;

  const hojeStr = (() => {
    const h = new Date();
    return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;
  })();

  const handleClose = () => {
    setQtdCaixasReembolsadas('');
    setDataInicio('');
    setPosologia('');
    setQtdCapsulaManual('');
    setPrecisaQtdCapsula(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qtdCaixasReembolsadas || Number(qtdCaixasReembolsadas) < 1) {
      toast.error('Informe a quantidade de caixas reembolsadas.');
      return;
    }
    if (!dataInicio) {
      toast.error('Informe a data de início do medicamento.');
      return;
    }
    if (!posologia || Number(posologia) < 1) {
      toast.error('Informe a posologia (comprimidos/dia) deste medicamento.');
      return;
    }
    if (precisaQtdCapsula && !qtdCapsulaManual) {
      toast.error('Informe a quantidade de comprimidos por caixa deste medicamento.');
      return;
    }
    try {
      setEnviando(true);
      const response = await api.put(`/monitoramento-medicamentos/${monitoramento.id}/reembolso`, {
        qtd_caixas_reembolsadas: Number(qtdCaixasReembolsadas),
        data_inicio_medicamento: dataInicio,
        posologia: Number(posologia), // 👈 NOVO
        qtd_capsula_manual: qtdCapsulaManual ? Number(qtdCapsulaManual) : null
      });
      toast.success('Evento de reembolso criado! Prossiga com o registro de contato.');
      // 👇 NOVO: devolve o registro recém-criado pro chamador — ele decide
      // como abrir a entrevista completa (comprimidos, adesão, reação) na
      // mesma hora, em vez de deixar isso pendurado pra outro contato.
      onSucesso(response.data.monitoramento);
      handleClose();
    } catch (error) {
      if (error.response?.data?.needs_qtd_capsula) {
        setPrecisaQtdCapsula(true);
        toast.error(error.response.data.error);
      } else {
        toast.error(error.response?.data?.error || 'Erro ao criar evento de reembolso.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: '520px', margin: 'auto' }}>
        <h3>Criar Evento de Reembolso</h3>
        <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: '4px 0 16px 0' }}>
          {monitoramento.paciente?.nome} {monitoramento.paciente?.sobrenome} — <strong>{monitoramento.medicamento?.nome}</strong>
        </p>

        <InfoBox style={{ backgroundColor: 'rgba(243, 156, 18, 0.12)', borderLeft: '4px solid #f39c12', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <LuTriangleAlert size={20} color="#e67e22" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#e67e22' }}>Atenção:</strong> informe apenas a quantidade de caixas que a operadora{' '}
            <strong>reembolsou</strong> nesta compra — não o total de caixas que o paciente possui em casa. Após criar o
            evento, você já vai poder registrar o contato (comprimidos, adesão e reações) na sequência.
          </div>
        </InfoBox>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Quantidade de caixas reembolsadas</label>
            <Input
              type="number"
              min="1"
              value={qtdCaixasReembolsadas}
              onChange={(e) => setQtdCaixasReembolsadas(e.target.value)}
              placeholder="Ex: 1"
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Data de início deste medicamento</label>
            <Input
              type="date"
              max={hojeStr}
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Posologia (comprimidos/dia)</label>
            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', display: 'block' }}>
              Confirme ou altere caso a dosagem tenha mudado.
            </span>
            <Input
              type="number"
              min="1"
              value={posologia}
              onChange={(e) => setPosologia(e.target.value)}
              placeholder="Ex: 2"
              required
            />
          </FormGroup>

          {precisaQtdCapsula && (
            <FormGroup>
              <label>Quantidade de comprimidos por caixa de {monitoramento.medicamento?.nome}</label>
              <Input
                type="number"
                min="1"
                value={qtdCapsulaManual}
                onChange={(e) => setQtdCapsulaManual(e.target.value)}
                placeholder="Ex: 30"
                required
              />
            </FormGroup>
          )}

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={enviando}>Cancelar</Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Criando...' : 'Criar e Continuar Contato'}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}