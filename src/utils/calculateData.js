export const calcularProximoContato = (dataBaseStr) => {
  if (!dataBaseStr) return '';
  
  // Criamos a data fixando ao meio-dia para evitar bugs de fuso horário na conversão
  const data = new Date(`${dataBaseStr}T12:00:00`);
  
  // Adiciona 2 dias (48 horas)
  data.setDate(data.getDate() + 2);

  const diaSemana = data.getDay(); // 0 = Domingo, 1 = Segunda ... 6 = Sábado
  
  // Verifica se caiu no fim de semana
  if (diaSemana === 6) {
    // Se for Sábado, adiciona mais 2 dias para ir para Segunda-feira
    data.setDate(data.getDate() + 2);
  } else if (diaSemana === 0) {
    // Se for Domingo, adiciona mais 1 dia para ir para Segunda-feira
    data.setDate(data.getDate() + 1);
  }

  // Formata de volta para YYYY-MM-DD usando o timezone local para não haver divergência
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
};