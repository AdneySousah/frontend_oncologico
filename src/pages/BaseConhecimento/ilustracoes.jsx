import React from 'react';
import { LuCircleCheck, LuClock, LuTriangleAlert } from 'react-icons/lu';

// Mini-recriações ilustrativas de cada tela real do sistema, construídas
// com as MESMAS cores, formas e componentes visuais dos styles.js/index.jsx
// reais de cada página (não são screenshots — não temos como capturar a
// tela rodando de verdade — mas usam exatamente os tokens visuais reais:
// cores do theme.js, formato dos badges, cards e tabelas tal como são
// definidos no código de cada tela). Dado sempre fictício/ilustrativo.

const wrapStyle = {
  border: '1px solid var(--ilu-border, #ddd)',
  borderRadius: '10px',
  overflow: 'hidden',
  marginTop: '6px'
};

const Frame = ({ children, theme, label }) => (
  <div style={{ ...wrapStyle, background: theme.colors.background, borderColor: theme.colors.border }}>
    <div style={{
      padding: '6px 14px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.04em', color: theme.colors.textLight, background: theme.colors.surface,
      borderBottom: `1px solid ${theme.colors.border}`
    }}>
      {label}
    </div>
    <div style={{ padding: '18px' }}>{children}</div>
  </div>
);

