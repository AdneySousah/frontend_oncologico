import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api'; // Ajuste o nível de pastas se necessário
import * as S from './styles'; 

const ReacaoAdversaModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) setName('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reacao-adversa', { name });
      toast.success('Reação adversa cadastrada com sucesso!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Erro ao cadastrar reação adversa.');
    }
  };

  return (
    <S.Overlay>
      <S.ModalContainer>
        <h2>Nova Reação Adversa</h2>
        <form onSubmit={handleSubmit}>
          
          <S.FormGroup>
            <label>Nome da Reação</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Ex: Náusea, Fadiga, Neutropenia..."
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