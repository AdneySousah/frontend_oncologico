import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { HighlightedSection, Input } from './styles';

// 👇 ACUMULAR SOBRAS: em esquemas em ciclos (ex.: 6 comp. por 14 dias, pausa 7) a
// caixa não fecha ciclos inteiros e o paciente acumula comprimidos. Marcado aqui,
// na próxima reposição a sobra confirmada é SOMADA à caixa nova (em vez de ser
// desconsiderada). A marcação vale para este medicamento do paciente, segue nos
// próximos ciclos e cada mudança fica no histórico (quem, quando e por quê).

const Ajuda = styled.p`
  margin: ${p => p.theme.space.sm} 0 0 30px;
  font-size: 0.85rem;
  line-height: 1.45;
  color: ${p => p.theme.colors.textLight};
`;

const Confirmacao = styled.div`
  margin-top: ${p => p.theme.space.md};
  padding: ${p => p.theme.space.md};
  border-radius: ${p => p.theme.radius.md};
  border: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.surface};

  p { margin: 0 0 ${p => p.theme.space.sm}; font-size: 0.9rem; line-height: 1.4; }
  label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: ${p => p.theme.space.xs}; }
`;

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${p => p.theme.space.sm};
  margin-top: ${p => p.theme.space.md};

  button {
    min-height: 40px;
    padding: 0 ${p => p.theme.space.md};
    border-radius: ${p => p.theme.radius.sm};
    font-weight: 600;
    cursor: pointer;
    border: 1px solid ${p => p.theme.colors.border};
    background: ${p => p.theme.colors.surface};
    color: ${p => p.theme.colors.text};
  }
  button.principal {
    background: ${p => p.theme.colors.primary};
    border-color: ${p => p.theme.colors.primary};
    color: #fff;
  }
  button:disabled { opacity: 0.6; cursor: wait; }
`;

const Etiqueta = styled.span`
  display: inline-block;
  margin-left: ${p => p.theme.space.sm};
  padding: 2px 8px;
  border-radius: ${p => p.theme.radius.pill};
  font-size: 0.75rem;
  font-weight: 700;
  background: ${p => p.$pendente ? p.theme.colors.warningLight : p.$ativo ? p.theme.colors.successLight : p.theme.colors.surfaceAlt};
  color: ${p => p.$pendente || p.$ativo ? p.theme.colors.text : p.theme.colors.textLight};
`;

const AvisoPendente = styled.p`
  margin: 0 0 ${p => p.theme.space.sm};
  padding: ${p => p.theme.space.sm};
  border-left: 3px solid ${p => p.theme.colors.warning};
  background: ${p => p.theme.colors.warningLight};
  border-radius: ${p => p.theme.radius.sm};
  font-weight: 600;
`;

const LinkHistorico = styled.button`
  margin: ${p => p.theme.space.sm} 0 0 30px;
  min-height: 32px;
  padding: 0;
  border: none;
  background: none;
  color: ${p => p.theme.colors.primary};
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
`;

const ListaHistorico = styled.ul`
  list-style: none;
  margin: ${p => p.theme.space.sm} 0 0 30px;
  padding: 0;
  font-size: 0.85rem;

  li {
    padding: ${p => p.theme.space.sm} 0;
    border-bottom: 1px dashed ${p => p.theme.colors.border};
    line-height: 1.4;
  }
  li:last-child { border-bottom: none; }
  .quando { color: ${p => p.theme.colors.textLight}; }
