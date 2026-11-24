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

// 👇 NOVO: diz se uma data cai dentro de algum período de pausa (mesma
// lógica do backend, replicada aqui pro cálculo instantâneo na tela).
function estaDentroDePausaLocal(dataObj, periodosPausa) {
  if (!Array.isArray(periodosPausa) || periodosPausa.length === 0) return false;
  return periodosPausa.some(p => {
    if (!p || !p.inicio) return false;
    // 👇 CORREÇÃO: as pausas chegam da API como timestamp ISO
    // ("2026-10-11T03:00:00.000Z"); sem descartar a hora, o dia virava NaN e
    // a pausa era ignorada no estoque projetado.
    const [ai, mi, di] = String(p.inicio).split('T')[0].split('-');
    const inicio = new Date(Number(ai), Number(mi) - 1, Number(di));
    if (dataObj < inicio) return false;
    if (!p.fim) return true;
    const [af, mf, df] = String(p.fim).split('T')[0].split('-');
    const fim = new Date(Number(af), Number(mf) - 1, Number(df));
    return dataObj <= fim;
  });
}

// Pausas do ciclo (histórico + a ativa agora) — espelho de obterPeriodosPausa no backend.
function periodosPausaDe(monitoramento) {
  return [
    ...(Array.isArray(monitoramento?.pausas_historico) ? monitoramento.pausas_historico : []),
    ...(monitoramento?.data_pausa_inicio ? [{ inicio: monitoramento.data_pausa_inicio, fim: null }] : [])
  ];
}

const parseDataLocal = (valor) => {
  const [a, m, d] = String(valor).split('T')[0].split('-');
  return new Date(Number(a), Number(m) - 1, Number(d));
};

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
  const periodosPausa = periodosPausaDe(monitoramento);

  if (tipo === 'personalizada') {
    const datas = monitoramento?.posologia_datas_personalizadas || [];
    const fimExclusivo = new Date(dataInicioObj);
    fimExclusivo.setDate(fimExclusivo.getDate() + diasPassados);
    let doses = 0;
    datas.forEach(dStr => {
      const [a, m, d] = dStr.split('-');
      const dataObj = new Date(Number(a), Number(m) - 1, Number(d));
      if (dataObj >= dataInicioObj && dataObj < fimExclusivo && !estaDentroDePausaLocal(dataObj, periodosPausa)) doses++;
    });
    return doses * posologiaPorDose;
  }

  let doses = 0;
  for (let offset = 0; offset < diasPassados; offset++) {
    const dataDoOffset = new Date(dataInicioObj);
    dataDoOffset.setDate(dataDoOffset.getDate() + offset);
    if (estaDentroDePausaLocal(dataDoOffset, periodosPausa)) continue;
    if (ehDiaDeTomaLocal(offset, tipo, monitoramento)) doses++;
  }
  return doses * posologiaPorDose;
}

const LIMITE_DIAS_SIMULACAO = 3650; // mesma trava de segurança do backend (10 anos)

// Em que data a caixa acaba — espelho de calcularDataFimCaixa em
// backend/src/utils/calcularPosologia.js (mesmo atalho no diário sem pausa e
// mesma simulação dia a dia nos outros padrões), pra prévia da tela bater com o
// que o back grava ao aplicar a compra. Devolve null quando não dá pra calcular.
export function calcularDataFimCaixaLocal(dataInicioObj, totalCapsulas, posologiaPorDose, monitoramento) {
  const total = Number(totalCapsulas) || 0;
  const dose = Number(posologiaPorDose) || 0;
  if (!dataInicioObj || total <= 0 || dose <= 0) return null;
  const tipo = monitoramento?.tipo_posologia || 'diaria';
  const periodosPausa = periodosPausaDe(monitoramento);

  if (tipo === 'personalizada') {
    const datas = (monitoramento?.posologia_datas_personalizadas || [])
      .map(parseDataLocal)
      .filter(d => d >= dataInicioObj && !estaDentroDePausaLocal(d, periodosPausa))
      .sort((a, b) => a - b);
    let restante = total;
    for (const d of datas) {
      restante -= dose;
      if (restante <= 0) return d;
    }
    return datas.length > 0 ? datas[datas.length - 1] : null;
  }

  if (tipo === 'diaria' && periodosPausa.length === 0) {
    const fim = new Date(dataInicioObj);
    fim.setDate(fim.getDate() + Math.floor(total / dose));
    return fim;
  }

  let restante = total;
  for (let offset = 0; offset < LIMITE_DIAS_SIMULACAO; offset++) {
    const dia = new Date(dataInicioObj);
    dia.setDate(dia.getDate() + offset);
    if (estaDentroDePausaLocal(dia, periodosPausa)) continue;
    if (ehDiaDeTomaLocal(offset, tipo, monitoramento)) {
      restante -= dose;
      if (restante <= 0) return dia;
    }
  }
  return null;
}

// 👇 NOVO: primeiro dia de dose que o estoque de hoje NÃO cobre — base do aviso
// "dias sem medicação" ao aplicar uma compra nova. Antes a conta era
// hoje + estoque ÷ dose, como se o paciente tomasse todo dia (em "9 a cada 7
// dias" o estoque parecia acabar em poucos dias). No diário dá o mesmo
// resultado de antes. Em cíclica/intervalo mantém a FASE do ciclo a partir da
// âncora (início da caixa), igual a calcularDataFimPorRestante no backend.
// @param ancoraObj - Date do início da caixa atual (data_administracao/entrega)
// @param restanteHoje - comprimidos que o paciente tem hoje
// @returns Date, ou null quando não dá pra saber (ex.: personalizada sem datas suficientes)
export function calcularPrimeiroDiaSemCobertura(ancoraObj, restanteHoje, posologiaPorDose, monitoramento, hoje = new Date()) {
  const dose = Number(posologiaPorDose) || 0;
  if (dose <= 0) return null;
  const tipo = monitoramento?.tipo_posologia || 'diaria';
  const periodosPausa = periodosPausaDe(monitoramento);
  const dia = new Date(hoje);
  dia.setHours(0, 0, 0, 0);

  let inicio = dia;
  let disponivel = Math.max(0, Number(restanteHoje) || 0);
  if (ancoraObj && ancoraObj > dia) {
    inicio = ancoraObj; // a caixa ainda não começou: conta a partir do início dela
  } else if (ancoraObj && (tipo === 'ciclica' || tipo === 'intervalo')) {
    const diasPassados = Math.floor((dia - ancoraObj) / (1000 * 60 * 60 * 24));
    disponivel += contarComprimidosConsumidos(ancoraObj, diasPassados, dose, monitoramento);
    inicio = ancoraObj;
  }

  if (tipo === 'personalizada') {
    const datas = (monitoramento?.posologia_datas_personalizadas || [])
      .map(parseDataLocal)
      .filter(d => d >= inicio && !estaDentroDePausaLocal(d, periodosPausa))
      .sort((a, b) => a - b);
    for (const d of datas) {
      if (disponivel < dose) return d;
      disponivel -= dose;
    }
    return null;
  }

  for (let offset = 0; offset < LIMITE_DIAS_SIMULACAO; offset++) {
    const d = new Date(inicio);
    d.setDate(d.getDate() + offset);
    if (estaDentroDePausaLocal(d, periodosPausa)) continue;
    if (ehDiaDeTomaLocal(offset, tipo, monitoramento)) {
      if (disponivel < dose) return d;
      disponivel -= dose;
    }
  }
  return null;
}
