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

// Diz se um determinado dia do ciclo (offset em dias a partir do início,
// começando em 0) é dia de "toma" — mesma lógica usada no backend
// (calcularPosologia.js), replicada aqui pro cálculo instantâneo na tela
// (sem precisar de ida e volta ao servidor a cada tecla digitada).
function ehDiaDeTomaLocal(offsetDias, tipoPosologia, monitoramento) {
  if (!tipoPosologia || tipoPosologia === 'diaria') return true;
  if (tipoPosologia === 'ciclica') {
    const toma = Number(monitoramento?.posologia_ciclo_dias_toma) || 1;
    const pausa = Number(monitoramento?.posologia_ciclo_dias_pausa) || 0;
    const ciclo = toma + pausa;
    if (ciclo <= 0) return true;
    return (offsetDias % ciclo) < toma;
  }
  if (tipoPosologia === 'intervalo') {
    const intervalo = Number(monitoramento?.posologia_intervalo_dias) || 1;
    if (intervalo <= 0) return true;
    return (offsetDias % intervalo) === 0;
  }
  return false; // 'personalizada' é tratado à parte, por não seguir um ciclo repetido
}

// 👇 CORREÇÃO DE BUG: o "Estoque Projetado para Hoje" sempre calculava
// `diasPassados * posologia`, como se a posologia fosse sempre "X por
// dia" — isso está certo pro padrão diário, mas é errado pra cíclica,
// intervalo ou personalizada, onde a posologia é "X por DOSE", e doses só
// acontecem em alguns dias específicos, não todo santo dia. Resultado
// real reportado: paciente com "9 a cada 7 dias" aparecia com "~0
// comprimidos" projetados depois de só 1-2 doses reais, porque a conta
// multiplicava 9 por TODOS os dias corridos, não só pelos dias de dose.
//
// @param dataInicioObj - Date (meia-noite local) de quando começou a tomar essa caixa
// @param diasPassados - quantos dias corridos já se passaram desde dataInicioObj até hoje
// @param posologiaPorDose - comprimidos consumidos em cada dose/dia de toma
// @param monitoramento - objeto com tipo_posologia e os campos de padrão
export function contarComprimidosConsumidos(dataInicioObj, diasPassados, posologiaPorDose, monitoramento) {
  if (diasPassados <= 0 || !posologiaPorDose) return 0;
  const tipo = monitoramento?.tipo_posologia || 'diaria';

  if (tipo === 'personalizada') {
    const datas = monitoramento?.posologia_datas_personalizadas || [];
    const fimExclusivo = new Date(dataInicioObj);
    fimExclusivo.setDate(fimExclusivo.getDate() + diasPassados);
    let doses = 0;
    datas.forEach(dStr => {
      const [a, m, d] = dStr.split('-');
      const dataObj = new Date(Number(a), Number(m) - 1, Number(d));
      if (dataObj >= dataInicioObj && dataObj < fimExclusivo) doses++;
    });
    return doses * posologiaPorDose;
  }

  let doses = 0;
  for (let offset = 0; offset < diasPassados; offset++) {
    if (ehDiaDeTomaLocal(offset, tipo, monitoramento)) doses++;
  }
  return doses * posologiaPorDose;
}

