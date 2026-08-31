import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { ModalOverlay, ModalContent, ButtonGroup, Button } from './styles';

export default function AssistenteCalculoModal({ onClose, onUsarData }) {
  const [mensagens, setMensagens] = useState([
    { autor: 'ia', texto: 'Me conta a quantidade de comprimidos, a data de início e quantos por dia, que eu calculo pra você. Ex: "60 comprimidos, comecei dia 22/07, tomo 1 por dia, quando termina?"' }
  ]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [historico, setHistorico] = useState([]);
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
        historico: historico.slice(-6)
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
      <ModalContent style={{ maxWidth: '480px', margin: 'auto', display: 'flex', flexDirection: 'column', height: '520px' }}>
        <h3 style={{ marginBottom: '10px' }}>🧮 Calculadora de datas</h3>
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
            placeholder="Ex: 60 comprimidos, comecei 22/07, 1 por dia, quando termina?"
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