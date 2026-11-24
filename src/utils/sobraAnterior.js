import { calcularEstoqueProjetado } from './estoqueProjetado';

// 👇 ACUMULAR SOBRAS: sugestão da sobra da caixa anterior no dia em que a caixa
// nova começa = estoque PROJETADO do ciclo atual nessa data (mesma conta da
// lista e do "Estoque Projetado para Hoje", com o padrão de posologia do ciclo).
//
// Antes a sugestão saía do "total informado" no contato: sem o total preenchido
// ficava vazia (somava 0) e, com ele, a sobra virava "informado − caixa nova",
// o que fazia a adesão sempre bater (comparava o informado com ele mesmo).
// Agora a sobra vem da projeção e o informado continua servindo para medir a
// adesão. É só sugestão: quem atende confirma com o paciente ou corrige.
// O backend soma exatamente o número enviado (qtd_sobra_anterior).

const paraData = (iso) => {
  const [a, m, d] = String(iso).split('T')[0].split('-').map(Number);
  return new Date(a, m - 1, d);
};

export function sugerirSobraAnterior({ monitoramentoAtual, dataInicioNovaCaixa, hoje = new Date() }) {
  if (!monitoramentoAtual) return '';
  const referencia = dataInicioNovaCaixa ? paraData(dataInicioNovaCaixa) : hoje;
  const projetado = calcularEstoqueProjetado(monitoramentoAtual, referencia);
  if (projetado == null) return '';
  return String(Math.max(0, Math.round(projetado)));
}

// Valor que entra na conta e no envio: inteiro >= 0 (vazio/ inválido = 0).
export function sobraValida(valor) {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
