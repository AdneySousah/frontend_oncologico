import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, ButtonGroup, Button } from './styles';

export default function AssistenteCalculoModal({ onClose, onUsarData }) {
  const [mensagens, setMensagens] = useState([
    { autor: 'ia', texto: 'Me conta quantos comprimidos ainda restam, quantos tem a caixa e quantos ela toma por dia, que eu calculo quando ela começou a tomar. Ex: "tem 61 comprimidos, caixa de 90, toma 1 por dia, quando ela começou?"\n\nSe você já souber a data de início e quiser saber quando termina, também calculo — só me falar a data, a quantidade e a posologia.' }
  ]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  // MUDE PRA ESSE
  const [historico, setHistorico] = useState([]);
  const [dataReferencia, setDataReferencia] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  });
  const fimDaListaRef = useRef(null);

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = async () => {
    const pergunta = texto.trim();
    if (!pergunta || enviando) return;
    setMensagens(prev => [...prev, { autor: 'usuario', texto: pergunta }]);
    setTexto('');
    setEnviando(true);
    try {
      const response = await api.post('/assistente-calculo', {
        mensagem: pergunta,
        historico: historico.slice(-6),
        data_referencia: dataReferencia // 👈 data em que o tele foi realizado — o cálculo deve contar a partir DAQUI, nunca da data atual do servidor
      });
      const { resposta, data_resultante } = response.data;
      setMensagens(prev => [...prev, { autor: 'ia', texto: resposta, dataResultante: data_resultante }]);
      setHistorico(prev => [...prev, { pergunta, resposta }]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao calcular.');
      setMensagens(prev => [...prev, { autor: 'ia', texto: 'Tive um problema pra calcular isso, tenta de novo?' }]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalOverlay style={{ zIndex: 1100 }}>
      <ModalContent style={{ maxWidth: '680px', margin: 'auto', display: 'flex', flexDirection: 'column', height: '520px' }}>

        <h3 style={{ marginBottom: '10px' }}>🧮 Calculadora de datas</h3>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            Data em que o tele foi realizado:
            <input
              type="date"
              value={dataReferencia}
              onChange={(e) => setDataReferencia(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.2)' }}
            />
          </label>
          <span style={{ opacity: 0.7 }}>Se o contato foi feito em outro dia (ex: sexta passada), ajuste aqui — o cálculo usa esta data, não a data de hoje.</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px' }}>
          {mensagens.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.autor === 'usuario' ? 'flex-end' : 'flex-start',
                backgroundColor: m.autor === 'usuario' ? '#8a2be2' : 'rgba(0,0,0,0.06)',
                color: m.autor === 'usuario' ? '#fff' : 'inherit',
                padding: '8px 12px',
                borderRadius: '10px',
                maxWidth: '85%',
                fontSize: '0.9rem'
              }}
            >
              <div>{m.texto}</div>
              {m.dataResultante && (
                <button
                  type="button"
                  onClick={() => onUsarData(m.dataResultante)}
                  style={{ marginTop: '6px', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', backgroundColor: '#fff', color: '#8a2be2', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                  Usar essa data
                </button>
              )}
            </div>
          ))}
          {enviando && (
            <div style={{ alignSelf: 'flex-start', fontSize: '0.85rem', opacity: 0.6 }}>Calculando...</div>
          )}
          <div ref={fimDaListaRef} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); enviar(); } }}

            placeholder="Ex: 61 comprimidos, caixa de 90, toma 1 por dia, quando começou?"
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)' }}
            disabled={enviando}
          />
          <Button type="button" onClick={enviar} disabled={enviando || !texto.trim()}>
            Enviar
          </Button>
        </div>
        <ButtonGroup style={{ marginTop: '10px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}