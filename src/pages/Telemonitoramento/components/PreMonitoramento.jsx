import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import {
  ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button, InfoBox, PreMonitoramentoTitle,
  CalculadoraAjudaButton
} from './styles';

import AssistenteCalculoModal from './AssistenteCalculoModal';

import { LuCalculator } from 'react-icons/lu';

const formatarDataParaInput = (isoStr) => {
  if (!isoStr) return '';
  return isoStr.split('T')[0];
};

export default function PreMonitoramento({ monitoramento, onClose, onSuccess }) {
  const [dataAdministracao, setDataAdministracao] = useState(
    formatarDataParaInput(monitoramento?.data_administracao)
  );
  const [loading, setLoading] = useState(false);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  let dataEntregaFormatada = '-';
  if (monitoramento?.data_entrega) {
    const dataApenasData = monitoramento.data_entrega.split('T')[0];
    const [ano, mes, dia] = dataApenasData.split('-');
    dataEntregaFormatada = `${dia}/${mes}/${ano}`;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dataAdministracao) {
      toast.error('Informe a data de administração.');
      return;
    }
    try {
      setLoading(true);
      const response = await api.put(`/monitoramento-medicamentos/${monitoramento.id}/data-administracao`, {
        data_administracao: dataAdministracao
      });
      toast.success('Data de administração registrada com sucesso!');
      onSuccess(dataAdministracao, response.data.monitoramento.data_calculada_fim_caixa);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar data de administração.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ModalOverlay>
        <ModalContent style={{ maxWidth: '550px', margin: 0 }}>
          <PreMonitoramentoTitle>Pré-Monitoramento Inicial</PreMonitoramentoTitle>

          <InfoBox style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)', borderColor: '#f39c12' }}>
            <p><strong>Primeiro Contato Registrado</strong></p>
            <p className="sub-text">
              Como este é o primeiro monitoramento para o medicamento <strong>{monitoramento.medicamento?.nome}</strong>, precisamos saber quando o paciente efetivamente iniciou o uso para calcular o estoque corretamente.
            </p>
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '6px' }}>
              <p style={{ margin: 0, fontSize: '0.95em' }}>
                📍 <strong>Data de início do medicamento informada:</strong> {dataEntregaFormatada}
              </p>
            </div>
          </InfoBox>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Data de Início da Administração (Quando começou a tomar?)</label>
              <Input
                type="date"
                value={dataAdministracao}
                onChange={(e) => setDataAdministracao(e.target.value)}
                required
              />
              <CalculadoraAjudaButton type="button" onClick={() => setMostrarCalculadora(true)}>
                <LuCalculator size={16} />
                Me ajude a calcular a data de administração
              </CalculadoraAjudaButton>
            </FormGroup>
            <ButtonGroup>
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Processando...' : 'Confirmar Data e Avançar'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </ModalOverlay>

      {mostrarCalculadora && (
        <AssistenteCalculoModal
          onClose={() => setMostrarCalculadora(false)}
          onUsarData={(dataISO) => {
            setDataAdministracao(dataISO);
            setMostrarCalculadora(false);
          }}
        />
      )}
    </>
  );
}