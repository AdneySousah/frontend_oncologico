// Formata a posologia de um monitoramento de forma que deixe explícito,
// pra quem está fazendo o atendimento, quando o padrão NÃO é o diário
// simples — sem isso, a tela sempre mostrava "Dose: X/dia" mesmo quando o
// paciente na verdade segue um ciclo de toma/pausa, um intervalo entre
// doses, ou datas personalizadas, escondendo exatamente a informação que
// o atendente precisa pra agir rápido.
export function formatarPadraoPosologia(monitoramento, posologiaAtual) {
  const tipo = monitoramento?.tipo_posologia || 'diaria';
  const dose = posologiaAtual ?? monitoramento?.posologia_diaria;

  if (tipo === 'ciclica') {
    const toma = monitoramento?.posologia_ciclo_dias_toma;
    const pausa = monitoramento?.posologia_ciclo_dias_pausa;
    return `Posologia CÍCLICA: toma ${toma} dia(s), pausa ${pausa} dia(s) (${dose}/dia nos dias de toma)`;
  }
  if (tipo === 'intervalo') {
    const intervalo = monitoramento?.posologia_intervalo_dias;
    return `Posologia A CADA ${intervalo} DIAS (${dose} por dose)`;
  }
  if (tipo === 'personalizada') {
    return `Posologia PERSONALIZADA (datas específicas, ${dose} por dose) — não repete sozinha`;
  }
  return `Dose: ${dose}/dia`;
}
