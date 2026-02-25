import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { 
  ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button, AdherenceBadge 
} from '../styles';
import { getAdherenceClassification } from '../index'; 

export default function TelemonitoramentoModal({ isOpen, onClose, monitoramento, onSucesso }) {
  const [tomandoCorretamente, setTomandoCorretamente] = useState(true);
  const [qtdInformada, setQtdInformada] = useState('');
  const [dataAbertura, setDataAbertura] = useState('');
  const [isReacao, setIsReacao] = useState(false);
  const [reacaoAdversaId, setReacaoAdversaId] = useState('');
  const [listaReacoes, setListaReacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [contatoEfetivo, setContatoEfetivo] = useState(true);
  const [adesaoTratamento, setAdesaoTratamento] = useState(true);
  const [nivelAdesao, setNivelAdesao] = useState('COMPLETAMENTE');

  useEffect(() => {
    if (isOpen) {
      setTomandoCorretamente(true);
      setQtdInformada('');
      setDataAbertura('');
      setIsReacao(false);
      setReacaoAdversaId('');
      setContatoEfetivo(true);
      setAdesaoTratamento(true);
      setNivelAdesao('COMPLETAMENTE');

      api.get('/reacao-adversa')
        .then(response => setListaReacoes(response.data))
        .catch(() => toast.error('Erro ao carregar reações adversas.'));
    }
  }, [isOpen, monitoramento]);

  if (!isOpen || !monitoramento) return null;

  const score = monitoramento.avaliacao?.total_score;
  const adInfo = getAdherenceClassification(score);
  
  // Pegando a quantidade total da caixa que vem do backend
  const qtdTotalCaixa = monitoramento.medicamento?.qtd_capsula || 0;
  
  // Calculando a data de hoje no formato YYYY-MM-DD para travar o calendário
  const dataHoje = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contatoEfetivo) {
      if (!qtdInformada || !dataAbertura) {
        toast.error('Preencha os dados da caixa do medicamento.');
        return;
      }
      
      // Trava Lógica 1: Quantidade não pode ser maior que o total
      if (Number(qtdInformada) > qtdTotalCaixa) {
        toast.error(`A quantidade restante não pode ser maior que o total da caixa (${qtdTotalCaixa}).`);
        return;
      }

      // Trava Lógica 2: Data não pode ser menor que hoje
      if (dataAbertura < dataHoje) {
        toast.error('A data de abertura da nova caixa não pode ser no passado.');
        return;
      }

      if (isReacao && !reacaoAdversaId) {
        toast.error('Selecione qual foi a reação adversa.');
        return;
      }
    }

    try {
      setLoading(true);
      await api.put(`/monitoramento-medicamentos/${monitoramento.id}`, {
        contato_efetivo: contatoEfetivo,
        adesao_tratamento: contatoEfetivo ? adesaoTratamento : null,
        nivel_adesao: contatoEfetivo ? (adesaoTratamento ? nivelAdesao : 'NAO_ADERE') : null,
        tomando_corretamente: contatoEfetivo ? tomandoCorretamente : null,
        qtd_informada_caixa: contatoEfetivo ? Number(qtdInformada) : null,
        data_abertura_nova_caixa: contatoEfetivo ? dataAbertura : null,
        is_reacao: contatoEfetivo ? isReacao : null,
        reacao_adversa_id: contatoEfetivo && isReacao ? Number(reacaoAdversaId) : null
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
        <h3>Registrar Contato - {monitoramento.paciente?.nome}</h3>
        
        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <p style={{ marginBottom: '8px' }}><strong>Medicamento:</strong> {monitoramento.medicamento?.nome}</p>
          <p style={{ marginBottom: '8px', fontSize: '0.9em', color: '#666' }}>Quantidade na caixa: {qtdTotalCaixa} comprimidos</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <strong>Score Anterior:</strong> {score != null ? `${score} pts` : '-'}
            {score != null && (
              <AdherenceBadge level={adInfo.level} style={{ margin: 0 }}>
                {adInfo.label}
              </AdherenceBadge>
            )}
          </div>
        </div>

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
                <label>Paciente está aderindo ao tratamento?</label>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={adesaoTratamento === true} onChange={() => setAdesaoTratamento(true)} /> Sim
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={adesaoTratamento === false} onChange={() => {
                        setAdesaoTratamento(false);
                        setNivelAdesao('NAO_ADERE');
                      }} /> Não
                  </label>
                </div>
              </FormGroup>

              {adesaoTratamento && (
                <FormGroup>
                  <label>O quanto ele adere?</label>
                  <Input as="select" value={nivelAdesao} onChange={(e) => setNivelAdesao(e.target.value)} required style={{ padding: '0.75rem', width: '100%' }}>
                    <option value="COMPLETAMENTE">Completamente</option>
                    <option value="PARCIALMENTE">Parcialmente</option>
                  </Input>
                </FormGroup>
              )}

              <FormGroup style={{ marginTop: '1rem' }}>
                <label>O paciente está tomando o medicamento corretamente?</label>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={tomandoCorretamente === true} onChange={() => setTomandoCorretamente(true)} /> Sim
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={tomandoCorretamente === false} onChange={() => setTomandoCorretamente(false)} /> Não
                  </label>
                </div>
              </FormGroup>

              <FormGroup>
                <label>O paciente relatou alguma reação adversa?</label>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={isReacao === true} onChange={() => setIsReacao(true)} /> Sim
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="radio" checked={isReacao === false} onChange={() => { setIsReacao(false); setReacaoAdversaId(''); }} /> Não
                  </label>
                </div>
              </FormGroup>

              {isReacao && (
                <FormGroup>
                  <label>Qual foi a reação adversa?</label>
                  <Input as="select" value={reacaoAdversaId} onChange={(e) => setReacaoAdversaId(e.target.value)} required style={{ padding: '0.75rem', width: '100%' }}>
                    <option value="" disabled>Selecione uma reação...</option>
                    {listaReacoes.map((reacao) => (
                      <option key={reacao.id} value={reacao.id}>{reacao.name}</option>
                    ))}
                  </Input>
                </FormGroup>
              )}

              <FormGroup>
                <label>Quantos comprimidos restam na caixa do paciente?</label>
                <Input 
                  type="number" 
                  min="0" 
                  max={qtdTotalCaixa} // Trava HTML: Impede usar a setinha pra cima de passar do limite
                  value={qtdInformada} 
                  onChange={(e) => setQtdInformada(e.target.value)} 
                  placeholder={`Máx: ${qtdTotalCaixa}`} 
                  required 
                />
              </FormGroup>

              <FormGroup>
                <label>Qual a data informada para abertura da NOVA caixa?</label>
                <Input 
                  type="date" 
                  min={dataHoje} // Trava HTML: Desabilita os dias anteriores a hoje no calendário
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