export function IlustracaoDashboard({ theme }) {
  const cards = [
    { titulo: 'Termos', valor: '84%', sub: '312 aceitos de 371', cor: '#5cb85c' },
    { titulo: 'Aderência', valor: '76%', sub: 'completamente aderente', cor: '#337ab7' },
    { titulo: 'NPS', valor: '9.1', sub: '↑ score 72', cor: '#5bc0de' },
  ];
  return (
    <Frame theme={theme} label="Dashboard — período: 01/09 a 30/09">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: theme.colors.surface, borderRadius: '10px', padding: '14px',
            border: `1px solid ${theme.colors.border}`, boxShadow: '0 3px 10px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', paddingBottom: '8px',
              borderBottom: `1px solid ${theme.colors.border}`, marginBottom: '10px'
            }}>
              <strong style={{ fontSize: '0.8rem', color: theme.colors.text }}>{c.titulo}</strong>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: c.cor }}>{c.valor}</div>
            <div style={{ fontSize: '0.72rem', color: theme.colors.textLight, marginTop: '2px' }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function IlustracaoNecessidadeNavegacao({ theme }) {
  const linhas = [
    { nome: 'Maria S. Costa', status: 'Aceito', cor: '#52c41a', bg: 'rgba(0,168,84,0.15)' },
    { nome: 'João P. Alves', status: 'Pendente', cor: '#faad14', bg: 'rgba(250,173,20,0.15)' },
    { nome: 'Ana R. Lima', status: 'Recusado', cor: '#f5222d', bg: 'rgba(245,34,45,0.15)' },
  ];
  return (
    <Frame theme={theme} label="Necessidade de Navegação">
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
        {[['Pendente', '#faad14', 12], ['Aceito', '#52c41a', 84], ['Recusado', '#f5222d', 5]].map(([lbl, cor, n], i) => (
          <div key={i} style={{
            width: '58px', height: '58px', borderRadius: '50%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', border: `2px solid ${cor}`, background: theme.colors.surface
          }}>
            <strong style={{ fontSize: '0.95rem', color: theme.colors.text }}>{n}</strong>
            <span style={{ fontSize: '0.55rem', color: theme.colors.textLight }}>{lbl}</span>
          </div>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
              <td style={{ padding: '8px 4px', color: theme.colors.text }}>{l.nome}</td>
              <td style={{ padding: '8px 4px' }}>
                <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 700, background: l.bg, color: l.cor }}>
                  {l.status}
                </span>
              </td>
              <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                <span style={{ padding: '5px 12px', borderRadius: '6px', background: theme.colors.primary, color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                  {l.status === 'Aceito' ? 'Avaliar' : 'Termo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}

export function IlustracaoTelemonitoramento({ theme }) {
  return (
    <Frame theme={theme} label="Telemonitoramento — pendências">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: theme.colors.textLight, fontSize: '0.68rem', textTransform: 'uppercase' }}>
            <th style={{ paddingBottom: '8px' }}>Paciente</th>
            <th>Medicamento</th>
            <th>Adesão</th>
            <th>Próximo contato</th>
          </tr>
        </thead>
        <tbody>
          {[
            { nome: 'Carla M. Souza', med: 'Abemaciclibe 150mg', ades: 'Completamente', cor: '#52c41a', data: '05/09' },
            { nome: 'Pedro H. Reis', med: 'Anastrozol 1mg', ades: 'Parcialmente', cor: '#faad14', data: '03/09' },
          ].map((l, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
              <td style={{ padding: '8px 0', color: theme.colors.text, fontWeight: 600 }}>{l.nome}</td>
              <td style={{ color: theme.colors.textLight }}>{l.med}</td>
              <td>
                <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 700, background: `${l.cor}25`, color: l.cor }}>
                  {l.ades}
                </span>
              </td>
              <td style={{ color: theme.colors.text }}>{l.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}

export function IlustracaoLinhaDoTempo({ theme }) {
  const eventos = [
    { titulo: 'Termo aceito', data: '12/07', cor: '#5cb85c' },
    { titulo: 'Ciclo iniciado — Abemaciclibe', data: '18/07', cor: '#337ab7' },
    { titulo: 'Medicamento descontinuado', data: '02/09', cor: '#d9534f', desc: true },
  ];
  return (
    <Frame theme={theme} label="Linha do Tempo do paciente">
      <div style={{ position: 'relative', paddingLeft: '22px' }}>
        <div style={{ position: 'absolute', left: '7px', top: '6px', bottom: '6px', width: '2px', background: theme.colors.border }} />
        {eventos.map((e, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: '14px' }}>
            <div style={{
              position: 'absolute', left: '-22px', top: '4px', width: '14px', height: '14px', borderRadius: '50%',
              background: e.cor, border: `3px solid ${theme.colors.surface}`, boxShadow: `0 0 0 2px ${e.cor}40`
            }} />
            <div style={{
              background: e.desc ? 'rgba(229,57,53,0.1)' : theme.colors.surface,
              border: `1px solid ${e.desc ? 'rgba(229,57,53,0.4)' : theme.colors.border}`,
              borderRadius: '8px', padding: '8px 12px'
            }}>
              <strong style={{ fontSize: '0.82rem', color: e.desc ? '#c0392b' : theme.colors.text, display: 'block' }}>{e.titulo}</strong>
              <span style={{ fontSize: '0.7rem', color: theme.colors.textLight }}>{e.data}</span>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function IlustracaoRecalculo({ theme }) {
  return (
    <Frame theme={theme} label="Recálculo — corrigir posologia">
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 0', color: theme.colors.text, fontWeight: 600 }}>Bruna Rodrigues</td>
              </tr>
              <tr>
                <td style={{ color: theme.colors.textLight }}>Aspirina 500MG — 1 cp/dia</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{
          background: theme.colors.surface, border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px', padding: '12px', minWidth: '180px'
        }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: theme.colors.textLight, display: 'block', marginBottom: '4px' }}>
            POSOLOGIA (cp/dia)
          </label>
          <div style={{ background: theme.colors.inputBg, border: `1px solid ${theme.colors.border}`, borderRadius: '5px', padding: '5px 8px', fontSize: '0.8rem', marginBottom: '8px', color: theme.colors.text }}>2</div>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: theme.colors.textLight, display: 'block', marginBottom: '4px' }}>
            DATA DE INÍCIO
          </label>
          <div style={{ background: theme.colors.inputBg, border: `1px solid ${theme.colors.border}`, borderRadius: '5px', padding: '5px 8px', fontSize: '0.8rem', color: theme.colors.text }}>05/09/2026</div>
        </div>
      </div>
    </Frame>
  );
}

export function IlustracaoFaturamento({ theme }) {
  const cards = [
    { label: 'Total do mês', valor: 'R$ 128.430', cor: '#1890ff' },
    { label: 'Pacientes faturados', valor: '47', cor: '#5cb85c' },
  ];
  return (
    <Frame theme={theme} label="Faturamento — resumo do mês">
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: theme.colors.surface, borderLeft: `4px solid ${c.cor}`, borderTop: `1px solid ${theme.colors.border}`,
            borderRight: `1px solid ${theme.colors.border}`, borderBottom: `1px solid ${theme.colors.border}`,
            borderRadius: '8px', padding: '10px 18px', minWidth: '150px'
          }}>
            <p style={{ margin: 0, fontSize: '0.65rem', color: theme.colors.textLight, textTransform: 'uppercase', fontWeight: 700 }}>{c.label}</p>
            <h2 style={{ margin: '4px 0 0 0', color: c.cor, fontSize: '1.2rem' }}>{c.valor}</h2>
          </div>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <tbody>
          <tr style={{ borderTop: `1px solid ${theme.colors.border}` }}>
            <td style={{ padding: '8px 0', color: theme.colors.text }}>Maria S. Costa</td>
            <td style={{ color: theme.colors.textLight }}>Abemaciclibe 150mg</td>
            <td style={{ textAlign: 'right', color: theme.colors.text, fontWeight: 600 }}>R$ 16.311,43</td>
          </tr>
        </tbody>
      </table>
    </Frame>
  );
}

export function IlustracaoAuditoria({ theme }) {
  const linhas = [
    { user: 'Ana Paula', acao: 'Edição', entidade: 'Perfil', cor: '#337ab7' },
    { user: 'Carlos Dias', acao: 'Criação', entidade: 'Usuário', cor: '#5cb85c' },
    { user: 'Sistema', acao: 'Envio', entidade: 'NPS WhatsApp', cor: '#5bc0de' },
  ];
  return (
    <Frame theme={theme} label="Auditoria — registro de ações">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: theme.colors.textLight, fontSize: '0.68rem', textTransform: 'uppercase' }}>
            <th style={{ paddingBottom: '8px' }}>Usuário</th>
            <th>Ação</th>
            <th>Entidade</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
              <td style={{ padding: '8px 0', color: theme.colors.text }}>{l.user}</td>
              <td>
                <span style={{ padding: '3px 9px', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 700, background: `${l.cor}20`, color: l.cor }}>
                  {l.acao}
                </span>
              </td>
              <td style={{ color: theme.colors.textLight }}>{l.entidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}
