// Seed de desenvolvimento (dados FICTÍCIOS) — roda de fora do repositório:
//   cd /home/claude/proj/backend && node --env-file=.env ../../tools/seed-dev.mjs
import '../proj/backend/src/database/index.js';
import Perfil from '../proj/backend/src/app/models/Perfil.js';
import Operadora from '../proj/backend/src/app/models/Operadora.js';
import User from '../proj/backend/src/app/models/User.js';
import Medicamentos from '../proj/backend/src/app/models/Medicamentos.js';
import Pacientes from '../proj/backend/src/app/models/Pacientes.js';
import MonitoramentoMedicamento from '../proj/backend/src/app/models/MonitoramentoMedicamento.js';

const modulos = ['usuarios','operadoras','chat','pacientes','avaliacoes','termos','telemonitoramento','reacao_adversa','dashboard','audit-logs','check-saude','linhadotempo','faturamento','termo','falhascontatos','pausa_tratamento','recalculo','base_conhecimento','fechar_mes_dashboard'];
const permissoes = Object.fromEntries(modulos.map(m => [m, { acessar: true, editar: true, excluir: true }]));

const [perfil] = await Perfil.findOrCreate({ where: { nome: 'Admin (dev)' }, defaults: { permissoes } });
const [operadora] = await Operadora.findOrCreate({ where: { nome: 'OPERADORA TESTE' }, defaults: { cnpj: '00000000000000', telefone: '0000000000', email: [], external_id: 1, is_active: true } });
const [user] = await User.findOrCreate({ where: { email: 'admin@teste.local' }, defaults: { name: 'Admin Teste', username: 'admin', password_hash: 'EXTERNAL_AUTH_dev', active: true, is_admin: true, is_profissional: false, is_new_user: false, perfil_id: perfil.id, external_id: 1 } });
await user.setOperadoras([operadora]);
const [medA] = await Medicamentos.findOrCreate({ where: { nome: 'MEDICAMENTO TESTE A' }, defaults: { dosagem: '10', tipo_dosagem: 'MG', qtd_capsula: 30, price: 100, external_id: 1001 } });
const [medB] = await Medicamentos.findOrCreate({ where: { nome: 'MEDICAMENTO TESTE B' }, defaults: { dosagem: '50', tipo_dosagem: 'MG', qtd_capsula: 60, price: 250, external_id: 1002 } });

const pacientes = [];
for (const i of [1, 2, 3]) {
  const [p] = await Pacientes.findOrCreate({ where: { cpf: `0000000000${i}` }, defaults: {
    nome: 'Paciente', sobrenome: `Teste ${i}`, celular: `3199999000${i}`, data_nascimento: '1970-01-01', sexo: i === 2 ? 'F' : 'M',
    possui_cuidador: false, operadora_id: operadora.id, is_active: true, status_termo: 'Pendente', medicamento_id: i === 3 ? medB.id : medA.id, external_id: 5000 + i, fez_entrevista: false,
  } });
  pacientes.push(p);
}
if (await MonitoramentoMedicamento.count() === 0) {
  await MonitoramentoMedicamento.bulkCreate([
    { paciente_id: pacientes[0].id, medicamento_id: medA.id, posologia_diaria: 1, qtd_informada_caixa: 30, data_abertura_nova_caixa: '2026-10-01', data_calculada_fim_caixa: '2026-10-31', data_proximo_contato: '2026-10-10', status: 'PENDENTE', qtd_caixas: 1, qtd_total_capsulas: 30, data_entrega: '2026-10-01', tipo_posologia: 'diaria' },
    { paciente_id: pacientes[2].id, medicamento_id: medB.id, posologia_diaria: 2, qtd_informada_caixa: 60, data_abertura_nova_caixa: '2026-09-20', data_calculada_fim_caixa: '2026-10-20', data_proximo_contato: '2026-10-08', status: 'PENDENTE', qtd_caixas: 1, qtd_total_capsulas: 60, data_entrega: '2026-09-20', tipo_posologia: 'diaria' },
  ]);
}
console.log(`seed ok: perfil=${perfil.id} operadora=${operadora.id} user=${user.id} pacientes=${pacientes.map(p => p.id).join(',')} monitoramentos=${await MonitoramentoMedicamento.count()}`);
process.exit(0);
