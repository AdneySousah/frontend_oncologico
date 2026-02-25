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
  LuTrash2
} from "react-icons/lu";

import { 
  Form, 
  FormGroup, 
  ButtonGroup, 
  ActionButton, 
  Section,
  Container 
} from './styles';

export default function EntrevistaForm({ paciente, onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [listaComorbidades, setListaComorbidades] = useState([]);
  const [listaMedicamentos, setListaMedicamentos] = useState([]); 
  
  // ESTADO DOS ANEXOS
  const [anexos, setAnexos] = useState([]);

  // ESTADO DOS MEDICAMENTOS (Array de IDs)
  // Iniciamos com um array vazio. Se o checkbox for marcado, ele terá pelo menos um item (mesmo que vazio '')
  const [medicamentosUso, setMedicamentosUso] = useState([]);
  const [possuiMedicamento, setPossuiMedicamento] = useState(false);

  const [formData, setFormData] = useState({
    medico_id: '',
    estadiamento: 'I',
    data_contato: new Date().toISOString().split('T')[0],
    observacoes: '',
    data_proximo_contato: '',
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
    // medicamento_uso foi removido daqui e virou o state independente acima
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
        // --------------------------------------------------------

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

  // --- HANDLES DOS MEDICAMENTOS MÚLTIPLOS ---
  const handlePossuiMedicamentoChange = (e) => {
    const isChecked = e.target.checked;
    setPossuiMedicamento(isChecked);
    // Se marcou que possui, inicializa o array com 1 slot vazio. Se desmarcou, zera.
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

  // HANDLES DE ANEXOS
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
        'prestador_medico_id', 'paciente_id'
      ];
      
      camposBase.forEach(key => {
          if (formData[key]) dataToSend.append(key, formData[key]);
      });

      dataToSend.append('comorbidade', JSON.stringify(formData.comorbidade));
      dataToSend.append('exame', JSON.stringify(formData.exame));
      
      // Filtrar apenas os selects que foram preenchidos (ignorando os vazios) e enviar como array
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Voltar para Lista de Pacientes
        </button>
        <h2 style={{ color: '#333' }}>Entrevista de Admissão Clínica</h2>
      </div>

      <Section>
        <h3><LuCircleUser /> Dados do Paciente Selecionado</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <div><label style={{ color: '#666', fontSize: '0.8rem' }}>Nome Completo:</label><p><strong>{paciente.nome} {paciente.sobrenome}</strong></p></div>
            <div><label style={{ color: '#666', fontSize: '0.8rem' }}>CPF:</label><p><strong>{paciente.cpf}</strong></p></div>
            <div><label style={{ color: '#666', fontSize: '0.8rem' }}>Nascimento:</label><p><strong>{formatarData(paciente.data_nascimento)}</strong></p></div>
            <div><label style={{ color: '#666', fontSize: '0.8rem' }}>Sexo:</label><p><strong>{formatarSexo(paciente.sexo)}</strong></p></div>
            <div><label style={{ color: '#666', fontSize: '0.8rem' }}>Operadora:</label><p><strong>{paciente.operadoras?.nome || 'Não informada'}</strong></p></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
            <div>
              <label style={{ color: '#666', fontSize: '0.8rem' }}>Contatos:</label>
              <p><strong>Cel:</strong> {paciente.celular || '-'}</p>
              <p><strong>Tel:</strong> {paciente.telefone || '-'}</p>
            </div>
            <div>
              <label style={{ color: '#666', fontSize: '0.8rem' }}>Endereço Completo:</label>
              <p>
                <strong>
                  {paciente.logradouro || ''}, {paciente.numero || 'S/N'} 
                  {paciente.complemento ? ` (${paciente.complemento})` : ''} - {paciente.bairro || ''}, 
                  {paciente.cidade || ''} - {paciente.estado || ''}
                </strong>
              </p>
              <p><strong>CEP:</strong> {paciente.cep || '-'}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
            <label style={{ color: '#666', fontSize: '0.8rem' }}>Possui Cuidador?</label>
            <p style={{ marginBottom: paciente.possui_cuidador ? '10px' : '0' }}>
              <strong>{paciente.possui_cuidador ? 'Sim' : 'Não'}</strong>
            </p>
            
            {paciente.possui_cuidador && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <div><label style={{ color: '#666', fontSize: '0.8rem' }}>Nome do Cuidador:</label><p><strong>{paciente.nome_cuidador || '-'}</strong></p></div>
                <div><label style={{ color: '#666', fontSize: '0.8rem' }}>Contato do Cuidador:</label><p><strong>{paciente.contato_cuidador || '-'}</strong></p></div>
              </div>
            )}
          </div>

        </div>
      </Section>

      <Form onSubmit={handleSubmit}>
        <Section>
          <h3><LuStethoscope /> Informações Médicas e Estadiamento</h3>
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
              <input readOnly value={medicoSelecionado?.crm || ''} style={{ backgroundColor: '#e9ecef', color: '#666' }} />
            </FormGroup>
            <FormGroup>
              <label>Local de Atendimento</label>
              <select required value={formData.prestador_medico_id} onChange={e => setFormData({ ...formData, prestador_medico_id: e.target.value })} disabled={!formData.medico_id}>
                <option value="">{!formData.medico_id ? "Escolha um médico primeiro" : "Selecione o Local..."}</option>
                {locaisPermitidos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </FormGroup>
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
            <FormGroup>
              <label>Data do Atendimento</label>
              <input type="date" required value={formData.data_contato} onChange={e => setFormData({ ...formData, data_contato: e.target.value })} />
            </FormGroup>
          </div>
        </Section>

        <Section>
          <h3><LuCircleAlert /> Histórico de Comorbidades</h3>
          <div className="flex-row">
            <input type="checkbox" checked={formData.comorbidade.possui_comorbidade} onChange={e => handleNestedChange('comorbidade', 'possui_comorbidade', e.target.checked)} />
            <label>O paciente possui alguma comorbidade associada?</label>
          </div>
          {formData.comorbidade.possui_comorbidade && (
            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
        </Section>

        <Section>
            <h3><LuFlaskConical /> Registro de Exames Relevantes</h3>
            <div className="flex-row">
                <input type="checkbox" checked={formData.exame.possui_exame} onChange={e => handleNestedChange('exame', 'possui_exame', e.target.checked)} />
                <label>Foram apresentados resultados de exames?</label>
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
                  <FormGroup><label>Realização</label><input type="date" required value={formData.exame.data_exame_realizado} onChange={e => handleNestedChange('exame', 'data_exame_realizado', e.target.value)} /></FormGroup>
                  <FormGroup><label>Laudo</label><input type="date" required value={formData.exame.data_exame_resultado} onChange={e => handleNestedChange('exame', 'data_exame_resultado', e.target.value)} /></FormGroup>
              </div>
            )}
        </Section>

        <Section>
            <h3><LuPill /> Uso de Medicamentos</h3>
            <div className="flex-row">
                <input type="checkbox" checked={possuiMedicamento} onChange={handlePossuiMedicamentoChange} />
                <label>O paciente faz uso de algum medicamento oncológico?</label>
            </div>
            
            {possuiMedicamento && (
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                
                {medicamentosUso.map((medId, index) => {
                  // Busca o objeto completo para mostrar o card, se estiver preenchido
                  const medSelecionado = listaMedicamentos.find(m => m.id === Number(medId));

                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '15px', borderBottom: index !== medicamentosUso.length - 1 ? '1px dashed #ccc' : 'none' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <FormGroup style={{ flex: 1, margin: 0 }}>
                            <label>Medicamento {index + 1}</label>
                            <select 
                              required 
                              value={medId} 
                              onChange={e => handleMedicamentoChange(index, e.target.value)}
                            >
                                <option value="">Selecione o medicamento na lista...</option>
                                {listaMedicamentos.map(m => (
                                  <option key={m.id} value={m.id}>
                                    {m.principio_ativo || m.nome_comercial ? `${m.nome_comercial || ''} (${m.principio_ativo || ''}) - ${m.dosagem || ''}${m.tipo_dosagem || ''}` : m.nome}
                                  </option>
                                ))}
                            </select>
                        </FormGroup>
                        
                        {/* Só mostra botão de remover se houver mais de um select */}
                        {medicamentosUso.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removerSelectMedicamento(index)} 
                            style={{ background: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', padding: '0 15px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            title="Remover este medicamento"
                          >
                             <LuTrash2 size={18} /> Remover
                          </button>
                        )}
                      </div>

                      {/* INFO CARD DO MEDICAMENTO SELECIONADO */}
                      {medSelecionado && (
                        <div style={{ 
                          background: '#fff', 
                          padding: '12px', 
                          borderRadius: '6px', 
                          border: '1px solid #d0d7de',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '10px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#666', fontWeight: 'bold' }}>Nome Comercial</label>
                            <p style={{ margin: '3px 0 0 0', color: '#333', fontSize: '0.85rem' }}>{medSelecionado.nome_comercial || '-'}</p>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#666', fontWeight: 'bold' }}>Princípio Ativo</label>
                            <p style={{ margin: '3px 0 0 0', color: '#333', fontSize: '0.85rem' }}>{medSelecionado.principio_ativo || '-'}</p>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#666', fontWeight: 'bold' }}>Dosagem</label>
                            <p style={{ margin: '3px 0 0 0', color: '#333', fontSize: '0.85rem' }}>
                              {medSelecionado.dosagem ? `${medSelecionado.dosagem} ${medSelecionado.tipo_dosagem || ''}` : '-'}
                            </p>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#666', fontWeight: 'bold' }}>Qtd. Caixa</label>
                            <p style={{ margin: '3px 0 0 0', color: '#333', fontSize: '0.85rem' }}>
                              {medSelecionado.qtd_capsula ? `${medSelecionado.qtd_capsula} cápsulas/comp.` : '-'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button 
                  type="button" 
                  onClick={adicionarSelectMedicamento} 
                  style={{ 
                    background: '#0052cc', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '10px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: 'fit-content'
                  }}
                >
                    <LuPlus size={18} /> Adicionar outro medicamento
                </button>
              </div>
            )}
        </Section>

        <Section>
          <h3><LuPaperclip /> Anexos da Entrevista (Exames, Receitas, Laudos)</h3>
          <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            {anexos.map((anexo, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
                    <FormGroup style={{ flex: 1, margin: 0 }}>
                        <label>Nome do Documento</label>
                        <input 
                            placeholder="Ex: Exame de Sangue..."
                            value={anexo.nome}
                            onChange={(e) => handleAnexoChange(index, 'nome', e.target.value)}
                            required
                        />
                    </FormGroup>
                    
                    <FormGroup style={{ flex: 1, margin: 0 }}>
                        <label>Arquivo</label>
                        <input 
                            type="file" 
                            onChange={(e) => handleAnexoChange(index, 'file', e.target.files[0])}
                            required
                        />
                    </FormGroup>

                    <button 
                      type="button" 
                      onClick={() => removerAnexo(index)} 
                      style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 15px', height: '40px', cursor: 'pointer' }}
                    >
                        Remover
                    </button>
                </div>
            ))}

            <button 
              type="button" 
              onClick={adicionarAnexo} 
              style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 15px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}
            >
                + Adicionar Anexo
            </button>
          </div>
        </Section>

        <Section>
          <h3><LuHistory /> Próximos Passos</h3>
          <div className="grid-3">
            <FormGroup><label>Data do Próximo Contato</label><input type="date" value={formData.data_proximo_contato} onChange={e => setFormData({...formData, data_proximo_contato: e.target.value})} /></FormGroup>
            <FormGroup>
              <label>Turno Preferencial</label>
              <select value={formData.turno_contato} onChange={e => setFormData({...formData, turno_contato: e.target.value})}>
                  <option value="Manhã">Manhã</option><option value="Tarde">Tarde</option><option value="Noite">Noite</option>
              </select>
            </FormGroup>
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