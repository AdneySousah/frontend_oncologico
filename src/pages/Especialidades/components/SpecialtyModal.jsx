import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import * as S from './styles'; // Importando as tags estilizadas do novo arquivo

const SpecialtyModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) setName('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/specialities', { name });
      toast.success('Especialidade cadastrada!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Erro ao cadastrar especialidade.');
    }
  };

  return (
    <S.Overlay>
      <S.ModalContainer>
        <h2>Nova Especialidade</h2>
        <form onSubmit={handleSubmit}>
          
          <S.FormGroup>
            <label>Nome da Especialidade</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Ex: Oncologia Clínica"
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

export default SpecialtyModal;