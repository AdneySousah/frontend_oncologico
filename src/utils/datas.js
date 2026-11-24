// Datas de negócio (YYYY-MM-DD) no fuso do usuário.
// Não use toISOString().split('T')[0] para "hoje": ele converte para UTC e,
// depois das 21h (UTC-3), devolve o dia seguinte.

export function dataLocalISO(data) {
  const d = data instanceof Date ? data : new Date(data);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function hojeISO() {
  return dataLocalISO(new Date());
}
