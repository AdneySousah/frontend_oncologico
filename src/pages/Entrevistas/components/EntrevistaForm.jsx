import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import {
  LuCircleUser,
  LuStethoscope,
  LuFlaskConical,
  LuCircleCheck,
  LuCircleX,
  LuHistory,
  LuCircleAlert,
  LuPill,
  LuPaperclip,
  LuPlus,
  LuTrash2,
  LuArrowLeft
} from "react-icons/lu";

import {
  Form,
  FormGroup,
  ButtonGroup,
  ActionButton,
  Section,
  Container,
  PageHeader,
  BackButton,
  InfoBox,
  InfoGrid,
  InfoItem,
  NestedContainer,
  ListItem,
  FlexRowEnd,
  ItemCard,
  IconButton
} from './styles';
import { calcularProximoContato } from '../../../utils/calculateData';

export default function EntrevistaForm({ paciente, onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [listaComorbidades, setListaComorbidades] = useState([]);
  const [listaMedicamentos, setListaMedicamentos] = useState([]);

  const [anexos, setAnexos] = useState([]);

  const [medicamentosUso, setMedicamentosUso] = useState([]);
  const [possuiMedicamento, setPossuiMedicamento] = useState(false);

  const dataAtualStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    // ---> Aqui a mágica acontece. Ele pega o ID enviado pelo modal. Se não vier nada, fica vazio.
    medico_id: paciente.medico_pre_selecionado || '', 
    estadiamento: 'I',
    data_contato: new Date().toISOString().split('T')[0],
    data_proximo_contato: calcularProximoContato(dataAtualStr),
    observacoes: '',
    observacao_medicacao: '', 
    turno_contato: 'Manhã',
    diagnostico_id: '',
    prestador_medico_id: '',
    paciente_id: paciente.id,

    comorbidade: {
      possui_comorbidade: false,
      comorbidade_id: '',
      sabe_diagnostico: false,
      descricao_diagnostico: ''
    },

    exame: {
      possui_exame: false,
      nome_exame: '',
      tipo_exame: 'sangue',
      resultado_exame: '',
      data_exame_realizado: '',
      data_exame_resultado: '',
      prestador_medico_id: ''
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [diagRes, prestRes, medicosRes, comorbRes, medRes] = await Promise.all([
          api.get('/diagnosticos'),
          api.get('/prestadores-medicos'),
          api.get('/medicos'),
          api.get('/comorbidades'),
          api.get('/medicamentos')
        ]);

        setDiagnosticos(diagRes.data);
        setPrestadores(prestRes.data);

        const medicosFiltrados = medicosRes.data.map(medico => {
          const locaisValidos = medico.locais_atendimento?.filter(
            local => local.tipo === 'hospital' || local.tipo === 'clinica'
          ) || [];

          return {
            ...medico,
            locais_atendimento: locaisValidos
          };
        }).filter(medico => medico.locais_atendimento.length > 0);

        setMedicos(medicosFiltrados);
        setListaComorbidades(comorbRes.data);
        setListaMedicamentos(medRes.data);
      } catch (err) {
        toast.error("Erro ao carregar dados de apoio.");
      }
    }
    loadData();
  }, []);

  const laboratorios = prestadores.filter(p => p.tipo === 'laboratorio');
  const medicoSelecionado = medicos.find(m => m.id === Number(formData.medico_id));
  const locaisPermitidos = medicoSelecionado?.locais_atendimento || [];

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleMedicoChange = (e) => {
    const selectedId = e.target.value;
    setFormData(prev => ({
      ...prev,
      medico_id: selectedId,
      prestador_medico_id: ''
    }));
  };

  const handlePossuiMedicamentoChange = (e) => {
    const isChecked = e.target.checked;
    setPossuiMedicamento(isChecked);
    setMedicamentosUso(isChecked ? [''] : []);
  };

  const adicionarSelectMedicamento = () => {
    setMedicamentosUso([...medicamentosUso, '']);
  };

  const removerSelectMedicamento = (index) => {
    const novosMedicamentos = [...medicamentosUso];
    novosMedicamentos.splice(index, 1);
    setMedicamentosUso(novosMedicamentos);
  };

  const handleMedicamentoChange = (index, value) => {
    const novosMedicamentos = [...medicamentosUso];
    novosMedicamentos[index] = value;
    setMedicamentosUso(novosMedicamentos);
  };

  const adicionarAnexo = () => {
    setAnexos([...anexos, { nome: '', file: null }]);
  };

  const removerAnexo = (index) => {
    const novosAnexos = [...anexos];
    novosAnexos.splice(index, 1);
    setAnexos(novosAnexos);
  };

  const handleAnexoChange = (index, field, value) => {
    const novosAnexos = [...anexos];
    if (field === 'nome') {
      novosAnexos[index][field] = value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    } else {
      novosAnexos[index][field] = value;
    }
    setAnexos(novosAnexos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = new FormData();

      const camposBase = [
        'medico_id', 'estadiamento', 'data_contato', 'observacoes',
        'data_proximo_contato', 'turno_contato', 'diagnostico_id',
        'prestador_medico_id', 'paciente_id', 'observacao_medicacao'
      ];

      camposBase.forEach(key => {
        if (formData[key]) dataToSend.append(key, formData[key]);
      });

      dataToSend.append('comorbidade', JSON.stringify(formData.comorbidade));
      dataToSend.append('exame', JSON.stringify(formData.exame));

      const medicamentosPreenchidos = medicamentosUso.filter(id => id !== '');
      dataToSend.append('medicamentos_selecionados', JSON.stringify(medicamentosPreenchidos));

      anexos.forEach((anexo) => {
        if (anexo.file && anexo.nome) {
          dataToSend.append('anexos_files', anexo.file);
          dataToSend.append('anexos_nomes', anexo.nome);
        }
      });

      await api.post('/entrevistas-medicas', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Entrevista salva com sucesso!");
      onSuccess();
    } catch (err) {
      toast.error("Erro ao salvar. Verifique os campos.");
    } finally {
      setLoading(false);
    }
  };

  const formatarSexo = (sexo) => {
    if (sexo === 'M') return 'Masculino';
    if (sexo === 'F') return 'Feminino';
    return 'Não definido';
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    return dataStr.split('-').reverse().join('/');
  };

  return (
    <Container>
      <PageHeader>
        <BackButton onClick={onCancel}>
          <LuArrowLeft /> Voltar para Lista de Pacientes
        </BackButton>
        <h2>Entrevista de Admissão Clínica</h2>
      </PageHeader>

      <Section>
        <h3><LuCircleUser /> Dados do Paciente Selecionado</h3>
        <InfoBox>

          <InfoGrid>
            <InfoItem><label>Nome Completo:</label><p>{paciente.nome} {paciente.sobrenome}</p></InfoItem>
            <InfoItem><label>CPF:</label><p>{paciente.cpf}</p></InfoItem>
            <InfoItem><label>Nascimento:</label><p>{formatarData(paciente.data_nascimento)}</p></InfoItem>
            <InfoItem><label>Sexo:</label><p>{formatarSexo(paciente.sexo)}</p></InfoItem>
            <InfoItem><label>Operadora:</label><p>{paciente.operadoras?.nome || 'Não informada'}</p></InfoItem>
          </InfoGrid>

          <InfoGrid className="col-2">
            <InfoItem>
              <label>Contatos:</label>
              <p>Cel: {paciente.celular || '-'}</p>
              <p>Tel: {paciente.telefone || '-'}</p>
            </InfoItem>
            <InfoItem>
              <label>Endereço Completo:</label>
              <p>
                {paciente.logradouro || ''}, {paciente.numero || 'S/N'}
                {paciente.complemento ? ` (${paciente.complemento})` : ''} - {paciente.bairro || ''},
                {paciente.cidade || ''} - {paciente.estado || ''}
              </p>
              <p>CEP: {paciente.cep || '-'}</p>
            </InfoItem>
          </InfoGrid>

          <InfoGrid className="border-top">
            <InfoItem>
              <label>Possui Cuidador?</label>
              <p>{paciente.possui_cuidador ? 'Sim' : 'Não'}</p>
            </InfoItem>

            {paciente.possui_cuidador && (
              <>
                <InfoItem><label>Nome do Cuidador:</label><p>{paciente.nome_cuidador || '-'}</p></InfoItem>
                <InfoItem><label>Contato do Cuidador:</label><p>{paciente.contato_cuidador || '-'}</p></InfoItem>
              </>
            )}
          </InfoGrid>

        </InfoBox>
      </Section>

      <Form onSubmit={handleSubmit}>
        <Section>
          <h3><LuStethoscope />Informações Iniciais</h3>
          <div className="grid-3">
            <FormGroup>
              <label>Médico Responsável</label>
              <select required value={formData.medico_id} onChange={handleMedicoChange}>
                <option value="">Selecione o Médico...</option>
                {medicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </FormGroup>
            <FormGroup>
              <label>CRM</label>
              <input readOnly value={medicoSelecionado?.crm || ''} />
            </FormGroup>
            <FormGroup>
              <label>Local de Atendimento</label>
              <select required value={formData.prestador_medico_id} onChange={e => setFormData({ ...formData, prestador_medico_id: e.target.value })} disabled={!formData.medico_id}>
                <option value="">{!formData.medico_id ? "Escolha um médico primeiro" : "Selecione o Local..."}</option>
                {locaisPermitidos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </FormGroup>

            <FormGroup>
              <label>Data do contato</label>
              <input
                type="date"
                required
                value={formData.data_contato}
                onChange={e => {
                  const novaDataContato = e.target.value;
                  setFormData({
                    ...formData,
                    data_contato: novaDataContato,
                    data_proximo_contato: calcularProximoContato(novaDataContato)
                  });
                }}
              />
            </FormGroup>
          </div>
        </Section>

        <Section>
          <h3><LuCircleAlert /> Histórico do paciente</h3>
          <div className="flex-row">
            <input type="checkbox" checked={formData.comorbidade.possui_comorbidade} onChange={e => handleNestedChange('comorbidade', 'possui_comorbidade', e.target.checked)} />
            <label>O paciente possui alguma comorbidade associada?</label>
          </div>
          {formData.comorbidade.possui_comorbidade && (
            <div className="grid-6" style={{ marginTop: '15px' }}>
              <FormGroup>
                <label>Selecione a Comorbidade</label>
                <select required value={formData.comorbidade.comorbidade_id} onChange={e => handleNestedChange('comorbidade', 'comorbidade_id', e.target.value)}>
                  <option value="">Escolha uma comorbidade...</option>
                  {listaComorbidades.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </FormGroup>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="flex-row">
                  <input type="checkbox" checked={formData.comorbidade.sabe_diagnostico} onChange={e => handleNestedChange('comorbidade', 'sabe_diagnostico', e.target.checked)} />
                  <label>Paciente sabe dessa comorbidade?</label>
                </div>
                {formData.comorbidade.sabe_diagnostico && (
                  <FormGroup>
                    <input required placeholder="Descrição do diagnóstico..." value={formData.comorbidade.descricao_diagnostico} onChange={e => handleNestedChange('comorbidade', 'descricao_diagnostico', e.target.value)} />
                  </FormGroup>
                )}
              </div>
            </div>
          )}
<br />
          <h3> Histórico do paciente</h3>
          <FormGroup>
            <label>Estadiamento Atual</label>
            <select value={formData.estadiamento} onChange={e => setFormData({ ...formData, estadiamento: e.target.value })}>
              <option value="I">I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Diagnóstico Primário (CID)</label>
            <select required value={formData.diagnostico_id} onChange={e => setFormData({ ...formData, diagnostico_id: e.target.value })}>
              <option value="">Selecione o CID...</option>
              {diagnosticos.map(d => <option key={d.id} value={d.id}>{d.diagnostico}</option>)}
            </select>
          </FormGroup>
        </Section>

        <Section>
          <h3><LuFlaskConical /> Registro de Exames Relevantes</h3>
          <div className="flex-row">
            <input type="checkbox" checked={formData.exame.possui_exame} onChange={e => handleNestedChange('exame', 'possui_exame', e.target.checked)} />
            <label>Qual o último exame realizado?</label>
          </div>
          {formData.exame.possui_exame && (
            <div className="grid-3" style={{ marginTop: '15px' }}>
              <FormGroup><label>Nome do Exame</label><input required value={formData.exame.nome_exame} onChange={e => handleNestedChange('exame', 'nome_exame', e.target.value)} /></FormGroup>
              <FormGroup>
                <label>Tipo</label>
                <select value={formData.exame.tipo_exame} onChange={e => handleNestedChange('exame', 'tipo_exame', e.target.value)}>
                  <option value="sangue">Sangue</option><option value="imagem">Imagem</option><option value="biópsia">Biópsia</option><option value="outro">Outro</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Laboratório</label>
                <select required value={formData.exame.prestador_medico_id} onChange={e => handleNestedChange('exame', 'prestador_medico_id', e.target.value)}>
                  <option value="">Selecione...</option>
                  {laboratorios.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </FormGroup>
              <FormGroup><label>Resultado</label><input required value={formData.exame.resultado_exame} onChange={e => handleNestedChange('exame', 'resultado_exame', e.target.value)} /></FormGroup>
              <FormGroup><label>Data do exame</label><input type="date" required value={formData.exame.data_exame_realizado} onChange={e => handleNestedChange('exame', 'data_exame_realizado', e.target.value)} /></FormGroup>

            </div>
          )}

        </Section>

        <Section>
          <h3><LuPill /> Informações de Medicamentos</h3>

          <FormGroup>
            <label>Outros Medicamentos (Não Oncológicos ou Uso Contínuo)</label>
            <textarea 
              rows="3"
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', resize: 'vertical' }}
              placeholder="Descreva aqui os medicamentos não oncológicos que o paciente utiliza..."
              value={formData.observacao_medicacao}
              onChange={e => setFormData({ ...formData, observacao_medicacao: e.target.value })}
            />
          </FormGroup>

          <div className="flex-row" style={{ marginTop: '20px' }}>
            <input type="checkbox" checked={possuiMedicamento} onChange={handlePossuiMedicamentoChange} />
            <label>O paciente faz uso de algum medicamento oncológico?</label>
          </div>

          {possuiMedicamento && (
            <NestedContainer>

              {medicamentosUso.map((medId, index) => {
                const medSelecionado = listaMedicamentos.find(m => m.id === Number(medId));

                return (
                  <ListItem key={index}>
                    <FlexRowEnd>
                      <FormGroup flex="1" margin="0">
                        <label>Medicamento {index + 1}</label>
                        <select
                          required
                          value={medId}
                          onChange={e => handleMedicamentoChange(index, e.target.value)}
                        >
                          <option value="">Selecione o medicamento na lista...</option>
                          {listaMedicamentos.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.principio_ativo || m.nome_comercial ? `(${m.nome_comercial || ''}) ${m.principio_ativo || ''} - ${m.dosagem || ''}${m.tipo_dosagem || ''}` : m.nome}
                            </option>
                          ))}
                        </select>
                      </FormGroup>

                      {medicamentosUso.length > 1 && (
                        <IconButton
                          type="button"
                          className="danger-outline"
                          onClick={() => removerSelectMedicamento(index)}
                          title="Remover este medicamento"
                        >
                          <LuTrash2 size={18} /> Remover
                        </IconButton>
                      )}
                    </FlexRowEnd>

                    {medSelecionado && (
                      <ItemCard>
                        <InfoItem>
                          <label>Nome Comercial</label>
                          <p>{medSelecionado.nome_comercial || '-'}</p>
                        </InfoItem>
                        <InfoItem>
                          <label>Princípio Ativo</label>
                          <p>{medSelecionado.principio_ativo || '-'}</p>
                        </InfoItem>
                        <InfoItem>
                          <label>Dosagem</label>
                          <p>{medSelecionado.dosagem ? `${medSelecionado.dosagem} ${medSelecionado.tipo_dosagem || ''}` : '-'}</p>
                        </InfoItem>
                        <InfoItem>
                          <label>Qtd. Caixa</label>
                          <p>{medSelecionado.qtd_capsula ? `${medSelecionado.qtd_capsula} cápsulas/comp.` : '-'}</p>
                        </InfoItem>
                      </ItemCard>
                    )}
                  </ListItem>
                );
              })}

              <IconButton
                type="button"
                className="primary"
                onClick={adicionarSelectMedicamento}
              >
                <LuPlus size={18} /> Adicionar outro medicamento
              </IconButton>
            </NestedContainer>
          )}

        </Section>

        <Section>
          <h3><LuPaperclip /> Anexos da Entrevista (Exames, Receitas, Laudos)</h3>
          <NestedContainer>
            {anexos.map((anexo, index) => (
              <FlexRowEnd key={index} mb="10px">
                <FormGroup flex="1" margin="0">
                  <label>Nome do Documento</label>
                  <input
                    placeholder="Ex: Exame de Sangue..."
                    value={anexo.nome}
                    onChange={(e) => handleAnexoChange(index, 'nome', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup flex="1" margin="0">
                  <label>Arquivo</label>
                  <input
                    type="file"
                    onChange={(e) => handleAnexoChange(index, 'file', e.target.files[0])}
                    required
                  />
                </FormGroup>

                <IconButton
                  type="button"
                  className="danger"
                  onClick={() => removerAnexo(index)}
                >
                  Remover
                </IconButton>
              </FlexRowEnd>
            ))}

            <IconButton
              type="button"
              className="success"
              onClick={adicionarAnexo}
            >
              <LuPlus size={18} /> Adicionar Anexo
            </IconButton>
          </NestedContainer>
        </Section>

        <Section>
          <h3><LuHistory /> Próximos Passos</h3>
          <div className="grid-3">
            <FormGroup><label>Data da navegação do paciente</label><input type="date" value={formData.data_proximo_contato} onChange={e => setFormData({ ...formData, data_proximo_contato: e.target.value })} /></FormGroup>
          </div>
        </Section>

        <ButtonGroup>
          <ActionButton type="button" onClick={onCancel} className="cancel"><LuCircleX size={20} /> Cancelar</ActionButton>
          <ActionButton type="submit" className="save" disabled={loading}><LuCircleCheck size={20} /> {loading ? 'Processando...' : 'Finalizar Entrevista Médica'}</ActionButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}