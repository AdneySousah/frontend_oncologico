import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { LuCircleCheck } from 'react-icons/lu';
import api from '../services/api';

// Componente reutilizável: escolher um padrão de posologia (diária, cíclica
// toma/pausa, a cada X dias, ou datas personalizadas) e ver um calendário de
// confirmação antes de salvar. Usado em 3 lugares: configuração inicial
// (Necessidade de Navegação), Recálculo, e Registrar Contato
// (Telemonitoramento, quando a posologia muda no meio do ciclo).
//
// Props:
//   dataInicio: string 'AAAA-MM-DD' — data de referência pra gerar a prévia
//   value: { tipo_posologia, posologia_ciclo_dias_toma, posologia_ciclo_dias_pausa, posologia_intervalo_dias, posologia_datas_personalizadas }
//   onChange: (novoValue) => void
export default function SeletorPosologia({ dataInicio, value, onChange }) {
  const theme = useTheme();
  const [preview, setPreview] = useState([]);
  const [carregandoPreview, setCarregandoPreview] = useState(false);

  const tipo = value.tipo_posologia || 'diaria';

  const atualizar = (campos) => {
    onChange({ ...value, ...campos });
  };

  const buscarPreview = useCallback(async () => {
    if (!dataInicio) return;
    try {
      setCarregandoPreview(true);
      const res = await api.post('/monitoramento-medicamentos/preview-posologia', {
        data_inicio: dataInicio,
        tipo_posologia: tipo,
        posologia_ciclo_dias_toma: value.posologia_ciclo_dias_toma,
        posologia_ciclo_dias_pausa: value.posologia_ciclo_dias_pausa,
        posologia_intervalo_dias: value.posologia_intervalo_dias,
        posologia_datas_personalizadas: value.posologia_datas_personalizadas,
        num_dias: 35
      });
      setPreview(res.data.dias);
    } catch {
      setPreview([]);
    } finally {
      setCarregandoPreview(false);
    }
  }, [dataInicio, tipo, value.posologia_ciclo_dias_toma, value.posologia_ciclo_dias_pausa, value.posologia_intervalo_dias, value.posologia_datas_personalizadas]);

  useEffect(() => { buscarPreview(); }, [buscarPreview]);

  const toggleDataPersonalizada = (dataIso) => {
    const atuais = value.posologia_datas_personalizadas || [];
    const jaMarcada = atuais.includes(dataIso);
    const novasDatas = jaMarcada ? atuais.filter(d => d !== dataIso) : [...atuais, dataIso];
    atualizar({ posologia_datas_personalizadas: novasDatas });
  };

  const tipos = [
    { key: 'diaria', label: 'Diária' },
    { key: 'ciclica', label: 'Cíclica (toma/pausa)' },
    { key: 'intervalo', label: 'A cada X dias' },
    { key: 'personalizada', label: 'Personalizada' },
  ];

  const formatarDiaCalendario = (isoStr) => {
    const [, m, d] = isoStr.split('-');
    return `${d}/${m}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: theme.colors?.text }}>
          Padrão de posologia
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {tipos.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => atualizar({ tipo_posologia: t.key })}
              style={{
                padding: '8px 10px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
                border: `1px solid ${tipo === t.key ? (theme.colors?.primary || '#337ab7') : (theme.colors?.border || '#ddd')}`,
                background: tipo === t.key ? `${theme.colors?.primary || '#337ab7'}18` : 'transparent',
                color: tipo === t.key ? (theme.colors?.primary || '#337ab7') : (theme.colors?.text || '#333'),
                fontWeight: tipo === t.key ? 700 : 400
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tipo === 'ciclica' && (
        <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.85rem', color: theme.colors?.text }}>
            Toma por{' '}
            <input
              type="number" min="1" style={{ width: '56px' }}
              value={value.posologia_ciclo_dias_toma || ''}
              onChange={(e) => atualizar({ posologia_ciclo_dias_toma: Number(e.target.value) || null })}
            /> dia(s)
          </label>
          <label style={{ fontSize: '0.85rem', color: theme.colors?.text }}>
            Pausa por{' '}
            <input
              type="number" min="0" style={{ width: '56px' }}
              value={value.posologia_ciclo_dias_pausa ?? ''}
              onChange={(e) => atualizar({ posologia_ciclo_dias_pausa: Number(e.target.value) || 0 })}
            /> dia(s)
          </label>
        </div>
      )}

      {tipo === 'intervalo' && (
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '0.85rem', color: theme.colors?.text }}>
            Toma 1 vez a cada{' '}
            <input
              type="number" min="1" style={{ width: '56px' }}
              value={value.posologia_intervalo_dias || ''}
              onChange={(e) => atualizar({ posologia_intervalo_dias: Number(e.target.value) || null })}
            /> dia(s)
          </label>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: '4px 0 0 0' }}>
            Pra 1x por mês, use 30. Pra uma dose única marcada no calendário, use "Personalizada" e marque só o dia.
          </p>
        </div>
      )}

      {tipo === 'personalizada' && (
        <p style={{ fontSize: '0.8rem', opacity: 0.75, marginBottom: '10px' }}>
          Clique nos dias do calendário abaixo pra marcar quando o paciente toma. Não repete sozinho — é só pras datas marcadas.
        </p>
      )}

      <div style={{ background: theme.colors?.background || '#f8f9fa', borderRadius: '10px', padding: '14px', border: `1px solid ${theme.colors?.border || '#ddd'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: theme.colors?.textLight || '#888', fontWeight: 700, textTransform: 'uppercase' }}>
            Prévia — próximos 35 dias
          </span>
          <span style={{ fontSize: '0.7rem', color: theme.colors?.textLight || '#888' }}>
            <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', background: '#52c41a', marginRight: '4px' }} /> toma
            <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', background: theme.colors?.border || '#ddd', marginLeft: '10px', marginRight: '4px' }} /> pausa
          </span>
        </div>
        {carregandoPreview ? (
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Calculando...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {preview.map((d) => (
              <div
                key={d.data}
                onClick={() => tipo === 'personalizada' && toggleDataPersonalizada(d.data)}
                style={{
                  textAlign: 'center', fontSize: '0.68rem', padding: '6px 2px', borderRadius: '5px',
                  cursor: tipo === 'personalizada' ? 'pointer' : 'default',
                  background: d.toma ? 'rgba(82,196,26,0.18)' : 'transparent',
                  color: d.toma ? '#2c7a0f' : (theme.colors?.textLight || '#999'),
                  border: `1px solid ${d.toma ? 'rgba(82,196,26,0.4)' : theme.colors?.border || '#eee'}`
                }}
              >
                {formatarDiaCalendario(d.data)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.78rem', color: theme.colors?.textLight || '#888' }}>
        <LuCircleCheck size={14} />
        Confira o calendário acima antes de salvar — é exatamente esse padrão que vai valer pra esse medicamento.
      </div>
    </div>
  );
}
