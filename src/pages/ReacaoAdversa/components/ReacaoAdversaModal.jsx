import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import * as S from './styles'; 

const ReacaoAdversaModal = ({ isOpen, onClose, onSuccess, dataToEdit }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (dataToEdit) {
      setName(dataToEdit.name);
    } else {
      setName('');
    }
  }, [dataToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (dataToEdit) {
        await api.put(`/reacao-adversa/${dataToEdit.id}`, { name });
        toast.success('Reação atualizada!');
      } else {
        await api.post('/reacao-adversa', { name });
        toast.success('Reação cadastrada!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao processar solicitação.');
    }
  };

  return (
    <S.Overlay>
      <S.ModalContainer>
        <h2>{dataToEdit ? 'Editar Reação' : 'Nova Reação Adversa'}</h2>
        <form onSubmit={handleSubmit}>
          <S.FormGroup>
            <label>Nome da Reação</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Ex: Náusea, Fadiga..."
              autoFocus
            />
          </S.FormGroup>
          <S.ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save">Salvar</button>
          </S.ButtonGroup>
        </form>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default ReacaoAdversaModal;