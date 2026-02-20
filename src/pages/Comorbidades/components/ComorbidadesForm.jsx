import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { LuSave, LuCircleX } from "react-icons/lu"; 
import { Form, FormGroup, ButtonGroup, ActionButton, FormContainer } from '../styles';

export default function ComorbidadesForm({ comorbidadeToEdit, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (comorbidadeToEdit) setNome(comorbidadeToEdit.nome);
  }, [comorbidadeToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (comorbidadeToEdit) {
        // Se você adicionar o método update no backend futuramente:
        await api.put(`/comorbidades/${comorbidadeToEdit.id}`, { nome });
        toast.success("Comorbidade atualizada!");
      } else {
        await api.post('/comorbidades', { nome });
        toast.success("Comorbidade cadastrada com sucesso!");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar comorbidade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Nome da Comorbidade</label>
          <input 
            placeholder="Ex: Diabetes Mellitus, Hipertensão, etc."
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required
          />
        </FormGroup>

        <ButtonGroup>
          <ActionButton type="button" className="cancel" onClick={onCancel}>
            <LuCircleX size={20} /> Cancelar
          </ActionButton>
          
          <ActionButton type="submit" className="save" disabled={loading}>
            <LuSave size={20} />
            {loading ? 'Salvando...' : (comorbidadeToEdit ? 'Atualizar' : 'Cadastrar')}
          </ActionButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}