// Helpers compartilhados pelos modais de Telemonitoramento (individual e em
// conjunto) pra decisão sobre a compra que o sistema oferece no contato:
// aplicar, trocar a compra selecionada (paciente já está na mais recente) ou
// não aplicar com motivo. As chaves de motivo precisam bater com
// MOTIVOS_NAO_APLICAR_COMPRA em backend/src/app/controllers/MonitoramentoMedicamentoController.js.
// 👇 PADRÃO DA NOVA CAIXA: padrão de posologia (diário/cíclico/intervalo/
// personalizado) do ciclo novo criado ao aplicar uma compra. Mesma linha →
// campos *_nova_caixa; medicamento novo (conjunto/substituição) → os campos
// que o back já aceitava pro medicamento novo.
export const padraoDoCiclo = (ciclo) => ({
  tipo_posologia: ciclo?.tipo_posologia || 'diaria',
  posologia_ciclo_dias_toma: ciclo?.posologia_ciclo_dias_toma ?? null,
  posologia_ciclo_dias_pausa: ciclo?.posologia_ciclo_dias_pausa ?? null,
  posologia_intervalo_dias: ciclo?.posologia_intervalo_dias ?? null,
  posologia_datas_personalizadas: ciclo?.posologia_datas_personalizadas ?? null
});

export const montarCamposPadraoNovaCaixa = (padrao, mudouMedicamento) => {
  const p = padrao || { tipo_posologia: 'diaria' };
  const tipo = p.tipo_posologia || 'diaria';
  if (mudouMedicamento) {
    return {
      tipo_posologia_novo_medicamento: tipo,
      parametros_posologia_novo_medicamento: {
        posologia_ciclo_dias_toma: p.posologia_ciclo_dias_toma || null,
        posologia_ciclo_dias_pausa: p.posologia_ciclo_dias_pausa ?? null,
        posologia_intervalo_dias: p.posologia_intervalo_dias || null,
        posologia_datas_personalizadas: p.posologia_datas_personalizadas || null
      }
    };
  }
  return {
    tipo_posologia_nova_caixa: tipo,
    posologia_ciclo_dias_toma_nova_caixa: p.posologia_ciclo_dias_toma || null,
    posologia_ciclo_dias_pausa_nova_caixa: p.posologia_ciclo_dias_pausa ?? null,
    posologia_intervalo_dias_nova_caixa: p.posologia_intervalo_dias || null,
    posologia_datas_personalizadas_nova_caixa: p.posologia_datas_personalizadas || null
  };
};

export const validarPadraoPosologia = (padrao) => {
  const tipo = padrao?.tipo_posologia || 'diaria';
  if (tipo === 'ciclica' && (!padrao?.posologia_ciclo_dias_toma || padrao?.posologia_ciclo_dias_pausa == null)) return 'Complete o padrão de ciclo (dias de toma e de pausa) da nova caixa.';
  if (tipo === 'intervalo' && !padrao?.posologia_intervalo_dias) return 'Informe a cada quantos dias a nova caixa é tomada.';
  if (tipo === 'personalizada' && (!padrao?.posologia_datas_personalizadas || padrao.posologia_datas_personalizadas.length === 0)) return 'Marque as datas da nova caixa no calendário.';
  return null;
};

export const MOTIVOS_NAO_APLICAR_COMPRA = {
  PACIENTE_NAO_RECEBEU: 'Paciente ainda não recebeu / não iniciou esta compra',
  AINDA_NA_CAIXA_ANTERIOR: 'Paciente ainda está usando a caixa anterior (aplicar no próximo contato)',
  DADOS_DIVERGENTES: 'Dados da compra divergem do que o paciente informou',
  COMPRA_NAO_PERTENCE: 'Compra não corresponde a este tratamento',
  OUTRO: 'Outro (descrever)'
};

export const MOTIVO_NAO_APLICAR_VAZIO = { motivo: '', texto: '' };

// Troca a compra selecionada mantendo a lista de pendentes (que só serve pra
// tela) e marcando que a escolha foi deliberada do operador.
export function selecionarEventoNovaCompra(dadosAtuais, eventoEscolhido) {
  return {
    ...(dadosAtuais || {}),
    ...eventoEscolhido,
    selecionado_pelo_operador: true,
    eventos_pendentes: dadosAtuais?.eventos_pendentes || []
  };
}

// Regras de tela antes de enviar — espelham as do backend. Devolve a mensagem
// de erro ou null.
export function validarDecisaoNovaCompra({ dadosNovaCompra, aplicarNovaCompra, descontinuarMedicamento, confirmouConsumoAnteriores, motivoNaoAplicar }) {
  if (!dadosNovaCompra) return null;
  if (aplicarNovaCompra) {
    if ((dadosNovaCompra.eventos_anteriores?.length || 0) > 0 && !confirmouConsumoAnteriores) {
      return 'Confirme que o paciente já utilizou as compras anteriores antes de aplicar a mais recente.';
    }
    return null;
  }
  if (descontinuarMedicamento) return null;
  if (!motivoNaoAplicar?.motivo) return 'Informe o motivo para não aplicar a compra oferecida neste contato.';
  if (motivoNaoAplicar.motivo === 'OUTRO' && !(motivoNaoAplicar.texto || '').trim()) return 'Descreva o motivo para não aplicar a compra oferecida.';
  return null;
}

// Campos extras do payload de registro de contato (individual e em conjunto):
// confirmação do consumo das compras anteriores, compra oferecida e motivo.
export function montarCamposDecisaoNovaCompra({ dadosNovaCompra, aplicarNovaCompra, confirmouConsumoAnteriores, motivoNaoAplicar }) {
  const oferecida = dadosNovaCompra?.evento_externo_id || null;
  const naoAplicou = !aplicarNovaCompra && !!oferecida;
  return {
    confirmar_consumo_eventos_anteriores: !!(aplicarNovaCompra && confirmouConsumoAnteriores),
    compra_oferecida_evento_id: naoAplicou ? oferecida : null,
    motivo_nao_aplicar_compra: naoAplicou ? (motivoNaoAplicar?.motivo || null) : null,
    motivo_nao_aplicar_compra_texto: naoAplicou ? ((motivoNaoAplicar?.texto || '').trim() || null) : null
  };
}

// O payload envia só o evento escolhido — a lista de pendentes é grande e só
// serve pra tela (JSON.stringify descarta undefined).
export function limparDadosNovaCompraParaEnvio(dadosNovaCompra) {
  if (!dadosNovaCompra) return null;
  return { ...dadosNovaCompra, eventos_pendentes: undefined };
}
