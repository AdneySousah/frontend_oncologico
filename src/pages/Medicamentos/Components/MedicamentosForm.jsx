import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { LuSave, LuCircleX } from "react-icons/lu"; 
import { Form, FormGroup, ButtonGroup, ActionButton, FormContainer } from '../styles';

export default function MedicamentosForm({ medicamentoToEdit, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  
  // Agrupando todos os campos em um único state
  const [formData, setFormData] = useState({
    codigo_tuss: '',
    nome_comercial: '',
    principio_ativo: '',
    nome: '',
    laboratorio: '',
    tipo_produto: '',
    dosagem: '',
    tipo_dosagem: '',
    qtd_capsula: '',
    descricao: ''
  });

  useEffect(() => {
    if (medicamentoToEdit) {
      setFormData({
        codigo_tuss: medicamentoToEdit.codigo_tuss || '',
        nome_comercial: medicamentoToEdit.nome_comercial || '',
        principio_ativo: medicamentoToEdit.principio_ativo || '',
        nome: medicamentoToEdit.nome || '',
        laboratorio: medicamentoToEdit.laboratorio || '',
        tipo_produto: medicamentoToEdit.tipo_produto || '',
        dosagem: medicamentoToEdit.dosagem || '',
        tipo_dosagem: medicamentoToEdit.tipo_dosagem || '',
        qtd_capsula: medicamentoToEdit.qtd_capsula || '',
        descricao: medicamentoToEdit.descricao || ''
      });
    }
  }, [medicamentoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Converte qtd_capsula para número caso não esteja vazio
    const payload = { ...formData };
    if (payload.qtd_capsula) payload.qtd_capsula = parseInt(payload.qtd_capsula, 10);

    try {
      if (medicamentoToEdit) {
        await api.put(`/medicamentos/${medicamentoToEdit.id}`, payload);
        toast.success("Medicamento atualizado!");
      } else {
        await api.post('/medicamentos', payload);
        toast.success("Medicamento cadastrado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar medicamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Código TUSS</label>
          <input 
            name="codigo_tuss"
            placeholder="Ex: 90433165"
            value={formData.codigo_tuss} 
            onChange={handleChange} 
          />
        </FormGroup>

        <FormGroup>
          <label>Nome Comercial</label>
          <input 
            name="nome_comercial"
            placeholder="Ex: VERZENIOS"
            value={formData.nome_comercial} 
            onChange={handleChange} 
          />
        </FormGroup>

        <FormGroup>
          <label>Princípio Ativo</label>
          <input 
            name="principio_ativo"
            placeholder="Ex: ABEMACICLIBE"
            value={formData.principio_ativo} 
            onChange={handleChange} 
          />
        </FormGroup>

        <FormGroup>
          <label>Laboratório</label>
          <input 
            name="laboratorio"
            placeholder="Ex: ELI LILLY"
            value={formData.laboratorio} 
            onChange={handleChange} 
          />
        </FormGroup>

        <FormGroup>
          <label>Tipo de Produto</label>
          <select name="tipo_produto" value={formData.tipo_produto} onChange={handleChange}>
            <option value="">Selecione...</option>
            <option value="REFERENCIA">Referência</option>
            <option value="GENERICO">Genérico</option>
            <option value="BIOSSIMILAR">Biossimilar</option>
          </select>
        </FormGroup>

        <FormGroup style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Dosagem</label>
            <input 
              name="dosagem"
              placeholder="Ex: 150"
              value={formData.dosagem} 
              onChange={handleChange} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Unidade</label>
            <select name="tipo_dosagem" value={formData.tipo_dosagem} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="MG">MG</option>
              <option value="G">G</option>
              <option value="MCG">MCG</option>
              <option value="UI">UI</option>
              <option value="ML">ML</option>
              <option value="MG/ML">MG/ML</option>
            </select>
          </div>
        </FormGroup>

        <FormGroup>
          <label>Qtd. Cápsulas/Comprimidos</label>
          <input 
            name="qtd_capsula"
            type="number"
            placeholder="Ex: 30"
            value={formData.qtd_capsula} 
            onChange={handleChange} 
          />
        </FormGroup>

        <FormGroup className="full-width">
          <label>Nome Completo (Apresentação)</label>
          <input 
            name="nome"
            placeholder="Ex: ABEMACICLIBE 150 MG COM REV CT BL AL AL X 30"
            value={formData.nome} 
            onChange={handleChange} 
            required
          />
        </FormGroup>

        <FormGroup className="full-width">
          <label>Descrição Opcional</label>
          <textarea 
            name="descricao"
            placeholder="Observações ou descrição detalhada..."
            value={formData.descricao} 
            onChange={handleChange} 
          />
        </FormGroup>

        <ButtonGroup>
          <ActionButton type="button" className="cancel" onClick={onCancel}>
            <LuCircleX size={20} /> Cancelar
          </ActionButton>
          
          <ActionButton type="submit" className="save" disabled={loading}>
            <LuSave size={20} />
            {loading ? 'Salvando...' : (medicamentoToEdit ? 'Atualizar' : 'Cadastrar')}
          </ActionButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}