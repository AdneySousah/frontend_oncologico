import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { LuSave, LuCircleX } from "react-icons/lu"; 
import { Form, FormGroup, ButtonGroup, ActionButton, FormContainer } from './styles'; 

export default function DiagnosticosForm({ diagToEdit, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [diagnostico, setDiagnostico] = useState('');

  useEffect(() => {
    if (diagToEdit) {
      setDiagnostico(diagToEdit.diagnostico);
    } else {
      setDiagnostico('');
    }
  }, [diagToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (diagToEdit) {
        await api.put(`/diagnosticos/${diagToEdit.id}`, { diagnostico });
        toast.success("Diagnóstico atualizado com sucesso!");
      } else {
        await api.post('/diagnosticos', { diagnostico });
        toast.success("Diagnóstico cadastrado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar diagnóstico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="full-width">
          <label>Nome do Diagnóstico / CID</label>
          <input 
            name="diagnostico"
            placeholder="Ex: C61 - Neoplasia maligna da próstata"
            value={diagnostico} 
            onChange={(e) => setDiagnostico(e.target.value)} 
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
            {loading ? 'Salvando...' : (diagToEdit ? 'Atualizar' : 'Cadastrar')}
          </ActionButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}