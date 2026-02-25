import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { LuSave, LuCircleX, LuMapPin } from "react-icons/lu"; 
import axios from 'axios'; // Importando o axios para buscar o CEP direto no front
import { 
  Form, 
  FormGroup, 
  ButtonGroup, 
  ActionButton, 
  FormContainer 
} from './styles';

export default function PrestadoresForm({ prestadorToEdit, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '', 
    cnpj: '', 
    cep: '', 
    tipo: 'clinica', 
    numero: '', 
    complemento: '',
    // Adicionando os campos de endereço ao estado
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  useEffect(() => {
    if (prestadorToEdit) setFormData(prestadorToEdit);
  }, [prestadorToEdit]);

  // Função disparada ao sair do campo de CEP
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return; // Só busca se tiver 8 dígitos

    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (data.erro) {
        toast.error("CEP não encontrado!");
        return;
      }

      // Atualiza o estado com os dados recebidos para visualização
      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      }));
    } catch (error) {
      toast.error("Erro ao buscar informações do CEP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (prestadorToEdit) {
        await api.put(`/prestadores-medicos/${prestadorToEdit.id}`, formData);
        toast.success("Prestador médico atualizado!");
      } else {
        await api.post('/prestadores-medicos', formData);
        toast.success("Novo prestador cadastrado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="full-width">
          <label>Nome / Razão Social</label>
          <input 
            placeholder="Ex: Hospital Central de Sabará"
            value={formData.nome} 
            onChange={e => setFormData({...formData, nome: e.target.value})} 
            required
          />
        </FormGroup>

        <FormGroup>
          <label>CNPJ</label>
          <input 
            placeholder="00.000.000/0000-00"
            value={formData.cnpj} 
            onChange={e => setFormData({...formData, cnpj: e.target.value})} 
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Tipo de Unidade</label>
          <select 
            value={formData.tipo} 
            onChange={e => setFormData({...formData, tipo: e.target.value})}
          >
            <option value="hospital">Hospital</option>
            <option value="clinica">Clínica</option>
            <option value="laboratorio">Laboratório</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>CEP</label>
          <div style={{ position: 'relative' }}>
            <input 
              placeholder="00000-000"
              value={formData.cep} 
              onChange={e => setFormData({...formData, cep: e.target.value})} 
              onBlur={handleCepBlur} /* EVENTO ADICIONADO AQUI */
              required
            />
            <LuMapPin 
              size={18} 
              style={{ position: 'absolute', right: '15px', top: '15px', color: '#ccc' }} 
            />
          </div>
        </FormGroup>

        {/* CAMPOS VISUAIS (Apenas Leitura) PARA CONFIRMAÇÃO DO ENDEREÇO */}
        <FormGroup className="full-width">
          <label>Logradouro Confirmado</label>
          <input 
            value={formData.logradouro} 
            readOnly 
            disabled 
            placeholder="Preenchido automaticamente pelo CEP"
           
          />
        </FormGroup>

        <div style={{ display: 'flex', gap: '15px', width: '100%', gridColumn: '1 / -1' }}>
          <FormGroup style={{ flex: 1 }}>
            <label>Bairro</label>
            <input 
              value={formData.bairro} 
              readOnly 
              disabled 
             
            />
          </FormGroup>
          <FormGroup style={{ flex: 1 }}>
            <label>Cidade / UF</label>
            <input 
              value={formData.cidade ? `${formData.cidade} - ${formData.estado}` : ''} 
              readOnly 
              disabled 
             
            />
          </FormGroup>
        </div>
        {/* FIM DOS CAMPOS VISUAIS */}

        <FormGroup>
          <label>Número</label>
          <input 
            placeholder="Ex: 123 ou S/N"
            value={formData.numero} 
            onChange={e => setFormData({...formData, numero: e.target.value})} 
          />
        </FormGroup>

        <FormGroup>
          <label>Complemento (Opcional)</label>
          <input 
            placeholder="Ex: Bloco A, Sala 202"
            value={formData.complemento} 
            onChange={e => setFormData({...formData, complemento: e.target.value})} 
          />
        </FormGroup>

        <ButtonGroup>
          <ActionButton 
            type="button" 
            className="cancel" 
            onClick={onCancel}
          >
            <LuCircleX size={20} /> 
            Cancelar
          </ActionButton>
          
          <ActionButton 
            type="submit" 
            className="save" 
            disabled={loading}
          >
            <LuSave size={20} />
            {loading ? 'Salvando...' : (prestadorToEdit ? 'Atualizar Dados' : 'Cadastrar Prestador')}
          </ActionButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}