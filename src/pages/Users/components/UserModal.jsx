import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Overlay, ModalContainer, Form, FormGroup, ButtonGroup, Button, CheckboxGroup, Select } from './styles';
import api from '../../../services/api';

const UserModal = ({ isOpen, onClose, userToEdit, onSuccess }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
    perfil_id: '', // Adicionado
    operadoras: [],
  });

  const [operadorasList, setOperadorasList] = useState([]);
  const [perfisList, setPerfisList] = useState([]); // Adicionado

  useEffect(() => {
    async function loadData() {
      try {
        const [opsRes, perfisRes] = await Promise.all([
          api.get('/operadoras'),
          api.get('/perfis') // Busca os perfis
        ]);

        setOperadorasList(opsRes.data);
        setPerfisList(perfisRes.data);
      } catch (err) {
        console.error("Falha ao carregar dados auxiliares", err);
      }
    }
    if (isOpen) loadData();
  }, [isOpen]);

  useEffect(() => {
    if (userToEdit) {
      setUserData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '',
        is_admin: userToEdit.is_admin || false,
        perfil_id: userToEdit.perfil_id || '', // Preenche o perfil
        operadoras: userToEdit.operadoras ? userToEdit.operadoras.map(op => op.id) : []
      });
    } else {
      setUserData({ name: '', email: '', password: '', is_admin: false, perfil_id: '', operadoras: [] });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOperadoraToggle = (operadoraId) => {
    setUserData(prev => {
      const isSelected = prev.operadoras.includes(operadoraId);
      if (isSelected) {
        return { ...prev, operadoras: prev.operadoras.filter(id => id !== operadoraId) };
      } else {
        return { ...prev, operadoras: [...prev.operadoras, operadoraId] };
      }
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userData.perfil_id) {
    return toast.warning("Por favor, selecione um Perfil de Acesso.");
  }

  try {
    const payload = { ...userData };

    if (userToEdit) {
      await api.put(`/users/${userToEdit.id}`, payload);
      
      // --- LOGICA DE ATUALIZAÇÃO LOCAL ---
      // 1. Pegamos os dados do usuário logado no momento
      const storageData = JSON.parse(localStorage.getItem('oncologico:UserData') || '{}');
      
      // 2. Verificamos se o ID que estamos editando é o ID do usuário logado
      if (storageData.user && storageData.user.id === userToEdit.id) {
        // 3. Atualizamos apenas os campos que mudaram no storage local
        storageData.user.is_admin = userData.is_admin;
        storageData.user.name = userData.name;
        storageData.user.email = userData.email;
        // Se houver perfil_id ou outros campos, atualize aqui também
        
        // 4. Gravamos de volta no LocalStorage
        localStorage.setItem('oncologico:UserData', JSON.stringify(storageData));
        
     
      }
      // -----------------------------------

      toast.success('Usuário atualizado com sucesso!');
    } else {
      // Lógica de criação (POST) permanece igual...
      await api.post('/users', payload);
      toast.success('Usuário criado com sucesso!');
    }

    onSuccess();
    onClose();
  } catch (err) {
    const message = err.response?.data?.error || 'Erro ao salvar dados.';
    toast.error(message);
  }
};

  return (
    <Overlay>
      <ModalContainer style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>

        <Form onSubmit={handleSubmit}>
          {/* PERFIL DE ACESSO */}
          <FormGroup>
            <label style={{ fontWeight: 'bold' }}>Perfil de Acesso (Grupo)</label>
            <Select name="perfil_id" value={userData.perfil_id} onChange={handleUserChange} required>
              <option value="">Selecione um perfil...</option>
              {perfisList.map(perfil => (
                <option key={perfil.id} value={perfil.id}>{perfil.nome}</option>
              ))}
            </Select>
          </FormGroup>

          {/* Dados Básicos */}
          <FormGroup>
            <label>Nome Completo</label>
            <input name="name" value={userData.name} onChange={handleUserChange} required />
          </FormGroup>

          <FormGroup>
            <label>E-mail</label>
            <input type="email" name="email" value={userData.email} onChange={handleUserChange} required />
          </FormGroup>

          {!userToEdit && (
            <FormGroup>
              <label>Senha</label>
              <input type="password" name="password" value={userData.password} onChange={handleUserChange} required minLength={6} />
            </FormGroup>
          )}

          {/* Área de Operadoras */}
          <FormGroup>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
              Acesso às Operadoras
            </label>
            <CheckboxGroup style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {operadorasList.map(op => (
                <label key={op.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userData.operadoras.includes(op.id)}
                    onChange={() => handleOperadoraToggle(op.id)}
                  />
                  {op.nome}
                </label>
              ))}
            </CheckboxGroup>
          </FormGroup>

          <ButtonGroup style={{ marginTop: '20px' }}>
            <Button type="button" className="cancel" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="save">Salvar</Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
}

export default UserModal;
