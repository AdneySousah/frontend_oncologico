import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { Input } from './styles';

// Bloco "parou de tomar em X → com essa data o paciente deve ter Y
// comprimidos → o paciente confirma?" — usado na pausa temporária e na
// descontinuação. A projeção vem do backend
// (POST /monitoramento-medicamentos/:id/projecao-restante), o mesmo motor
// que calcula o fim de caixa, considerando padrão de posologia e pausas
// anteriores. `base` (opcional) projeta uma caixa ainda não gravada, ex:
// compra nova aplicada no mesmo contato.
//
// `valor` é { dataParada, confirmado (null | true | false), qtdInformada, projecao }
// e `onChange` recebe um atualizador (prev => next) — passe o setState direto.
const formatarData = (iso) => (iso ? String(iso).split('T')[0].split('-').reverse().join('/') : '');

export default function ConfirmacaoRestante({ monitoramentoId, base = null, valor, onChange, nome = 'restante', rotuloData = 'Parou de tomar em (primeiro dia sem o medicamento) *' }) {
  // `erro` guarda a chave (data + base) a que se refere, pra sumir sozinho
  // quando a data muda — sem precisar de setState síncrono dentro do effect
  // (regra react-hooks/set-state-in-effect).
  const [erro, setErro] = useState(null);

  const hoje = new Date();
  const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  const baseChave = base ? JSON.stringify(base) : '';
  const dataParada = valor?.dataParada || '';
  const chaveAtual = `${dataParada}|${baseChave}`;

  useEffect(() => {
    if (!dataParada || !monitoramentoId) return undefined;
    let ativo = true;
    api.post(`/monitoramento-medicamentos/${monitoramentoId}/projecao-restante`, {
      data_parada: dataParada,
      base: baseChave ? JSON.parse(baseChave) : null
    })
      .then(res => {
        if (!ativo) return;
        onChange(prev => ({ ...prev, projecao: { ...res.data, chave: chaveAtual }, confirmado: null, qtdInformada: '' }));
      })
      .catch(err => {
        if (!ativo) return;
        setErro({ chave: chaveAtual, mensagem: err.response?.data?.error || 'Não foi possível calcular os comprimidos restantes.' });
        onChange(prev => ({ ...prev, projecao: null, confirmado: null }));
      });
    return () => { ativo = false; };
  }, [dataParada, monitoramentoId, baseChave, chaveAtual, onChange]);

  const erroAtual = erro && erro.chave === chaveAtual ? erro.mensagem : null;
  const projecaoAtual = valor?.projecao && valor.projecao.chave === chaveAtual ? valor.projecao : null;
  const carregando = !!dataParada && !erroAtual && !projecaoAtual;

  const projecao = projecaoAtual;

  return (
    // "full": dentro de um .inputs-row (grade) ocupa a linha inteira — a
    // projeção e a pergunta precisam de largura, não de uma coluna estreita.
    <div className="input-group full" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
      <label>{rotuloData}</label>
      <Input
        type="date"
        max={dataHoje}
        value={dataParada}
        onChange={(e) => onChange(prev => ({ ...prev, dataParada: e.target.value, projecao: null, confirmado: null, qtdInformada: '' }))}
        style={{ maxWidth: '240px' }}
      />

      {dataParada && (
        <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '6px', background: 'rgba(52, 152, 219, 0.08)', border: '1px solid rgba(52, 152, 219, 0.35)', fontSize: '0.9em', lineHeight: '1.5' }}>
          {carregando && <span>Calculando os comprimidos restantes...</span>}
          {!carregando && erroAtual && <span style={{ color: '#c0392b' }}>{erroAtual}</span>}
          {!carregando && !erroAtual && projecao && (
            <>
              <div>
                Com essa data, o paciente deve ter <strong>{projecao.qtd_restante_projetada} comprimido(s)</strong> na caixa
                {' '}({projecao.consumidos} tomado(s) desde {formatarData(projecao.data_inicio)}, de {projecao.qtd_total} no total).
              </div>
              <div style={{ marginTop: '8px', fontWeight: 'bold' }}>O paciente confirma que tem essa quantidade? *</div>
              <div style={{ display: 'flex', gap: '18px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'normal' }}>
                  <input type="radio" name={`${nome}-confirma`} checked={valor.confirmado === true} onChange={() => onChange(prev => ({ ...prev, confirmado: true, qtdInformada: '' }))} />
                  Sim
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'normal' }}>
                  <input type="radio" name={`${nome}-confirma`} checked={valor.confirmado === false} onChange={() => onChange(prev => ({ ...prev, confirmado: false }))} />
                  Não
                </label>
              </div>
              {valor.confirmado === false && (
                <div className="input-group" style={{ marginTop: '8px', maxWidth: '320px' }}>
                  <label>Quantos comprimidos ele tem na caixa? *</label>
                  <Input
                    type="number"
                    min="0"
                    value={valor.qtdInformada}
                    onChange={(e) => onChange(prev => ({ ...prev, qtdInformada: e.target.value }))}
                    placeholder="Quantidade informada pelo paciente"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
