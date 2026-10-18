// Estado e regras do bloco "parou de tomar em X → com essa data o paciente
// deve ter Y comprimidos → confirma? (Sim/Não + quantidade real)", usado na
// pausa temporária e na descontinuação do medicamento. As chaves do payload
// precisam bater com resolverRestanteNaParada no MonitoramentoMedicamentoController.
export const ESTADO_RESTANTE_VAZIO = { dataParada: '', confirmado: null, qtdInformada: '', projecao: null };

// Devolve a mensagem de erro ou null.
export function validarRestante(estado, rotulo = 'o medicamento') {
  if (!estado?.dataParada) return `Informe a data em que o paciente parou de tomar ${rotulo}.`;
  if (!estado.projecao) return 'Aguarde o cálculo dos comprimidos restantes antes de continuar.';
  if (estado.confirmado === null || estado.confirmado === undefined) return 'Confirme com o paciente se ele tem a quantidade de comprimidos projetada.';
  if (estado.confirmado === false) {
    const qtd = Number(estado.qtdInformada);
    if (estado.qtdInformada === '' || isNaN(qtd) || qtd < 0) return 'Informe quantos comprimidos o paciente tem na caixa.';
  }
  return null;
}

// Campos do PATCH /pausar
export function montarCamposRestantePausa(estado) {
  return {
    data_parada: estado.dataParada || null,
    qtd_restante_confirmada: estado.confirmado === true,
    qtd_restante_informada: estado.confirmado === false ? Number(estado.qtdInformada) : (estado.projecao?.qtd_restante_projetada ?? null)
  };
}

// Campos do registro de contato com descontinuação (PUT individual e conjunto)
export function montarCamposDescontinuacao(estado) {
  return {
    data_descontinuacao: estado.dataParada || null,
    qtd_restante_confirmada: estado.confirmado === true,
    qtd_restante_informada: estado.confirmado === false ? Number(estado.qtdInformada) : (estado.projecao?.qtd_restante_projetada ?? null)
  };
}
