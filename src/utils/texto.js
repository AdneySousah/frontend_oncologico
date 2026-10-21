// Padrão de exibição de textos cadastrados livremente (motivos, nomes de
// usuário): primeira letra de cada palavra em maiúscula, o resto em
// minúscula, mantendo em minúscula as preposições/artigos do português no
// meio da frase. Só para EXIBIÇÃO — o que vai pro banco continua como foi
// digitado.
//   "inelegível pelo plano de saúde" -> "Inelegível pelo Plano de Saúde"
//   "ADNEY SOUSA SANTOS"             -> "Adney Sousa Santos"
//   "pós-operatório (clínica)"       -> "Pós-Operatório (Clínica)"
const CONECTIVOS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'nos', 'nas',
  'por', 'pelo', 'pela', 'pelos', 'pelas', 'o', 'a', 'os', 'as',
  'para', 'com', 'sem', 'ao', 'à', 'aos', 'às', 'um', 'uma', 'ou'
]);

export function capitalizar(texto) {
  if (texto === null || texto === undefined) return '';
  const palavras = String(texto).trim().toLowerCase().split(/\s+/);
  return palavras
    .map((palavra, indice) => {
      if (!palavra) return palavra;
      if (indice > 0 && CONECTIVOS.has(palavra)) return palavra;
      // primeira letra da palavra e de cada parte após hífen, parêntese ou barra
      return palavra.replace(/(^|[-(/[])(\p{L})/gu, (_, separador, letra) => separador + letra.toUpperCase());
    })
    .join(' ');
}
