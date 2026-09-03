import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useTheme } from 'styled-components';
import api from '../../../services/api';
import { Overlay, ModalContainer, Button, Input } from './styles';
import { getCustomSelectStyles } from '../../../utils/selectStyles';

// Modal de "Pausar Tratamento" — usa a MESMA lista de motivos do fluxo de
// "Descontinuar Medicamento" do Telemonitoramento (/motivos-pausa-tratamento),
// pra manter os motivos contabilizáveis de forma consistente nos dois lugares.
export default function PausarTratamentoModal({ paciente, onClose, onConfirmar }) {
  const theme = useTheme();
  const [listaMotivos, setListaMotivos] = useState([]);
  const [motivoSelecionado, setMotivoSelecionado] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.get('/motivos-pausa-tratamento')
      .then(res => { if (isMounted) setListaMotivos(res.data); })
      .catch(() => { if (isMounted) toast.error('Erro ao carregar motivos de pausa.'); });
    return () => { isMounted = false; };
  }, []);

  const handleConfirmar = async () => {
    if (!motivoSelecionado) {
      toast.error('Selecione o motivo da pausa.');
      return;
    }
    setSalvando(true);
    await onConfirmar(motivoSelecionado.value, observacao.trim() || null);
    setSalvando(false);
  };

  if (!paciente) return null;

  return (
    <Overlay style={{ zIndex: 2000 }}>
      <ModalContainer style={{ maxWidth: '500px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          ⏸ Pausar Tratamento
        </h3>
        <p style={{ opacity: 0.85, marginBottom: '15px' }}>
          Pausar o tratamento de <strong>{paciente.nome} {paciente.sobrenome}</strong>? Enquanto pausado,
          nenhum contato (termo, NPS, chat) será enviado a este paciente e ele não aparecerá nas
          pendências do Telemonitoramento.
        </p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Motivo da Pausa *</label>
          <Select
            options={listaMotivos.map(m => ({ value: m.id, label: m.descricao }))}
            value={motivoSelecionado}
            onChange={setMotivoSelecionado}
            styles={getCustomSelectStyles(theme)}
            placeholder="Selecione o motivo..."
            noOptionsMessage={() => "Nenhum motivo cadastrado — cadastre em Tabelas Cadastrais"}
            menuPosition="fixed"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Observação (opcional)</label>
          <Input
            as="textarea"
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Detalhes adicionais, se necessário..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button type="button" onClick={onClose} disabled={salvando} style={{ backgroundColor: '#6c757d' }}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirmar} disabled={salvando}>
            {salvando ? 'Pausando...' : 'Confirmar Pausa'}
          </Button>
        </div>
      </ModalContainer>
    </Overlay>
  );
}
