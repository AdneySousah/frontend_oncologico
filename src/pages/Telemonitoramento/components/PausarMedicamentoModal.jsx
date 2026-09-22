import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useTheme } from 'styled-components';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, FormGroup, Button } from './styles';
import { getCustomSelectStyles } from '../../../utils/selectStyles';

// Modal dedicado pra pausar temporariamente UM medicamento específico —
// diferente de "Pausar Tratamento" (paciente inteiro, sem prazo). Aqui tem
// motivo estruturado e uma data prevista de retomada, que alimenta o
// alerta de "pausa terminando em breve".
export default function PausarMedicamentoModal({ monitoramento, onClose, onPausado }) {
  const theme = useTheme();
  const [listaMotivos, setListaMotivos] = useState([]);
  const [motivoSelecionado, setMotivoSelecionado] = useState(null);
  const [dataFimPrevista, setDataFimPrevista] = useState('');
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get('/motivos-pausa-tratamento')
      .then(res => setListaMotivos(res.data))
      .catch(() => toast.error('Erro ao carregar motivos de pausa.'));
  }, []);

  const hoje = new Date();
  const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

  const handleConfirmar = async () => {
    if (!motivoSelecionado) {
      toast.error('Selecione o motivo da pausa.');
      return;
    }
    if (!dataFimPrevista) {
      toast.error('Informe a data prevista de retomada.');
      return;
    }
    try {
      setEnviando(true);
      await api.patch(`/monitoramento-medicamentos/${monitoramento.id}/pausar`, {
        motivo_id: motivoSelecionado.value,
        data_fim_prevista: dataFimPrevista,
        observacao: observacao || null
      });
      toast.success(`${monitoramento.medicamento?.nome || 'Medicamento'} pausado com sucesso.`);
      window.dispatchEvent(new Event('updateAlerts'));
      onPausado();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao pausar medicamento.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: '480px' }}>
        <h3>Pausar Temporariamente</h3>
        <p style={{ opacity: 0.75, fontSize: '0.85rem', marginBottom: '18px' }}>
          {monitoramento.paciente?.nome} {monitoramento.paciente?.sobrenome} — {monitoramento.medicamento?.nome}
        </p>

        <FormGroup>
          <label>Motivo da pausa *</label>
          <Select
            options={listaMotivos.map(m => ({ value: m.id, label: m.descricao }))}
            value={motivoSelecionado}
            onChange={setMotivoSelecionado}
            styles={getCustomSelectStyles(theme)}
            placeholder="Selecione o motivo..."
            noOptionsMessage={() => "Nenhum motivo cadastrado — cadastre em Tabelas Cadastrais"}
            menuPosition="fixed"
          />
        </FormGroup>

        <FormGroup>
          <label>Retomar em (data prevista) *</label>
          <input
            type="date"
            min={dataHoje}
            value={dataFimPrevista}
            onChange={(e) => setDataFimPrevista(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${theme.colors?.border || '#ddd'}`, background: theme.colors?.inputBg || '#fff', color: theme.colors?.text || '#333' }}
          />
        </FormGroup>

        <FormGroup style={{ marginBottom: 0 }}>
          <label>Observação (opcional)</label>
          <textarea
            rows={3}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Detalhes adicionais, se necessário..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${theme.colors?.border || '#ddd'}`, background: theme.colors?.inputBg || '#fff', color: theme.colors?.text || '#333', resize: 'vertical' }}
          />
        </FormGroup>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={enviando}>Cancelar</Button>
          <Button type="button" onClick={handleConfirmar} disabled={enviando}>
            {enviando ? 'Pausando...' : 'Confirmar Pausa'}
          </Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
