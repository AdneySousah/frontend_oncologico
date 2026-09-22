import React, { memo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { ChartHeader } from '../styles';
import api from '../../../services/api';

// 👇 NOVO: card independente — não recebe dados do fetch principal do
// Dashboard (que só olha o banco local). Este busca direto no endpoint
// que consulta o sistema externo, e só ele, pra não atrasar o carregamento
// do resto do dashboard caso a consulta externa demore.
const NovosPacientesOperadoraChart = () => {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  useEffect(() => {
    setCarregando(true);
    setErro(null);
    api.get('/dashboard/novos-pacientes-por-operadora', { params: { mes, ano } })
      .then(res => {
        setDados((res.data.porOperadora || []).map(item => ({ name: item.operadora, value: item.quantidade })));
      })
      .catch(err => {
        setErro(err.response?.data?.error || 'Erro ao consultar o sistema externo.');
      })
      .finally(() => setCarregando(false));
  }, [mes, ano]);

  return (
    <>
      <ChartHeader>
        <h3>Novos Pacientes Cadastrados (por Operadora)</h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} style={{ fontSize: '0.8rem', padding: '2px 4px' }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
            ))}
          </select>
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))} style={{ fontSize: '0.8rem', padding: '2px 4px' }}>
            {[hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </ChartHeader>

      {carregando ? (
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>Consultando o sistema externo...</div>
      ) : erro ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>{erro}</div>
      ) : dados.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>Nenhum novo paciente cadastrado neste período.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} stroke="#888" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#888', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            />
            <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={60}>
              <LabelList dataKey="value" position="top" fill="#374151" fontSize={16} fontWeight="900" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default memo(NovosPacientesOperadoraChart);
