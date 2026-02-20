import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { Overlay, ModalContainer, FormGroup, ButtonGroup } from './styles';

const DiagnosticoModal = ({ isOpen, onClose, diagToEdit, onSuccess }) => {
  const [diagnostico, setDiagnostico] = useState('');

  useEffect(() => {
    if (diagToEdit) {
      setDiagnostico(diagToEdit.diagnostico);
    } else {
      setDiagnostico('');
    }
  }, [diagToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (diagToEdit) {
        await api.put(`/diagnosticos/${diagToEdit.id}`, { diagnostico });
        toast.success('Diagnóstico atualizado!');
      } else {
        await api.post('/diagnosticos', { diagnostico });
        toast.success('Diagnóstico cadastrado!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao processar dados";
      toast.error(msg);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <h2>{diagToEdit ? 'Editar Diagnóstico' : 'Novo Diagnóstico'}</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Nome do Diagnóstico / CID</label>
            <input 
              value={diagnostico} 
              onChange={(e) => setDiagnostico(e.target.value)} 
              required 
              placeholder="Ex: C61 - Neoplasia maligna da próstata"
            />
          </FormGroup>
          <ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save">Salvar</button>
          </ButtonGroup>
        </form>
      </ModalContainer>
    </Overlay>
  );
};

export default DiagnosticoModal;