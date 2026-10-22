import React from 'react';

// Escolha de QUAL compra pendente é a atual, quando há mais de uma da mesma
// linha de tratamento (mesmo princípio ativo). Mesma regra do telemonitoramento:
// o padrão é a mais antiga; escolher uma mais recente exige confirmar que as
// anteriores já foram utilizadas — elas saem das pendentes sem virar ciclo.
// Usado no "Iniciar Tratamento" e na Necessidade de Navegação (uso contínuo).
//
// props:
//   eventos           - [{ evento_externo_id, data_entrega, data_administracao_prevista, qtd_caixas, medicamento_nome }], da mais antiga pra mais recente
//   value             - evento_externo_id selecionado
//   onChange(evento)  - recebe o objeto do evento escolhido
//   confirmado        - o operador confirmou o consumo das anteriores
//   onChangeConfirmado(bool)
const formatar = (iso) => (iso ? String(iso).split('T')[0].split('-').reverse().join('/') : '-');
const diasDesde = (iso) => {
  if (!iso) return null;
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  return Math.floor((hoje - new Date(`${String(iso).split('T')[0]}T00:00:00`)) / (1000 * 60 * 60 * 24));
};

export default function SeletorCompraBase({ eventos = [], value, onChange, confirmado = false, onChangeConfirmado }) {
  if (!Array.isArray(eventos) || eventos.length <= 1) return null;
  const indice = eventos.findIndex(e => Number(e.evento_externo_id) === Number(value));
  const anteriores = indice > 0 ? eventos.slice(0, indice) : [];

  return (
    <div style={{ border: '1px solid #f0c36d', background: '#fff8e6', borderRadius: '8px', padding: '12px 14px', margin: '10px 0' }}>
      <div style={{ fontWeight: 600, marginBottom: '4px', color: '#8a6d1f' }}>
        Há {eventos.length} compras deste medicamento aguardando. Qual o paciente está usando agora?
      </div>
      <div style={{ fontSize: '0.82rem', color: '#7a6a3a', marginBottom: '8px' }}>
        A mais antiga vem marcada. Se a caixa dela já foi consumida, escolha a mais recente — as anteriores serão registradas como já utilizadas (sem ciclo de monitoramento).
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {eventos.map(evento => {
          const dias = diasDesde(evento.data_administracao_prevista || evento.data_entrega);
          return (
            <label key={evento.evento_externo_id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="radio"
                checked={Number(value) === Number(evento.evento_externo_id)}
                onChange={() => { onChange(evento); if (onChangeConfirmado) onChangeConfirmado(false); }}
              />
              <span>
                <strong>#{evento.evento_externo_id}</strong> — {evento.qtd_caixas || 1} cx, entrega {formatar(evento.data_entrega)}, previsão de uso {formatar(evento.data_administracao_prevista)}
                {dias !== null && <span style={{ color: '#888' }}> ({dias >= 0 ? `há ${dias} dias` : `em ${-dias} dias`})</span>}
              </span>
            </label>
          );
        })}
      </div>
      {anteriores.length > 0 && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '10px', padding: '8px 10px', background: '#fdecea', border: '1px solid #f5b7b1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', color: '#922b21' }}>
          <input type="checkbox" checked={!!confirmado} onChange={(e) => onChangeConfirmado && onChangeConfirmado(e.target.checked)} style={{ marginTop: '2px' }} />
          <span>
            Confirmo que o paciente já utilizou a(s) compra(s) {anteriores.map(e => `#${e.evento_externo_id}`).join(', ')} — ela(s) será(ão) marcada(s) como processada(s) e não será(ão) mais oferecida(s). <strong>Obrigatório para continuar.</strong>
          </span>
        </label>
      )}
    </div>
  );
}
