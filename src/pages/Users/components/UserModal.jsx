import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Overlay, ModalContainer, Form, FormGroup, ButtonGroup, Button, CheckboxGroup, Select, ProfessionalSection } from './styles';
import api from '../../../services/api';

const UserModal = ({ isOpen, onClose, userToEdit, onSuccess }) => {
  // Estados do Usuário (Adicionado array de operadoras)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
    is_profissional: false,
    operadoras: [], // Guardará os IDs selecionados [1, 2, 4]
  });

  // Estados do Profissional
  const [proData, setProData] = useState({
    registry_type: 'CRM',
    registry_number: '',
    especiality_id: '',
  });

  // Estados para popular os Selects e Checkboxes
  const [specialties, setSpecialties] = useState([]);
  const [operadorasList, setOperadorasList] = useState([]);

  // Carregar Dados Iniciais (Especialidades e Operadoras)
  useEffect(() => {
    async function loadData() {
      try {
        const [specsRes, opsRes] = await Promise.all([
          api.get('/specialities'),
          api.get('/operadoras')
        ]);
        setSpecialties(specsRes.data);
        setOperadorasList(opsRes.data);
      } catch (err) {
        console.error("Falha ao carregar dados auxiliares");
      }
    }
    if (isOpen) loadData();
  }, [isOpen]);

  // Preencher dados na Edição
  useEffect(() => {
    if (userToEdit) {
      setUserData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '',
        is_admin: userToEdit.is_admin || false,
        is_profissional: userToEdit.is_profissional || false,
        // Pega os IDs das operadoras que vieram do backend e coloca no array
        operadoras: userToEdit.operadoras ? userToEdit.operadoras.map(op => op.id) : []
      });
    } else {
      setUserData({ name: '', email: '', password: '', is_admin: false, is_profissional: false, operadoras: [] });
      setProData({ registry_type: 'CRM', registry_number: '', especiality_id: '' });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  // Handler padrão de inputs e checkboxes únicos
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler específico para o array de checkboxes de operadoras
  const handleOperadoraToggle = (operadoraId) => {
    setUserData(prev => {
      const isSelected = prev.operadoras.includes(operadoraId);
      if (isSelected) {
        // Se já estava selecionado, remove do array
        return { ...prev, operadoras: prev.operadoras.filter(id => id !== operadoraId) };
      } else {
        // Se não estava selecionado, adiciona ao array
        return { ...prev, operadoras: [...prev.operadoras, operadoraId] };
      }
    });
  };

  const handleProChange = (e) => {
    setProData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let userId;

      // 1. Salvar/Atualizar Usuário (Agora enviando userData completo, que inclui o array de operadoras)
      if (userToEdit) {
        await api.put(`/users/${userToEdit.id}`, {
          name: userData.name,
          email: userData.email,
          is_admin: userData.is_admin,
          is_profissional: userData.is_profissional,
          operadoras: userData.operadoras // Array de IDs vai para o backend
        });
        userId = userToEdit.id;
        toast.success('Usuário atualizado!');
      } else {
        if (!userData.password || userData.password.length < 6) {
          return toast.error("Senha deve ter no mínimo 6 caracteres.");
        }

        const response = await api.post('/users', userData); // Vai com senha e operadoras
        userId = response.data.user?.id || response.data.id;
        toast.success('Usuário criado!');
      }

      // 2. Lógica de Profissional (Mantida como você fez)
      if (userData.is_profissional && !userToEdit) {
        if (!proData.registry_number || !proData.especiality_id) {
          toast.warning('Usuário criado, mas faltou dados do profissional (CRM/Especialidade).');
        } else {
          try {
            await api.post('/professionals', {
              user_id: userId,
              registry_type: proData.registry_type,
              registry_number: proData.registry_number,
              especiality_id: Number(proData.especiality_id)
            });
            toast.success('Dados profissionais vinculados com sucesso!');
          } catch (proError) {
            console.error(proError);
          }
        }
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
      <ModalContainer>
        <h2>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>
        
        <Form onSubmit={handleSubmit}>
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

          {/* Permissões */}
          <FormGroup>
             <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
              Permissões do Sistema
            </label>
            <CheckboxGroup>
              <label>
                <input 
                  type="checkbox" 
                  name="is_admin" 
                  checked={userData.is_admin} 
                  onChange={handleUserChange} 
                />
                Administrador
              </label>

              <label>
                <input 
                  type="checkbox" 
                  name="is_profissional" 
                  checked={userData.is_profissional} 
                  onChange={handleUserChange} 
                />
                Profissional de Saúde
              </label>
            </CheckboxGroup>
          </FormGroup>

          {/* Área Condicional: Dados Profissionais */}
          {userData.is_profissional && (
            <ProfessionalSection>
              <h4>Dados do Profissional</h4>
              
              <FormGroup>
                <label>Tipo de Registro</label>
                <Select name="registry_type" value={proData.registry_type} onChange={handleProChange}>
                  <option value="CRM">CRM (Médico)</option>
                  <option value="COREN">COREN (Enfermagem)</option>
                  <option value="CRN">CRN (Nutrição)</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label>Número do Registro</label>
                <input 
                  name="registry_number" 
                  value={proData.registry_number} 
                  onChange={handleProChange} 
                  placeholder="Ex: 12345-MG"
                  required={!userToEdit} 
                />
              </FormGroup>

              <FormGroup>
                <label>Especialidade</label>
                <Select 
                  name="especiality_id" 
                  value={proData.especiality_id} 
                  onChange={handleProChange}
                  required={!userToEdit}
                >
                  <option value="">Selecione uma especialidade</option>
                  {specialties.map(spec => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </Select>
              </FormGroup>
            </ProfessionalSection>
          )}

          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="save">Salvar</Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
}


export default UserModal;