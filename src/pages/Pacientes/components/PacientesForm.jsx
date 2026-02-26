import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; 
import axios from 'axios'; 
import { toast } from 'react-toastify';
import { Form, FormGroup, ButtonGroup, Button } from '../styles';

export default function PacientesForm({ pacienteToEdit, onSuccess, onCancel }) {
  // Estados Básicos
  const [operadoras, setOperadoras] = useState([]);
  const [loadingCep, setLoadingCep] = useState(false);
  const [historicoNomes, setHistoricoNomes] = useState([]);
  const [anexos, setAnexos] = useState([]); 

  const [formData, setFormData] = useState({
    nomeCompleto: '', cpf: '',
    data_nascimento: '', sexo: '',
    celular: '', telefone: '',
    cep: '', possui_cuidador: false,
    nome_cuidador: '', contato_cuidador: '',
    operadora_id: '',
    logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '',
    fez_entrevista: false
  });

  // Carregar dados iniciais (Operadoras e Histórico de Anexos)
  useEffect(() => {
    api.get('/operadoras').then(res => setOperadoras(res.data)).catch(console.error);
    api.get('/anexos/nomes').then(res => setHistoricoNomes(res.data)).catch(console.error);

    if (pacienteToEdit) {
      // Monta o nome completo juntando o que veio do backend
      const nomeJunto = `${pacienteToEdit.nome || ''} ${pacienteToEdit.sobrenome || ''}`.trim();

      setFormData({
        ...pacienteToEdit,
        nomeCompleto: nomeJunto,
        data_nascimento: pacienteToEdit.data_nascimento ? pacienteToEdit.data_nascimento.split('T')[0] : '',
        operadora_id: pacienteToEdit.operadora_id || '',
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

  // Handle padrão para campos de texto e checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle específico para buscar o CEP
  const handleCepChange = async (e) => {
    const cepValue = e.target.value.replace(/\D/g, ''); 
    setFormData(prev => ({ ...prev, cep: cepValue }));

    if (cepValue.length === 8) {
      setLoadingCep(true);
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cepValue}/json/`);
        
        if (data.erro) {
          toast.error("CEP não encontrado.");
          return;
        }

        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          numero: '',
          complemento: '' 
        }));
        toast.success("Endereço preenchido!");
      } catch (error) {
        toast.error("Erro ao buscar o CEP.");
      } finally {
        setLoadingCep(false);
      }
    }
  };

  // Handles específicos para a lista de Anexos
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
        // Capitaliza a primeira letra do nome do anexo
        const capitalizedValue = value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
        novosAnexos[index][field] = capitalizedValue;
    } else {
        novosAnexos[index][field] = value;
    }
    
    setAnexos(novosAnexos);
  };

  // Submit via FormData (para suportar arquivos)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      
      // --- LÓGICA DE SEPARAÇÃO DO NOME E SOBRENOME ---
      const partesNome = formData.nomeCompleto.trim().split(' ');
      const nomeEnviado = partesNome[0] || '';
      const sobrenomeEnviado = partesNome.slice(1).join(' ') || ''; 

      if (!sobrenomeEnviado) {
        toast.warning("Por favor, insira o nome completo (nome e sobrenome).");
        return; // Interrompe o envio para não dar erro no Yup do backend
      }

      dataToSend.append('nome', nomeEnviado);
      dataToSend.append('sobrenome', sobrenomeEnviado);

      // 1. Adiciona os dados de texto restantes
      Object.keys(formData).forEach(key => {
        // Ignora os campos que já tratamos manualmente acima e chaves indesejadas
        if (key !== 'nomeCompleto' && key !== 'nome' && key !== 'sobrenome') {
          let value = formData[key];
          if (key === 'cpf') value = value.replace(/\D/g, '');
          // FormData só aceita string/blob, então convertemos booleanos e nulls para string
          dataToSend.append(key, value === null ? '' : value);
        }
      });

      // 2. Adiciona os arquivos e os nomes dos anexos
      anexos.forEach((anexo) => {
        if (anexo.file && anexo.nome) {
            dataToSend.append('anexos_files', anexo.file);
            dataToSend.append('anexos_nomes', anexo.nome);
        }
      });

      if (pacienteToEdit) {
        // EDIÇÃO
        await api.put(`/pacientes/${pacienteToEdit.id}`, dataToSend , {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Dados atualizados!");
      } else {
        // CADASTRO
        await api.post('/pacientes', dataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Paciente cadastrado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erro ao processar solicitação";
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3 style={{ gridColumn: '1 / -1', marginBottom: '10px', color: '#555' }}>
        {pacienteToEdit ? `Editando: ${pacienteToEdit.nome}` : 'Informações Pessoais'}
      </h3>

      {/* O campo unificado de Nome Completo */}
      <FormGroup style={{ gridColumn: 'span 2' }}>
        <label>Nome Completo</label>
        <input 
          name="nomeCompleto" 
          value={formData.nomeCompleto} 
          onChange={handleChange} 
          placeholder="Ex: João da Silva"
          required 
        />
      </FormGroup>

      <FormGroup>
        <label>CPF (Apenas números)</label>
        <input name="cpf" value={formData.cpf} onChange={handleChange} required disabled={!!pacienteToEdit} />
      </FormGroup>

      <FormGroup>
        <label>Data de Nascimento</label>
        <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />
      </FormGroup>

      <FormGroup>
        <label>Sexo</label>
        <select name="sexo" value={formData.sexo} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="nao definido">Não Definido</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label>Operadora</label>
        <select name="operadora_id" value={formData.operadora_id} onChange={handleChange} required>
            <option value="">Selecione</option>
            {operadoras.map(op => (
                <option key={op.id} value={op.id}>{op.nome}</option>
            ))}
        </select>
      </FormGroup>

      <FormGroup>
        <label>Celular</label>
        <input name="celular" value={formData.celular} onChange={handleChange} required />
      </FormGroup>

      <FormGroup>
        <label>Telefone Fixo (Opcional)</label>
        <input name="telefone" value={formData.telefone} onChange={handleChange} />
      </FormGroup>

      {/* --- INÍCIO DA SEÇÃO DE ENDEREÇO --- */}
      <h3 style={{ gridColumn: '1 / -1', marginTop: '10px', marginBottom: '10px', color: '#555' }}>Endereço</h3>

      <FormGroup>
        <label>CEP {loadingCep && <span style={{fontSize: '12px', color: 'blue'}}> (Buscando...)</span>}</label>
        <input 
          name="cep" 
          value={formData.cep} 
          onChange={handleCepChange} 
          maxLength="8"
          placeholder="Apenas números"
          required 
        />
      </FormGroup>

      <FormGroup style={{ gridColumn: 'span 2' }}>
        <label>Logradouro (Rua, Avenida...)</label>
        <input name="logradouro" value={formData.logradouro} onChange={handleChange} required />
      </FormGroup>

      <FormGroup>
        <label>Número</label>
        <input name="numero" value={formData.numero} onChange={handleChange} placeholder="Ex: 123 ou S/N" required />
      </FormGroup>

      <FormGroup>
        <label>Complemento</label>
        <input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Bloco..." />
      </FormGroup>

      <FormGroup>
        <label>Bairro</label>
        <input name="bairro" value={formData.bairro} onChange={handleChange} required />
      </FormGroup>

      <FormGroup>
        <label>Cidade</label>
        <input name="cidade" value={formData.cidade} onChange={handleChange} required />
      </FormGroup>

      <FormGroup>
        <label>Estado (UF)</label>
        <input name="estado" value={formData.estado} onChange={handleChange} maxLength="2" required />
      </FormGroup>
      {/* --- FIM DA SEÇÃO DE ENDEREÇO --- */}

      <FormGroup style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
            type="checkbox" 
            name="possui_cuidador" 
            checked={formData.possui_cuidador} 
            onChange={handleChange} 
            style={{ width: '20px', height: '20px' }}
        />
        <label style={{ margin: 0 }}>Possui cuidador responsável?</label>
      </FormGroup>

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

      {/* --- INÍCIO DA SEÇÃO DE ANEXOS --- */}
      <div style={{ gridColumn: '1 / -1', marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h4 style={{ marginBottom: '15px', color: '#555' }}>Anexos do Paciente</h4>
        
        {/* Datalist "invisível" que serve de fonte para os inputs de nome */}
        <datalist id="historico-nomes">
            {historicoNomes.map((nome, idx) => (
                <option key={idx} value={nome} />
            ))}
        </datalist>

        {anexos.map((anexo, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
                <FormGroup style={{ flex: 1, margin: 0 }}>
                    <label>Nome do Documento</label>
                    <input 
                        list="historico-nomes" 
                        placeholder="Ex: Receita, Exame..."
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

                <Button type="button" onClick={() => removerAnexo(index)} style={{ background: '#dc3545', height: '40px' }}>
                    Remover
                </Button>
            </div>
        ))}

        <Button type="button" onClick={adicionarAnexo} style={{ background: '#28a745', marginTop: '10px' }}>
            + Adicionar Anexo
        </Button>
      </div>
      {/* --- FIM DA SEÇÃO DE ANEXOS --- */}

      <ButtonGroup style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
        <Button type="button" onClick={onCancel} style={{ background: '#6c757d' }}>Cancelar</Button>
        <Button type="submit">{pacienteToEdit ? 'Atualizar Dados' : 'Cadastrar Paciente'}</Button>
      </ButtonGroup>
    </Form>
  );
}