import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useTheme } from 'styled-components';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, FormGroup, ButtonGroup, Button } from './styles';
import { getCustomSelectStyles } from '../../../utils/selectStyles';


export default function TentativaContatoModal({
  titulo,
  descricao,
  onCancelar,
  onContinuar, // (contatoEfetivo: boolean, motivoFalhaSelecionado: {value, label} | null) => void
  enviando = false
}) {
  const theme = useTheme();
  const [contatoEfetivo, setContatoEfetivo] = useState(true);
  const [listaMotivosFalha, setListaMotivosFalha] = useState([]);
  const [motivoFalhaSelecionado, setMotivoFalhaSelecionado] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.get('/motivos-falha-contato')
      .then(res => { if (isMounted) setListaMotivosFalha(res.data); })
      .catch(() => { if (isMounted) toast.error('Erro ao carregar motivos de falha de contato.'); });
    return () => { isMounted = false; };
  }, []);

  const handleContinuar = () => {
    if (contatoEfetivo === false && !motivoFalhaSelecionado) {
      toast.error('Selecione o motivo pelo qual o contato não foi efetivado.');
      return;
    }
    onContinuar(contatoEfetivo, contatoEfetivo === false ? motivoFalhaSelecionado : null);
  };

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: '600px', margin: 'auto' }}>
        {titulo && <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{titulo}</h3>}
        {descricao && <p style={{ opacity: 0.85, marginBottom: '15px' }}>{descricao}</p>}
        <FormGroup>
          <label>O contato foi efetivado com sucesso?</label>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
              <input
                type="radio"
                checked={contatoEfetivo === true}
                onChange={() => { setContatoEfetivo(true); setMotivoFalhaSelecionado(null); }}
              /> Sim
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
              <input
                type="radio"
                checked={contatoEfetivo === false}
                onChange={() => setContatoEfetivo(false)}
              /> Não (Paciente não atendeu/ausente)
            </label>
          </div>
        </FormGroup>
        {contatoEfetivo === false && (
          <FormGroup style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ffeeba' }}>
            <label style={{ color: '#856404' }}>Qual o motivo da falha no contato?</label>
            <Select
              options={listaMotivosFalha.map(m => ({ value: m.id, label: m.descricao }))}
              value={motivoFalhaSelecionado}
              onChange={setMotivoFalhaSelecionado}
              styles={getCustomSelectStyles(theme)}
              placeholder="Selecione o motivo..."
              noOptionsMessage={() => "Nenhum motivo encontrado"}
              menuPosition="fixed"
            />
          </FormGroup>
        )}
        <ButtonGroup style={{ marginTop: '20px' }}>
          <Button type="button" variant="secondary" onClick={onCancelar} disabled={enviando}>Cancelar</Button>
          <Button type="button" onClick={handleContinuar} disabled={enviando}>
            {enviando ? 'Salvando...' : (contatoEfetivo ? 'Continuar' : 'Registrar Falha de Contato')}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}