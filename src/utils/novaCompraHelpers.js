// Helpers compartilhados pelos modais de Telemonitoramento (individual e em
// conjunto) pra decisão sobre a compra que o sistema oferece no contato:
// aplicar, trocar a compra selecionada (paciente já está na mais recente) ou
// não aplicar com motivo. As chaves de motivo precisam bater com
// MOTIVOS_NAO_APLICAR_COMPRA em backend/src/app/controllers/MonitoramentoMedicamentoController.js.
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
