import { contarComprimidosConsumidos } from './posologiaHelpers';

// Estoque projetado para hoje de um ciclo — UMA conta para a lista
// ("~N un. estimadas"), para a linha do histórico e para o modal ("Estoque
// Projetado para Hoje"): total da caixa menos o que foi consumido desde a
// data de administração, respeitando o padrão de posologia e as pausas.
// Antes a lista contava os dias até a data de fim de caixa (que vem da
// quantidade informada no último contato) e o modal contava a caixa — os
// dois podiam diferir por alguns comprimidos pro mesmo paciente.
//
// @param monitoramento - ciclo com qtd_total_capsulas (ou medicamento.qtd_capsula × qtd_caixas),
//                        posologia_diaria, data_administracao (ou data_entrega), tipo_posologia e pausas
// @param hoje - Date de referência (padrão: agora)
// @returns número inteiro entre 0 e o total da caixa, ou null quando não dá para calcular
export function calcularEstoqueProjetado(monitoramento, hoje = new Date()) {
  if (!monitoramento) return null;
  const qtdCaixas = Number(monitoramento.qtd_caixas || 1);
  const total = Number(monitoramento.qtd_total_capsulas || (monitoramento.medicamento?.qtd_capsula * qtdCaixas) || 0);
  const posologia = Number(monitoramento.posologia_diaria || 1);
  const referencia = monitoramento.data_administracao || monitoramento.data_entrega;
  if (!total || !referencia) return null;

  const [ano, mes, dia] = String(referencia).split('T')[0].split('-');
  const inicio = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const dataHoje = new Date(hoje);
  dataHoje.setHours(0, 0, 0, 0);
  if (dataHoje < inicio) return total; // ainda não começou a caixa

  const diasPassados = Math.max(0, Math.floor((dataHoje - inicio) / (1000 * 60 * 60 * 24)));
  const restante = total - contarComprimidosConsumidos(inicio, diasPassados, posologia, monitoramento);
  return Math.min(total, Math.max(0, restante));
}
