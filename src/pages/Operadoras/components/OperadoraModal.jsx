import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Overlay, ModalContainer, Form, FormGroup, ButtonGroup } from './styles';
import api from '../../../services/api';

const OperadoraModal = ({ isOpen, onClose, operadoraToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    emailStr: '' // Usamos uma string temporária para gerenciar o input
  });

  useEffect(() => {
    if (operadoraToEdit) {
      // Se o email vier como array do banco, juntamos com vírgulas para exibir no input
      const emails = Array.isArray(operadoraToEdit.email) 
        ? operadoraToEdit.email.join(', ') 
        : operadoraToEdit.email || '';

      setFormData({
        nome: operadoraToEdit.nome,
        cnpj: operadoraToEdit.cnpj,
        telefone: operadoraToEdit.telefone,
        emailStr: emails
      });
    } else {
      setFormData({ nome: '', cnpj: '', telefone: '', emailStr: '' });
    }
  }, [operadoraToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transforma a string de emails de volta em array, removendo espaços
    const emailArray = formData.emailStr.split(',').map(email => email.trim()).filter(email => email !== '');

    const dataToSend = {
      nome: formData.nome,
      cnpj: formData.cnpj,
      telefone: formData.telefone,
      email: emailArray // Envia como array para o backend (conforme validação do Yup)
    };

    try {
      if (operadoraToEdit) {
        await api.put(`/operadoras/${operadoraToEdit.id}`, dataToSend);
        toast.success('Operadora atualizada com sucesso!');
      } else {
        await api.post('/operadoras', dataToSend);
        toast.success('Operadora criada com sucesso!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao salvar operadora.';
      // Se houver mensagens detalhadas do Yup
      if (err.response?.data?.messages) {
        err.response.data.messages.forEach(msg => toast.error(`${msg.field}: ${msg.message}`));
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <h2>{operadoraToEdit ? 'Editar Operadora' : 'Nova Operadora'}</h2>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Nome da Operadora</label>
            <input 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>

          <FormGroup>
            <label>CNPJ</label>
            <input 
              name="cnpj" 
              value={formData.cnpj} 
              onChange={handleChange} 
              placeholder="00.000.000/0000-00"
              required 
            />
          </FormGroup>

          <FormGroup>
            <label>Telefone</label>
            <input 
              name="telefone" 
              value={formData.telefone} 
              onChange={handleChange} 
              placeholder="(00) 0000-0000"
              required 
            />
          </FormGroup>

          <FormGroup>
            <label>E-mails (Separe por vírgula)</label>
            <input 
              name="emailStr" 
              value={formData.emailStr} 
              onChange={handleChange} 
              placeholder="ex: financeiro@operadora.com, autorizacao@operadora.com"
            />
            <small>Você pode inserir múltiplos e-mails.</small>
          </FormGroup>

          <ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save">Salvar</button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default OperadoraModal;