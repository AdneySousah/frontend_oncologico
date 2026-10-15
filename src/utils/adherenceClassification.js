// Classificação de adesão pelo score da avaliação. Ficava exportada de
// pages/Telemonitoramento/index.jsx (e importada pelo TelemonitoramentoModal),
// o que quebrava a regra react-refresh/only-export-components do lint — uma
// página só pode exportar o componente. Movida pra cá sem mudar a regra.
export const getAdherenceClassification = (score) => {
  if (score == null) return { label: 'Sem Avaliação', level: 'none' };
  if (score <= 9) return { label: 'Paciente com alta tendência a adesão ao tratamento', level: 'alta' };
  if (score <= 12) return { label: 'Paciente com tendência moderada a adesão ao tratamento', level: 'media' };
  return { label: 'Paciente com tendência baixa a adesão ao tratamento', level: 'baixa' };
};
