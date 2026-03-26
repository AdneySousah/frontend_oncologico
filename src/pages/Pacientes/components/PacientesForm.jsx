import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import AutoFillComponent from './AutoFillComponent'; // Importe o novo componente

import { 
  Form, FormGroup, ButtonGroup, Button, ModalOverlay, ModalContent, ModalActions,
  SectionTitle, StatusBadge, CheckboxGroup, AttachmentsContainer, AttachmentItem
} from '../styles';

export default function PacientesForm({ pacienteToEdit, onSuccess, onCancel, isAdmin }) {
  const [operadoras, setOperadoras] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loadingCep, setLoadingCep] = useState(false);
  const [historicoNomes, setHistoricoNomes] = useState([]);
  const [anexos, setAnexos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitAction, setSubmitAction] = useState('save');

  // Estado para destacar o medicamento após a IA preencher o resto
  const [highlightMedicamento, setHighlightMedicamento] = useState(false);

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
    api.get('/operadoras/filtro').then(res => {
        const data = res.data;
        setOperadoras(data);
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

  // --- NOVA FUNÇÃO QUE RECEBE OS DADOS DO COMPONENTE DE IA ---
  const handleAutoFillSuccess = (extractedData, documentFile) => {
    setFormData(prev => {
      const isRestrito = operadoras.length === 1;
      const operadoraDefinitiva = isRestrito ? operadoras[0].id : (extractedData.operadora_id || prev.operadora_id);

      return {
        ...prev,
        ...extractedData,
        operadora_id: operadoraDefinitiva,
        possui_cuidador: extractedData.possui_cuidador === true || extractedData.possui_cuidador === 'true',
        medicamento_id: prev.medicamento_id // Mantém o estado atual, forçando a seleção manual
      };
    });

    if (documentFile) {
      setAnexos(prev => [
        ...prev, 
        { nome: 'Documento de cadastro da operadora', file: documentFile }
      ]);
    }
    
    toast.success("Dados preenchidos!");
    setHighlightMedicamento(true);
    toast.info("Por favor, selecione o medicamento manualmente.");
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
          dataToSend.set(key, value === null ? '' : value);
        }
      });

      if (pacienteToEdit && submitAction === 'confirm') {
        dataToSend.set('is_new_user', 'false');
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
  const isOperadoraUnica = operadoras.length === 1;

  return (
    <>
      <Form onSubmit={handlePreSubmit}>
        
        {/* Renderiza o componente isolado de Preenchimento Inteligente */}
        {!pacienteToEdit && (
          <AutoFillComponent onFillData={handleAutoFillSuccess} />
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
            disabled={isOperadoraUnica}
            style={{ cursor: isOperadoraUnica ? 'not-allowed' : 'pointer' }}
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
          {highlightMedicamento && <span style={{color: '#dc3545', fontSize: '12px', fontWeight: 'bold'}}>Seleção obrigatória após o preenchimento inteligente</span>}
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

          {pacienteToEdit && pacienteToEdit.is_new_user && isAdmin === true && (
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
    </>
  );
}