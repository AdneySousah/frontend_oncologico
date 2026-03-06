import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Select from 'react-select';
import { useTheme } from 'styled-components';

import { 
  ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button, InfoBox, ProjectedStockBox
} from './styles'; 

import { AdherenceBadge } from '../styles'; 
import { getAdherenceClassification } from '../index'; 
import { getCustomSelectStyles } from '../../../utils/selectStyles'; 

export default function TelemonitoramentoModal({ isOpen, onClose, monitoramento, onSucesso }) {
  const theme = useTheme();

  const [qtdInformada, setQtdInformada] = useState('');
  const [dataAbertura, setDataAbertura] = useState('');
  const [isReacao, setIsReacao] = useState(false);
  const [reacoesSelecionadas, setReacoesSelecionadas] = useState([]); 
  const [listaReacoes, setListaReacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [contatoEfetivo, setContatoEfetivo] = useState(true);
  const [nivelAdesao, setNivelAdesao] = useState('COMPLETAMENTE');

  let idealRemaining = 0;
  let margemMin = 0;
  let margemMax = 0;
  let dataAberturaFormatada = '';
  
  // 1. FORÇA OS DADOS A SEREM NÚMEROS PRA EVITAR CONCATENAÇÃO DE STRING
  const qtdTotalCaixa = Number(monitoramento?.medicamento?.qtd_capsula || 0);
  const posologia = Number(monitoramento?.posologia_diaria || 1);

  if (monitoramento?.data_calculada_fim_caixa) {
    const [ano, mes, dia] = monitoramento.data_calculada_fim_caixa.split('-');
    const dataFim = new Date(ano, mes - 1, dia);
    
    const diasDuracao = Math.floor(qtdTotalCaixa / posologia);
    const dataAberturaAnterior = new Date(dataFim);
    dataAberturaAnterior.setDate(dataAberturaAnterior.getDate() - diasDuracao);
    dataAberturaFormatada = dataAberturaAnterior.toLocaleDateString('pt-BR');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
    
    idealRemaining = Math.max(0, diffDays * posologia);
    
    // Calcula as margens e garante que a Mínima será sempre menor que a Máxima
    const calcMin = Math.max(0, idealRemaining - posologia);
    const calcMax = Math.min(qtdTotalCaixa, idealRemaining + posologia);
    
    margemMin = Math.min(calcMin, calcMax);
    margemMax = Math.max(calcMin, calcMax);
  }

  useEffect(() => {
    if (isOpen) {
      setQtdInformada('');
      setDataAbertura('');
      setIsReacao(false);
      setReacoesSelecionadas([]);
      setContatoEfetivo(true);
      setNivelAdesao('COMPLETAMENTE');

      api.get('/reacao-adversa')
        .then(response => setListaReacoes(response.data))
        .catch(() => toast.error('Erro ao carregar reações adversas.'));
    }
  }, [isOpen, monitoramento]);

  useEffect(() => {
    if (qtdInformada === '' || !monitoramento) return;

    const qtdInformadaNum = Number(qtdInformada);

    if (qtdInformadaNum >= margemMin && qtdInformadaNum <= margemMax) {
      setNivelAdesao('COMPLETAMENTE');
    } else {
      const expectedTaken = qtdTotalCaixa - idealRemaining;
      const actualTaken = qtdTotalCaixa - qtdInformadaNum;

      let percentual = 100;
      
      if (expectedTaken > 0) {
        // 2. CORREÇÃO DO BUG DO PERCENTUAL: 
        // Lida com casos em que o paciente tomou mais comprimidos do que deveria
        if (actualTaken > expectedTaken) {
          // Tomou a mais (superdosagem penaliza o percentual)
          percentual = (expectedTaken / actualTaken) * 100;
        } else {
          // Tomou a menos ou certinho
          percentual = (actualTaken / expectedTaken) * 100;
        }
      } else if (actualTaken > 0) {
        // Se era esperado que tomasse 0, mas tomou algum
        percentual = 0;
      }

      if (percentual >= 70) {
        setNivelAdesao('PARCIALMENTE');
      } else {
        setNivelAdesao('NAO_ADERE');
      }
    }
  }, [qtdInformada, monitoramento, margemMin, margemMax, qtdTotalCaixa, idealRemaining]);

  useEffect(() => {
    if (qtdInformada !== '' && posologia > 0) {
      const qtd = Number(qtdInformada);
      const diasRestantes = Math.floor(qtd / posologia);

      const dataNovaCaixa = new Date();
      dataNovaCaixa.setHours(0, 0, 0, 0);
      dataNovaCaixa.setDate(dataNovaCaixa.getDate() + diasRestantes);

      const diaSemana = dataNovaCaixa.getDay(); 
      if (diaSemana === 6) { 
        dataNovaCaixa.setDate(dataNovaCaixa.getDate() + 2); 
      } else if (diaSemana === 0) { 
        dataNovaCaixa.setDate(dataNovaCaixa.getDate() + 1); 
      }

      const ano = dataNovaCaixa.getFullYear();
      const mes = String(dataNovaCaixa.getMonth() + 1).padStart(2, '0');
      const dia = String(dataNovaCaixa.getDate()).padStart(2, '0');
      
      setDataAbertura(`${ano}-${mes}-${dia}`);
    } else {
      setDataAbertura(''); 
    }
  }, [qtdInformada, posologia]);

  if (!isOpen || !monitoramento) return null;

  const score = monitoramento.avaliacao?.total_score;
  const adInfo = getAdherenceClassification(score);
  const dataHoje = new Date().toISOString().split('T')[0];

  const opcoesReacoes = listaReacoes.map(reacao => ({
    value: reacao.id,
    label: reacao.name
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contatoEfetivo) {
      if (!qtdInformada || !dataAbertura) {
        toast.error('Preencha os dados da caixa do medicamento.');
        return;
      }
      
      if (Number(qtdInformada) > qtdTotalCaixa) {
        toast.error(`A quantidade restante não pode ser maior que o total da caixa (${qtdTotalCaixa}).`);
        return;
      }

      if (dataAbertura < dataHoje) {
        toast.error('A data de abertura da nova caixa não pode ser no passado.');
        return;
      }

      if (isReacao && (!reacoesSelecionadas || reacoesSelecionadas.length === 0)) {
        toast.error('Selecione pelo menos uma reação adversa.');
        return;
      }
    }

    try {
      setLoading(true);
      
      const reacoesIds = reacoesSelecionadas ? reacoesSelecionadas.map(r => r.value) : [];

      await api.put(`/monitoramento-medicamentos/${monitoramento.id}`, {
        contato_efetivo: contatoEfetivo,
        nivel_adesao: contatoEfetivo ? nivelAdesao : 'NAO_ADERE',
        qtd_informada_caixa: contatoEfetivo ? Number(qtdInformada) : null,
        data_abertura_nova_caixa: contatoEfetivo ? dataAbertura : null,
        is_reacao: contatoEfetivo ? isReacao : null,
        reacoes_adversas: contatoEfetivo && isReacao ? reacoesIds : [] 
      });

      toast.success('Contato registrado com sucesso!');
      onSucesso(); 
      onClose();   
      window.dispatchEvent(new Event('updateAlerts'));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Registrar Contato - {monitoramento.paciente?.nome} {monitoramento.paciente?.sobrenome} </h3>
        
        <InfoBox>
          <p><strong>Medicamento:</strong> {monitoramento.medicamento?.nome}</p>
          <p className="sub-text">
            Quantidade original da caixa: {qtdTotalCaixa} comprimidos (Dose: {posologia}/dia)
          </p>

          <ProjectedStockBox>
            <p style={{ marginBottom: '10px', fontSize: '0.9em', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '6px' }}>
              <strong>Abertura da Caixa Atual (Informado no último contato):</strong> {dataAberturaFormatada}
            </p>
            <p style={{ marginBottom: '5px', fontSize: '1.05em' }}>
              Estoque Projetado para Hoje: <span className="destaque">~{idealRemaining} comprimidos</span>
            </p>
            <p style={{ fontSize: '0.85em', opacity: 0.8 }}>
              (Margem aceitável calculada: {margemMin} a {margemMax})
            </p>
          </ProjectedStockBox>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <strong>Score Anterior:</strong> {score != null ? `${score} pts` : '-'}
            {score != null && (
              <AdherenceBadge level={adInfo.level} style={{ margin: 0 }}>
                {adInfo.label}
              </AdherenceBadge>
            )}
          </div>
        </InfoBox>

        <form onSubmit={handleSubmit}>
          
          <FormGroup>
            <label>O contato foi efetivado com sucesso?</label>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                <input type="radio" checked={contatoEfetivo === true} onChange={() => setContatoEfetivo(true)} /> Sim
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                <input type="radio" checked={contatoEfetivo === false} onChange={() => setContatoEfetivo(false)} /> Não (Paciente não atendeu/ausente)
              </label>
            </div>
          </FormGroup>

          {contatoEfetivo && (
            <>
              <FormGroup>
                <label>Quantos comprimidos restam na caixa do paciente?</label>
                <Input 
                  type="number" 
                  min="0" 
                  max={qtdTotalCaixa}
                  value={qtdInformada} 
                  onChange={(e) => setQtdInformada(e.target.value)} 
                  placeholder={`Máx: ${qtdTotalCaixa}`} 
                  required 
                />
              </FormGroup>

              <FormGroup>
                <label>O quanto ele adere? (Calculado automaticamente)</label>
                <Input as="select" value={nivelAdesao} disabled required>
                  <option value="COMPLETAMENTE">Completamente (Dentro da Média)</option>
                  <option value="PARCIALMENTE">Parcialmente (Entre 70% e a Margem Ideal)</option>
                  <option value="NAO_ADERE">Não Adere (Abaixo de 70% ou Superdosagem)</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <label>O paciente relatou alguma reação adversa?</label>
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
                  <label>Quais foram as reações adversas? (Marque todas que se aplicam)</label>
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
                <label>Qual a data informada para abertura da NOVA caixa?</label>
                <Input 
                  type="date" 
                  min={dataHoje} 
                  value={dataAbertura} 
                  onChange={(e) => setDataAbertura(e.target.value)} 
                  required 
                />
              </FormGroup>
            </>
          )}

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}