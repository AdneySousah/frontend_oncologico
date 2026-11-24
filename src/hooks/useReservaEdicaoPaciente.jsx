import { useState, useEffect, useRef, useCallback } from 'react';
import api, { lerUsuarioSalvo } from '../services/api';

const INTERVALO_RENOVACAO_MS = 5 * 60 * 1000; // renova a reserva a cada 5 min enquanto o modal estiver aberto

const urlReserva = (pacienteId) => `/monitoramento-medicamentos/paciente/${pacienteId}/reserva-edicao`;

export default function useReservaEdicaoPaciente(pacienteId, ativo) {
  // Guarda de qual paciente é o bloqueio: trocou de paciente ou fechou o modal,
  // o bloqueio antigo deixa de valer na hora (sem setState dentro do effect).
  const [estadoBloqueio, setEstadoBloqueio] = useState({ pacienteId: null, dados: null }); // dados: { usuario, iniciado_em } | null
  const bloqueio = (ativo && pacienteId && estadoBloqueio.pacienteId === pacienteId) ? estadoBloqueio.dados : null;
  const intervaloRef = useRef(null);

  const liberar = useCallback(() => {
    if (!pacienteId) return;
    api.delete(urlReserva(pacienteId)).catch(() => {});
  }, [pacienteId]);

  useEffect(() => {
    if (!ativo || !pacienteId) return;
    let isMounted = true;

    const tentarReservar = () => {
      api.post(urlReserva(pacienteId))
        .then(() => { if (isMounted) setEstadoBloqueio({ pacienteId, dados: null }); })
        .catch(err => {
          if (isMounted && err.response?.status === 409) setEstadoBloqueio({ pacienteId, dados: err.response.data });
        });
    };

    // Fechar/sair da aba não desmonta o React: libera a reserva aqui para não
    // travar o paciente por 20 min. sendBeacon não manda header Authorization,
    // por isso fetch com keepalive (a requisição sobrevive ao fechamento da página).
    const liberarAoSairDaPagina = () => {
      const token = lerUsuarioSalvo()?.token;
      if (!token) return;
      try {
        fetch(api.getUri({ url: urlReserva(pacienteId) }), {
          method: 'DELETE',
          keepalive: true,
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      } catch {
        // navegador sem suporte: a reserva expira sozinha
      }
    };

    // Voltou para a página pelo cache do navegador (botão "voltar"): reserva de novo.
    const aoVoltarParaPagina = (event) => {
      if (event.persisted) tentarReservar();
    };

    tentarReservar();
    intervaloRef.current = setInterval(tentarReservar, INTERVALO_RENOVACAO_MS);
    window.addEventListener('pagehide', liberarAoSairDaPagina);
    window.addEventListener('pageshow', aoVoltarParaPagina);

    return () => {
      isMounted = false;
      clearInterval(intervaloRef.current);
      window.removeEventListener('pagehide', liberarAoSairDaPagina);
      window.removeEventListener('pageshow', aoVoltarParaPagina);
      liberar();
      // Ao reabrir o mesmo paciente não pode aparecer o bloqueio da vez anterior.
      setEstadoBloqueio({ pacienteId: null, dados: null });
    };
  }, [ativo, pacienteId, liberar]);

  return { bloqueio, liberar };
}
