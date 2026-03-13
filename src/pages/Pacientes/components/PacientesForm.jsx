import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import axios from 'axios';
import { toast } from 'react-toastify';

import { 
  Form, FormGroup, ButtonGroup, Button, ModalOverlay, ModalContent, ModalActions,
  SectionTitle, StatusBadge, CheckboxGroup, AttachmentsContainer, AttachmentItem,
  AutoFillContainer, AutoFillText, ResultBox
} from '../styles';

export default function PacientesForm({ pacienteToEdit, onSuccess, onCancel, isAdmin }) {
  const [operadoras, setOperadoras] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loadingCep, setLoadingCep] = useState(false);
  const [historicoNomes, setHistoricoNomes] = useState([]);
  const [anexos, setAnexos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para saber qual botão de submit foi clicado ('save' ou 'confirm')
  const [submitAction, setSubmitAction] = useState('save');

  // --- ESTADOS PARA A IA ---
  const [isAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [autoFillModalOpen, setAutoFillModalOpen] = useState(false);
  const [autoFillResult, setAutoFillResult] = useState(null);
  const [pendingDocFile, setPendingDocFile] = useState(null);
  
  // Novos estados para a seleção de medicamento
  const [medicamentoSelecionadoIA, setMedicamentoSelecionadoIA] = useState('');
  const [highlightMedicamento, setHighlightMedicamento] = useState(false);
  const fileInputRef = useRef(null); 

  const camposMapeados = {
    nomeCompleto: "Nome Completo", cpf: "CPF", data_nascimento: "Data Nasc.",
    sexo: "Sexo", celular: "Celular", telefone: "Telefone", cep: "CEP",
    logradouro: "Logradouro", numero: "Número", complemento: "Complemento",
    bairro: "Bairro", cidade: "Cidade", estado: "Estado", possui_cuidador: "Possui Cuidador",
    nome_cuidador: "Nome Cuidador", contato_cuidador: "Contato Cuidador"
  };

  const [formData, setFormData] = useState({
    nomeCompleto: '', cpf: '',
    data_nascimento: '', sexo: '',
    celular: '', telefone: '',
    cep: '', possui_cuidador: false,
    nome_cuidador: '', contato_cuidador: '',
    operadora_id: '', 
    medicamento_id: '',
    logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '',
    fez_entrevista: false
  });

  useEffect(() => {
    // 1. CHAMA A ROTA COM FILTRO (Igual ao ImportarPacientes)
    api.get('/operadoras/filtro').then(res => {
        const data = res.data;
        setOperadoras(data);
        
        // 2. AUTO PREENCHIMENTO DA OPERADORA
        // Se retornar apenas 1 operadora e for um NOVO cadastro, já seta ela no formulário
        if (data.length === 1 && !pacienteToEdit) {
            setFormData(prev => ({ ...prev, operadora_id: data[0].id }));
        }
    }).catch(console.error);

    api.get('/anexos/nomes').then(res => setHistoricoNomes(res.data)).catch(console.error);
    api.get('/medicamentos').then(res => setMedicamentos(res.data)).catch(console.error);

    if (pacienteToEdit) {
      const nomeJunto = `${pacienteToEdit.nome || ''} ${pacienteToEdit.sobrenome || ''}`.trim();
      setFormData({
        ...pacienteToEdit,
        nomeCompleto: nomeJunto,
        data_nascimento: pacienteToEdit.data_nascimento ? pacienteToEdit.data_nascimento.split('T')[0] : '',
        operadora_id: pacienteToEdit.operadora_id || '',
        medicamento_id: pacienteToEdit.medicamento_id || '',
        logradouro: pacienteToEdit.logradouro || '',
        numero: pacienteToEdit.numero || '',
        complemento: pacienteToEdit.complemento || '',
        bairro: pacienteToEdit.bairro || '',
        cidade: pacienteToEdit.cidade || '',
        estado: pacienteToEdit.estado || '',
        possui_cuidador: pacienteToEdit.possui_cuidador || false,
        fez_entrevista: pacienteToEdit.fez_entrevista || false
      });
    }
  }, [pacienteToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    if (name === 'nomeCompleto' && typeof finalValue === 'string') {
      const preposicoes = ['da', 'de', 'do', 'das', 'dos'];
      finalValue = finalValue.split(' ').map((word, index) => {
        if (!word) return '';
        const lowerWord = word.toLowerCase();
        if (preposicoes.includes(lowerWord) && index !== 0) return lowerWord;
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    if (name === 'medicamento_id') setHighlightMedicamento(false);
  };

  const handleCepChange = async (e) => {
    const cepValue = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, cep: cepValue }));

    if (cepValue.length === 8) {
      setLoadingCep(true);
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cepValue}/json/`);
        if (data.erro) { toast.error("CEP não encontrado."); return; }
        setFormData(prev => ({
          ...prev, logradouro: data.logradouro || '', bairro: data.bairro || '',
          cidade: data.localidade || '', estado: data.uf || '', numero: '', complemento: ''
        }));
        toast.success("Endereço preenchido!");
      } catch (error) { toast.error("Erro ao buscar o CEP."); } 
      finally { setLoadingCep(false); }
    }
  };

  const triggerAutoFillUpload = () => fileInputRef.current.click();

  const handleAutoFillUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'image/jpeg', 'image/png', 'image/webp', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, envie uma Imagem, PDF ou documento Word.");
      return;
    }

    setPendingDocFile(file);
    const dataToSend = new FormData();
    dataToSend.append('documento', file);

    setIsAutoFillLoading(true);
    setMedicamentoSelecionadoIA(''); 
    
    try {
      const response = await api.post('/pacientes/autofill', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAutoFillResult(response.data);
      setAutoFillModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao processar o documento com IA.");
    } finally {
      setIsAutoFillLoading(false);
      e.target.value = null; 
    }
  };

  const processarPreenchimento = (isManualMedication) => {
    if (autoFillResult) {
      setFormData(prev => {
        // 3. TRAVA DA IA: Impede a IA de mudar a operadora se o usuário for restrito
        const isRestrito = operadoras.length === 1;
        const operadoraDefinitiva = isRestrito ? operadoras[0].id : (autoFillResult.operadora_id || prev.operadora_id);

        return {
          ...prev,
          ...autoFillResult,
          operadora_id: operadoraDefinitiva,
          possui_cuidador: autoFillResult.possui_cuidador === true || autoFillResult.possui_cuidador === 'true',
          medicamento_id: isManualMedication ? prev.medicamento_id : medicamentoSelecionadoIA
        };
      });

      if (pendingDocFile) {
        setAnexos(prev => [
          ...prev, 
          { nome: 'Documento de cadastro da operadora', file: pendingDocFile }
        ]);
      }
      toast.success("Dados preenchidos!");
      
      if (isManualMedication) {
        setHighlightMedicamento(true);
        toast.info("Por favor, selecione o medicamento manualmente no formulário.");
      }
    }
    setAutoFillModalOpen(false);
  };

  const adicionarAnexo = () => setAnexos([...anexos, { nome: '', file: null }]);
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

  const handlePreSubmit = (e) => {
    e.preventDefault();
    const partesNome = formData.nomeCompleto.trim().split(' ');
    if (partesNome.length < 2) {
      toast.warning("Por favor, insira o nome completo (nome e sobrenome).");
      return;
    }
    if (!formData.medicamento_id) {
      toast.warning("A seleção do medicamento é obrigatória.");
      setHighlightMedicamento(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);
    try {
      const dataToSend = new FormData();
      const partesNome = formData.nomeCompleto.trim().split(' ');
      dataToSend.append('nome', partesNome[0] || '');
      dataToSend.append('sobrenome', partesNome.slice(1).join(' ') || '');

      Object.keys(formData).forEach(key => {
        if (!['nomeCompleto', 'nome', 'sobrenome'].includes(key)) {
          let value = formData[key];
          if (key === 'cpf') value = value.replace(/\D/g, '');
          dataToSend.append(key, value === null ? '' : value);
        }
      });

      if (pacienteToEdit && submitAction === 'confirm') {
        dataToSend.append('is_new_user', 'false');
      }

      anexos.forEach((anexo) => {
        if (anexo.file && anexo.nome) {
          dataToSend.append('anexos_files', anexo.file);
          dataToSend.append('anexos_nomes', anexo.nome);
        }
      });

      if (pacienteToEdit) {
        await api.put(`/pacientes/${pacienteToEdit.id}`, dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (submitAction === 'confirm') {
          toast.success("Paciente confirmado e dados atualizados!");
        } else {
          toast.success("Dados atualizados!");
        }
      } else {
        await api.post('/pacientes', dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success("Paciente cadastrado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erro ao processar solicitação";
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    }
  };

  const nomeOperadoraSelecionada = operadoras.find(op => String(op.id) === String(formData.operadora_id))?.nome || 'Não informada';
  const primeiroNomePaciente = formData.nomeCompleto.trim().split(' ')[0] || 'este paciente';

  const renderAutoFillModal = () => {
    if (!autoFillResult) return null;
    
    const excludedKeys = ['medicamento_extraido', 'medicamentos_sugeridos'];
    const encontrados = Object.keys(autoFillResult).filter(k => !excludedKeys.includes(k) && autoFillResult[k] !== '' && autoFillResult[k] !== null && autoFillResult[k] !== false);
    const naoEncontrados = Object.keys(camposMapeados).filter(k => !encontrados.includes(k));

    const medExtraido = autoFillResult.medicamento_extraido;
    const medSugeridos = autoFillResult.medicamentos_sugeridos || [];

    return (
      <ModalOverlay style={{ zIndex: 1000 }}>
        <ModalContent style={{ width: '550px', maxHeight: '85vh', overflowY: 'auto' }}>
          <h3 style={{ color: '#007bff', marginBottom: '15px' }}>🚀 Análise de Documento Concluída</h3>
          
          {medExtraido && (
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '5px', marginBottom: '15px', border: '1px solid #ced4da', textAlign: 'left' }}>
              <h4 style={{ color: '#495057', marginBottom: '10px' }}>💊 Medicamento da Operadora: <strong style={{color: '#007bff'}}>{medExtraido}</strong></h4>
              
              {medSugeridos.length > 0 ? (
                <>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#555', fontWeight: 'bold' }}>Medicamentos relacionados no banco:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                    {medSugeridos.map(med => (
                      <label key={med.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                        <input 
                          type="radio" 
                          name="med_sugerido" 
                          value={med.id}
                          checked={String(medicamentoSelecionadoIA) === String(med.id)}
                          onChange={() => setMedicamentoSelecionadoIA(med.id)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        {med.nome} {med.dosagem ? `- ${med.dosagem}` : ''} 
                        <span style={{ fontSize: '12px', background: '#e9ecef', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>
                          {(med.rating * 100).toFixed(0)}% match
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '13px', color: '#856404', background: '#fff3cd', padding: '8px', borderRadius: '4px' }}>
                  Nenhum medicamento com 70% ou mais de semelhança encontrado no banco. Escolha manual necessária.
                </p>
              )}
            </div>
          )}

          <ResultBox className="success">
            <h4>✅ Outros Dados Encontrados:</h4>
            <ul>
              {encontrados.length > 0 ? encontrados.map(k => (
                <li key={k}><strong>{camposMapeados[k]}:</strong> {String(autoFillResult[k])}</li>
              )) : <li>Nenhum dado extra legível encontrado.</li>}
            </ul>
          </ResultBox>

          <ResultBox className="warning">
            <h4>⚠️ Requer Preenchimento Manual:</h4>
            <ul>
              {naoEncontrados.length > 0 ? naoEncontrados.map(k => (
                <li key={k}>{camposMapeados[k]}</li>
              )) : <li>Todos os campos base foram encontrados!</li>}
            </ul>
          </ResultBox>

          <ModalActions style={{ flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <Button type="button" onClick={() => setAutoFillModalOpen(false)} color="#6c757d">Cancelar</Button>
              <Button type="button" onClick={() => processarPreenchimento(true)} color="#17a2b8">Escolher Manualmente</Button>
            </div>
            <Button 
              type="button" 
              onClick={() => processarPreenchimento(false)} 
              color="#28a745" 
              style={{ width: '100%' }}
              disabled={medSugeridos.length > 0 && !medicamentoSelecionadoIA}
            >
              Confirmar Medicamento e Preencher
            </Button>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    );
  };

  // 4. VERIFICAÇÃO PARA O BLOQUEIO VISUAL
  const isOperadoraUnica = operadoras.length === 1;

  return (
    <>
      <Form onSubmit={handlePreSubmit}>
        
        {!pacienteToEdit && (
          <AutoFillContainer>
            <AutoFillText>
              <h4>Preenchimento Inteligente</h4>
              <p>Envie um documento (imagem) para preencher os dados automaticamente.</p>
            </AutoFillText>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/jpeg, image/png, image/webp, application/pdf, .doc, .docx" 
              onChange={handleAutoFillUpload} 
            />
            <Button type="button" onClick={triggerAutoFillUpload} disabled={isAutoFillLoading}>
              {isAutoFillLoading ? '⏳ Lendo documento...' : '📄 Enviar Doc. de Auto Preenchimento'}
            </Button>
          </AutoFillContainer>
        )}

        <SectionTitle>
          {pacienteToEdit ? `Editando: ${pacienteToEdit.nome}` : 'Informações Pessoais'}
          {pacienteToEdit && pacienteToEdit.is_new_user && <StatusBadge>Aguardando Confirmação</StatusBadge>}
        </SectionTitle>

        <FormGroup className="full-width">
          <label>Nome Completo *</label>
          <input name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <label>CPF *</label>
          <input name="cpf" value={formData.cpf} onChange={handleChange} required disabled={!!pacienteToEdit} />
        </FormGroup>

        <FormGroup>
          <label>Data de Nascimento *</label>
          <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <label>Sexo *</label>
          <select name="sexo" value={formData.sexo} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="nao definido">Não Definido</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Operadora *</label>
          <select 
            name="operadora_id" 
            value={formData.operadora_id} 
            onChange={handleChange} 
            required
            disabled={isOperadoraUnica} // DESABILITA SE FOR ÚNICA
            style={{ 
              
              cursor: isOperadoraUnica ? 'not-allowed' : 'pointer' 
            }}
          >
            <option value="">Selecione</option>
            {operadoras.map(op => <option key={op.id} value={op.id}>{op.nome}</option>)}
          </select>
        </FormGroup>

        <FormGroup>
          <label>Medicamento Vinculado *</label>
          <select 
            name="medicamento_id" 
            value={formData.medicamento_id} 
            onChange={handleChange} 
            required
            style={{ 
              boxShadow: highlightMedicamento ? '0 0 8px rgba(220, 53, 69, 0.8)' : 'none',
              borderColor: highlightMedicamento ? '#dc3545' : '',
              transition: 'all 0.3s'
            }}
          >
            <option value="">Selecione</option>
            {medicamentos.map(med => (
              <option key={med.id} value={med.id}>{med.nome} {med.dosagem ? `- ${med.dosagem}` : ''}</option>
            ))}
          </select>
          {highlightMedicamento && <span style={{color: '#dc3545', fontSize: '12px'}}>Seleção obrigatória</span>}
        </FormGroup>

        <FormGroup>
          <label>Celular *</label>
          <input name="celular" value={formData.celular} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <label>Telefone Fixo</label>
          <input name="telefone" value={formData.telefone} onChange={handleChange} />
        </FormGroup>

        <SectionTitle>Endereço</SectionTitle>

        <FormGroup>
          <label>CEP {loadingCep && <span style={{ fontSize: '12px', color: 'blue' }}> (Buscando...)</span>}</label>
          <input name="cep" value={formData.cep} onChange={handleCepChange} maxLength="8" />
        </FormGroup>

        <FormGroup className="full-width">
          <label>Logradouro *</label>
          <input name="logradouro" value={formData.logradouro} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <label>Número *</label>
          <input name="numero" value={formData.numero} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <label>Complemento</label>
          <input name="complemento" value={formData.complemento} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <label>Bairro *</label>
          <input name="bairro" value={formData.bairro} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <label>Cidade *</label>
          <input name="cidade" value={formData.cidade} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <label>Estado (UF) *</label>
          <input name="estado" value={formData.estado} onChange={handleChange} maxLength="2" required />
        </FormGroup>

        <CheckboxGroup>
          <input type="checkbox" name="possui_cuidador" checked={formData.possui_cuidador} onChange={handleChange} id="cuidador_check" />
          <label htmlFor="cuidador_check">Possui cuidador responsável?</label>
        </CheckboxGroup>

        {formData.possui_cuidador && (
          <>
            <FormGroup>
              <label>Nome do Cuidador</label>
              <input name="nome_cuidador" value={formData.nome_cuidador} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Contato do Cuidador</label>
              <input name="contato_cuidador" value={formData.contato_cuidador} onChange={handleChange} />
            </FormGroup>
          </>
        )}

        <AttachmentsContainer>
          <h4>Anexos do Paciente</h4>
          <datalist id="historico-nomes">
            {historicoNomes.map((nome, idx) => <option key={idx} value={nome} />)}
          </datalist>

          {anexos.map((anexo, index) => (
            <AttachmentItem key={index}>
              <FormGroup style={{ flex: 1, margin: 0 }}>
                <label>Nome do Documento</label>
                <input list="historico-nomes" value={anexo.nome} onChange={(e) => handleAnexoChange(index, 'nome', e.target.value)} required />
              </FormGroup>
              <FormGroup style={{ flex: 1, margin: 0 }}>
                <label>Arquivo</label>
                {anexo.file && <span style={{display:'block', fontSize:'12px', color:'green', marginBottom:'5px'}}>{anexo.file.name}</span>}
                <input type="file" onChange={(e) => handleAnexoChange(index, 'file', e.target.files[0])} required={!anexo.file} />
              </FormGroup>
              <Button type="button" onClick={() => removerAnexo(index)} color="#dc3545">Remover</Button>
            </AttachmentItem>
          ))}
          <Button type="button" onClick={adicionarAnexo} color="#28a745" style={{ marginTop: '10px' }}>+ Adicionar Anexo</Button>
        </AttachmentsContainer>

        <ButtonGroup>
          <Button type="button" onClick={onCancel} color="#6c757d">Cancelar</Button>
          
          {!pacienteToEdit && (
            <Button type="submit" onClick={() => setSubmitAction('save')}>Cadastrar Paciente</Button>
          )}

          {pacienteToEdit && !pacienteToEdit.is_new_user && (
            <Button type="submit" onClick={() => setSubmitAction('save')}>Atualizar Dados</Button>
          )}

          {pacienteToEdit && pacienteToEdit.is_new_user && isAdmin ===true && (
            <Button type="submit" onClick={() => setSubmitAction('confirm')} color="#faad14">Confirmar Cadastro</Button>
          )}
        </ButtonGroup>
      </Form>

      {isModalOpen && (
        <ModalOverlay style={{ zIndex: 1000 }}>
          <ModalContent>
            <h3>Confirmar Operadora</h3>
            <p>A operadora escolhida para <strong>{primeiroNomePaciente}</strong> é a <strong>{nomeOperadoraSelecionada}</strong>?</p>
            <ModalActions>
              <Button type="button" onClick={() => setIsModalOpen(false)} color="#6c757d">Revisar Operadora</Button>
              <Button type="button" onClick={handleConfirmSubmit}>Sim, confirmar e salvar</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {autoFillModalOpen && renderAutoFillModal()}
    </>
  );
}