`;

const formatarDataHora = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
};

export default function AcumuloSobras({ monitoramentoId, ativo, onChange, nomeMedicamento, desabilitado = false, onPendenteChange }) {
  const [pedido, setPedidoInterno] = useState(null); // valor que o usuário quer aplicar (aguardando confirmação)
  // Avisa a tela de fora: com a confirmação aberta o contato não pode ser salvo
  // (antes dava para salvar achando que estava ativado, e a sobra não era somada).
  const setPedido = (valor) => {
    setPedidoInterno(valor);
    if (onPendenteChange) onPendenteChange(valor != null);
  };
  // Se o cartão sair da tela (ex.: marcou "descontinuar"), não deixa a pendência presa.
  const avisarPendente = useRef(onPendenteChange);
  avisarPendente.current = onPendenteChange;
  useEffect(() => () => { if (avisarPendente.current) avisarPendente.current(false); }, []);
  const [motivo, setMotivo] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [historico, setHistorico] = useState(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const carregarHistorico = async () => {
    try {
      const { data } = await api.get(`/monitoramento-medicamentos/${monitoramentoId}/acumular-sobras/historico`);
      setHistorico(data);
    } catch {
      toast.error('Não foi possível carregar o histórico de acumular sobras.');
    }
  };

  const confirmar = async () => {
    setSalvando(true);
    try {
      const { data } = await api.patch(`/monitoramento-medicamentos/${monitoramentoId}/acumular-sobras`, { ativo: pedido, motivo: motivo.trim() || null });
      onChange(!!data.acumula_sobras);
      toast.success(pedido ? 'Acumular sobras ativado para este medicamento.' : 'Acumular sobras desativado para este medicamento.');
      setPedido(null);
      setMotivo('');
      if (mostrarHistorico) carregarHistorico();
    } catch (erro) {
      toast.error(erro.response?.data?.error || 'Não foi possível salvar a opção de acumular sobras.');
    } finally {
      setSalvando(false);
    }
  };

  const alternarHistorico = () => {
    const abrir = !mostrarHistorico;
    setMostrarHistorico(abrir);
    if (abrir) carregarHistorico();
  };

  return (
    <HighlightedSection data-testid="acumulo-sobras" id="acumulo-sobras">
      <label className="checkbox-label">
        {/* A caixa mostra só o que está SALVO; o pedido aparece na etiqueta "Falta confirmar". */}
        <input
          type="checkbox"
          checked={!!ativo}
          disabled={desabilitado || salvando || pedido != null}
          onChange={(e) => setPedido(e.target.checked)}
        />
        <strong>
          Acumular sobras entre as caixas{nomeMedicamento ? ` (${nomeMedicamento})` : ''}
          <Etiqueta $ativo={!!ativo} $pendente={pedido != null}>
            {pedido != null ? 'Falta confirmar' : ativo ? 'Ativado' : 'Desativado'}
          </Etiqueta>
        </strong>
      </label>
      <Ajuda>
        Use quando o paciente toma em ciclos e a caixa não fecha um ciclo inteiro (sobra de propósito, não por esquecimento).
        Com esta opção, ao aplicar uma compra nova a sobra confirmada é somada à caixa nova.
      </Ajuda>

      {pedido != null && (
        <Confirmacao role="group" aria-label="Confirmar acumular sobras">
          <AvisoPendente>
            Ainda não está valendo: clique em {pedido ? '"Confirmar e ativar"' : '"Confirmar e desativar"'} (ou em "Cancelar").
          </AvisoPendente>
          <p>
            {pedido
              ? 'Ativar: depois de confirmar, as compras deste medicamento passam a somar a sobra à caixa nova — inclusive a compra desta tela, se você aplicar. No "Detalhamento do Estoque Projetado" aparece o campo "+ Sobra da caixa anterior" para confirmar a quantidade com o paciente. Vale até alguém desativar.'
              : 'Desativar: depois de confirmar, nas próximas compras a caixa nova volta a substituir o estoque (a sobra não é somada).'}
          </p>
          <label htmlFor="motivo-acumulo">Motivo (opcional, fica no histórico)</label>
          <Input
            id="motivo-acumulo"
            as="textarea"
            rows="2"
            maxLength={500}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex.: caixa de 120 e o ciclo usa 84 comprimidos"
          />
          <Acoes>
            <button type="button" className="principal" onClick={confirmar} disabled={salvando}>
              {salvando ? 'Salvando...' : (pedido ? 'Confirmar e ativar' : 'Confirmar e desativar')}
            </button>
            <button type="button" onClick={() => { setPedido(null); setMotivo(''); }} disabled={salvando}>Cancelar</button>
          </Acoes>
        </Confirmacao>
      )}

      <LinkHistorico type="button" onClick={alternarHistorico}>
        {mostrarHistorico ? 'Esconder histórico' : 'Ver histórico desta opção'}
      </LinkHistorico>
      {mostrarHistorico && (
        historico == null ? <Ajuda>Carregando...</Ajuda>
          : historico.length === 0 ? <Ajuda>Nenhuma mudança registrada ainda.</Ajuda>
            : (
              <ListaHistorico>
                {historico.map(h => (
                  <li key={h.id}>
                    <strong>{h.ativado ? 'Ativado' : 'Desativado'}</strong> por {h.usuario}{' '}
                    <span className="quando">em {formatarDataHora(h.data)}</span>
                    {h.motivo && <div>Motivo: {h.motivo}</div>}
                  </li>
                ))}
              </ListaHistorico>
            )
      )}
    </HighlightedSection>
  );
}
