import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

const INTERVALO_RENOVACAO_MS = 5 * 60 * 1000; // renova a reserva a cada 5 min enquanto o modal estiver aberto

export default function useReservaEdicaoPaciente(pacienteId, ativo) {
  const [bloqueio, setBloqueio] = useState(null); // { usuario, iniciado_em } | null
  const intervaloRef = useRef(null);

  const liberar = useCallback(() => {
    if (!pacienteId) return;
    api.delete(`/monitoramento-medicamentos/paciente/${pacienteId}/reserva-edicao`).catch(() => {});
  }, [pacienteId]);

  useEffect(() => {
    if (!ativo || !pacienteId) return;
    let isMounted = true;

    const tentarReservar = () => {
      api.post(`/monitoramento-medicamentos/paciente/${pacienteId}/reserva-edicao`)
        .then(() => { if (isMounted) setBloqueio(null); })
        .catch(err => {
          if (isMounted && err.response?.status === 409) setBloqueio(err.response.data);
        });
    };

    tentarReservar();
    intervaloRef.current = setInterval(tentarReservar, INTERVALO_RENOVACAO_MS);

    return () => {
      isMounted = false;
      clearInterval(intervaloRef.current);
      liberar();
    };
  }, [ativo, pacienteId, liberar]);

  return { bloqueio, liberar };
}