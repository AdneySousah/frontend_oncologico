import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { LuSave, LuCircleX } from "react-icons/lu"; 
import { Form, FormGroup, ButtonGroup, ActionButton, FormContainer } from './styles'; // Use o mesmo import de estilo do MedicamentosForm

export default function ReacoesAdversasForm({ reacaoToEdit, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (reacaoToEdit) {
      setName(reacaoToEdit.name);
    } else {
      setName('');
    }
  }, [reacaoToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (reacaoToEdit) {
        await api.put(`/reacao-adversa/${reacaoToEdit.id}`, { name });
        toast.success("Reação atualizada com sucesso!");
      } else {
        await api.post('/reacao-adversa', { name });
        toast.success("Reação cadastrada com sucesso!");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar reação adversa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="full-width">
          <label>Nome da Reação Adversa</label>
          <input 
            name="name"
            placeholder="Ex: Náusea, Fadiga..."
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
            {loading ? 'Salvando...' : (reacaoToEdit ? 'Atualizar' : 'Cadastrar')}
          </ActionButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}