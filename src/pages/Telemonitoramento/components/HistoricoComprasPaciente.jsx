import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../../services/api';

// 👇 CORREÇÃO (F22): este componente era uma cópia de HistoricoAberturas (chamava
// /historico-aberturas e mostrava "Aberturas de Caixas" duas vezes no modal).
// Agora lista as COMPRAS do paciente vindas do sistema externo
// (GET /monitoramento-medicamentos/:id/historico-compras → linhas de
// eventos_pacientes, mais recentes primeiro), com a situação de cada uma no
// telemonitoramento.

const HistoricoContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.sm};
  padding: 20px;
  box-shadow: ${props => props.theme.shadow.md};
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  color: ${props => props.theme.colors.text};

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: ${props => props.theme.colors.text};
    font-size: 1.1em;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 10px;
  }

  .vazio {
    font-size: 0.9em;
    color: ${props => props.theme.colors.textLight};
  }
`;

const CompraItem = styled.div`
  padding: 12px;
  border-left: 4px solid ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.surfaceAlt};
  margin-bottom: 12px;
  border-radius: 0 6px 6px 0;
  opacity: ${props => (props.$excluida ? 0.7 : 1)};

  .med-name {
    font-weight: 600;
    font-size: 0.95em;
    margin-bottom: 8px;
  }

  .event-info {
    font-size: 0.85em;
    color: ${props => props.theme.colors.textLight};
    margin: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .badge {
    background: ${props => props.theme.colors.primaryLight};
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
  }
`;

// cor do selo de situação: chave de theme.colors (texto) + versão clara (fundo)
const CORES_SITUACAO = {
  aplicada: ['success', 'successLight'],
  semCiclo: ['info', 'infoLight'],
  pendente: ['warning', 'warningLight'],
  excluida: ['danger', 'dangerLight']
};

const SeloSituacao = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${props => props.theme.radius.pill};
  font-size: 0.78em;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors[CORES_SITUACAO[props.$tipo][1]]};
  border: 1px solid ${props => props.theme.colors[CORES_SITUACAO[props.$tipo][0]]};
`;

// Situação da compra no telemonitoramento, pelos campos de processamento de
// eventos_pacientes (ver migration add-processamento-to-eventos-pacientes).
function situacaoCompra(compra) {
  if (compra.excluido_externo) return { tipo: 'excluida', texto: 'Excluída no sistema externo' };
  if (compra.processado && compra.tipo_processamento === 'CONSUMIDO_SEM_CICLO') return { tipo: 'semCiclo', texto: 'Usada sem ciclo próprio' };
  if (compra.processado) return { tipo: 'aplicada', texto: 'Aplicada no telemonitoramento' };
  return { tipo: 'pendente', texto: 'Aguardando aplicação' };
}

const formatarData = (dataStr) => {
  if (!dataStr) return 'Não informada';
  const [ano, mes, dia] = String(dataStr).split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
};

export default function HistoricoComprasPaciente({ monitoramento }) {
  // O resultado guarda de qual monitoramento veio — "carregando" é derivado
  // disso, e uma resposta atrasada de outro paciente é descartada.
  const [resultado, setResultado] = useState({ id: null, itens: [] });
  const compras = resultado.itens;
  const loading = !!monitoramento?.id && resultado.id !== monitoramento.id;

  const id = monitoramento?.id;
  useEffect(() => {
    if (!id) return undefined;
    let ativo = true;

    api.get(`/monitoramento-medicamentos/${id}/historico-compras`)
      .then(response => {
        if (!ativo) return;
        setResultado({ id, itens: Array.isArray(response.data) ? response.data : [] });
      })
      .catch(err => {
        if (!ativo) return;
        console.error('Erro ao carregar histórico de compras', err);
        setResultado({ id, itens: [] });
      });

    return () => { ativo = false; };
  }, [id]);

  if (loading) {
    return (
      <HistoricoContainer>
        <h4>Histórico de Compras</h4>
        <p className="vazio">Carregando compras...</p>
      </HistoricoContainer>
    );
  }

  return (
    <HistoricoContainer>
      <h4>Histórico de Compras</h4>
      {compras.length === 0 ? (
        <p className="vazio">Nenhuma compra encontrada.</p>
      ) : (
        compras.map(compra => {
          const situacao = situacaoCompra(compra);
          const qtdCaixas = Number(compra.qtd_caixas) || 0;
          const qtdCapsula = Number(compra.medicamento?.qtd_capsula) || 0;
          return (
            <CompraItem key={compra.id} $excluida={!!compra.excluido_externo}>
              <div className="med-name">{compra.medicamento?.nome || 'Medicamento não informado'}</div>
              <div className="event-info">
                <span><strong>ID do Evento:</strong></span>
                <span className="badge">{compra.external_id || 'N/A'}</span>
              </div>
              <div className="event-info">
                <span><strong>Quantidade:</strong></span>
                <span>
                  {qtdCaixas} caixa{qtdCaixas === 1 ? '' : 's'}
                  {qtdCapsula > 0 ? ` (${qtdCaixas * qtdCapsula} comp.)` : ''}
                </span>
              </div>
              <div className="event-info">
                <span><strong>{compra.data_entrega_real ? 'Entregue em:' : 'Entrega prevista:'}</strong></span>
                <span>{formatarData(compra.data_entrega_real || compra.data_entrega_prevista)}</span>
              </div>
              <div className="event-info">
                <span><strong>Previsão de uso:</strong></span>
                <span>{formatarData(compra.data_administracao_prevista)}</span>
              </div>
              <div style={{ marginTop: '6px' }}>
                <SeloSituacao $tipo={situacao.tipo}>{situacao.texto}</SeloSituacao>
              </div>
            </CompraItem>
          );
        })
      )}
    </HistoricoContainer>
  );
}
