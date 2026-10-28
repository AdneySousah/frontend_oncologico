// "Linha de tratamento": identidade de um medicamento pro telemonitoramento —
// princípio ativo normalizado + concentração (força em mg, lida do nome); sem princípio, TUSS; sem os dois, o id local. Dois
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
  if (principio) {
    // 👇 CONCENTRAÇÃO: o mesmo princípio ativo em forças diferentes pode ser
    // combinação (TEMOZOLOMIDA 100 MG + 20 MG compondo a dose) ou troca de dose
    // (ABEMACICLIBE 150 → 100 MG) — nos dois casos é o operador quem decide
    // "conjunto ou substituição", então são linhas distintas. Caixas e marcas
    // diferentes da MESMA força (RIBOCICLIBE 200 MG/DOSE X 21/X 42, LETROZOL/
    // FEMARA 2,5 MG) continuam a mesma linha.
    const forca = extrairConcentracao(medicamento.nome);
    return forca ? `pa:${principio}|${forca}` : `pa:${principio}`;
  }
  const tuss = String(medicamento.codigo_tuss ?? '').replace(/\D/g, '');
  if (tuss) return `tuss:${tuss}`;
  return medicamento.id !== undefined && medicamento.id !== null ? `id:${medicamento.id}` : null;
}

// Força/concentração a partir do nome do cadastro: "100 MG", "2,5 MG", "40MG",
// "200 MG/DOSE", "0.5 MG/DOSE", "(20,0 + 8,19) MG". Sem força reconhecível → ''.
export function extrairConcentracao(nome) {
  const texto = normalizarChave(nome);
  if (!texto) return '';
  const combinacao = texto.match(/\(([\d.,\s+]+)\)\s*(MG|MCG|G|UI|ML)(\/(ML|DOSE))?/);
  if (combinacao) return `${combinacao[1].replace(/\s+/g, '').replace(/,/g, '.')}${combinacao[2]}${combinacao[3] || ''}`;
  const simples = texto.match(/(\d+(?:[.,]\d+)?)\s*(MG|MCG|G|UI|ML)(\/(ML|DOSE))?(?![A-Z])/);
  if (!simples) return '';
  const valor = String(parseFloat(simples[1].replace(',', '.')));
  return `${valor}${simples[2]}${simples[3] || ''}`;
}

export function mesmaLinha(medA, medB) {
  if (!medA || !medB) return false;
  if (medA.id !== undefined && medA.id === medB.id) return true;
  const chaveA = chaveLinhaTratamento(medA);
  const chaveB = chaveLinhaTratamento(medB);
  return !!chaveA && chaveA === chaveB;
}
