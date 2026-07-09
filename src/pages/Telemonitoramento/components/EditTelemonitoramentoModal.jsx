import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api'; // Ajuste o caminho se necessário
import Select from 'react-select';
import { useTheme } from 'styled-components';

import {
  ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button, InfoBox
} from './styles'; // Usa os mesmos estilos do modal principal
import { getCustomSelectStyles } from '../../../utils/selectStyles';

export default function EditTelemonitoramentoModal({ isOpen, onClose, monitoramentoId, onSucesso }) {
  const theme = useTheme();
  
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const [monitoramentoData, setMonitoramentoData] = useState(null);
  const [listaReacoes, setListaReacoes] = useState([]);
  
  // Form Quantos comprimidos restavam com o paciente?
  const [qtdInformada, setQtdInformada] = useState('');
  const [isReacao, setIsReacao] = useState(false);
  const [reacoesSelecionadas, setReacoesSelecionadas] = useState([]);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    let isMounted = true;

    if (isOpen && monitoramentoId) {
      setLoadingInitial(true);

      // Busca as reações globais e os detalhes do monitoramento em paralelo
      Promise.all([
        api.get('/reacao-adversa'),
        api.get(`/monitoramento-medicamentos/${monitoramentoId}`)
      ])
      .then(([resReacoes, resMonit]) => {
        if (!isMounted) return;
        
        setListaReacoes(resReacoes.data);
        const data = resMonit.data;
        setMonitoramentoData(data);
        
        // Popula o formulário com os dados existentes
        setQtdInformada(data.qtd_informada_caixa || '');
        setObservacao(data.observacao || '');
        setIsReacao(!!data.is_reacao);
        
        if (data.reacoes_adversas && data.reacoes_adversas.length > 0) {
          const formatadas = data.reacoes_adversas.map(r => ({
            value: r.id,
            label: r.name
          }));
          setReacoesSelecionadas(formatadas);
        } else {
          setReacoesSelecionadas([]);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        toast.error('Erro ao carregar os dados para edição.');
        onClose();
      })
      .finally(() => {
        if (isMounted) setLoadingInitial(false);
      });
    }

    return () => { isMounted = false; };
  }, [isOpen, monitoramentoId, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const reacoesIds = reacoesSelecionadas ? reacoesSelecionadas.map(r => r.value) : [];

      await api.put(`/monitoramento-medicamentos/${monitoramentoId}/edicao-retroativa`, {
        qtd_informada_caixa: qtdInformada !== '' ? Number(qtdInformada) : null,
        is_reacao: isReacao,
        reacoes_adversas: isReacao ? reacoesIds : [],
        observacao: observacao || null
      });

      toast.success('Histórico atualizado com sucesso!');
      onSucesso(); // Recarrega a tabela por trás
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao editar o registro.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const opcoesReacoes = listaReacoes.map(reacao => ({
    value: reacao.id,
    label: reacao.name
  }));

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: '600px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✏️ Editar Contato Concluído
        </h3>

        {loadingInitial ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Carregando informações...</div>
        ) : (
          <>
            <InfoBox style={{ marginBottom: '20px' }}>
              <p><strong>Paciente:</strong> {monitoramentoData?.paciente?.nome} {monitoramentoData?.paciente?.sobrenome}</p>
              <p><strong>Medicamento:</strong> {monitoramentoData?.medicamento?.nome}</p>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px' }}>
                Aviso: A alteração destes dados afetará apenas o registro em prontuário deste contato específico.
              </p>
            </InfoBox>

            <form onSubmit={handleSubmit}>
              

              <FormGroup>
                <label>O paciente relatou alguma reação adversa neste ciclo?</label>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={isReacao === true} onChange={() => setIsReacao(true)} /> Sim
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={isReacao === false} onChange={() => { setIsReacao(false); setReacoesSelecionadas([]); }} /> Não
                  </label>
                </div>
              </FormGroup>

              {isReacao && (
                <FormGroup>
                  <label>Quais foram as reações adversas?</label>
                  <Select
                    isMulti
                    options={opcoesReacoes}
                    value={reacoesSelecionadas}
                    onChange={setReacoesSelecionadas}
                    styles={getCustomSelectStyles(theme)}
                    placeholder="Selecione as reações..."
                    noOptionsMessage={() => "Nenhuma reação encontrada"}
                  />
                </FormGroup>
              )}

              <FormGroup>
                <label>Observação</label>
                <Input
                  as="textarea"
                  rows="3"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Anotações sobre este contato..."
                  style={{ resize: 'vertical', padding: '10px' }}
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={onClose} disabled={loadingSubmit}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loadingSubmit}>
                  {loadingSubmit ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </ButtonGroup>
            </form>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}