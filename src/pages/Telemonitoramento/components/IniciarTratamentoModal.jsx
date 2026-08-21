import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import {
  ModalOverlay, ModalContent, FormGroup, Input, ButtonGroup, Button
} from './styles';
import useReservaEdicaoPaciente from '../../../hooks/useReservaEdicaoPaciente';

// Mesma regra de +5 dias (pulando fim de semana, nunca no passado) usada em
// todo o resto do sistema para sugerir a data do primeiro telemonitoramento.
const calcularDataSugeridaLocal = (dataBaseStr) => {
  if (!dataBaseStr) return '';
  const [ano, mes, dia] = dataBaseStr.split('-');
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + 5);
  const diaSemana = data.getDay();
  if (diaSemana === 6) data.setDate(data.getDate() + 2);
  else if (diaSemana === 0) data.setDate(data.getDate() + 1);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataFinal = data < hoje ? hoje : data;
  const y = dataFinal.getFullYear();
  const m = String(dataFinal.getMonth() + 1).padStart(2, '0');
  const d = String(dataFinal.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Tela de confirmação pra iniciar um novo tratamento (ou retomar um antigo)
// pra um paciente com acompanhamento totalmente encerrado. O medicamento e
// as quantidades vêm do evento detectado na integração — não editáveis por
// escolha de design (o sistema não deve "inventar" que um paciente começou
// algo sem a integração confirmar). Só posologia e datas são preenchidas
// pelo atendente, no mesmo padrão do fluxo de "nova compra" já existente.
export default function IniciarTratamentoModal({ isOpen, onClose, paciente, candidatos, onSucesso }) {
  const [selecionados, setSelecionados] = useState({});
  const [dadosPorMedicamento, setDadosPorMedicamento] = useState({});
  const [loading, setLoading] = useState(false);

  const { bloqueio: bloqueioEdicao } = useReservaEdicaoPaciente(paciente?.id, isOpen && !!paciente?.id);

  useEffect(() => {
    if (isOpen && candidatos && candidatos.length > 0) {
      const sel = {};
      const dados = {};
      candidatos.forEach((c, idx) => {
        sel[c.medicamento_id] = idx < 2;
        const dataEntrega = c.data_entrega ? c.data_entrega.split('T')[0] : '';
        dados[c.medicamento_id] = {
          posologia: '',
          qtdCapsulaManual: '',
          dataEntrega,
          dataTelemonitoramento: c.data_sugerida_primeiro_contato
            ? String(c.data_sugerida_primeiro_contato).split('T')[0]
            : calcularDataSugeridaLocal(dataEntrega),
          qtdCaixas: c.qtd_caixas || 1
        };
      });
      setSelecionados(sel);
      setDadosPorMedicamento(dados);
    }
  }, [isOpen, candidatos]);

  if (!isOpen || !paciente || !candidatos || candidatos.length === 0) return null;

  if (bloqueioEdicao) {
    return (
      <ModalOverlay>
        <ModalContent style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
          <h3>⏳ Paciente em Atendimento</h3>
          <p style={{ margin: '15px 0' }}>
            Este paciente já está sendo atendido por <strong>{bloqueioEdicao.usuario}</strong>.
          </p>
          <ButtonGroup style={{ marginTop: '20px', justifyContent: 'center' }}>
            <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  }

  const toggleSelecionado = (medId) => {
    setSelecionados(prev => {
      const jaSelecionados = Object.values(prev).filter(Boolean).length;
      if (!prev[medId] && jaSelecionados >= 2) {
        toast.warning('É possível iniciar no máximo 2 medicamentos ao mesmo tempo.');
        return prev;
      }
      return { ...prev, [medId]: !prev[medId] };
    });
  };

  const atualizarCampo = (medId, campo, valor) => {
    setDadosPorMedicamento(prev => ({ ...prev, [medId]: { ...prev[medId], [campo]: valor } }));
  };

  const handleConfirmar = async () => {
    const idsSelecionados = Object.keys(selecionados).filter(id => selecionados[id]);
    if (idsSelecionados.length === 0) {
      toast.error('Selecione ao menos um medicamento para iniciar.');
      return;
    }
    const medicamentosConfirmados = [];
    for (const medId of idsSelecionados) {
      const candidato = candidatos.find(c => String(c.medicamento_id) === String(medId));
      const dados = dadosPorMedicamento[medId];
      if (!dados.posologia || Number(dados.posologia) <= 0) {
        toast.error(`Informe a posologia de ${candidato.medicamento_nome}.`);
        return;
      }
      if (!dados.dataEntrega || !dados.dataTelemonitoramento) {
        toast.error(`Preencha as datas de ${candidato.medicamento_nome}.`);
        return;
      }
      if (!candidato.qtd_capsula_conhecida && !dados.qtdCapsulaManual) {
        toast.error(`Informe a quantidade total de comprimidos da caixa de ${candidato.medicamento_nome}.`);
        return;
      }
      medicamentosConfirmados.push({
        medicamento_id: Number(medId),
        posologia_diaria: Number(dados.posologia),
        data_entrega: dados.dataEntrega,
        data_telemonitoramento: dados.dataTelemonitoramento,
        qtd_capsula_manual: dados.qtdCapsulaManual ? Number(dados.qtdCapsulaManual) : null,
        qtd_caixas: Number(dados.qtdCaixas) || 1,
        evento_externo_id: candidato.evento_externo_id
      });
    }

    try {
      setLoading(true);
      await api.post('/monitoramento-medicamentos', {
        paciente_id: paciente.id,
        patient_evaluation_id: null,
        medicamentos_confirmados: medicamentosConfirmados
      });
      toast.success('Tratamento iniciado com sucesso!');
      window.dispatchEvent(new Event('updateAlerts'));
      onSucesso();
      onClose();
    } catch (error) {
      if (error.response?.data?.needs_qtd_capsula) {
        toast.warning(error.response.data.message, { autoClose: 6000 });
      } else {
        toast.error(error.response?.data?.error || 'Erro ao iniciar tratamento.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: '650px', margin: 'auto' }}>
        <h3>Iniciar Novo Tratamento — {paciente.nome} {paciente.sobrenome}</h3>
        <p style={{ opacity: 0.85, marginBottom: '15px', fontSize: '0.9rem' }}>
          Detectamos {candidatos.length > 1 ? 'os seguintes medicamentos novos' : 'o seguinte medicamento novo'} para
          este paciente na integração externa. Confirme a posologia e as datas para iniciar o acompanhamento.
        </p>

        {candidatos.map(candidato => {
          const dados = dadosPorMedicamento[candidato.medicamento_id] || {};
          const marcado = !!selecionados[candidato.medicamento_id];
          return (
            <div
              key={candidato.medicamento_id}
              style={{
                border: '1px solid var(--border-color, #ddd)', borderRadius: '8px', padding: '15px',
                marginBottom: '15px', opacity: marcado ? 1 : 0.5
              }}
            >
              {candidatos.length > 1 && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={marcado} onChange={() => toggleSelecionado(candidato.medicamento_id)} />
                  Iniciar acompanhamento agora
                </label>
              )}
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{candidato.medicamento_nome}</p>
              {marcado && (
                <>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <FormGroup style={{ flex: '1 1 140px' }}>
                      <label>Comprimidos ao dia</label>
                      <Input
                        type="number" min="1"
                        value={dados.posologia || ''}
                        onChange={(e) => atualizarCampo(candidato.medicamento_id, 'posologia', e.target.value)}
                        placeholder="Ex: 2"
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: '1 1 100px' }}>
                      <label>Qtd. Caixas</label>
                      <Input
                        type="number" min="1"
                        value={dados.qtdCaixas || ''}
                        onChange={(e) => atualizarCampo(candidato.medicamento_id, 'qtdCaixas', e.target.value)}
                      />
                    </FormGroup>
                  </div>
                  {!candidato.qtd_capsula_conhecida && (
                    <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #ffeeba' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#856404' }}>
                        ⚠️ Qtd. total de comprimidos por caixa:
                      </label>
                      <Input
                        type="number" min="1"
                        value={dados.qtdCapsulaManual || ''}
                        onChange={(e) => atualizarCampo(candidato.medicamento_id, 'qtdCapsulaManual', e.target.value)}
                        placeholder="Ex: 30"
                        style={{ width: '150px' }}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <FormGroup style={{ flex: '1 1 160px' }}>
                      <label>Data de Entrega</label>
                      <Input
                        type="date"
                        value={dados.dataEntrega || ''}
                        onChange={(e) => atualizarCampo(candidato.medicamento_id, 'dataEntrega', e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: '1 1 160px' }}>
                      <label>Data do Primeiro Contato</label>
                      <Input
                        type="date"
                        value={dados.dataTelemonitoramento || ''}
                        onChange={(e) => atualizarCampo(candidato.medicamento_id, 'dataTelemonitoramento', e.target.value)}
                      />
                    </FormGroup>
                  </div>
                </>
              )}
            </div>
          );
        })}

        <ButtonGroup style={{ marginTop: '15px' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="button" onClick={handleConfirmar} disabled={loading}>
            {loading ? 'Iniciando...' : 'Confirmar e Iniciar'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}