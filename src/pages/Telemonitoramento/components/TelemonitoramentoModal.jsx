import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Select from 'react-select';
import { useTheme } from 'styled-components';
import styled from 'styled-components';

import {
  ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button, InfoBox, ProjectedStockBox
} from './styles';

import { AdherenceBadge } from '../styles';
import { getAdherenceClassification } from '../index';
import { getCustomSelectStyles } from '../../../utils/selectStyles';
import NpsModal from './NpsModal';
import ResumoAnterior from './ResumoAnterior';
import PreMonitoramento from './PreMonitoramento';
import ComparativoNovaCompra from './ComparativoNovaCompra';

const SkeletonLoader = styled.div`
  background: linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite linear;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);

  @keyframes pulse {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .text-line {
    height: 12px;
    background: rgba(0,0,0,0.06);
    border-radius: 4px;
    margin-bottom: 10px;
    width: 100%;
  }
  .text-line.short { width: 60%; }
`;

export default function TelemonitoramentoModal({ isOpen, onClose, monitoramento, monitoramentoAnterior, onSucesso }) {
  const theme = useTheme();

  const [localMonitoramento, setLocalMonitoramento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNpsPrompt, setShowNpsPrompt] = useState(false);

  const [loadingCompra, setLoadingCompra] = useState(false);
  const [dadosNovaCompra, setDadosNovaCompra] = useState(null);
  const [aplicarNovaCompra, setAplicarNovaCompra] = useState(false);
  
  const [dataRealInicioNovaCaixa, setDataRealInicioNovaCaixa] = useState('');
  const [posologiaNovaCaixa, setPosologiaNovaCaixa] = useState('');

  const [qtdInformada, setQtdInformada] = useState('');
  const [dataAbertura, setDataAbertura] = useState(''); 
  const [isReacao, setIsReacao] = useState(false);
  const [reacoesSelecionadas, setReacoesSelecionadas] = useState([]);
  const [listaReacoes, setListaReacoes] = useState([]);
  const [contatoEfetivo, setContatoEfetivo] = useState(true);
  const [nivelAdesao, setNivelAdesao] = useState('COMPLETAMENTE');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (monitoramento) {
      setLocalMonitoramento(monitoramento);
    }
  }, [monitoramento]);

  useEffect(() => {
    let isMounted = true;

    if (isOpen && localMonitoramento?.id) {
      setQtdInformada('');
      setDataAbertura('');
      setIsReacao(false);
      setReacoesSelecionadas([]);
      setContatoEfetivo(true);
      setNivelAdesao('COMPLETAMENTE');
      setShowNpsPrompt(false);
      setObservacao('');
      
      setDadosNovaCompra(null);
      setAplicarNovaCompra(false);
      setPosologiaNovaCaixa('');

      if (localMonitoramento.data_calculada_fim_caixa) {
        const [ano, mes, dia] = localMonitoramento.data_calculada_fim_caixa.split('T')[0].split('-');
        const dateObj = new Date(ano, mes - 1, dia);
        dateObj.setDate(dateObj.getDate() + 1);

        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        setDataRealInicioNovaCaixa(`${y}-${m}-${d}`);
      }

      api.get('/reacao-adversa')
        .then(response => { if (isMounted) setListaReacoes(response.data); })
        .catch(() => { if (isMounted) toast.error('Erro ao carregar reações adversas.'); });

      setLoadingCompra(true);
      api.get(`/monitoramento-medicamentos/${localMonitoramento.id}/verificar-compra`)
        .then(response => {
          if (!isMounted) return;
          if (response.data && response.data.novaCompraDetectada) {
            setDadosNovaCompra(response.data.detalhes);
            setAplicarNovaCompra(true);
            setPosologiaNovaCaixa(localMonitoramento.posologia_diaria || '');
            
            if (response.data.detalhes.data_novo_inicio) {
              const dataDoBackend = response.data.detalhes.data_novo_inicio.split('T')[0];
              setDataRealInicioNovaCaixa(dataDoBackend);
            }
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          if (error.response?.data?.error) {
            toast.error(error.response.data.error);
          } else {
            console.log('Sem compras futuras adicionais encontradas.');
          }
        })
        .finally(() => {
          if (isMounted) setLoadingCompra(false);
        });
    }

    return () => { isMounted = false; };
  }, [isOpen, localMonitoramento?.id]);

  let idealRemaining = 0;
  let margemMin = 0;
  let margemMax = 0;
  let dataReferenciaFormatada = '-';
  let dataFimCicloAtualFormatada = '-'; // <--- Variável nova para a data do Fim
  let isAntesDoInicio = false; 

  const qtdCaixas = Number(localMonitoramento?.qtd_caixas || 1);
  const qtdTotalCaixa = Number(
    localMonitoramento?.qtd_total_capsulas || (localMonitoramento?.medicamento?.qtd_capsula * qtdCaixas) || 0
  );
  const posologia = Number(localMonitoramento?.posologia_diaria || 1);

  const dataUsoReferencia = localMonitoramento?.data_administracao || localMonitoramento?.data_entrega;
  
  if (dataUsoReferencia) {
    const dataApenasData = dataUsoReferencia.split('T')[0];
    const [ano, mes, dia] = dataApenasData.split('-');
    dataReferenciaFormatada = `${dia}/${mes}/${ano}`;

    const dataInicio = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (hoje < dataInicio) {
      isAntesDoInicio = true;
    }
  }

  if (localMonitoramento?.data_calculada_fim_caixa) {
    const [ano, mes, dia] = localMonitoramento.data_calculada_fim_caixa.split('T')[0].split('-');
    dataFimCicloAtualFormatada = `${dia}/${mes}/${ano}`; // <--- Setando a variável de exibição
    const dataFim = new Date(ano, mes - 1, dia);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (isAntesDoInicio) {
      idealRemaining = qtdTotalCaixa;
    } else {
      const diffDays = Math.max(0, Math.floor((dataFim - hoje) / (1000 * 60 * 60 * 24)));
      idealRemaining = diffDays * posologia;

      if (idealRemaining > qtdTotalCaixa) {
        idealRemaining = qtdTotalCaixa;
      }
    }

    margemMin = Math.max(0, idealRemaining - posologia);
    margemMax = Math.min(qtdTotalCaixa, idealRemaining + posologia);
  }

  useEffect(() => {
    if (qtdInformada === '' || !localMonitoramento) return;

    const qtdInformadaNum = Number(qtdInformada);
    const diferencaComprimidos = Math.abs(idealRemaining - qtdInformadaNum);
    const diferencaEmDias = diferencaComprimidos / posologia;

    if (diferencaEmDias <= 2) {
      setNivelAdesao('COMPLETAMENTE');
    } else if (diferencaEmDias <= 6) {
      setNivelAdesao('PARCIALMENTE');
    } else {
      setNivelAdesao('NAO_ADERE');
    }
  }, [qtdInformada, localMonitoramento, idealRemaining, posologia]);

  useEffect(() => {
    if (qtdInformada !== '') {
      let daysToAdd = 30;

      if (nivelAdesao === 'PARCIALMENTE') {
        daysToAdd = 15;
      } else if (nivelAdesao === 'NAO_ADERE') {
        daysToAdd = 7;
      }

      const date = new Date();
      date.setDate(date.getDate() + daysToAdd);

      const dayOfWeek = date.getDay();
      if (dayOfWeek === 6) {
        date.setDate(date.getDate() + 2); 
      } else if (dayOfWeek === 0) {
        date.setDate(date.getDate() + 1); 
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      setDataAbertura(`${year}-${month}-${day}`);
    } else {
      setDataAbertura('');
    }
  }, [qtdInformada, nivelAdesao]);

  if (!isOpen || !localMonitoramento) return null;

  if (showNpsPrompt) {
    return (
      <NpsModal
        monitoramento={localMonitoramento}
        onClose={() => {
          onClose();
        }}
      />
    );
  }

  const isPreMonitoramento = !monitoramentoAnterior && !localMonitoramento.data_administracao;

  const handlePreMonitoramentoSuccess = (novaDataAdmin, novaDataFimCaixa) => {
    setLocalMonitoramento(prev => ({
      ...prev,
      data_administracao: novaDataAdmin,
      data_calculada_fim_caixa: novaDataFimCaixa
    }));
  };

  if (isPreMonitoramento) {
    return (
      <PreMonitoramento 
        monitoramento={localMonitoramento} 
        onClose={onClose} 
        onSuccess={handlePreMonitoramentoSuccess} 
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hojeDate = new Date();
    const dataHojeFormat = `${hojeDate.getFullYear()}-${String(hojeDate.getMonth() + 1).padStart(2, '0')}-${String(hojeDate.getDate()).padStart(2, '0')}`;

    if (contatoEfetivo) {
      if (!qtdInformada || !dataAbertura) {
        toast.error('Preencha os dados da caixa do medicamento.');
        return;
      }
      if (dataAbertura < dataHojeFormat) {
        toast.error('A data do próximo contato não pode ser no passado.');
        return;
      }
      if (aplicarNovaCompra) {
        if (!dataRealInicioNovaCaixa) {
          toast.error('A data de início da nova caixa é obrigatória.');
          return;
        }
        if (!posologiaNovaCaixa) {
          toast.error('A posologia da nova caixa é obrigatória.');
          return;
        }
      }
    }

    try {
      setLoading(true);
      const reacoesIds = reacoesSelecionadas ? reacoesSelecionadas.map(r => r.value) : [];

      await api.put(`/monitoramento-medicamentos/${localMonitoramento.id}`, {
        contato_efetivo: contatoEfetivo,
        nivel_adesao: contatoEfetivo ? nivelAdesao : 'NAO_ADERE',
        qtd_informada_caixa: contatoEfetivo ? Number(qtdInformada) : null,
        data_abertura_nova_caixa: contatoEfetivo ? dataAbertura : null,
        is_reacao: contatoEfetivo ? isReacao : null,
        reacoes_adversas: contatoEfetivo && isReacao ? reacoesIds : [],
        observacao: observacao || null,
        
        aplicar_nova_compra: aplicarNovaCompra,
        dados_nova_compra: aplicarNovaCompra ? dadosNovaCompra : null,
        data_inicio_nova_caixa: aplicarNovaCompra ? dataRealInicioNovaCaixa : null,
        posologia_nova_caixa: aplicarNovaCompra ? Number(posologiaNovaCaixa) : null
      });

      toast.success('Contato registrado com sucesso!');
      onSucesso();
      window.dispatchEvent(new Event('updateAlerts'));
      setShowNpsPrompt(true);

    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao registrar contato.');
    } finally {
      setLoading(false);
    }
  };

  const scoreAtual = localMonitoramento.avaliacao?.total_score;
  const adInfo = getAdherenceClassification(scoreAtual);
  
  const hojeDate = new Date();
  const dataHoje = `${hojeDate.getFullYear()}-${String(hojeDate.getMonth() + 1).padStart(2, '0')}-${String(hojeDate.getDate()).padStart(2, '0')}`;

  const opcoesReacoes = listaReacoes.map(reacao => ({
    value: reacao.id,
    label: reacao.name
  }));

  return (
    <ModalOverlay>
      <div style={{ display: 'flex', gap: '20px', maxWidth: '1200px', width: '95%', margin: '0 auto', justifyContent: 'center', alignItems: 'flex-start' }}>
        
        {monitoramentoAnterior && (
          <ResumoAnterior monitoramento={monitoramentoAnterior} />
        )}

        <ModalContent style={{ flex: 1, maxWidth: '800px', margin: 0 }}>
          <h3>Registrar Contato - {localMonitoramento.paciente?.nome} {localMonitoramento.paciente?.sobrenome} | {localMonitoramento.evento_externo_id} </h3>

          {loadingCompra ? (
            <SkeletonLoader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }} />
                <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Consultando fornecimento externo...</span>
              </div>
              <div className="text-line"></div>
              <div className="text-line short"></div>
            </SkeletonLoader>
          ) : (
            <ComparativoNovaCompra 
              data={dadosNovaCompra} 
              checked={aplicarNovaCompra} 
              onChangeChecked={setAplicarNovaCompra} 
              dataInicioManual={dataRealInicioNovaCaixa}
              onChangeDataInicio={setDataRealInicioNovaCaixa}
              posologiaAtual={posologia}
              posologiaNovaCaixa={posologiaNovaCaixa}
              onChangePosologiaNova={setPosologiaNovaCaixa}
              estoqueHoje={qtdInformada !== '' ? Number(qtdInformada) : idealRemaining}
              dataInicioAtual={dataUsoReferencia}
              isAntesDoInicio={isAntesDoInicio}
            />
          )}

          <InfoBox>
            <p><strong>Medicamento Atual:</strong> {localMonitoramento.medicamento?.nome}</p>
            <p className="sub-text">
              Quantidade total inicial: {qtdTotalCaixa} comprimidos ({qtdCaixas} caixa{qtdCaixas > 1 ? 's' : ''}) (Dose: {posologia}/dia)
            </p>

            <ProjectedStockBox>
              {/* === INICIO DA MODIFICAÇÃO VISUAL === */}
              <p style={{ marginBottom: '6px', fontSize: '0.9em' }}>
                <strong>Data administração informada pelo paciente:</strong> {dataReferenciaFormatada}
              </p>
              <p style={{ marginBottom: '10px', fontSize: '0.9em', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '6px' }}>
                <strong>Data prevista para o fim do ciclo:</strong> {dataFimCicloAtualFormatada}
              </p>
              {/* === FIM DA MODIFICAÇÃO VISUAL === */}
              
              <p style={{ marginBottom: '5px', fontSize: '1.05em' }}>
                Estoque Projetado para Hoje: <span className="destaque">~{idealRemaining} comprimidos</span>
              </p>
              <p style={{ fontSize: '0.85em', opacity: 0.8 }}>
                (Margem aceitável calculada: {margemMin} a {margemMax})
              </p>
            </ProjectedStockBox>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>Score Atual:</strong> {scoreAtual != null ? `${scoreAtual} pts` : '-'}
              {scoreAtual != null && (
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
                  <label>Quantos comprimidos restam com o paciente no total?</label>
                  <Input
                    type="number"
                    min="0"
                    value={qtdInformada}
                    onChange={(e) => setQtdInformada(e.target.value)}
                    placeholder="Ex: 45"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Observação (Opcional)</label>
                  <Input
                    as="textarea"
                    rows="3"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Descreva aqui informações em relação aos comprimidos do paciente"
                    style={{ resize: 'vertical', padding: '10px' }}
                  />
                </FormGroup>

                <FormGroup>
                  <label>O quanto ele adere? (Calculado automaticamente)</label>
                  <Input as="select" value={nivelAdesao} disabled required>
                    <option value="COMPLETAMENTE">Alta adesão ao uso do medicamento</option>
                    <option value="PARCIALMENTE">Média adesão ao uso do medicamento</option>
                    <option value="NAO_ADERE">Baixa adesão ao uso do medicamento</option>
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
                  <label>Data do próximo contato de acordo com a adesão ao medicamento</label>
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
      </div>
    </ModalOverlay>
  );
}