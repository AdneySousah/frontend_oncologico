// "Linha de tratamento": identidade de um medicamento pro telemonitoramento —
// princípio ativo normalizado; sem ele, TUSS; sem os dois, o id local. Dois
// cadastros com o mesmo princípio ativo (Ribociclibe X 21 e X 42, LETROZOL e
// FEMARA) são o MESMO medicamento. Espelho de backend/src/utils/linhaTratamento.js.
export function normalizarChave(texto) {
  return String(texto ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function chaveLinhaTratamento(medicamento) {
  if (!medicamento) return null;
  const principio = normalizarChave(medicamento.principio_ativo);
  if (principio) return `pa:${principio}`;
  const tuss = String(medicamento.codigo_tuss ?? '').replace(/\D/g, '');
  if (tuss) return `tuss:${tuss}`;
  return medicamento.id !== undefined && medicamento.id !== null ? `id:${medicamento.id}` : null;
}

export function mesmaLinha(medA, medB) {
  if (!medA || !medB) return false;
  if (medA.id !== undefined && medA.id === medB.id) return true;
  const chaveA = chaveLinhaTratamento(medA);
  const chaveB = chaveLinhaTratamento(medB);
  return !!chaveA && chaveA === chaveB;
}
