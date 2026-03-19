import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { LuSave, LuCircleX } from "react-icons/lu"; 
import { Form, FormGroup, ButtonGroup, ActionButton, FormContainer } from './styles'; 

export default function EspecialidadesForm({ specialtyToEdit, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (specialtyToEdit) {
      setName(specialtyToEdit.name);
    } else {
      setName('');
    }
  }, [specialtyToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (specialtyToEdit) {
        await api.put(`/specialities/${specialtyToEdit.id}`, { name });
        toast.success("Especialidade atualizada com sucesso!");
      } else {
        await api.post('/specialities', { name });
        toast.success("Especialidade cadastrada com sucesso!");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar especialidade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="full-width">
          <label>Nome da Especialidade</label>
          <input 
            name="name"
            placeholder="Ex: Oncologia Clínica, Cirurgia..."
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
            autoFocus
          />
        </FormGroup>

        <ButtonGroup>
          <ActionButton type="button" className="cancel" onClick={onCancel}>
            <LuCircleX size={20} /> Cancelar
          </ActionButton>
          
          <ActionButton type="submit" className="save" disabled={loading}>
            <LuSave size={20} />
            {loading ? 'Salvando...' : (specialtyToEdit ? 'Atualizar' : 'Cadastrar')}
          </ActionButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}